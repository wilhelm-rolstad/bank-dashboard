import CategoryExpenseListEl from "../elements/CategoryExpenseListEl"

type CategoryChartProps = {
    stats : any[],

}

export default function CategoryChart({stats}:CategoryChartProps){
    return(
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
    )
}