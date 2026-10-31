import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { fonts, usePalette } from '../../src/theme';
import { Icon, type IconName } from '../../src/ui/Icon';

function tabIcon(name: IconName) {
  return ({ color }: { color: ColorValue }) => <Icon name={name} color={color} />;
}

export default function TabsLayout() {
  const palette = usePalette();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.ink,
        tabBarInactiveTintColor: palette.inkMuted,
        tabBarStyle: { backgroundColor: palette.surface, borderTopColor: palette.border },
        tabBarLabelStyle: { fontFamily: fonts.extraBold, fontSize: 12 },
        sceneStyle: { backgroundColor: palette.background },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: tabIcon('home') }} />
      <Tabs.Screen name="treinar" options={{ title: 'Treinar', tabBarIcon: tabIcon('train') }} />
      <Tabs.Screen name="simulado" options={{ title: 'Simulado', tabBarIcon: tabIcon('exam') }} />
      <Tabs.Screen name="progresso" options={{ title: 'Progresso', tabBarIcon: tabIcon('chart') }} />
    </Tabs>
  );
}
