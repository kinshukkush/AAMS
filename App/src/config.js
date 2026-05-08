import { Platform } from 'react-native';

const isDev = __DEV__;

// CHANGE THIS to your production Railway URL
const PRODUCTION_URL = 'https://aams-production.up.railway.app';

const fallbackBaseUrl = Platform.select({
  android: isDev ? 'http://10.0.2.2:8000' : PRODUCTION_URL,
  ios: isDev ? 'http://localhost:8000' : PRODUCTION_URL,
  web: isDev ? 'http://localhost:8000' : PRODUCTION_URL,
  default: PRODUCTION_URL,
});

// Priority: Env Var > Fallback
export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || fallbackBaseUrl).replace(/\/$/, '');
export const STORAGE_KEY = 'aams.attendance.session';
export const APP_NAME = 'AAMS Attendance';
