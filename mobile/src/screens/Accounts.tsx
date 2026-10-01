import {View, Text, FlatList} from 'react-native'
import {useState, useEffect} from 'react'
import { useAuth } from '../context/AuthContext';
import AccountComponent from '../components/AccountComponent'

type Account = {
    iban: string,
    balance: number,
    booked_balance: number,
    product : string,
    usage : string,
    id : number,
    label: string | null,
    cash_account_type?: string | null
}

export default function Accounts(){

    const [accounts, setAccounts] = useState<Account[]>([])
    const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        if (!token) return;

        let cancelled = false;

        async function loadAccounts() {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_DATABASE_URL}/rest/v1/rpc/get_accounts`,
                {
                    method: 'POST',
                    headers: {
                        apikey: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                }
            );

            if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
            }

            const data: Account[] = await response.json();
    
            if (!cancelled) {
                setAccounts(data);
            }
        }

        loadAccounts().catch((error) => {
            if (!cancelled) console.error(error);
        });

        return () => {
            cancelled = true;
        };
    }, [token]);

    return(
        <View className="flex-1 w-full items-center gap-4 bg-white">
            <Text className="mt-20">Accounts</Text>

            <FlatList
                className="flex-1 w-full"
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingVertical: 16,
                    gap: 16,
                }}
                data={accounts}
                extraData={selectedAccountId}
                keyExtractor={(a) => String(a.id)}
                renderItem={({ item: a }) => (
               <AccountComponent
                    iban={a.iban}
                    balance={a.balance}
                    booked_balance={a.booked_balance}
                    product={a.product}
                    usage={a.usage}
                    id={a.id}
                    label={a.label}
                    cash_account_type={a.cash_account_type}
                    isSelected={selectedAccountId === a.id}
                    onPress={() => setSelectedAccountId(a.id)}

               />
                )}
            />

        </View>
    )
}
