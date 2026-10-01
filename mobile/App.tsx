import './global.css';
import { memo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import AnalyticsScreen from './src/screens/Analytics';
import AccountsScreen from './src/screens/Accounts';
import StatisticsScreen from './src/screens/Statistics';
import { ChartPie, PanelsTopLeft, ChartLine, CreditCard} from 'lucide-react-native';
import { AuthProvider } from './src/context/AuthContext';

const MemoizedHomeScreen = memo(HomeScreen);
const MemoizedAnalyticsScreen = memo(AnalyticsScreen);
const MemoizedAccountsScreen = memo(AccountsScreen);
const MemoizedStatisticsScreen = memo(StatisticsScreen)


export default function App() {
  const [screen, setScreen] = useState('home');

  return (
    <AuthProvider>
    <View className="flex-1">
      <View className="flex-1">
        <View style={{ flex: 1, display: screen === 'home' ? 'flex' : 'none' }}>
          <MemoizedHomeScreen />
        </View>
        <View style={{ flex: 1, display: screen === 'accounts' ? 'flex' : 'none' }}>
          <MemoizedAccountsScreen />
        </View>
        <View style={{ flex: 1, display: screen === 'analytics' ? 'flex' : 'none' }}>
          <MemoizedAnalyticsScreen />
        </View>
         <View style={{ flex: 1, display: screen === 'statistics' ? 'flex' : 'none' }}>
          <MemoizedStatisticsScreen />
        </View>
      </View>

      <View className="flex-row justify-around bg-white pt-4 pb-10 px-6">

        <Pressable onPress={() => setScreen('home')}>
          <View className="flex flex-col items-center justify-center w-[90px] h-[50px] " >
              <PanelsTopLeft/>
              <Text className="text-xs">Home</Text>
          </View>
        </Pressable>

        <Pressable onPress={() => setScreen('accounts')}>
          <View className="flex flex-col items-center justify-center w-[90px] h-[50px] ">
              <CreditCard/>
              <Text className="text-xs">Accounts</Text>
          </View>
        </Pressable>

        <Pressable onPress={() => setScreen('analytics')}>
          <View className="flex flex-col items-center justify-center w-[90px] h-[50px] ">
              <ChartPie/>
              <Text className="text-xs">Analytics</Text>
          </View>
        </Pressable>

        <Pressable onPress={() => setScreen('statistics')}>
          <View className="flex flex-col items-center justify-center w-[90px] h-[50px]  ">
              <ChartLine/>
              <Text className="text-xs">Statistics</Text>
          </View>
        </Pressable>

        
       
      </View>
    </View>
    </AuthProvider>
  );
}
