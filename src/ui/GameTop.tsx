import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { usePalette } from '../theme';
import { Icon } from './Icon';
import { ProgressBar } from './ProgressBar';
import { Text } from './Text';

interface Props {
  caption: string;
  progress: number;
  closeLabel: string;
}

export function GameTop({ caption, progress, closeLabel }: Props) {
  const router = useRouter();
  const palette = usePalette();
  return (
    <View style={styles.top}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={closeLabel}
        onPress={() => router.back()}
        style={[styles.close, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Icon name="close" size={20} color={palette.ink} strokeWidth={2.4} />
      </Pressable>
      <View style={{ flex: 1, gap: 6 }}>
        <Text variant="caption" muted>
          {caption}
        </Text>
        <ProgressBar value={progress} color={palette.good} track={palette.track} height={8} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  close: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
