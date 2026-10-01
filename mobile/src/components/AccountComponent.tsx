import { memo, useId } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Svg, { Defs, LinearGradient, Line, RadialGradient, Rect, Stop } from 'react-native-svg';

type AccountComponentProps = {
  iban: string;
  balance: number;
  booked_balance: number;
  product: string;
  usage: string;
  id: number;
  label: string | null;
  cash_account_type?: string | null;
  isSelected?: boolean;
  onPress?: () => void;
};

const amountFormatter = new Intl.NumberFormat('nb-NO', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatAccountNumber(iban: string) {
  const compact = (iban ?? '').replace(/\s/g, '');
  if (/^NO\d{13}$/i.test(compact)) {
    const number = compact.slice(4);
    return `${number.slice(0, 4)} ${number.slice(4, 6)} ${number.slice(6)}`;
  }
  return compact.match(/.{1,4}/g)?.join(' ') ?? '';
}

function Account({
  iban, balance, booked_balance, product, usage, label,
  cash_account_type, isSelected = false, onPress,
}: AccountComponentProps) {
  const gradientId = useId().replace(/[^a-zA-Z0-9]/g, '');

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${label || product}, ${amountFormatter.format(balance / 100)}`}
      style={({ pressed }) => [
        styles.card,
        { transform: [{ translateX: isSelected ? 6 : 0 }, { scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      <View pointerEvents="none" style={StyleSheet.absoluteFill} className="rounded-2xl overflow-hidden">
        <Svg width="100%" height="100%" viewBox="0 0 360 160" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id={`${gradientId}base`} x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0" stopColor="#2A1B2A" />
              <Stop offset="1" stopColor="#3E2436" />
            </LinearGradient>
            <RadialGradient id={`${gradientId}rose`} cx="8%" cy="92%" rx="72%" ry="78%">
              <Stop offset="0" stopColor="#B44A6B" />
              <Stop offset="1" stopColor="#B44A6B" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id={`${gradientId}amber`} cx="88%" cy="10%" rx="60.5%" ry="66%">
              <Stop offset="0" stopColor="#E0913F" />
              <Stop offset="1" stopColor="#E0913F" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect width="360" height="160" fill={`url(#${gradientId}base)`} />
          <Rect width="360" height="160" fill={`url(#${gradientId}rose)`} />
          <Rect width="360" height="160" fill={`url(#${gradientId}amber)`} />
          <Line x1="120" y1="0" x2="120" y2="160" stroke="white" strokeOpacity={0.1} />
          <Line x1="240" y1="0" x2="240" y2="160" stroke="white" strokeOpacity={0.1} />
          <Line x1="0" y1="80" x2="360" y2="80" stroke="white" strokeOpacity={0.1} />
        </Svg>
      </View>

      <View style={styles.content}>
      <View className="flex-row items-center gap-2 ">
        <Text className="flex-1 text-base font-medium text-white" numberOfLines={1}>
          {label || product}
        </Text>
        {!!(cash_account_type || usage) && (
          <View className="max-w-[35%] rounded-full border border-white/20 bg-white/10 px-2 py-1">
            <Text className="text-xs text-white" numberOfLines={1}>
              {cash_account_type || usage}
            </Text>
          </View>
        )}
        <Text className="text-[10px] tracking-widest text-white/80">STOREBRAND</Text>
      </View>

      <View className="flex-row items-end justify-between gap-3">
        <Text className="flex-1 text-xs text-white/90" numberOfLines={1} selectable>
          {formatAccountNumber(iban)}
        </Text>
        <View className="max-w-[60%] items-end gap-1">
          <Text className="text-xl font-medium text-white" style={styles.amount} numberOfLines={1}>
            {amountFormatter.format(balance / 100)}
          </Text>
          <Text className="text-xs text-white/80" style={styles.amount} numberOfLines={1}>
            Booked {amountFormatter.format(booked_balance / 100)}
          </Text>
        </View>
      </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: '#2A1B2A',
    overflow: 'hidden',
  },
  content: {
    minHeight: 160,
    paddingHorizontal: 24,
    paddingVertical: 24,
    justifyContent: 'space-between',
    gap: 28,
  },
  amount: { fontVariant: ['tabular-nums'] },
});

export default memo(Account);
