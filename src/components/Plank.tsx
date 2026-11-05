import React, { memo, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { ROW_H } from '../constants/config';
import { TABULAR } from '../utils/format';

type Props = {
  widthPx: number;
  grad: string[];
  ink: string;
  label: string;
  animateIn: boolean;
};

const PLANK_H = ROW_H - 8;

/**
 * One board on the rack: walnut-style gradient, 3 grain lines, a knot and an
 * end-grain cap. The drop animation touches transform + opacity only, so
 * useNativeDriver stays true (rule: animation-gpu-properties).
 */
function PlankBase({ widthPx, grad, ink, label, animateIn }: Props) {
  const drop = useRef(new Animated.Value(animateIn ? 0 : 1)).current;
  const squash = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animateIn) {
      return;
    }
    drop.setValue(0);
    const anim = Animated.sequence([
      Animated.timing(drop, {
        toValue: 1,
        duration: 220,
        easing: Easing.bezier(0.2, 0.9, 0.3, 1),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(squash, {
          toValue: 0.94,
          duration: 45,
          useNativeDriver: true,
        }),
        Animated.timing(squash, {
          toValue: 1,
          duration: 45,
          useNativeDriver: true,
        }),
      ]),
    ]);
    anim.start();
    return () => anim.stop();
  }, [animateIn, drop, squash]);

  const translateY = drop.interpolate({ inputRange: [0, 1], outputRange: [-46, 0] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.row,
        { opacity: drop, transform: [{ translateY }, { scaleY: squash }] },
      ]}>
      <LinearGradient
        colors={grad}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.plank, { width: widthPx }]}>
        <View style={[styles.grain, styles.grainA]} />
        <View style={[styles.grain, styles.grainB]} />
        <View style={[styles.grain, styles.grainC]} />
        <View style={styles.knot} />
        <View style={styles.endCap} />
        <Text style={[styles.label, TABULAR, { color: ink }]} numberOfLines={1}>
          {label}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: ROW_H,
    justifyContent: 'center',
  },
  plank: {
    height: PLANK_H,
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(36,24,17,0.28)',
  },
  grain: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(36,24,17,0.18)',
  },
  grainA: { top: '28%' },
  grainB: { top: '52%' },
  grainC: { top: '76%' },
  knot: {
    position: 'absolute',
    right: 26,
    top: '34%',
    width: 7,
    height: 6,
    borderRadius: 4,
    backgroundColor: 'rgba(36,24,17,0.30)',
  },
  endCap: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  label: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export const Plank = memo(PlankBase);
export default Plank;
