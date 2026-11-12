import { DemoStateProvider } from '@/components/demo-state';
import { Stack, router, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Keep every screen in one root Stack. A lightweight custom tab bar is rendered
// below the Stack on the five primary app routes. This avoids relying on a
// nested Tabs navigator and keeps the tab bar visible on both native and web.
export const unstable_settings = { initialRouteName: 'index' };

const TAB_ITEMS = [
  { path: '/today', label: 'Today', glyph: '◒' },
  { path: '/routes', label: 'Routes', glyph: '⌁' },
  { path: '/activity', label: 'Record', glyph: '◉' },
  { path: '/community', label: 'Community', glyph: '♧' },
  { path: '/profile', label: 'Profile', glyph: '○' },
] as const;

const evergreen = '#000000';
const aqua = '#8AFFFF';
const paper = '#F5F7F2';
const muted = '#7A8980';

function BottomNavigation() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const activeTab = TAB_ITEMS.find(item => item.path === pathname);

  // Hide the app navigation on login, registration, premium, run recording,
  // and account screens. It is in normal layout flow, so it cannot cover pages.
  if (!activeTab) return null;

  const bottomInset = Math.max(insets.bottom, 0);

  return (
    <View
      style={{
        height: 64 + bottomInset,
        paddingTop: 5,
        paddingBottom: bottomInset > 0 ? bottomInset : 6,
        paddingHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: paper,
        borderTopWidth: 1,
        borderTopColor: aqua,
        flexShrink: 0,
      }}
    >
      {TAB_ITEMS.map(item => {
        const focused = item.path === pathname;
        return (
          <Pressable
            key={item.path}
            onPress={() => router.replace(item.path)}
            accessibilityRole="button"
            accessibilityLabel={`${item.label} tab`}
            accessibilityState={{ selected: focused }}
            style={({ pressed }) => ({
              flex: 1,
              minWidth: 0,
              height: 52,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              opacity: pressed ? 0.68 : 1,
            })}
          >
            <Text
              style={{
                color: focused ? evergreen : muted,
                fontSize: 20,
                lineHeight: 24,
                fontWeight: focused ? '900' : '500',
              }}
            >
              {item.glyph}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                color: focused ? evergreen : muted,
                fontSize: 9,
                lineHeight: 12,
                fontWeight: focused ? '800' : '600',
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function RootNavigator() {
  return (
    <View style={{ flex: 1, backgroundColor: paper }}>
      <View style={{ flex: 1, minHeight: 0 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            // contentStyle: { backgroundColor: paper },
            // animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="premium" />
          <Stack.Screen name="run" />
          <Stack.Screen name="account" />
          <Stack.Screen name="today" />
          <Stack.Screen name="routes" />
          <Stack.Screen name="activity" />
          <Stack.Screen name="community" />
          <Stack.Screen name="profile" />
        </Stack>
      </View>
      <BottomNavigation />
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <DemoStateProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </DemoStateProvider>
    </SafeAreaProvider>
  );
}
