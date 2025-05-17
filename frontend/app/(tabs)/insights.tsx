import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { vars } from 'nativewind';
import { useEffect, useState } from 'react';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Button } from '@/components/ui/Button';

const periods = [
  { label: '1 month', value: '1m' },
  { label: '3 months', value: '3m' },
  { label: '6 months', value: '6m' },
  { label: '1 year', value: '1y' },
];

const periodMap = {
  '1m': 1,
  '3m': 3,
  '6m': 6,
  '1y': 12,
};

function InsightBar({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <View className="mb-4">
      <View className="flex-row justify-between mb-1">
        <Text className="text-base-content font-medium">{label}</Text>
        <Text className="text-base-content font-medium">{percent}%</Text>
      </View>
      <View className="h-3 w-full rounded-full bg-base-content-soft overflow-hidden">
        <View className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }} />
      </View>
    </View>
  );
}

export default function InsightsScreen() {
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<keyof typeof periodMap>('1m');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  type InsightItem = { label: string; percent: number };
  const [insightsData, setInsightsData] = useState<{ good: InsightItem[]; down: InsightItem[] }>({ good: [], down: [] });

  const fetchInsights = async () => {
    try {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NzQ5MjY0NCwianRpIjoiNjM4MGQ3N2QtMzgxYi00YmJkLWJiNWMtNDUwN2JjZWZlMjUyIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjUiLCJuYmYiOjE3NDc0OTI2NDQsImNzcmYiOiIwNDU2YzUwMC02ZTA3LTQ5ZWItYTZmZi1jYTIwM2RkYjcyNTciLCJleHAiOjE3NDc3NTE4NDR9.fQxlTImr2YwsogldMi7Z7wrPdy2WHE_tJmXMvYkd2vs'; // 🔐 Replace with real token logic
      const period = periodMap[selectedPeriod];

      const res = await fetch(`http://172.20.10.2:5001/api/get_insight?period=${period}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', data.message || 'Failed to fetch insights');
        return;
      }

      const totalGood = data.good.total || 1;
      const totalBad = data.bad.total || 1;

      const good = Object.entries(data.good)
      .filter(([key]) => key !== 'total')
      .map(([label, count]) => ({
      label,
      percent: Math.round((count as number / totalGood) * 100),
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 4); 

      const down = Object.entries(data.bad)
      .filter(([key]) => key !== 'total')
      .map(([label, count]) => ({
      label,
      percent: Math.round((count as number / totalBad) * 100),
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 4); 

      setInsightsData({ good, down });

    } catch (error) {
      console.error('Fetch insight error:', error);
      Alert.alert('Error', 'Something went wrong fetching insights.');
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [selectedPeriod]);

  return (
    <ScrollView className="flex-1 bg-base-100 px-6 pt-10" style={vars(theme)}>
      {/* Header Row */}
      <View className="flex-row justify-between items-center mb-12 mt-16">
        <Text className="text-3xl font-bold text-base-content">Insights</Text>

        {/* Dropdown Button */}
        <View className="relative">
          <Button
            title={periods.find((p) => p.value === selectedPeriod)?.label}
            iconName="chevron.down"
            contentClassName="text-base-content"
            iconEnd
            onPress={() => setDropdownOpen(!dropdownOpen)}
          />
          
          {dropdownOpen && (
            <View className="absolute right-0 top-12 w-28 bg-base-100 border border-base-content rounded-lg z-50 shadow">
              {periods.map((period) => (
                <Pressable
                  key={period.value}
                  onPress={() => {
                    setSelectedPeriod(period.value as keyof typeof periodMap);
                    setDropdownOpen(false);
                  }}
                  className="px-4 py-2"
                >
                  <Text className="text-base-content">{period.label}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Good Mood */}
      <Text className="text-lg font-semibold text-base-content mb-3">When you feel good…</Text>
      <View className="bg-base-100 rounded-2xl p-4 mb-8 bg-base-200">
        {insightsData.good.map((item) => (
          <InsightBar key={item.label} label={item.label} percent={item.percent} color="bg-primary" />
        ))}
      </View>

      {/* Down Mood */}
      <Text className="text-lg font-semibold text-base-content mb-3">When you feel down…</Text>
      <View className="bg-base-100 rounded-2xl p-4 bg-base-200">
        {insightsData.down.map((item) => (
          <InsightBar key={item.label} label={item.label} percent={item.percent} color="bg-rose-800" />
        ))}
      </View>
    </ScrollView>
  );
}
