import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import theme from '../constants/theme';

/**
 * Press feedback pattern (rule #8): <Pressable onPressIn/onPressOut> is the
 * PARENT, the <Animated.View style={{transform:[{scale}]}}> is the CHILD.
 * Native driver is used on `transform` only.
 */
export function usePressScale(to = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: to,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale, to]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}

export default usePressScale;
