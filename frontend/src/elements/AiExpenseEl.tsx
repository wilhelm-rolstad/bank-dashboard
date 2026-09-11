import { useState } from "react";
import TransactionEL from "./TransactionEl";
import { Sparkles, MoveUp, X } from "lucide-react";

type AiExpenseElProps = {
  transactions: any[];
};

export default function AiExpenseEl({ transactions }: AiExpenseElProps) {
  const API = "http://localhost:8000";
  const [problem, setProblem] = useState("");
  const [handling, setHandling] = useState(false);
  const [answer, setAnswer] = useState("");
  const [relevantTransactions, setRelevantTransactions] = useState([]);
  const [explanation, setExplanation] = useState("");
  const [total, setTotal] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(true);

  function parseTransactions(transactions: any[]) {
    return (transactions ?? []).map((t) => ({
      id: t.id,
      date: t.value_date,
      description: t.description,
      amount: t.amount / 100,
    }));
  }

  function parseAnswer(answer: string) {
    const parts = answer.split("*");

    setRelevantTransactions(JSON.parse(parts[1]));
    setExplanation(parts[2]);
    setTotal(parseFloat(parts[4]));
  }

  async function handleProblem() {
    if (problem && !handling) {
      console.log("Sending:", { transactions, problem });
      const res = await fetch(`${API}/aiexpensequery`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          transactions: parseTransactions(transactions),
          problem: problem,
        }),
      });
      const data = await res.json();
      if (data) {
        setAnswer(data.answer);
        console.log(data.answer);
        parseAnswer(data.answer);
      }
    }
    setHandling(false);
  }

  return (
    <>
      {!answer ? (
        <div
          className={`fixed bottom-4 right-4 box-border flex gap-2
            bg-white/70 shadow-lg ring-1 ring-black/5 backdrop-blur-xs
            transition-all duration-300 ease-in-out
            ${
              collapsed
                ? "w-14 p-4 rounded-full hover:scale-110"
                : "w-[calc(100%-2rem)] p-2 rounded-xl"
            }`}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setCollapsed(true);
            }
          }}
        >
          {collapsed ? (
            <button type="button" className="cursor-pointer" aria-label="Åpne AI-hjelper" onClick={() => setCollapsed(false)}>
              <Sparkles />
            </button>
          ) : (
            <div className="flex gap-2 w-full min-w-0">
              <input autoFocus className="flex-1 min-w-0 bg-gray-200 rounded-lg px-2 focus:outline-none" type="text" value={problem} onChange={(e) => setProblem(e.target.value)} onKeyDown={(e) => {
                    if(e.key === "Enter" && problem.trim() && !handling){
                        setHandling(true);
                        handleProblem();
                    }
                }}/>
              <button className={`${problem && !handling ? "bg-blue-500" : "bg-gray-300"} shrink-0 cursor-pointer text-white px-2 py-1 rounded-full`}
                
                onClick={() => {
                  setHandling(true);
                  handleProblem();
                }}>
                <MoveUp />
              </button>
            </div>
          )}
        </div>
      ) : null}

      {answer ? (
        <div className="absolute inset-40 z-50 rounded-3xl bg-white/80 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl scrollbar-thin [scrollbar-color:rgba(0,0,0,0.08)_transparent]">
          <button
            className="absolute flex items-center justify-center z-10 cursor-pointer top-2 left-2 border border-gray-200 p-2 w-8 h-8 rounded-full bg-white hover:scale-105 transition duration-300 hover:text-red-400"
            onClick={() => setAnswer("")}
          >
            <X width="32px" height="32px" />
          </button>

          <div className="h-full overflow-auto p-10">
            <div className="flex flex-col gap-2">
              <p>Relevante transaksjoner:</p>
              <div>
                {relevantTransactions.map((id) => {
                  const t = transactions.find((tx) => tx.id === id);
                  if (!t) return null;
                  return (
                    <TransactionEL
                      key={id}
                      description={t.description}
                      amount={t.amount}
                      currency={t.currency}
                      value_date={t.value_date}
                      account_name={t.account_name}
                      category={t.category}
                    />
                  );
                })}
              </div>
              <p>{explanation}</p>
              <p>Totalt brukt: {total ? total : 0}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}