import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function TitleScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Aerun"
        onPress={() => router.replace('/activity')}
        style={({ pressed }) => [styles.surface, pressed && styles.pressed]}
      >
        {/* Replace this framed mark with the Aerun logo image when it is ready. */}
        <View style={styles.logoPlaceholder}>
          <View style={styles.logoArc} />
          <View style={styles.logoDot} />
        </View>
        <Text style={styles.wordmark}>Aerun</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000000' },
  surface: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 26, backgroundColor: '#000000' },
  pressed: { opacity: 0.92 },
  logoPlaceholder: { width: 112, height: 112, borderRadius: 32, borderWidth: 1, borderColor: '#8AFFFF', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  logoArc: { width: 45, height: 45, borderRadius: 23, borderWidth: 5, borderColor: '#8AFFFF', borderRightColor: 'transparent', transform: [{ rotate: '-35deg' }] },
  logoDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#8AFFFF', position: 'absolute', right: 31, top: 30 },
  wordmark: { color: '#8AFFFF', fontSize: 38, fontWeight: '800', letterSpacing: 5 },
});
