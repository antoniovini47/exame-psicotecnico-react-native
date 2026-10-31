import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

interface Props {
  size?: number;
  mood?: 'neutral' | 'happy';
}

export function Mascot({ size = 56, mood = 'neutral' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Circle cx={28} cy={28} r={27} fill="#FFC93C" />
      {mood === 'happy' ? (
        <>
          <Path d="M10 29c4-9 32-9 36 0-4 9-32 9-36 0z" fill="#FFFFFF" />
          <Circle cx={28} cy={28} r={8} fill="#0E3B43" />
          <Circle cx={31} cy={25} r={2.5} fill="#FFFFFF" />
          <Path d="M19 44c5 4 13 4 18 0" fill="none" stroke="#0E3B43" strokeWidth={2.5} strokeLinecap="round" />
        </>
      ) : (
        <>
          <Ellipse cx={28} cy={29} rx={18} ry={13} fill="#FFFFFF" />
          <Circle cx={31} cy={29} r={8} fill="#0E3B43" />
          <Circle cx={34} cy={26} r={2.5} fill="#FFFFFF" />
        </>
      )}
    </Svg>
  );
}
