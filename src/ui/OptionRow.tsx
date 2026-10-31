import { Pressable, StyleSheet, View } from 'react-native';
import { radius, usePalette } from '../theme';
import { Icon } from './Icon';
import { Text } from './Text';

export type OptionState = 'idle' | 'correct' | 'wrong' | 'dimmed';

interface Props {
  letter: string;
  label: string;
  state: OptionState;
  onPress?: () => void;
}

export function OptionRow({ letter, label, state, onPress }: Props) {
  const palette = usePalette();
  const tone = {
    idle: { bg: palette.surface, border: palette.border, chip: palette.primarySoft, chipInk: palette.ink, ink: palette.ink },
    correct: { bg: palette.goodSoft, border: palette.good, chip: palette.good, chipInk: '#FFFFFF', ink: palette.ink },
    wrong: { bg: palette.badSoft, border: palette.bad, chip: palette.bad, chipInk: '#FFFFFF', ink: palette.ink },
    dimmed: { bg: palette.surface, border: palette.border, chip: palette.track, chipInk: palette.inkMuted, ink: palette.inkMuted },
  }[state];
  const status = state === 'correct' ? ', resposta certa' : state === 'wrong' ? ', sua resposta, errada' : '';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Alternativa ${letter}: ${label}${status}`}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: tone.bg, borderColor: tone.border, borderWidth: state === 'correct' || state === 'wrong' ? 2 : 1, opacity: pressed ? 0.85 : 1 },
      ]}>
      <View style={[styles.chip, { backgroundColor: tone.chip }]}>
        <Text variant="bodyStrong" color={tone.chipInk} style={{ fontSize: 14 }}>
          {letter}
        </Text>
      </View>
      <Text variant="bodyStrong" color={tone.ink} style={styles.label}>
        {label}
      </Text>
      {state === 'correct' && <Icon name="check" size={22} color={palette.goodInk} strokeWidth={3} />}
      {state === 'wrong' && <Icon name="close" size={22} color={palette.badInk} strokeWidth={3} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 52, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 10 },
  chip: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontSize: 17 },
});
