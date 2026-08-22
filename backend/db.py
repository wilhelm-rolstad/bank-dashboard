import os
import psycopg
from pathlib import Path
from psycopg.rows import dict_row
from dotenv import load_dotenv
import re

load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not set in .env")


def connect():
    conn = psycopg.connect(DATABASE_URL, row_factory=dict_row)
    conn.prepare_threshold = None
    return conn

def setLabel(uid, label):
    with connect() as conn, conn.cursor() as cur:
        cur.execute(
            """
            UPDATE accounts SET label = %(label)s WHERE accounts.uid = %(uid)s ;
            """,
            {
                "label" : label,
                "uid": uid
            }
        )


def categorizeTransaction(remittance_information):
    CATEGORIES = {
        "dagligvarer" : ["kiwi", "meny", "coop", "rema", "spar", "bunnpris", "extra", "narvesen", "coca cola", "unison", "joker", "normal", "zettle_*online", "super market", "lidl", "supermercado", "kiosk"],
        "takeaway" : ["mcdonalds", "burger king", "BK", "burger", "kebab", "foodora", "wolt", "uber eats", "sushi", "subway", "dominos", "pizza", "sabrura", "bit", "restaurante", "grill"],
        "abbonement" : ["netflix", "spotify", "openai", "anthropic", "storebrand forsikring"],
        "trening" : ["3t", "sats", "impulse", "feel24", "kaliber", "fresh", "evo", "anton sport", "gym shark"],
        "sparing" : ["nordnet"],
        "elektronikk" : ["eplehuset", "elkjøp", "komplett", "power"],
        "sosialt" : ["vinmonopolet", "bar", "pub", "kino", "scotsman", "downtown", "friends solsiden", "foyn", "fotballfesten", "ivy", "coya", "heidis", "to glass", "s4", "as palace grill"],
        "transport" : ["uber", "ryde", "bolt", "django", "ruter", "atb", "easypark", "st1", "circle k", "ferge", "vy", "blue energy as", "p-hus", "p hus", "parkering"],
        "overføring" : ["straksbetaling", "vipps", "overføring", "til", "fra", "overført"],
        "klær" : ["volt", "dressmann", "massimo", "john henric", "bogart", "morris", "eurosko", "follestad", "el corte ingles"],
        "reise" : ["norwegian", "sas", "flytoget"]
    }


    d = " ".join(remittance_information or []).lower()

    for category, keywords in CATEGORIES.items():
        for k in keywords:
            if re.search(rf"\b{re.escape(k)}\b", d):
                return category
    return "other"



       

def sync_account(account, transactions, balances=None):
    balances = balances or []

    def to_ore(btype):
        b = next((x for x in balances if x.get("balance_type") == btype), None)
        if not b:
            return None
        return round(float((b.get("balance_amount") or {}).get("amount") or 0) * 100)

    with connect() as conn, conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO accounts (uid, iban, account_holder_name, usage,
                                  cash_account_type, product, currency,
                                  balance, booked_balance)
            VALUES (%(uid)s, %(iban)s, %(name)s, %(usage)s,
                    %(type)s, %(product)s, %(currency)s,
                    %(balance)s, %(booked_balance)s)
            ON CONFLICT (iban) DO UPDATE SET
                uid = EXCLUDED.uid,
                account_holder_name = EXCLUDED.account_holder_name,
                usage = EXCLUDED.usage,
                cash_account_type = EXCLUDED.cash_account_type,
                product = EXCLUDED.product,
                currency = EXCLUDED.currency,
                balance = EXCLUDED.balance,
                booked_balance = EXCLUDED.booked_balance,
                fetched_at = now()
            RETURNING id
            """,
            {
                "uid": account["uid"],
                "iban": (account.get("account_id") or {}).get("iban"),
                "name": account.get("name"),
                "usage": account.get("usage"),
                "type": account.get("cash_account_type"),
                "product": account.get("product"),
                "currency": account.get("currency"),
                "balance": to_ore("ITAV"),
                "booked_balance": to_ore("CLBD"),
            },
        )
        account_id = cur.fetchone()["id"]

        rows = []
        for t in transactions: #For every transaction 
            amt = t.get("transaction_amount") or {} #get the amount
            direction = t.get("credit_debit_indicator") # positive or negative amount
            ore = round(float(amt.get("amount") or 0) * 100) # make it in øre *always stored in øre/cents because floats may break in math
            if direction == "DBIT":
                ore = -ore
            rows.append({
                "account_id": account_id,
                "entry_reference": t.get("entry_reference"),
                "amount": ore,
                "currency": amt.get("currency"),
                "direction": direction,
                "status": t.get("status"),
                "booking_date": t.get("booking_date"),
                "value_date": t.get("value_date"),
                "description": " ".join(t.get("remittance_information") or []),
                "category" : categorizeTransaction(t.get("remittance_information"))
            })

        if rows:
            cur.executemany(
                """
                INSERT INTO transactions (account_id, entry_reference, amount,
                                          currency, direction, status,
                                          booking_date, value_date, description, category)
                VALUES (%(account_id)s, %(entry_reference)s, %(amount)s,
                        %(currency)s, %(direction)s, %(status)s,
                        %(booking_date)s, %(value_date)s, %(description)s, %(category)s)
                ON CONFLICT (account_id, entry_reference) DO NOTHING
                """,
                rows,
            )

        return account_id, len(rows)


def recategorizeAllTransactions():
    with connect() as conn, conn.cursor() as cur:
        cur.execute("SELECT id, description FROM transactions")
        rows = cur.fetchall()

        updates = [
            {"id": r["id"], "category": categorizeTransaction([r["description"]])}
            for r in rows
        ]

        if updates:
            cur.executemany(
                "UPDATE transactions SET category = %(category)s WHERE id = %(id)s",
                updates,
            )

        return len(updates)

def getExpenseCategoryPercentages():
    with connect() as conn, conn.cursor() as cur:
        cur.execute("""SELECT category, 
                    count(*) as num_trans_cat, 
                    ROUND(count(*) * 100.0 / (SELECT count(*) FROM transactions WHERE amount < 0 AND category NOT IN ('overføring', 'sparing'))) AS percentage_num_trans, 
                    (SUM(amount) / 100) * -1 as amount, 
                    (SUM(amount)*100)/ (SELECT SUM(amount) FROM transactions WHERE amount < 0 AND category NOT IN ('overføring', 'sparing')) as percentage_amount
                    FROM transactions
                    WHERE amount < 0
                    GROUP BY category
                    HAVING category NOT IN ('overføring', 'sparing')
                    ORDER BY amount""")
        rows = cur.fetchall()
        return rows

def getTransactionsLastMonth(): #fetches all transactions within the last month
    with connect() as conn, conn.cursor() as cur:
        cur.execute(""" SELECT t.id, t.amount, t.direction, t.status, t.value_date, t.booking_date,
                        t.description, t.category,
                        a.uid AS account_uid,
                        COALESCE(a.label, a.product) AS account_name
                        FROM transactions t
                        JOIN accounts a ON a.id = t.account_id
                        WHERE t.value_date::date > CURRENT_DATE - INTERVAL '1 month'
                        ORDER BY t.value_date DESC""")
        rows = cur.fetchall()
        return rows

def getTransactionsLastYear(): #fetches all transactions within the last year
    with connect() as conn, conn.cursor() as cur:
        cur.execute(""" SELECT t.id, t.amount, t.direction, t.status, t.value_date, t.booking_date,
                        t.description, t.category,
                        a.uid AS account_uid,
                        COALESCE(a.label, a.product) AS account_name
                        FROM transactions t
                        JOIN accounts a ON a.id = t.account_id
                        WHERE t.value_date::date > CURRENT_DATE - INTERVAL '1 year'
                        ORDER BY t.value_date DESC""")
        return cur.fetchall()



def getAccounts():
    with connect() as conn, conn.cursor() as cur:
        cur.execute("SELECT *, COALESCE(label, product) AS account_name FROM accounts ORDER BY product")
        return cur.fetchall()


def getWeeklyExpenses():
    with connect() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT date_trunc('week', booking_date::date)::date AS week,
            category,
            ABS(SUM(amount)) / 100.0 AS total
            FROM transactions
            WHERE amount < 0
            AND category NOT IN ('overføring', 'sparing')
            AND booking_date::date > CURRENT_DATE - INTERVAL '6 months'
            GROUP BY week, category
            ORDER BY week
        """)
        rows = cur.fetchall()

    all_categories = {r["category"] for r in rows}

    by_week = {}
    for r in rows:
        week = r["week"].isoformat()
        if week not in by_week:
            by_week[week] = {"week": week, **{c: 0 for c in all_categories}}
        by_week[week][r["category"]] = float(r["total"])

    return list(by_week.values())