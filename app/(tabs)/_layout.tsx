import { Tabs } from 'expo-router';
import { Compass, FileText, Gauge, Settings } from 'lucide-react-native';
import { colors } from '@/lib/theme';

export default function TabLayout() {
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.teal, tabBarInactiveTintColor: colors.muted, tabBarStyle: { height: 74, paddingTop: 8, borderTopColor: colors.line, backgroundColor: '#fff' }, tabBarLabelStyle: { fontSize: 11, fontWeight: '700', paddingBottom: 7 } }}><Tabs.Screen name="index" options={{ title: 'Navigate', tabBarIcon: ({ color, size }) => <Compass color={color} size={size} /> }} /><Tabs.Screen name="drive" options={{ title: 'Drive', tabBarIcon: ({ color, size }) => <Gauge color={color} size={size} /> }} /><Tabs.Screen name="reports" options={{ title: 'Reports', tabBarIcon: ({ color, size }) => <FileText color={color} size={size} /> }} /><Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ color, size }) => <Settings color={color} size={size} /> }} /></Tabs>;
}
