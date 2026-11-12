import { C, Card, Label } from '@/components/screens';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function AuthHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return <View style={a.header}><Text style={a.wordmark}>Aerun<Text style={{ color: C.green }}>.</Text></Text><Text style={a.eyebrow}>{eyebrow}</Text><Text style={a.title}>{title}</Text><Text style={a.subtitle}>{subtitle}</Text></View>;
}
function Field({ label, placeholder, secureTextEntry = false, keyboardType = 'default' }: { label: string; placeholder: string; secureTextEntry?: boolean; keyboardType?: 'default' | 'email-address' }) {
  const [value, setValue] = useState('');
  return <View style={a.fieldWrap}><Text style={a.fieldLabel}>{label}</Text><TextInput value={value} onChangeText={setValue} placeholder={placeholder} placeholderTextColor="#8D9A92" secureTextEntry={secureTextEntry} keyboardType={keyboardType} autoCapitalize="none" style={a.input}/></View>;
}
function ActionButton({ title, onPress, variant = 'primary' }: { title: string; onPress: () => void; variant?: 'primary' | 'social' | 'outline' }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [a.action, variant === 'primary' ? a.actionPrimary : variant === 'outline' ? a.actionOutline : a.actionSocial, pressed && { opacity: .78 }]}><Text style={[a.actionText, variant !== 'primary' && a.actionTextDark]}>{title}</Text></Pressable>;
}

export function LoginScreen() {
  const continueToPremium = () => router.replace('/premium');
  return <SafeAreaView style={a.safe} edges={['top', 'bottom']}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={a.content} keyboardShouldPersistTaps="handled">
    <AuthHeader eyebrow="WELCOME BACK" title="Log in to Aerun." subtitle="Your route, your air, and your running circle in one place."/>
    <Card style={a.formCard}><Field label="EMAIL OR USERNAME" placeholder="Enter your email or username"/><Field label="PASSWORD" placeholder="Enter your password" secureTextEntry/><Pressable onPress={() => {}} style={a.forgot}><Text style={a.forgotText}>Forgot password?</Text></Pressable><ActionButton title="Log in" onPress={continueToPremium}/><View style={a.orRow}><View style={a.orLine}/><Text style={a.orText}>OR CONTINUE WITH</Text><View style={a.orLine}/></View><ActionButton title="Continue with Google" onPress={continueToPremium} variant="social"/><ActionButton title="Continue with Facebook" onPress={continueToPremium} variant="social"/></Card>
    <View style={a.bottomPrompt}><Text style={a.bottomText}>New to Aerun?</Text><Pressable onPress={() => router.push('/register')}><Text style={a.bottomLink}>Create an account</Text></Pressable></View>
    <Text style={a.disclaimer}>Demo login only. No credentials are checked or saved.</Text>
  </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}

export function RegisterScreen() {
  return <SafeAreaView style={a.safe} edges={['top', 'bottom']}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={a.content} keyboardShouldPersistTaps="handled">
    <Pressable onPress={() => router.back()} style={a.backButton}><Text style={a.backText}>‹  Back</Text></Pressable>
    <AuthHeader eyebrow="JOIN THE COMMUNITY" title="Create your account." subtitle="Set up your Aerun profile and start exploring better run windows."/>
    <Card style={a.formCard}><Field label="USERNAME" placeholder="Choose a username"/><Field label="EMAIL" placeholder="you@example.com" keyboardType="email-address"/><Field label="PASSWORD" placeholder="Create a password" secureTextEntry/><Field label="CONFIRM PASSWORD" placeholder="Re-enter your password" secureTextEntry/><ActionButton title="Create account" onPress={() => router.replace('/login')}/></Card>
    <View style={a.bottomPrompt}><Text style={a.bottomText}>Already have an account?</Text><Pressable onPress={() => router.replace('/login')}><Text style={a.bottomLink}>Log in</Text></Pressable></View>
    <Text style={a.disclaimer}>Demo registration only. You will be returned to the login screen; no account is created.</Text>
  </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}

export function PremiumScreen() {
  const enterToday = () => router.replace('/today');
  return <SafeAreaView style={a.safe} edges={['top', 'bottom']}><ScrollView contentContainerStyle={a.premiumContent}>
    <View style={a.premiumTop}><Text style={a.premiumMark}>✳</Text><Text style={a.premiumEyebrow}>AERUN PLUS</Text><Text style={a.premiumTitle}>Make every run{ '\n' }count a little more.</Text><Text style={a.premiumSubtitle}>Unlock more ways to understand your routes, your progress, and the conditions around you.</Text></View>
    <Card style={a.premiumCard}><Label>PREMIUM FEATURES</Label>
      <View style={a.featureRow}><Text style={a.featureIcon}>⌖</Text><View style={a.featureCopy}><Text style={a.featureTitle}>Smarter route insights</Text><Text style={a.featureSub}>Compare more route options with environmental context.</Text></View></View>
      <View style={a.featureDivider}/>
      <View style={a.featureRow}><Text style={a.featureIcon}>◷</Text><View style={a.featureCopy}><Text style={a.featureTitle}>Deeper running analytics</Text><Text style={a.featureSub}>Explore your pace, distance, and weekly consistency.</Text></View></View>
      <View style={a.featureDivider}/>
      <View style={a.featureRow}><Text style={a.featureIcon}>✧</Text><View style={a.featureCopy}><Text style={a.featureTitle}>Personalized run windows</Text><Text style={a.featureSub}>Find suggested hours based on the day's conditions.</Text></View></View>
      <View style={a.featureDivider}/>
      <View style={a.featureRow}><Text style={a.featureIcon}>♧</Text><View style={a.featureCopy}><Text style={a.featureTitle}>Community challenges</Text><Text style={a.featureSub}>Stay motivated with shared goals and running circles.</Text></View></View>
    </Card>
    <View style={a.premiumButtons}><Pressable onPress={enterToday} style={a.premiumPrimary}><Text style={a.premiumPrimaryText}>Try premium now for ₱99</Text><Text style={a.premiumPrimaryArrow}>↗</Text></Pressable><Pressable onPress={enterToday} style={a.premiumSecondary}><Text style={a.premiumSecondaryText}>Proceed with free features</Text></Pressable></View>
    <Text style={a.disclaimer}>This is a prototype offer only. No payment or subscription will be processed.</Text>
  </ScrollView></SafeAreaView>;
}

const a = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.paper }, content: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 30, gap: 20, width: '100%', maxWidth: 540, alignSelf: 'center' },
  header: { gap: 9, paddingTop: 10, paddingBottom: 6 }, wordmark: { color: C.ink, fontSize: 31, fontWeight: '900', letterSpacing: -1.5, marginBottom: 25 }, eyebrow: { color: C.green, fontSize: 9, fontWeight: '900', letterSpacing: 1.5 }, title: { color: C.ink, fontSize: 30, lineHeight: 36, fontWeight: '900', letterSpacing: -1 }, subtitle: { color: C.muted, fontSize: 12, lineHeight: 18, maxWidth: 330 },
  formCard: { padding: 17, gap: 14 }, fieldWrap: { gap: 6 }, fieldLabel: { color: C.muted, fontSize: 8, fontWeight: '900', letterSpacing: .9 }, input: { minHeight: 49, borderRadius: 12, backgroundColor: '#F7F9F6', borderWidth: 1, borderColor: C.line, color: C.ink, paddingHorizontal: 13, fontSize: 12 }, forgot: { alignSelf: 'flex-end', marginTop: -5 }, forgotText: { color: C.green, fontSize: 9, fontWeight: '800' }, action: { minHeight: 49, borderRadius: 13, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 }, actionPrimary: { backgroundColor: C.lime, marginTop: 1 }, actionOutline: { backgroundColor: C.white, borderWidth: 1, borderColor: C.line }, actionSocial: { backgroundColor: C.white, borderWidth: 1, borderColor: C.line }, actionText: { color: C.ink, fontSize: 12, fontWeight: '900' }, actionTextDark: { color: C.ink }, orRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginVertical: 2 }, orLine: { height: 1, flex: 1, backgroundColor: C.line }, orText: { color: C.muted, fontSize: 7, fontWeight: '900', letterSpacing: .8 }, bottomPrompt: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5 }, bottomText: { color: C.muted, fontSize: 10 }, bottomLink: { color: C.green, fontSize: 10, fontWeight: '900' }, disclaimer: { color: C.muted, textAlign: 'center', fontSize: 9, lineHeight: 14 }, backButton: { alignSelf: 'flex-start', backgroundColor: C.white, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 11 }, backText: { color: C.ink, fontSize: 11, fontWeight: '800' },
  premiumContent: { paddingHorizontal: 22, paddingTop: 26, paddingBottom: 30, gap: 18, width: '100%', maxWidth: 540, alignSelf: 'center' }, premiumTop: { alignItems: 'center', gap: 9, paddingVertical: 10 }, premiumMark: { color: C.ink, backgroundColor: C.lime, fontSize: 29, width: 58, height: 58, borderRadius: 20, textAlign: 'center', textAlignVertical: 'center', overflow: 'hidden', marginBottom: 4 }, premiumEyebrow: { color: C.green, fontSize: 8, fontWeight: '900', letterSpacing: 1.6 }, premiumTitle: { color: C.ink, fontSize: 30, lineHeight: 34, fontWeight: '900', letterSpacing: -1, textAlign: 'center' }, premiumSubtitle: { color: C.muted, fontSize: 11, lineHeight: 17, textAlign: 'center', maxWidth: 300 }, premiumCard: { padding: 17, gap: 13 }, featureRow: { flexDirection: 'row', alignItems: 'center', gap: 11 }, featureIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: C.sage, color: C.green, fontSize: 19, fontWeight: '900', textAlign: 'center', textAlignVertical: 'center', overflow: 'hidden' }, featureCopy: { flex: 1, gap: 3 }, featureTitle: { color: C.ink, fontSize: 11, fontWeight: '900' }, featureSub: { color: C.muted, fontSize: 9, lineHeight: 13 }, featureDivider: { height: 1, backgroundColor: C.line }, premiumButtons: { gap: 9 }, premiumPrimary: { backgroundColor: C.lime, borderRadius: 14, minHeight: 53, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, premiumPrimaryText: { color: C.ink, fontSize: 12, fontWeight: '900' }, premiumPrimaryArrow: { color: C.ink, fontSize: 20, fontWeight: '900' }, premiumSecondary: { minHeight: 48, borderRadius: 14, backgroundColor: C.white, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }, premiumSecondaryText: { color: C.ink, fontSize: 11, fontWeight: '800' },
});
