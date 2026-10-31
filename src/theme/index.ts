import { useColorScheme } from 'react-native';

const light = {
  background: '#FFFBEF',
  surface: '#FFFFFF',
  border: '#EDE6D3',
  track: '#EDE6D3',
  ink: '#0E3B43',
  inkMuted: '#4A5D60',
  primary: '#FFC93C',
  primarySoft: '#FFE9A8',
  onPrimary: '#0E3B43',
  hero: '#0E3B43',
  onHero: '#FFFBEF',
  onHeroMuted: '#CFE0E1',
  heroTrack: '#2A5960',
  good: '#2E9E5B',
  goodSoft: '#DDF3E4',
  goodInk: '#1E7A44',
  bad: '#D9481F',
  badSoft: '#FDE7E1',
  badInk: '#A3330F',
  warn: '#E8A317',
  flame: '#C2410C',
};

export type Palette = typeof light;

const dark: Palette = {
  background: '#0B1F23',
  surface: '#13292D',
  border: '#234247',
  track: '#234247',
  ink: '#F4EFE1',
  inkMuted: '#A9BDBF',
  primary: '#FFC93C',
  primarySoft: '#3A3418',
  onPrimary: '#0E3B43',
  hero: '#183A40',
  onHero: '#F4EFE1',
  onHeroMuted: '#A9BDBF',
  heroTrack: '#2A5960',
  good: '#3DBA72',
  goodSoft: '#163826',
  goodInk: '#7EDBA3',
  bad: '#F06A43',
  badSoft: '#3C1E16',
  badInk: '#FF9C7E',
  warn: '#F2B84B',
  flame: '#FB923C',
};

export const fonts = {
  regular: 'Nunito_400Regular',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
} as const;

export const radius = { sm: 10, md: 14, lg: 18, xl: 20, pill: 999 } as const;

export function usePalette(): Palette {
  return useColorScheme() === 'dark' ? dark : light;
}
