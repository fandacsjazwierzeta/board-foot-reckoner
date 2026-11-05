import React, { memo, useCallback } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';
import { TABULAR } from '../utils/format';

type Props = {
  label: string;
  value: string;
  unit: string;
  onDec: () => void;
  onInc: () => void;
  height?: number;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function StepButton({
  kind,
  onPress,
  label,
}: {
  kind: 'minus' | 'plus';
  onPress: () => void;
  label: string;
}) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.9);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.stepPress}>
      <Animated.View pointerEvents="box-none" style={[styles.stepFill, { transform: [{ scale }] }]}>
        {kind === 'minus' ? (
          <Minus size={18} color={theme.colors.earth.walnut} strokeWidth={2.6} />
        ) : (
          <Plus size={18} color={theme.colors.earth.walnut} strokeWidth={2.6} />
        )}
      </Animated.View>
    </Pressable>
  );
}

function StepperBase({ label, value, unit, onDec, onInc, height = 52 }: Props) {
  const dec = useCallback(() => onDec(), [onDec]);
  const inc = useCallback(() => onInc(), [onInc]);

  return (
    <View style={[styles.cell, { height }]}>
      <StepButton kind="minus" onPress={dec} label={'decrease ' + label} />

      <View style={styles.mid}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        <Text style={[styles.value, TABULAR]} numberOfLines={1}>
          {value + ' ' + unit}
        </Text>
      </View>

      <StepButton kind="plus" onPress={inc} label={'increase ' + label} />
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
    backgroundColor: theme.colors.bg.primary,
    paddingHorizontal: 2,
  },
  stepPress: { width: 42, height: 42 },
  stepFill: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(92,61,46,0.08)',
  },
  mid: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.secondary,
  },
  value: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '900',
    letterSpacing: 0.3,
    color: theme.colors.text.primary,
    marginTop: 1,
  },
});

export const Stepper = memo(StepperBase);
export default Stepper;
