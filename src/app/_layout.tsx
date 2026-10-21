import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { DemoStateProvider } from '@/components/demo-state';

// Keep the app's entry route on the static title screen on each fresh launch.
export const unstable_settings = { initialRouteName: 'index' };

const evergreen = '#000000';
const aqua = '#8AFFFF';
const paper = '#F5F7F2';
const muted = '#7A8980';

function TabIcon({ glyph, focused }: { glyph: string; focused: boolean }) {
  return <View style={{ width: 26, height: 23, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: focused ? evergreen : muted, fontSize: 19, fontWeight: focused ? '800' : '500' }}>{glyph}</Text></View>;
}

export default function RootLayout() {
  return <DemoStateProvider><StatusBar style="dark"/><Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: evergreen, tabBarInactiveTintColor: muted, tabBarLabelStyle: { fontSize: 9, fontWeight: '700', marginBottom: 4 }, tabBarStyle: { backgroundColor: paper, borderTopColor: aqua, height: 62, paddingTop: 5 }, sceneStyle: { backgroundColor: paper } }}>
    <Tabs.Screen name="index" options={{ href: null, tabBarStyle: { display: 'none' } }}/>
    <Tabs.Screen name="today" options={{ title: 'Today', tabBarIcon: ({ focused }) => <TabIcon glyph="◒" focused={focused}/> }}/>
    <Tabs.Screen name="routes" options={{ title: 'Routes', tabBarIcon: ({ focused }) => <TabIcon glyph="⌁" focused={focused}/> }}/>
    <Tabs.Screen name="activity" options={{ title: 'Activity', tabBarIcon: ({ focused }) => <TabIcon glyph="◷" focused={focused}/> }}/>
    <Tabs.Screen name="community" options={{ title: 'Community', tabBarIcon: ({ focused }) => <TabIcon glyph="♧" focused={focused}/> }}/>
    <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ focused }) => <TabIcon glyph="○" focused={focused}/> }}/>
  </Tabs></DemoStateProvider>;
}
