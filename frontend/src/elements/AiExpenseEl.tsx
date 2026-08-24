import {useState} from 'react'
import TransactionEL from './TransactionEl';

type AiExpenseElProps = {
    transactions : any[]
}

export default function AiExpenseEl({transactions}:AiExpenseElProps){
    const API = "http://localhost:8000";
    const [problem, setProblem] = useState("")
    const [handling, setHandling] = useState(false)
    const [answer, setAnswer] = useState("")
    const [relevantTransactions, setRelevantTransactions] = useState([])
    const [explanation, setExplanation] = useState("")
    const [total, setTotal] = useState<number | null>(null)

    function parseTransactions(transactions: any[]){
        return (transactions ?? []).map((t) => ({
            id: t.id,
            date: t.value_date,
            description: t.description,
            amount:t.amount / 100
        }));
    }

    function parseAnswer(answer: string){
        const parts = answer.split("*")
        
        setRelevantTransactions(JSON.parse(parts[1]))
        setExplanation(parts[2])
        setTotal(parseFloat(parts[4]))
    }

    async function handleProblem(){
        if (problem && !handling){
            console.log("Sending:", { transactions, problem });
            const res = await fetch(`${API}/aiexpensequery`, { 
            method: "POST", 
            headers: {"Content-type" : "application/json"},
            body: JSON.stringify({
                transactions: parseTransactions(transactions),
                problem: problem
            }),
        })
        const data = await res.json()
        if (data){
            setAnswer(data.answer)
            console.log(data.answer)
            parseAnswer(data.answer)
            }
        }
        setHandling(false)
    }

    return(
        <>
        {!answer ? 
            <div className="flex gap-2 fixed right-4 bottom-4 px-2 py-2 rounded-2xl bg-white/70 shadow-lg ring-1 ring-black/5 backdrop-blur-xs w-[50%]">
                <input className="bg-gray-200 w-full rounded-lg px-2 focus:outline-none focus:transalate-x-100" type="text" onChange={(e) => setProblem(e.target.value)}/>
                <button className={`${problem && !handling ? "bg-blue-500" : "bg-gray-300" } " shrink-0 whitespace-nowrap cursor-pointer text-white px-2 py-1 rounded-4xl hover:scale-105 transition duration-300"`} onClick={() => {setHandling(true); {handleProblem()}}}>{"->"}</button>
            </div> : null
            }
            
            {answer ? 
            <div className="absolute inset-8 z-50 rounded-2xl bg-gray-100/70 shadow-2xl ring-1 ring-black/5 backdrop-blur-sm scrollbar-thin [scrollbar-color:rgba(0,0,0,0.08)_transparent]">
                <button
                    className="absolute flex items-center justify-center z-10 cursor-pointer top-1 text-sm left-1 border border-gray-200 px-3 py-1 w-8 h-8 rounded-full  bg-white hover:scale-105 transition duration-300 hover:text-red-400"
                    onClick={() => setAnswer("")}>
                    X
                </button>

                <div className="h-full overflow-auto p-10 ">
                    <div className="flex flex-col gap-2">
                        <p>Relevant transactions:</p>
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
                        <p>Total: {total ? total : 0}</p>
                    </div>
                </div>
            </div> : null
            }
        </>
    )
}