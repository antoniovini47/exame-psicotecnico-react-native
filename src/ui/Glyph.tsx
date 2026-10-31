import type { ColorValue } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import type { Glyph as GlyphName } from '../domain/focusedAttention';

const TRIANGLES: Record<Exclude<GlyphName, 'square'>, string> = {
  up: 'M12 4l9 16H3z',
  down: 'M12 20L3 4h18z',
  left: 'M4 12l16-9v18z',
  right: 'M20 12L4 21V3z',
};

export const GLYPH_LABELS: Record<GlyphName, string> = {
  up: 'triângulo para cima',
  down: 'triângulo para baixo',
  left: 'triângulo para a esquerda',
  right: 'triângulo para a direita',
  square: 'quadrado',
};

interface Props {
  name: GlyphName;
  size: number;
  color: ColorValue;
}

export function Glyph({ name, size, color }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {name === 'square' ? (
        <Rect x={4.5} y={4.5} width={15} height={15} fill="none" stroke={color} strokeWidth={2.4} strokeLinejoin="round" />
      ) : (
        <Path d={TRIANGLES[name]} fill="none" stroke={color} strokeWidth={2.4} strokeLinejoin="round" />
      )}
    </Svg>
  );
}
