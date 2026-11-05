import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { STAT_STRIP_H } from '../constants/config';
import { TABULAR } from '../utils/format';

type SlotProps = {
  value: string;
  label: string;
  tone: string;
};

function Slot({ value, label, tone }: SlotProps) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    pulse.setValue(0.4);
    const anim = Animated.timing(pulse, {
      toValue: 1,
      duration: theme.animation.pulse,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [value, pulse]);

  const translateY = pulse.interpolate({ inputRange: [0.4, 1], outputRange: [4, 0] });

  return (
    <View style={styles.slot}>
      <Animated.View
        pointerEvents="none"
        style={[styles.slotInner, { opacity: pulse, transform: [{ translateY }] }]}>
        <Text style={[styles.value, TABULAR, { color: tone }]} numberOfLines={1}>
          {value}
        </Text>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </View>
  );
}

type Props = {
  boardFeet: string;
  cubicMetres: string;
  kilograms: string;
};

/** The G3 split-panel signature: three live totals between rack and controls. */
function StatStripBase({ boardFeet, cubicMetres, kilograms }: Props) {
  return (
    <View style={styles.strip}>
      <Slot value={boardFeet} label="BOARD FEET" tone={theme.colors.earth.green} />
      <View style={styles.divider} />
      <Slot value={cubicMetres} label="CUBIC M3" tone={theme.colors.earth.walnut} />
      <View style={styles.divider} />
      <Slot value={kilograms} label="WEIGHT KG" tone={theme.colors.earth.terracotta} />
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    height: STAT_STRIP_H,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.card,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  slot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // width:'100%' — NOT flex:1 inside the flex:1 slot (rule #19a)
  slotInner: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.ui.divider,
  },
  value: {
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  label: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
});

export const StatStrip = memo(StatStripBase);
export default StatStrip;
