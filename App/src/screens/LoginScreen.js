import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';

export default function LoginScreen({ onLogin, busy }) {
  const [email, setEmail] = useState('student1@lpu.edu');
  const [password, setPassword] = useState('student123');

  return (
    <LinearGradient colors={['#0f172a', '#1d4ed8', '#0891b2']} style={styles.bg}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Student QR Attendance</Text>
            </View>
            <Text style={styles.title}>Sign in to scan QR codes</Text>
            <Text style={styles.subtitle}>
              Use your student account to scan the teacher's rotating QR code and mark attendance instantly.
            </Text>

            <View style={styles.form}>
              <TextField label="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
              <TextField label="Password" secureTextEntry value={password} onChangeText={setPassword} />

              <PrimaryButton onPress={() => onLogin(email.trim(), password)} disabled={busy}>
                {busy ? 'Signing in...' : 'Continue'}
              </PrimaryButton>
            </View>

            {busy ? <ActivityIndicator color="#2563eb" style={{ marginTop: 16 }} /> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bg: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 28,
    padding: 24,
    gap: 14,
    boxShadow: '0px 16px 30px rgba(15, 23, 42, 0.22)',
    elevation: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dbeafe',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#1d4ed8',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    color: '#0f172a',
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 22,
  },
  form: {
    gap: 14,
    marginTop: 8,
  },
});
