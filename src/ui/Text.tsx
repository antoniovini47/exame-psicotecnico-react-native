import { Text as RNText, type TextProps, type TextStyle } from 'react-native';
import { fonts, usePalette } from '../theme';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'bodyStrong' | 'caption' | 'label';

const variants: Record<Variant, TextStyle> = {
  display: { fontFamily: fonts.black, fontSize: 30, lineHeight: 34 },
  title: { fontFamily: fonts.black, fontSize: 24, lineHeight: 28 },
  heading: { fontFamily: fonts.extraBold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 23 },
  bodyStrong: { fontFamily: fonts.extraBold, fontSize: 16, lineHeight: 22 },
  caption: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 19 },
  label: { fontFamily: fonts.extraBold, fontSize: 13, lineHeight: 17, letterSpacing: 0.5, textTransform: 'uppercase' },
};

interface Props extends TextProps {
  variant?: Variant;
  color?: string;
  muted?: boolean;
}

export function Text({ variant = 'body', color, muted, style, ...rest }: Props) {
  const palette = usePalette();
  return <RNText style={[variants[variant], { color: color ?? (muted ? palette.inkMuted : palette.ink) }, style]} {...rest} />;
}
