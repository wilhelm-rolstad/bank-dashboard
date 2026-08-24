import {useState} from 'react'

type AiExpenseElProps = {
    transactions : string[]
}

export default function AiExpenseEl({transactions}:AiExpenseElProps){
    const API = "http://localhost:8000";
    const [problem, setProblem] = useState("")

    function parseTransactions(transactions:string){

    }

    async function handleProblem(){
        if (problem){
            console.log("Sending:", { transactions, problem });
            const res = await fetch(`${API}/aiexpensequery`, { 
            method: "POST", 
            headers: {"Content-type" : "application/json"},
            body: JSON.stringify({
                transactions : transactions,
                problem: problem
            }),
        })
        const data = await res.json()
        console.log(data.answer)
        }
    }

    return(
        <>
            <div className="flex gap-2 fixed right-4 bottom-4 px-2 py-2 rounded-2xl bg-white/70 shadow-lg ring-1 ring-black/5 backdrop-blur-xs">
                <input className="bg-gray-200 rounded-lg px-2 focus:outline-none focus:transalate-x-100" type="text" onChange={(e) => setProblem(e.target.value)}/>
                <button className={`${problem ? "bg-blue-500" : "bg-gray-300" } " cursor-pointer text-white px-2 py-1 rounded-4xl hover:scale-105 transition duration-300"`} onClick={() => handleProblem()}>{"->"}</button>
            </div>
        </>
    )
}