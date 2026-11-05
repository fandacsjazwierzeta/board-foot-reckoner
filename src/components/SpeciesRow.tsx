import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { TABULAR, fmtBF, fmtKg } from '../utils/format';

type Props = {
  name: string;
  boardFeet: number;
  kilograms: number;
  share: number;
  tone: string;
  index: number;
};

function SpeciesRowBase({ name, boardFeet, kilograms, share, tone, index }: Props) {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(enter, {
      toValue: 1,
      duration: 300,
      delay: index * 70,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [enter, index]);

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });
  const sharePct = Math.round(Math.max(0, Math.min(1, share)) * 100);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.row, { opacity: enter, transform: [{ translateY }] }]}>
      <View style={[styles.edge, { backgroundColor: tone }]} />

      <View style={styles.left}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.track}>
          <View style={[styles.bar, { width: `${sharePct}%` }]} />
        </View>
      </View>

      <Text style={[styles.bf, TABULAR]} numberOfLines={1}>
        {fmtBF(boardFeet) + ' BF'}
      </Text>
      <Text style={[styles.kg, TABULAR]} numberOfLines={1}>
        {fmtKg(kilograms) + ' kg'}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(92,61,46,0.15)',
    backgroundColor: 'rgba(247,241,228,0.9)',
    overflow: 'hidden',
  },
  edge: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  left: { flex: 1, paddingRight: 10 },
  name: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.ui.divider,
    marginTop: 6,
    overflow: 'hidden',
  },
  bar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.earth.green,
  },
  bf: {
    width: 76,
    textAlign: 'right',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    color: theme.colors.earth.green,
  },
  kg: {
    width: 62,
    textAlign: 'right',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },
});

export const SpeciesRow = memo(SpeciesRowBase);
export default SpeciesRow;
