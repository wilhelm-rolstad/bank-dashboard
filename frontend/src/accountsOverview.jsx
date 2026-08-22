import { useState , useEffect} from "react";
import BankAccountEl from "./elements/BankAccountEl";
import TransactionEL from "./elements/TransactionEl";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, LineChart, CartesianGrid, XAxis, YAxis, Line} from "recharts";
import CategoryExpenseListEl from "./elements/CategoryExpenseListEl";

const API = "http://localhost:8000";

export default function accountsOverview() {
  const [loading, setLoading] = useState(false);
  const [authUrl, setAuthUrl] = useState(null);
  const [error, setError] = useState(null);
  const [code, setCode] = useState("");
  const [accounts, setAccounts] = useState([]); //must be sat back to null
  const [initializing, setInitializing] = useState(false); //must be sat back to true
  const [transactions, setTransactions] = useState(null);
  const [selectedUid, setSelectedUid] = useState(null);
  const [stats, setStats] = useState(null);
  const categories = ["dagligvarer", "takeaway", "transport", "trening", "sosialt", "klær", "reise", "elektronikk", "abbonement"];
  const [weeklyExpensesInCategories, setWeeklyExpensesInCategories] = useState(null)
  const COLORSPIE = ["#4a7c8c", "#8c5a4a", "#6b8f5a", "#8c7a4a", "#6b5a8c", "#4a8c7c", "#8c4a6b", "#5a6b8c"];
  const COLORSLINE = ["#38bdf8", "#fb923c", "#4ade80", "#facc15", "#a78bfa", "#2dd4bf", "#f472b6", "#60a5fa", "#f87171", "#a3e635"];
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
        fetch(`${API}/transactionsLastMonth`).then((r) => (r.ok ? r.json() : null)),
        fetch(`${API}/getExpenseStats`).then((r) => (r.ok ? r.json() : null)),
        fetch(`${API}/weeklyExpensesPerCategory`).then((r) => (r.ok ? r.json():null))
      ])
        .then(([accountsData, transactionData, statsData, weeklyExpenseData]) => {
          if (accountsData) {
            setAccounts(accountsData);
            console.log("accountsData:", accountsData);
          }
          if (transactionData) setTransactions(transactionData);
          if (statsData) setStats(statsData);
          if (weeklyExpenseData) setWeeklyExpensesInCategories(weeklyExpenseData)
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
  <div className="mx-auto w-full h-screen flex flex-col p-2">

    <h1 className="text-md">Kontooversikt og transaksjoner</h1>

    {error && <p style={{ color: "crimson" }}>{error}</p>}

    {initializing ? (
      <p className="text-gray-500">Loading accounts…</p>
    ) : accounts ? (
      <div className="flex flex-col flex-1 min-h-0 gap-2 p-2">

        
        <div className="shrink-0">
          
          <div className="flex w-full flex-row gap-2 bg-white rounded-md my-5 px-2 py-2 text-sm items-center ">
              <p>Total Liquid: </p>
              <p>{totalLiquid}</p>
              <button className="cursor-pointer border rounded-lg px-2 py-1 hover:scale-105 text-sm transition duration-200" onClick={() => recategorizeAllTransactions()}>recategorize</button>
              <section className="flex gap-1 ml-auto">
                <p className="px-2 py-1 border border-gray-200 rounded bg-gray-100 text-xs cursor-pointer hover:scale-105 transition duration-300">Month</p>
                <p className="px-2 py-1 border border-gray-200 rounded bg-gray-100 text-xs cursor-pointer hover:scale-105 transition duration-300">3 Months</p>
                <p className="px-2 py-1 border border-gray-200 rounded bg-gray-100 text-xs cursor-pointer hover:scale-105 transition duration-300">Year</p>
                <p className="px-2 py-1 border border-gray-200 rounded bg-gray-100 text-xs cursor-pointer hover:scale-105 transition duration-300">All</p>
              </section>
          </div>

          <div className="w-full flex gap-2 items-center justify-center h-[26vh]">

            <section className="flex items-center justify-center h-full w-5/10">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyExpensesInCategories ?? []}>
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
                 <Tooltip
                  formatter={(v) => `${Number(v).toLocaleString("nb-NO")} kr`}
                  contentStyle={{
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(6px) saturate(160%)",
                  WebkitBackdropFilter: "blur(6px) saturate(160%)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 16,
                  padding: "10px 14px",
                  fontSize: 12,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.5)",
                }}
                  labelStyle={{ color: "#1a1a1a", fontWeight: 600, marginBottom: 6 }}
                />

                  {categories.map((cat, i) => (
                    <Line
                      key={cat}
                      type="monotone"
                      dataKey={cat}
                      stroke={COLORSLINE[i % COLORSLINE.length]}
                      strokeWidth={1}
                      dot={false}
                     
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </section>

            <div className="w-2/10 h-full flex items-center justify-center">
            {stats ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {chartData.map((_, i) => (
                      <linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={COLORSPIE[i % COLORSPIE.length]} stopOpacity={1} />
                        <stop offset="100%" stopColor={COLORSPIE[i % COLORSPIE.length]} stopOpacity={0.7} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie data={chartData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius="90%"
                    className="focus:outline-none [&_*]:outline-none"
                    stroke="none">
                      

                    {chartData.map((_, i) => (
                      <Cell key={i} fill={`url(#grad${i})`} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => `${Number(v).toLocaleString("nb-NO")} kr`}
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.85)",
                      border: "none",
                      borderRadius: 8,
                      padding: "6px 10px",
                      fontSize: 12,
                    }}
                    itemStyle={{ color: "#fff" }}
                    labelStyle={{ color: "#fff" }}
                    cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p>loading…</p>
            )}
            </div>
            <section className="w-3/10 flex flex-col gap-2 ml-auto p-1 text-black overflow-y-auto max-h-full h-full [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.08)_transparent]">
              {(stats ?? []).map((s) => (
                  <CategoryExpenseListEl
                    key={s.category}
                    category={s.category}
                    amount={s.amount}
                    percentage_amount={s.percentage_amount}
                    num_transactions={s.num_trans_cat}
                    percentage_num_transactions={s.percentage_num_trans}
                  />
              ))}
            </section>
          </div>
        </div>

        
        <div className="flex gap-2 w-full flex-1 min-h-0">

          <div className="flex flex-col gap-2 w-[20%] pl-3 pr-8 py-3  overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {accounts.map((account) => (
              <BankAccountEl
                key={account.id}
                name={account.account_name}
                cash_account_type={account.cash_account_type}
                balance={account.balance}
                reserved_balance={account.booked_balance}
                currency={account.currency}
                iban={account.iban}
                uid={account.uid}
                isSelected={selectedUid === account.uid}
                onClick={() => setSelectedUid(selectedUid === account.uid ? null : account.uid)}
              />
            ))}
          </div>

          <div className="flex-1 flex flex-col gap-0 bg-white items-start p-2 overflow-auto [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.08)_transparent] text-left">
            {visible.map((transaction, i) => (
              <TransactionEL
                key={`${selectedUid ?? "all"}-${transaction.id}`}
                style={{ animationDelay: `${Math.min(i * 25, 600)}ms` }}
                direction={transaction.direction}
                description={transaction.description}
                amount={transaction.amount}
                currency={transaction.currency}
                value_date={transaction.value_date}
                account_name={transaction.account_name}
                category={transaction.category}
              />
            ))}
          </div>
        </div>
      </div>
    ) : (
      /* login section unchanged */
      <>
        ...
      </>
    )}
  </div>
);
}