import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StatusBar, Text, View, StyleSheet, Image } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import LoginScreen from './src/screens/LoginScreen';
import ScanScreen from './src/screens/ScanScreen';
import { clearSession, loadSession, saveSession } from './src/storage';
import { login, scanAttendance } from './src/api';

const Stack = createStackNavigator();

export default function App() {
  const [booting, setBooting] = useState(true);
  const [busy, setBusy] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(function () {
    loadSession()
      .then(setSession)
      .finally(function () {
        setBooting(false);
      });
  }, []);

  async function handleLogin(email, password) {
    setBusy(true);
    try {
      const response = await login(email, password);
      if (!response.user || response.user.role !== 'student') {
        throw new Error('Please sign in with a student account.');
      }
      const nextSession = {
        accessToken: response.access_token,
        user: response.user,
      };
      await saveSession(nextSession);
      setSession(nextSession);
    } catch (error) {
      Alert.alert('Login failed', error?.response?.data?.error || error.message || 'Unable to sign in');
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    await clearSession();
    setSession(null);
  }

  async function handleScan(payload) {
    if (!session?.accessToken) {
      throw new Error('No session token available');
    }
    return scanAttendance(session.accessToken, payload);
  }

  if (booting) {
    return (
      <LinearGradient colors={['#0f172a', '#1d4ed8', '#0891b2']} style={styles.boot}>
        <Image source={require('./src/public/logo.png')} style={styles.bootLogo} />
        <ActivityIndicator color="#ffffff" size={42} />
        <Text style={styles.bootText}>Loading attendance app...</Text>
      </LinearGradient>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#fff' } }}>
          {!session ? (
            <Stack.Screen name="Login">
              {() => <LoginScreen onLogin={handleLogin} busy={busy} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Scanner">
              {() => <ScanScreen user={session.user} onLogout={handleLogout} onScan={handleScan} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  bootLogo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  bootText: {
    color: 'white',
    fontWeight: '700',
  },
});
