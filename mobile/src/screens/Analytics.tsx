import { ActivityIndicator, ScrollView, View, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import ExpensePieChart from '../components/ExpensePieChart';

type ExpenseCategory = {
  category: string;
  num_trans_cat: number;
  percentage_num_trans: number;
  amount: number;
  percentage_amount: number;
};

export default function AnalyticsScreen() {

    const { token } = useAuth();

const [categories, setCategories] = useState<ExpenseCategory[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  if (!token) return;

  let cancelled = false;

  async function loadCategories() {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_DATABASE_URL}/rest/v1/rpc/get_expense_category_percentages`,
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

    const data: ExpenseCategory[] = await response.json();

    if (!cancelled) {
      setCategories(data);
      setError(null);
    }
  }

  loadCategories()
    .catch((error: unknown) => {
      if (!cancelled) {
        setError(error instanceof Error ? error.message : 'Unable to load spending.');
      }
    })
    .finally(() => {
      if (!cancelled) setLoading(false);
    });

  return () => {
    cancelled = true;
  };
}, [token]);



  return (
    <View className="flex-1 bg-white">
      <Text className="mt-20 px-6 text-xl font-semibold text-gray-900">Spending by category</Text>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
        {!token ? (
          <Text className="text-gray-500">Sign in on Home to see your spending.</Text>
        ) : loading ? (
          <ActivityIndicator size="large" color="#3b82f6" />
        ) : error ? (
          <Text accessibilityRole="alert" className="text-red-600">{error}</Text>
        ) : (
          <ExpensePieChart categories={categories} />
        )}
      </ScrollView>
    </View>
  );
}
