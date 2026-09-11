import os
import time
import uuid
import jwt
import requests
from datetime import datetime, timedelta, timezone
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import json
import db
from concurrent.futures import ThreadPoolExecutor

load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

APP_ID = os.getenv("ENABLEBANKING_APP_ID")
KEY_PATH = Path(__file__).parent.parent / os.getenv("ENABLEBANKING_KEY_PATH").lstrip(
    "./"
)
BASE_URL = "https://api.enablebanking.com"
REDIRECT_URI = "https://wilhelmrolstad.no/callback"
SESSION_FILE = Path(__file__).parent / "session.json"


def load_session():
    if SESSION_FILE.exists():
        try:
            return json.loads(SESSION_FILE.read_text())
        except Exception:
            return {}
    return {}


def save_session(data):
    SESSION_FILE.write_text(json.dumps(data, indent=2))


if not APP_ID:
    raise RuntimeError("ENABLEBANKING_APP_ID not set in .env")
if not KEY_PATH.exists():
    raise RuntimeError(f"Private key not found at {KEY_PATH}")

PRIVATE_KEY = KEY_PATH.read_text()

# In-memory storage. Fine for dev; you'd use a real DB for production.
SESSIONS = {}  # session_id -> session data (accounts, etc.)
LATEST = load_session()  # simple {"session_id": ..., "accounts": [...]}

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "tauri://localhost",
        "http://tauri.localhost",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def make_jwt() -> str:
    now = int(time.time())
    payload = {
        "iss": "enablebanking.com",
        "aud": "api.enablebanking.com",
        "iat": now,
        "exp": now + 3600,
    }
    headers = {"typ": "JWT", "alg": "RS256", "kid": APP_ID}
    return jwt.encode(payload, PRIVATE_KEY, algorithm="RS256", headers=headers)


def auth_header():
    return {"Authorization": f"Bearer {make_jwt()}"}


def fetch_all_transactions(account_uid, days=90, status=None):
    date_from = (datetime.now(timezone.utc) - timedelta(days=days)).strftime("%Y-%m-%d")
    all_txs = []
    continuation_key = None

    while True:
        params = {"date_from": date_from}
        if status:
            params["transaction_status"] = status
        if continuation_key:
            params["continuation_key"] = continuation_key

        resp = requests.get(
            f"{BASE_URL}/accounts/{account_uid}/transactions",
            params=params,
            headers=auth_header(),
            timeout=30,
        )
        if not resp.ok:
            break

        data = resp.json()
        all_txs.extend(data.get("transactions", []))
        continuation_key = data.get("continuation_key")
        if not continuation_key or len(all_txs) > 5000:
            break

    return all_txs


@app.get("/")
def root():
    return {"status": "ok", "message": "backend is running"}


@app.get("/aspsps")
def list_aspsps():
    resp = requests.get(f"{BASE_URL}/aspsps", headers=auth_header())
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)
    return resp.json()


@app.post("/start-auth")
def start_auth(aspsp_name: str = "Mock ASPSP", country: str = "NO"):
    """Start an auth session with a bank. Returns a URL for the user to visit."""
    valid_until = (datetime.now(timezone.utc) + timedelta(days=90)).strftime(
        "%Y-%m-%dT%H:%M:%S.000000+00:00"
    )
    body = {
        "access": {"valid_until": valid_until},
        "aspsp": {"name": aspsp_name, "country": country},
        "state": str(uuid.uuid4()),
        "redirect_url": REDIRECT_URI,
        "psu_type": "personal",
    }
    resp = requests.post(f"{BASE_URL}/auth", json=body, headers=auth_header())
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)
    data = resp.json()
    return {"url": data.get("url"), "authorization_id": data.get("authorization_id")}


@app.get("/callback", response_class=HTMLResponse)
def callback(code: str = None, state: str = None, error: str = None):
    """Bank redirects here after user auth. Exchange the code for a session."""
    if error:
        return HTMLResponse(f"<h1>Auth failed</h1><pre>{error}</pre>", status_code=400)
    if not code:
        return HTMLResponse("<h1>Missing code</h1>", status_code=400)

    resp = requests.post(
        f"{BASE_URL}/sessions", json={"code": code}, headers=auth_header()
    )
    if resp.status_code != 200:
        return HTMLResponse(
            f"<h1>Session failed</h1><pre>{resp.text}</pre>", status_code=400
        )

    session = resp.json()
    session_id = session.get("session_id")
    SESSIONS[session_id] = session
    LATEST["session_id"] = session_id
    LATEST["accounts"] = session.get("accounts", [])
    save_session(LATEST)

    account_lines = "".join(
        f"<li>{a.get('uid')} — {a.get('account_id', {}).get('iban', 'no IBAN')}</li>"
        for a in session.get("accounts", [])
    )
    return HTMLResponse(f"""
        <h1>Connected!</h1>
        <p>Session ID: <code>{session_id}</code></p>
        <p>Accounts:</p>
        <ul>{account_lines}</ul>
        <p>Now try: <a href="/accounts">/accounts</a></p>
    """)


@app.get("/accounts/{account_uid}/transactions")
def get_transactions(account_uid: str, days: int = 90):
    return {"transactions": fetch_all_transactions(account_uid, days)}


@app.get("/accounts")
def get_accounts():
    accounts = LATEST.get("accounts")
    if not accounts:
        raise HTTPException(status_code=404, detail="No session. Start auth first.")

    def fetch_one(account):
        uid = account.get("uid")
        try:
            resp = requests.get(
                f"{BASE_URL}/accounts/{uid}/balances",
                headers=auth_header(),
                timeout=15,
            )
            bals = resp.json().get("balances", []) if resp.ok else []
        except Exception:
            bals = []
        return {**account, "balances": bals}

    with ThreadPoolExecutor(max_workers=8) as pool:
        return list(pool.map(fetch_one, accounts))


@app.get("/balances")
def get_all_balances():
    """Fetch balances for every account in the current session."""
    accounts = LATEST.get("accounts")
    if not accounts:
        raise HTTPException(status_code=404, detail="No session. Start auth first.")

    results = []
    for a in accounts:
        uid = a.get("uid")
        resp = requests.get(
            f"{BASE_URL}/accounts/{uid}/balances",
            headers=auth_header(),
        )
        entry = {
            "uid": uid,
            "iban": (a.get("account_id") or {}).get("iban"),
            "name": a.get("name"),
            "product": a.get("product"),
        }
        if resp.status_code == 200:
            entry["balances"] = resp.json().get("balances", [])
        else:
            entry["error"] = f"{resp.status_code}: {resp.text[:200]}"
        results.append(entry)

    return results


@app.post("/sync")
def sync():
    accounts = LATEST.get("accounts")
    if not accounts:
        raise HTTPException(status_code=404, detail="No session. Start auth first.")
    summary = []
    last_sync = LATEST.get("last_sync", 0)
    if time.time() - last_sync > 2 * 60 * 60:
        for (
            a
        ) in accounts:  # For alle kontoer, henter alle transaksjoner fra hver av dem.
            txs = fetch_all_transactions(a["uid"])

            bresp = requests.get(
                f"{BASE_URL}/accounts/{a['uid']}/balances",
                headers=auth_header(),
                timeout=15,
            )
            balances = bresp.json().get("balances", []) if bresp.ok else []

            _, n = db.sync_account(a, txs, balances)
            summary.append({"product": a.get("product"), "fetched": n})
        LATEST["last_sync"] = time.time()
        save_session(LATEST)
        return summary
    else:
        return []


@app.post("/account-label")
def set_account_label(uid: str, label: str):
    db.setLabel(uid, label)
    return {"ok": True}


@app.post("/recategorize")
def recategorizeAllTransactions():
    db.recategorizeAllTransactions()


@app.get("/getExpenseStats")
def getStats():
    return db.getExpenseCategoryPercentages()


@app.get("/transactionsLastMonth")
def getTransactionsLastMont():
    return db.getTransactionsLastMonth()


@app.get("/getAccounts")
def getAccounts():
    return db.getAccounts()


@app.get("/getMonthlyExpensesPerCategory")
def getMonthlyExpenses():
    return db.getMonthlyExpenses()


@app.post("/aiexpensequery")
async def aiexpensequery(request: Request):
    data = await request.json()
    return db.openaiExpenseQuery(data["problem"], data["transactions"])
