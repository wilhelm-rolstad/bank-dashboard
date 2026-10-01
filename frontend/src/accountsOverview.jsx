import { useState , useEffect} from "react";
import BankAccountEl from "./elements/BankAccountEl";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, LineChart, CartesianGrid, XAxis, YAxis, Line} from "recharts";
import CategoryExpenseListEl from "./elements/CategoryExpenseListEl";
import AiExpenseEl from "./elements/AiExpenseEl"
import TransactionList from "./components/TransactionList";
import AccountsList from "./components/AccountsList";
import ExpenseChart from "./components/ExpenseChart";
import ExpensePie from "./components/ExpensePie";
import CategoryChart from "./components/CategoryChart";
import IntervalPicker from "./elements/IntervalPicker";

const API = "http://localhost:8000";

export default function accountsOverview() {
  const [loading, setLoading] = useState(false);
  const [authUrl, setAuthUrl] = useState(null);
  const [error, setError] = useState(null);
  const [code, setCode] = useState("");
  const [accounts, setAccounts] = useState([]); //must be sat back to null
  const [initializing, setInitializing] = useState(true); //must be sat back to true
  const [transactions, setTransactions] = useState(null);
  const [selectedUid, setSelectedUid] = useState(null);
  const [stats, setStats] = useState(null);
  const categories = ["dagligvarer", "takeaway", "transport", "trening", "sosialt", "klær", "reise", "elektronikk", "abbonement"];
  const [monthlyExpensesInCategories, setMonthlyExpensesInCategories] = useState(null)
  const chartData = (stats ?? [])
  .filter((s) => s.category !== "other")
  .map((s) => ({ name: s.category, value: Math.abs(Number(s.amount)) }));

  async function startAuth() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API}/start-auth?aspsp_name=Storebrand&country=NO`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
      const data = await res.json();
      setAuthUrl(data.url);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function exchangeCode() { //
  setError(null);
  try {
    const result = await fetch(`${API}/callback?code=${encodeURIComponent(code.trim())}`); 
    if (!result.ok) throw new Error(`${result.status} ${await result.text()}`);
    const accResult = await fetch(`${API}/accounts`);
    setAccounts(await accResult.json());
  } catch (e) {
    setError(String(e));
  }
}

useEffect(() => {
  fetch(`${API}/sync`, { method: "POST" })
    .catch(() => {})
    .finally(() => {
      Promise.all([
        fetch(`${API}/getAccounts`).then((r) => (r.ok ? r.json() : null)),
        fetch(`${API}/transactionsLastYear`).then((r) => (r.ok ? r.json() : null)), //transactionLastMonth...
        fetch(`${API}/getExpenseStats`).then((r) => (r.ok ? r.json() : null)),
        fetch(`${API}/getMonthlyExpensesPerCategory`).then((r) => (r.ok ? r.json():null))
      ])
        .then(([accountsData, transactionData, statsData, monthlyExpenseData]) => {
          if (accountsData) {
            setAccounts(accountsData);
            console.log("accountsData:", accountsData);
          }
          if (transactionData) setTransactions(transactionData);
          if (statsData) setStats(statsData);
          if (monthlyExpenseData) setMonthlyExpensesInCategories(monthlyExpenseData)
        })
        .catch(() => {})
        .finally(() => setInitializing(false));
    });
}, []);

async function recategorizeAllTransactions(){
  await fetch(`${API}/recategorize`, { method: "POST" })
}

const totalLiquid = (accounts ?? []).reduce(
  (sum, account) => sum + (parseFloat((account.balance / 100).toFixed(2)) || 0),
  0
).toFixed(2);

const visible = (transactions ?? []).filter(
  (t) => !selectedUid || t.account_uid === selectedUid
);

  return (
  <div className="mx-auto w-full h-full flex flex-col font-jetbrains font-normal">


    {error && <p style={{ color: "crimson" }}>{error}</p>}

      <div className="flex flex-col flex-1 min-h-0 gap-2 px-2">
          <h1 className="text-2xl shrink-0">Kontooversikt og transaksjoner</h1>
          
          <div className={`flex w-full flex-row gap-2 rounded-md my-5 px-2 py-2 text-sm items-center ${initializing ? "bg-gray-200 animate-pulse *:invisible" : "bg-white "} `}>
              <p className="rounded-lg bg-gray-100 border border-gray-200 px-3 py-1  [corner-shape:squircle]">Total kjøpekraft: </p>
              <p>{totalLiquid}</p>
              <p className="rounded-lg bg-gray-100 border border-gray-200 px-3 py-1  [corner-shape:squircle]">Differanse lån og kjøpekraft: </p>
              <p>...</p>
              {/*<button className="cursor-pointer border rounded-lg px-2 py-1 hover:scale-105 text-sm transition duration-200" onClick={() => recategorizeAllTransactions()}>recategorize</button>*/}
              <IntervalPicker someFunction={null}/>
          </div>

          <div className={`w-full flex gap-2 items-center justify-center h-[26vh] rounded-lg ${initializing ? "*:invisible animate-pulse bg-gray-200" : ""}`}>
            <ExpenseChart
              monthlyExpensesInCategories={monthlyExpensesInCategories}
              categories={categories}
            />
            <ExpensePie chartData={chartData} stats={stats} />
            <CategoryChart stats={stats} />
          </div>
       

        
        <div className={`flex gap-2 w-full flex-1 min-h-0`}>
          <AccountsList
            accounts={accounts}
            selectedAccount={selectedUid}
            setSelectedUid={setSelectedUid}
            initializing={initializing}
          />

          
          <TransactionList
            transactions={transactions}
            selectedAccount={selectedUid}
            visible={visible}
            initializing={initializing}
          />
          {transactions ? <AiExpenseEl transactions={transactions}/> : ""}
        </div>
      </div>
  </div>
);
}
