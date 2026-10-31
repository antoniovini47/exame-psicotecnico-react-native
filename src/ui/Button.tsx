import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { radius, usePalette } from '../theme';
import { Text } from './Text';

interface Props {
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'dark' | 'outline';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, onPress, kind = 'primary', disabled, style }: Props) {
  const palette = usePalette();
  const background = kind === 'primary' ? palette.primary : kind === 'dark' ? palette.hero : 'transparent';
  const color = kind === 'primary' ? palette.onPrimary : kind === 'dark' ? palette.onHero : palette.ink;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: background, borderColor: kind === 'outline' ? palette.ink : background, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}>
      <Text variant="bodyStrong" color={color} style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 52, borderRadius: radius.lg, borderWidth: 2, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  label: { fontSize: 17, textAlign: 'center' },
});
