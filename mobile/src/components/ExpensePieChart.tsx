import { Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

type Expense = { category: string; amount: number };

// Edit these colors to customize individual categories.
const categoryColors: Record<string, string> = {
  dagligvarer: '#22c55e',
  transport: '#3b82f6',
  restaurant: '#f97316',
  shopping: '#a855f7',
  takeaway: '#eab308',
  sosialt: '#ec4899',
  reise: '#14b8a6',
  trening: '#ef4444',
  elektronikk: '#6366f1',
  other: '#94a3b8',
};
const fallbackColors = ['#0891b2', '#d97706', '#7c3aed', '#be185d', '#059669'];
const currency = new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK' });
const percent = new Intl.NumberFormat('nb-NO', { style: 'percent', maximumFractionDigits: 1 });

function getColor(category: string) {
  const key = category.trim().toLowerCase();
  let hash = 0;
  for (const character of key) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return categoryColors[key] ?? fallbackColors[hash % fallbackColors.length];
}

export default function ExpensePieChart({ categories }: { categories: Expense[] }) {
  const expenses = categories
    .filter(({ amount }) => Number.isFinite(amount) && amount > 0)
    .slice()
    .sort((a, b) => b.amount - a.amount);
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  if (total === 0) {
    return <Text className="text-center text-gray-500 py-8">No spending to show yet.</Text>;
  }

  let angle = -Math.PI / 2;
  const slices: (Expense & { color: string; path: string })[] = [];
  for (const item of expenses) {
    const start = angle;
    const sweep = (item.amount / total) * Math.PI * 2;
    angle += sweep;
    const x1 = 150 + 140 * Math.cos(start);
    const y1 = 150 + 140 * Math.sin(start);
    const x2 = 150 + 140 * Math.cos(angle);
    const y2 = 150 + 140 * Math.sin(angle);
    slices.push({
      ...item,
      color: getColor(item.category),
      path: `M 150 150 L ${x1} ${y1} A 140 140 0 ${sweep > Math.PI ? 1 : 0} 1 ${x2} ${y2} Z`,
    });
  }

  return (
    <View className="w-full gap-5">
      <View
        style={{ width: '100%', maxWidth: 320, aspectRatio: 1, alignSelf: 'center' }}
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Spending by category. Total ${currency.format(total)}. Breakdown below.`}
      >
        <Svg width="100%" height="100%" viewBox="0 0 300 300">
          {slices.length === 1 ? (
            <Circle cx={150} cy={150} r={140} fill={slices[0].color} />
          ) : slices.map((slice) => (
            <Path key={slice.category} d={slice.path} fill={slice.color} stroke="white" strokeWidth={2} />
          ))}
        </Svg>
      </View>

      <View className="items-center gap-1">
        <Text className="text-sm text-gray-500">Total spending</Text>
        <Text className="text-2xl font-semibold text-gray-900">{currency.format(total)}</Text>
      </View>

      {slices.map((slice) => (
        <View key={slice.category} className="flex-row items-center gap-3">
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: slice.color }} />
          <Text className="flex-1 text-sm text-gray-900" numberOfLines={1}>{slice.category}</Text>
          <View className="items-end">
            <Text className="text-sm font-medium text-gray-900">{currency.format(slice.amount)}</Text>
            <Text className="text-xs text-gray-500">{percent.format(slice.amount / total)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
