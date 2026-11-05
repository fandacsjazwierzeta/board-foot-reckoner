import React, { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
  height?: number;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function SizeChipBase({ label, active, onPress, height = 38 }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.94);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.press, { height }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.chip, active ? styles.chipActive : null, { transform: [{ scale }] }]}>
        <Text style={[styles.label, active ? styles.labelActive : null]} numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { flex: 1 },
  chip: {
    flex: 1,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
    backgroundColor: 'rgba(92,61,46,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    borderWidth: 1.5,
    borderColor: theme.colors.earth.green,
    backgroundColor: 'rgba(47,143,107,0.14)',
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: theme.colors.earth.walnut,
  },
  labelActive: {
    color: theme.colors.earth.green,
    fontWeight: '900',
  },
});

export const SizeChip = memo(SizeChipBase);
export default SizeChip;
