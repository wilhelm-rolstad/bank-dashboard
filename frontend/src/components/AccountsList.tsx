import BankAccountEl from "../elements/BankAccountEl"

type AccountsListProps = {
    accounts: any[],
    selectedAccount: string,
    setSelectedUid: (accountId: string) => void,
    initializing:  boolean
}

export default function AccountsList({accounts, selectedAccount, setSelectedUid, initializing} : AccountsListProps){
    return(
        <div className={`flex flex-col gap-2 w-[25%] pl-3 pr-8 py-3  overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${initializing ? " *:invisible animate-pulse bg-gray-200 rounded-lg" : ""}`}>
            {accounts.map((account) => (
                <BankAccountEl
                key={account.id}
                name={account.account_name}
                cash_account_type={account.cash_account_type}
                balance={account.balance}
                reserved_balance={account.booked_balance}
                currency={account.currency}
                iban={account.iban}
                label={account.label}
                uid={account.uid}
                isSelected={selectedAccount === account.uid}
                onClick={() => setSelectedUid(selectedAccount === account.uid ? null : account.uid)}
                />
            ))}
        </div>
    )
}