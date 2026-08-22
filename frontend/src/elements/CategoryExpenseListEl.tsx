type CategoryExpenseListElProps = {
    category: string,
    amount: number,
    num_transactions: number,
    percentage_amount: number,
    percentage_num_transactions: number
}

export default function CategoryExpenseListEl({category, amount, num_transactions, percentage_amount, percentage_num_transactions}: CategoryExpenseListElProps){
    return (
        <section className="flex items-center gap-2 rounded-lg px-3 py-1 text-xs bg-white/10 backdrop-blur-md border border-white/20 shadow-sm shadow-black/10 text-black">
            <p className="flex-1 truncate">{category}</p>
            <p className="w-20 text-right tabular-nums">{amount}kr</p>
            <p className="w-12 text-right tabular-nums">{percentage_amount}%</p>
            <p className="w-10 text-right tabular-nums">{num_transactions}</p>
            <p className="w-12 text-right tabular-nums">{percentage_num_transactions}%</p>
        </section>
    );
}