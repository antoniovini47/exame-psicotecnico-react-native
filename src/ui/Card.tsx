import { View, type ViewProps } from 'react-native';
import { radius, usePalette } from '../theme';

export function Card({ style, ...rest }: ViewProps) {
  const palette = usePalette();
  return (
    <View
      style={[{ backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: radius.xl, padding: 16 }, style]}
      {...rest}
    />
  );
}
