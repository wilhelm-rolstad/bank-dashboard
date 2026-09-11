import TransactionEL from "../elements/TransactionEl"
import AiExpenseEl from "../elements/AiExpenseEl"

type TransactionListProps = {
    transactions : any[],
    selectedAccount : string,
    visible: any[],
    initializing: boolean
}

export default function TransactionList({transactions, selectedAccount, visible, initializing}: TransactionListProps){
    return(
        <div className="flex-1 relative min-h-0"> {/*  */}
                    <div className={`h-full flex flex-col gap-0 items-start p-2 overflow-auto [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.08)_transparent] text-left ${initializing ? "*:invisible animate-pulse bg-gray-200 rounded-lg" : "bg-white"}`}>
                    {visible.map((transaction, i) => (
                      <TransactionEL
                        key={`${selectedAccount ?? "all"}-${transaction.id}`}
                        style={{ animationDelay: `${Math.min(i * 25, 600)}ms` }}
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
    )
}