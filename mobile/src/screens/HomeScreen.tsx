import * as RN from 'react-native';
import { useMemo, useState } from 'react';
import TransactionComponent from '../components/TransactionComponent';
import { useAuth } from '../context/AuthContext';

type Transaction = {
  id: string; // Use number if your API returns numeric IDs
  description: string;
  amount: number;
  category: string;
  value_date: string;

};

const PAGE_SIZE = 30;
const transactionKey = (transaction: Transaction) => String(transaction.id);
const renderTransaction = ({ item }: { item: Transaction }) => (
  <TransactionComponent
    category={item.category}
    description={item.description}
    amount={item.amount}
    value_date={item.value_date}
  />
);

export default function HomeScreen() {

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleTransactions = useMemo(
    () => transactions.slice(0, visibleCount),
    [transactions, visibleCount],
  );
  const [initializing, setInitializing] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [modalVisible, setModalVisible] = useState(true)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackColor, setFeedbackColor] = useState("text-black")
  const { setToken } = useAuth();
  const DATABASE_API = process.env.EXPO_PUBLIC_DATABASE_URL;

  console.log(DATABASE_API)

  
  async function loadTransactions(accessToken: string) {
    const apiKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!DATABASE_API || !apiKey) {
      throw new Error('Missing Supabase configuration');
    }
    setInitializing(true);
    try {
      const response = await fetch(
        `${DATABASE_API}/rest/v1/rpc/transactions_last_year`,
        {
          method: 'POST',
          headers: {
            apikey: apiKey,
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      setTransactions(data);
      setVisibleCount(PAGE_SIZE);
    } catch (error) {
      console.error(error);
    } finally {
      setInitializing(false);
    }
}


async function signIn(email: string, password: string) {
  const url = process.env.EXPO_PUBLIC_DATABASE_URL;
  const apiKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !apiKey) {
    throw new Error('Missing Supabase configuration');
  }

  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description ?? data.msg ?? 'Sign-in failed');
  }

  return data.access_token as string;
}

async function handleSignIn(){
  try{
    setFeedbackColor("text-black")
    setFeedbackMessage("loading...")
    const token = await signIn(email, password)
    setToken(token)
    await loadTransactions(token)
    setModalVisible(false)
  }
  catch (error){
    setFeedbackColor("text-red-400")
    setFeedbackMessage("Email or password is incorrect")
    console.log(error)
  }
}

  
  return (
    <RN.View className="flex-1 flex-col gap-2 items-center bg-[#f7f8fa] p-6 rounded-6xl">


      <RN.Modal presentationStyle="fullScreen"  animationType="slide"   visible={modalVisible}>
        <RN.View className="border p-5 flex flex-col gap-4 items-center justify-center w-full h-full">
          <RN.Text className="mt-10 text-3xl">Sign in</RN.Text>
          <RN.TextInput
            className="border w-[60%] h-12 rounded-lg px-4 py-0 text-xl"
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <RN.TextInput className="border w-[60%] h-12 rounded-lg px-4 py-0 text-xl" placeholder="Password"  value={password} secureTextEntry onChangeText={setPassword} autoCapitalize="none" autoCorrect={false}/>

          <RN.Text className={` ${feedbackColor}`}>{feedbackMessage}</RN.Text>

          <RN.Pressable className=" px-7 py-3 rounded-2xl  bg-blue-500" onPress={() => handleSignIn()}><RN.Text className="text-xl text-white">Login</RN.Text></RN.Pressable>

          <RN.View className=" h-[22%]"></RN.View>

          </RN.View>
      </RN.Modal>



      <RN.View className=" w-full mt-10 p-2">
        <RN.Text className="text-black text-lg">Transaksjoner</RN.Text>
      </RN.View>
    
      <RN.FlatList
        className="flex-1 w-full bg-white"
        contentContainerClassName="gap-1 bg-transparent"
        data={visibleTransactions}
        keyExtractor={transactionKey}
        initialNumToRender={12}
        maxToRenderPerBatch={8}
        windowSize={5}
        renderItem={renderTransaction}
        ListFooterComponent={
          <RN.View className="items-center gap-3 py-5">
            {initializing ? (
              <RN.ActivityIndicator color="#3b82f6" />
            ) : transactions.length > 0 ? (
              <>
                <RN.Text className="text-xs text-gray-500">
                  Showing {visibleTransactions.length} of {transactions.length}
                </RN.Text>
                {visibleTransactions.length < transactions.length && (
                  <RN.Pressable
                    accessibilityRole="button"
                    className="rounded-full bg-blue-500 px-5 py-3 active:opacity-70"
                    onPress={() => setVisibleCount((count) => Math.min(count + PAGE_SIZE, transactions.length))}
                  >
                    <RN.Text className="font-medium text-white">Load more</RN.Text>
                  </RN.Pressable>
                )}
              </>
            ) : null}
          </RN.View>
        }
      />
    </RN.View> 
  );
}
