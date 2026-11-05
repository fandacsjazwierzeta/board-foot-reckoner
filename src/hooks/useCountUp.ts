import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * Counts 0 -> target over `duration`. The animated value is read inside the
 * listener callback through a ref (rule #8) and only the throttled display
 * string lands in state.
 */
export function useCountUp(target: number, duration = 900, decimals = 1): string {
  const progress = useRef(new Animated.Value(0)).current;
  const latest = useRef(0);
  const [display, setDisplay] = useState(() => (0).toFixed(decimals));

  useEffect(() => {
    latest.current = 0;
    progress.setValue(0);

    const id = progress.addListener(({ value }) => {
      const next = value * target;
      if (Math.abs(next - latest.current) >= Math.pow(10, -decimals) / 2) {
        latest.current = next;
        setDisplay(next.toFixed(decimals));
      }
    });

    const anim = Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });

    anim.start(({ finished }) => {
      if (finished) {
        setDisplay(target.toFixed(decimals));
      }
    });

    return () => {
      anim.stop();
      progress.removeListener(id);
    };
  }, [target, duration, decimals, progress]);

  return display;
}

export default useCountUp;
