import { Pressable, StyleSheet } from 'react-native';
import { radius, usePalette } from '../theme';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

interface Props {
  title: string;
  icon: IconName;
  detail: string;
  onPress?: () => void;
}

export function SkillTile({ title, icon, detail, onPress }: Props) {
  const palette = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !onPress }}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: palette.surface, borderColor: palette.border, opacity: onPress ? (pressed ? 0.85 : 1) : 0.6 },
      ]}>
      <Icon name={icon} size={32} color={palette.ink} />
      <Text variant="bodyStrong">{title}</Text>
      <Text variant="caption" muted>
        {detail}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: { flexBasis: '47%', flexGrow: 1, minHeight: 112, borderWidth: 1, borderRadius: radius.lg, padding: 14, gap: 8 },
});
