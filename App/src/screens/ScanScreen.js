import React, { useEffect, useMemo, useState } from 'react';
import { Alert, View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import PrimaryButton from '../components/PrimaryButton';

export default function ScanScreen({ user, onLogout, onScan }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [locked, setLocked] = useState(false);
  const [result, setResult] = useState(null);
  const [lastScan, setLastScan] = useState(null);

  useEffect(function() {
    if (!permission || permission.granted) return;
    requestPermission();
  }, [permission, requestPermission]);

  const resultStyle = useMemo(function() {
    if (!result) return styles.idle;
    return result.kind === 'success' ? styles.success : styles.error;
  }, [result]);

  async function handleBarcodeScanned(event) {
    if (locked || !event?.data) return;
    setLocked(true);
    setResult({ kind: 'processing', title: 'Marking attendance...', subtitle: 'Please wait' });

    try {
      const data = await onScan(event.data);
      const className = `${data.class_name} - ${data.section}`;
      const subtitle = data.already_scanned_session ? 'Already scanned this QR window' : 'Attendance marked present';
      const payloadResult = { kind: 'success', title: className, subtitle };
      setResult(payloadResult);
      setLastScan(payloadResult);
      Alert.alert('Attendance marked', `${className}\n${subtitle}`);
    } catch (error) {
      const message = error?.response?.data?.error || error.message || 'QR scan failed';
      const payloadResult = { kind: 'error', title: 'Scan failed', subtitle: message };
      setResult(payloadResult);
      setLastScan(payloadResult);
      Alert.alert('Scan failed', message);
    } finally {
      setTimeout(function() {
        setLocked(false);
      }, 1400);
    }
  }

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#2563eb" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <LinearGradient colors={['#0f172a', '#1d4ed8', '#0891b2']} style={styles.bg}>
        <View style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>Camera permission needed</Text>
          <Text style={styles.permissionText}>
            The app needs camera access to scan the teacher's QR code and mark attendance.
          </Text>
          <PrimaryButton onPress={requestPermission}>Grant Camera Access</PrimaryButton>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#f8fafc', '#eff6ff', '#ecfeff']} style={styles.bg}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Signed in as</Text>
          <Text style={styles.name}>{user.full_name}</Text>
          <Text style={styles.meta}>{user.student_id || user.email}</Text>
        </View>
        <Pressable onPress={onLogout} style={({ pressed }) => [styles.logout, pressed && { opacity: 0.8 }]}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.title}>Scan the rotating QR code</Text>
        <Text style={styles.subtitle}>Point the camera at the QR shown by your teacher. Attendance will be marked automatically.</Text>
      </View>

      <View style={styles.cameraShell}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={locked ? undefined : handleBarcodeScanned}
        />
        <View style={styles.overlay}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
        </View>
        <View style={styles.scanLabel}>
          <Text style={styles.scanLabelText}>{locked ? 'Processing...' : 'Scanner ready'}</Text>
        </View>
      </View>

      <View style={[styles.resultCard, resultStyle]}>
        <Text style={styles.resultTitle}>{result ? result.title : 'Waiting for QR code'}</Text>
        <Text style={styles.resultText}>{result ? result.subtitle : 'Hold the QR inside the frame to mark attendance.'}</Text>
        {lastScan ? <Text style={styles.timestamp}>Last scan: {new Date().toLocaleTimeString()}</Text> : null}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, padding: 18, gap: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: { color: '#64748b', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  name: { color: '#0f172a', fontSize: 24, fontWeight: '900', marginTop: 4 },
  meta: { color: '#64748b', marginTop: 2 },
  logout: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.95)',
  },
  logoutText: { color: '#0f172a', fontWeight: '800' },
  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.95)',
  },
  title: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  subtitle: { marginTop: 8, color: '#475569', lineHeight: 21 },
  cameraShell: {
    flex: 1,
    minHeight: 340,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.22)',
    shadowColor: '#0f172a',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  camera: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  cornerTopLeft: {
    position: 'absolute', left: 22, top: 22, width: 42, height: 42, borderLeftWidth: 4, borderTopWidth: 4, borderColor: '#ffffff', borderTopLeftRadius: 16,
  },
  cornerTopRight: {
    position: 'absolute', right: 22, top: 22, width: 42, height: 42, borderRightWidth: 4, borderTopWidth: 4, borderColor: '#ffffff', borderTopRightRadius: 16,
  },
  cornerBottomLeft: {
    position: 'absolute', left: 22, bottom: 22, width: 42, height: 42, borderLeftWidth: 4, borderBottomWidth: 4, borderColor: '#ffffff', borderBottomLeftRadius: 16,
  },
  cornerBottomRight: {
    position: 'absolute', right: 22, bottom: 22, width: 42, height: 42, borderRightWidth: 4, borderBottomWidth: 4, borderColor: '#ffffff', borderBottomRightRadius: 16,
  },
  scanLabel: {
    position: 'absolute', bottom: 16, left: 16, right: 16,
    backgroundColor: 'rgba(15,23,42,0.72)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  scanLabelText: { color: 'white', fontWeight: '800', textAlign: 'center' },
  resultCard: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.95)',
  },
  idle: {},
  success: { borderColor: 'rgba(16,185,129,0.35)' },
  error: { borderColor: 'rgba(220,38,38,0.35)' },
  resultTitle: { color: '#0f172a', fontSize: 18, fontWeight: '900' },
  resultText: { marginTop: 6, color: '#475569', lineHeight: 20 },
  timestamp: { marginTop: 10, color: '#64748b', fontSize: 12, fontWeight: '700' },
  permissionCard: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 28,
    padding: 24,
    gap: 14,
  },
  permissionTitle: { color: '#0f172a', fontSize: 22, fontWeight: '900' },
  permissionText: { color: '#475569', lineHeight: 21 },
  flex: { flex: 1 },
});
