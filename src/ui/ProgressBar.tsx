import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { radius } from '../theme';

interface Props {
  value: number;
  color: string;
  track: string;
  height?: number;
}

export function ProgressBar({ value, color, track, height = 10 }: Props) {
  const width = useSharedValue(0);
  useEffect(() => {
    width.value = withTiming(Math.max(0, Math.min(1, value)), { duration: 400 });
  }, [value, width]);
  const fill = useAnimatedStyle(() => ({ width: `${width.value * 100}%` }));
  return (
    <View style={{ height, backgroundColor: track, borderRadius: radius.pill, overflow: 'hidden' }}>
      <Animated.View style={[{ height: '100%', backgroundColor: color, borderRadius: radius.pill }, fill]} />
    </View>
  );
}
