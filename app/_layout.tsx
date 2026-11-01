import { Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black, useFonts } from '@expo-google-fonts/nunito';
import { Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { initAds } from '../src/ads/ads';
import { initAnalytics, trackScreen } from '../src/analytics';
import { usePalette } from '../src/theme';

SplashScreen.preventAutoHideAsync();
initAnalytics();
initAds();

export default function RootLayout() {
  const palette = usePalette();
  const pathname = usePathname();
  const [loaded, error] = useFonts({ Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  useEffect(() => {
    trackScreen(pathname);
  }, [pathname]);

  if (!loaded && !error) return null;

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.background } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="rodada" options={{ gestureEnabled: false }} />
        <Stack.Screen name="resultado" options={{ gestureEnabled: false }} />
        <Stack.Screen name="revisao" />
        <Stack.Screen name="atencao" options={{ gestureEnabled: false }} />
        <Stack.Screen name="dividida" options={{ gestureEnabled: false }} />
        <Stack.Screen name="memoria" options={{ gestureEnabled: false }} />
      </Stack>
    </>
  );
}
