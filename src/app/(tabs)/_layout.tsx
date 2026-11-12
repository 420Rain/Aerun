import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const evergreen = '#000000';
const aqua = '#8AFFFF';
const paper = '#F5F7F2';
const muted = '#7A8980';

function TabIcon({ glyph, focused }: { glyph: string; focused: boolean }) {
  return (
    <View style={{ width: 26, height: 23, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: focused ? evergreen : muted, fontSize: 19, fontWeight: focused ? '800' : '500' }}>{glyph}</Text>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  // Add the Android/iOS system bottom inset to the tab bar itself so the
  // tab items sit above the phone's navigation/gesture area.
  const bottomInset = Math.max(insets.bottom, 0);
  const baseHeight = 62;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: evergreen,
        tabBarInactiveTintColor: muted,
        tabBarLabelStyle: { fontSize: 9, fontWeight: '700', marginBottom: 2 },
        tabBarStyle: {
          backgroundColor: paper,
          borderTopColor: aqua,
          height: baseHeight + bottomInset,
          paddingTop: 5,
          paddingBottom: bottomInset > 0 ? bottomInset : 6,
        },
        sceneStyle: { backgroundColor: paper },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen name="today" options={{ title: 'Today', tabBarIcon: ({ focused }) => <TabIcon glyph="◒" focused={focused} /> }} />
      <Tabs.Screen name="routes" options={{ title: 'Routes', tabBarIcon: ({ focused }) => <TabIcon glyph="⌁" focused={focused} /> }} />
      <Tabs.Screen name="activity" options={{ title: 'Record', tabBarIcon: ({ focused }) => <TabIcon glyph="◉" focused={focused} /> }} />
      <Tabs.Screen name="community" options={{ title: 'Community', tabBarIcon: ({ focused }) => <TabIcon glyph="♧" focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ focused }) => <TabIcon glyph="○" focused={focused} /> }} />
    </Tabs>
  );
}
