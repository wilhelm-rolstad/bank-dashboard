import CategoryDropDown from "./CategoryDropDown";
import { useState } from "react";

type TransactionElProps = {
    style?: React.CSSProperties,
    description : string,
    amount: number,
    currency: string,
    value_date : string,
    account_name: string,
    category: string,
    id: number
}

{/* ADD A WAY TO TELL IF A TRANSACTION IS NEGATIVE OR POSITIVE, - + and colors */}
export default function TransactionEL({style, description, amount, currency, value_date, account_name, category, id} : TransactionElProps){
    function dateFormatter(date: string){
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        let splitdate = date.split("-")
        let newdate = splitdate[2] + ". " + months[(parseInt(splitdate[1]) - 1)] + " " + splitdate[0];
        return newdate;
    }

    function moneyFormatter(amount: string | number) {
        const n = Math.abs(Number(amount)) / 100;
        const formatted = n.toLocaleString("nb-NO", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return `${Number(amount) < 0 ? "−" : "+"} ${formatted}`;
    }

    function remittanceInformationFormatter(rem_inf: string | string[] | null) {
    const text = Array.isArray(rem_inf) ? rem_inf.join(" ") : (rem_inf ?? "");
     let parts = text.split(" ");

    if (Number.isFinite(Number(parts[parts.length - 1]))) {
        parts = parts.slice(0, -1);
    }

    return parts
        .filter((part) => part.toLowerCase() !== "notanr")
        .join(" ");
    }

    const CATEGORY_STYLES: Record<string, string> = {
        dagligvarer: "bg-emerald-100 text-emerald-800 border-emerald-200",
        takeaway: "bg-orange-100 text-orange-800 border-orange-200",
        transport: "bg-sky-100 text-sky-800 border-sky-200",
        trening: "bg-violet-100 text-violet-800 border-violet-200",
        sosialt: "bg-pink-100 text-pink-800 border-pink-200",
        abbonement: "bg-amber-100 text-amber-800 border-amber-200",
        klær: "bg-rose-100 text-rose-800 border-rose-200",
        elektronikk: "bg-cyan-100 text-cyan-800 border-cyan-200",
        reise: "bg-teal-100 text-teal-800 border-teal-200",
        sparing: "bg-lime-100 text-lime-800 border-lime-200",
        overføring: "bg-indigo-100 text-indigo-800 border-indigo-200",
        other: "bg-gray-100 text-gray-600 border-gray-200",
    };  

    const [selectedCategory, setSelectedCategory] = useState(category);

    const API = "http://localhost:8000";

    async function changeCategory(newCategory: string) {
        const params = new URLSearchParams({
            id: String(id),
            newCategory,
        });

        const result = await fetch(`${API}/category?${params}`, {
            method: "PATCH",
        });

        if (!result.ok) {
            throw new Error(`${result.status} ${await result.text()}`);
        }

        setSelectedCategory(newCategory)
    }
    
    return(<>
        <section style={style} className="animate-slide-in text-xs text-left text-black flex items-center py-1 w-full min-w-0 cursor-pointer hover:bg-gray-200 rounded-md transition hover:duration-100 duration-400">
            <p className="px-3 flex-1 w-[30%]">{remittanceInformationFormatter(description)}</p>
            <p className="px-3 w-[20%] truncate">{account_name}</p>
            <p className={`px-3 w-28 ml-auto text-right tabular-nums whitespace-nowrap ${Number(amount) < 0 ? "text-red-500" : "text-green-500"}`}>
                {moneyFormatter(amount)}&nbsp;{currency}
            </p>
            <p className="px-3 w-28 text-right whitespace-nowrap">{dateFormatter(value_date)}</p>
            <CategoryDropDown category={selectedCategory} changeCategory={changeCategory}/>
        </section>
        <hr className="border-t border-gray-200 w-full"/>
    </>)
}