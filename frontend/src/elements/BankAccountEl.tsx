import { useState } from 'react'

type BankAccountElProps = {
    uid : string,
    name: string,
    cash_account_type:  string,
    currency: string,
    balance: number,
    reserved_balance: number,
    iban: string,
    label: string,
    isSelected: boolean,
    onClick: () => void
}

export default function BankAccountEl({uid, name, cash_account_type, balance, reserved_balance, currency, iban, label, isSelected, onClick}:BankAccountElProps){

    const API = "http://localhost:8000";

    function ibanConverter(iban:string){
        let accountNumber = iban.slice(4)
        

        return accountNumber.slice(0,4)+ " " + accountNumber.slice(4,6) + " " + accountNumber.slice(6,11);
    }

    async function setLabel(newLabel:string){
        console.log("trying to set the label...")
        await fetch(`${API}/account-label?uid=${encodeURIComponent(uid)}&label=${encodeURIComponent(newLabel)}`, {
            method: "POST",
        });
    }

    const cardBg = "bg-[radial-gradient(110%_120%_at_88%_10%,#E0913F_0%,rgba(224,145,63,0)_55%),radial-gradient(120%_130%_at_8%_92%,#B44A6B_0%,rgba(180,74,107,0)_60%),linear-gradient(140deg,#2A1B2A_0%,#3E2436_100%)]"

    const [editing, setEditing] = useState(false);
    

    return(
        <>
            <section className={` ${cardBg} ${isSelected ? "translate-x-5" : "translate-x-0"} relative px-5 py-3 w-full rounded-3xl bg-blue-500 flex flex-col gap-2 h-26 cursor-pointer hover:scale-105 active:scale-95 transition duration-300`} onClick={onClick} >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] bg-[length:33.34%_50%] bg-[position:-1px_-1px]"></div>
                <div className="flex text-start w-full items-center gap-2 justify-center text-white">   
                      {editing ? 
                        <input placeholder="newname" onKeyDown={(e) => {if (e.key === "Enter") {setLabel(e.currentTarget.value)} }} ></input> 
                        : 
                        <p className="text-lg " onClick={(e) => setEditing(true)}>{label? label : name}</p> 
                      }
                      <p className="text-sm border px-2 py-1 bg-white/10 backdrop-blur-md border-white/20 rounded-3xl shadow-lg shadow-black/20">{cash_account_type}</p> 
                      <p className="text-sm ml-auto">ISSUER </p>
                </div>

                <div className="flex gap-2 mt-auto min-w-[40%] ">
                    <div className=" mt-auto text-white text-sm whitespace-nowrap overflow-hidden">
                        {ibanConverter(iban)} 
                    </div>
               
                    <div className="flex flex-col ml-auto gap-0  min-w-[60%]">
                        <p className="text-md ml-auto text-white">{(balance / 100).toFixed(2)}</p>
                        <p className="text-xs text-right text-gray-100 whitespace-nowrap">Booked {(reserved_balance / 100).toFixed(2)}</p>
                    </div>
                </div>
            </section>
        </>
    )
}