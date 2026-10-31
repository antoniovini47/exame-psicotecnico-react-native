import type { ColorValue } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconName =
  | 'home'
  | 'train'
  | 'exam'
  | 'chart'
  | 'flame'
  | 'close'
  | 'chevron'
  | 'check'
  | 'target'
  | 'split'
  | 'memory'
  | 'trend'
  | 'gift';

interface Props {
  name: IconName;
  size?: number;
  color: ColorValue;
  strokeWidth?: number;
}

export function Icon({ name, size = 24, color, strokeWidth = 2 }: Props) {
  const stroke = { stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {name === 'home' && <Path d="M4 11l8-7 8 7v9H4z" {...stroke} />}
      {name === 'train' && <Path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12" {...stroke} />}
      {name === 'exam' && (
        <>
          <Rect x={5} y={3} width={14} height={18} rx={2} {...stroke} />
          <Path d="M9 8h6M9 12h6M9 16h3" {...stroke} />
        </>
      )}
      {name === 'chart' && <Path d="M5 20V12M12 20V5M19 20v-9" {...stroke} />}
      {name === 'flame' && <Path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z" {...stroke} />}
      {name === 'close' && <Path d="M6 6l12 12M18 6L6 18" {...stroke} />}
      {name === 'chevron' && <Path d="M9 6l6 6-6 6" {...stroke} />}
      {name === 'check' && <Path d="M5 12l5 5 9-10" {...stroke} />}
      {name === 'target' && (
        <>
          <Circle cx={12} cy={12} r={9} {...stroke} />
          <Circle cx={12} cy={12} r={5} {...stroke} />
          <Circle cx={12} cy={12} r={1.5} fill={color} />
        </>
      )}
      {name === 'split' && (
        <>
          <Rect x={3} y={5} width={7} height={14} rx={2} {...stroke} />
          <Rect x={14} y={5} width={7} height={14} rx={2} {...stroke} />
        </>
      )}
      {name === 'memory' && (
        <>
          <Rect x={3} y={3} width={7} height={7} rx={1.5} {...stroke} />
          <Rect x={14} y={3} width={7} height={7} rx={1.5} {...stroke} />
          <Rect x={3} y={14} width={7} height={7} rx={1.5} {...stroke} />
          <Rect x={14} y={14} width={7} height={7} rx={1.5} fill={color} stroke={color} strokeWidth={strokeWidth} />
        </>
      )}
      {name === 'trend' && <Path d="M4 18l5-6 4 3 7-9M15 6h5v5" {...stroke} />}
      {name === 'gift' && <Path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-2-4-6-3-5 0M12 7c2-4 6-3 5 0" {...stroke} />}
    </Svg>
  );
}
