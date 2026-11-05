import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { SCREEN_W } from '../constants/config';
import useCountUp from '../hooks/useCountUp';
import { TABULAR, fmtKg, fmtM3 } from '../utils/format';

type Props = {
  boardFeet: number;
  cubicMetres: number;
  kilograms: number;
  overagePct: number;
  note?: string;
};

const CARD_W = Math.min(SCREEN_W - 40, 348);

function TotalsHeroCardBase({ boardFeet, cubicMetres, kilograms, overagePct, note }: Props) {
  const scale = useRef(new Animated.Value(0.9)).current;
  const counted = useCountUp(boardFeet, 900, 1);

  useEffect(() => {
    const anim = Animated.spring(scale, {
      toValue: 1,
      tension: 46,
      friction: 8,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [scale]);

  return (
    <Animated.View pointerEvents="box-none" style={[styles.card, { transform: [{ scale }] }]}>
      <View style={styles.topBar} />

      <Text style={[styles.big, TABULAR]} numberOfLines={1}>
        {counted}
      </Text>
      <Text style={styles.bigCaption}>BOARD FEET</Text>

      <View style={styles.divider} />

      <View style={styles.grid}>
        <View style={styles.gridCell}>
          <Text style={[styles.gridValue, TABULAR]} numberOfLines={1}>
            {fmtM3(cubicMetres)}
          </Text>
          <Text style={styles.gridCaption}>CUBIC M3</Text>
        </View>
        <View style={styles.gridDivider} />
        <View style={styles.gridCell}>
          <Text style={[styles.gridValue, TABULAR]} numberOfLines={1}>
            {fmtKg(kilograms)}
          </Text>
          <Text style={styles.gridCaption}>KILOGRAMS</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.overage} numberOfLines={1}>
        {'INCLUDES ' + overagePct + '% OVERAGE'}
      </Text>

      {note ? (
        <Text style={styles.note} numberOfLines={2}>
          {'NOTE: ' + note}
        </Text>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: 'rgba(92,61,46,0.2)',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 14,
    alignItems: 'center',
    overflow: 'hidden',
    ...theme.shadows.raised,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: theme.colors.earth.green,
  },
  big: {
    fontSize: 44,
    lineHeight: 50,
    fontWeight: '900',
    letterSpacing: 0.5,
    color: theme.colors.earth.green,
  },
  bigCaption: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 2.4,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  divider: {
    alignSelf: 'stretch',
    height: 1,
    backgroundColor: theme.colors.ui.divider,
    marginVertical: 12,
  },
  grid: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridCell: {
    flex: 1,
    alignItems: 'center',
  },
  gridDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.ui.divider,
  },
  gridValue: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '800',
    color: theme.colors.earth.walnut,
  },
  gridCaption: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.secondary,
    marginTop: 3,
  },
  overage: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: theme.colors.earth.terracotta,
  },
  note: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: theme.colors.text.muted,
    marginTop: 6,
    textAlign: 'center',
  },
});

export const TotalsHeroCard = memo(TotalsHeroCardBase);
export default TotalsHeroCard;
