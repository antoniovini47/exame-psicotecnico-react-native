import { getAnalytics, logEvent, setAnalyticsCollectionEnabled } from '@react-native-firebase/analytics';

type Params = Record<string, string | number>;

const analytics = getAnalytics();
let lastScreen: string | null = null;

export function initAnalytics(): void {
  setAnalyticsCollectionEnabled(analytics, process.env.EXPO_PUBLIC_ANALYTICS === 'on');
}

export function track(name: string, params?: Params): void {
  logEvent(analytics, name, params);
}

export function trackScreen(path: string): void {
  if (path === lastScreen) return;
  lastScreen = path;
  logEvent(analytics, 'screen_view', { screen_name: path, screen_class: path });
}
