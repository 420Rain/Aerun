import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function TitleScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.surface}>
        <View style={styles.logoPlaceholder}><View style={styles.logoArc} /><View style={styles.logoDot} /></View>
        <Text style={styles.wordmark}>Aerun<Text style={styles.wordmarkDot}>.</Text></Text>
        <Text style={styles.tagline}>YOUR ROUTE. YOUR AIR.</Text>
        <Text style={styles.intro}>Make every run more informed.</Text>
        <Text style={styles.subintro}>Explore your city with air quality and weather context built into the journey.</Text>
        <Pressable onPress={() => router.push('/login')} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}><Text style={styles.primaryText}>Get started</Text><Text style={styles.primaryArrow}>↗</Text></Pressable>
        <Pressable onPress={() => router.push('/login')} style={styles.loginLink}><Text style={styles.loginText}>Already have an account? <Text style={styles.loginStrong}>Log in</Text></Text></Pressable>
        <Text style={styles.footer}>A FRONTEND-ONLY PROTOTYPE · METRO MANILA</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000000' },
  surface: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, backgroundColor: '#000000', gap: 14 },
  logoPlaceholder: { width: 104, height: 104, borderRadius: 31, borderWidth: 1, borderColor: '#8AFFFF', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: 8 },
  logoArc: { width: 45, height: 45, borderRadius: 23, borderWidth: 5, borderColor: '#8AFFFF', borderRightColor: 'transparent', transform: [{ rotate: '-35deg' }] },
  logoDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#8AFFFF', position: 'absolute', right: 28, top: 27 },
  wordmark: { color: '#8AFFFF', fontSize: 42, fontWeight: '900', letterSpacing: -1.8 },
  wordmarkDot: { color: '#FFFFFF' },
  tagline: { color: '#AABBB2', fontSize: 8, fontWeight: '900', letterSpacing: 2.2, marginBottom: 24 },
  intro: { color: '#FFFFFF', fontSize: 23, fontWeight: '900', textAlign: 'center', letterSpacing: -.5 },
  subintro: { color: '#AABBB2', fontSize: 12, lineHeight: 18, maxWidth: 285, textAlign: 'center', marginBottom: 19 },
  primary: { width: '100%', minHeight: 54, borderRadius: 15, backgroundColor: '#8AFFFF', paddingHorizontal: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  primaryText: { color: '#000000', fontSize: 13, fontWeight: '900' },
  primaryArrow: { color: '#000000', fontSize: 20, fontWeight: '900' },
  loginLink: { padding: 9 },
  loginText: { color: '#AABBB2', fontSize: 10 },
  loginStrong: { color: '#8AFFFF', fontWeight: '900' },
  footer: { position: 'absolute', bottom: 19, color: '#6E8177', fontSize: 7, letterSpacing: 1, fontWeight: '800' },
  pressed: { opacity: .82 },
});
