import type { ColorValue } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import type { Figure } from '../domain/visualMemory';

export const FIGURE_LABELS: Record<Figure, string> = {
  circle: 'círculo',
  square: 'quadrado',
  triangle: 'triângulo',
  star: 'estrela',
  heart: 'coração',
  diamond: 'losango',
  hexagon: 'hexágono',
  cross: 'cruz',
  moon: 'lua',
  arrow: 'seta',
  bolt: 'raio',
  drop: 'gota',
  house: 'casa',
  bell: 'sino',
  flag: 'bandeira',
  leaf: 'folha',
};

const PATHS: Partial<Record<Figure, string>> = {
  triangle: 'M12 3l9.5 17h-19z',
  star: 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z',
  heart: 'M12 20.5S3 15 3 8.8A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 9 2.2C21 15 12 20.5 12 20.5z',
  diamond: 'M12 2.5l8.5 9.5-8.5 9.5-8.5-9.5z',
  hexagon: 'M12 2.5l8.2 4.75v9.5L12 21.5l-8.2-4.75v-9.5z',
  cross: 'M9 3h6v6h6v6h-6v6H9v-6H3V9h6z',
  moon: 'M15.5 3A9 9 0 1 0 21 15.5 7.2 7.2 0 0 1 15.5 3z',
  arrow: 'M3 9.5h10V4.5l8 7.5-8 7.5v-5H3z',
  bolt: 'M13.5 2L4.5 13.5h6L9.5 22l10-12h-6.5z',
  drop: 'M12 2.5s7 7.6 7 12.3a7 7 0 0 1-14 0C5 10.1 12 2.5 12 2.5z',
  house: 'M3 11l9-8 9 8v10h-6v-6H9v6H3z',
  bell: 'M12 2.5a6 6 0 0 1 6 6v5l2 3.5H4l2-3.5v-5a6 6 0 0 1 6-6zM9.5 19.5a2.5 2.5 0 0 0 5 0z',
  flag: 'M5 2.5h2v19H5zM7 3.5h12l-3 4.5 3 4.5H7z',
  leaf: 'M20.5 3.5C9 3.5 3.5 9 3.5 16.5c0 1.4.2 2.7.6 4 1-4.6 4.3-8.6 8.9-10.6-3.8 2.6-6.2 6.4-7 10.6 1.2.4 2.5.5 3.7.5 7.5 0 10.8-6 10.8-17.5z',
};

interface Props {
  name: Figure;
  size: number;
  color: ColorValue;
}

export function FigureIcon({ name, size, color }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {name === 'circle' && <Circle cx={12} cy={12} r={9} fill={color} />}
      {name === 'square' && <Rect x={3.5} y={3.5} width={17} height={17} rx={2} fill={color} />}
      {PATHS[name] && <Path d={PATHS[name]} fill={color} fillRule="evenodd" />}
    </Svg>
  );
}
