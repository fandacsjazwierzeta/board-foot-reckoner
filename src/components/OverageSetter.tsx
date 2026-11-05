import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { OVERAGE_CHIPS, OVERAGE_LIMITS } from '../constants/config';
import { clamp } from '../game/lumber';
import { TABULAR, fmtBF } from '../utils/format';
import SizeChip from './SizeChip';
import Stepper from './Stepper';

type Props = {
  value: number;
  baseBoardFeet: number;
  onChange: (next: number) => void;
};

function OverageSetterBase({ value, baseBoardFeet, onChange }: Props) {
  const dec = useCallback(
    () => onChange(clamp(value - OVERAGE_LIMITS.step, OVERAGE_LIMITS.min, OVERAGE_LIMITS.max)),
    [value, onChange],
  );
  const inc = useCallback(
    () => onChange(clamp(value + OVERAGE_LIMITS.step, OVERAGE_LIMITS.min, OVERAGE_LIMITS.max)),
    [value, onChange],
  );

  const preview = baseBoardFeet * (1 + value / 100);

  return (
    <View style={styles.wrap}>
      <Text style={styles.hint}>WASTE FACTOR FOR DEFECTS AND MILLING LOSS</Text>

      <View style={styles.chips}>
        {OVERAGE_CHIPS.map(pct => (
          <ChipItem key={'ov-' + pct} pct={pct} active={pct === value} onChange={onChange} />
        ))}
      </View>

      <View style={styles.stepperRow}>
        <Stepper
          label="OVERAGE"
          value={String(value)}
          unit="%"
          onDec={dec}
          onInc={inc}
          height={56}
        />
      </View>

      <View style={styles.previewBox}>
        <Text style={[styles.preview, TABULAR]} numberOfLines={1}>
          {fmtBF(baseBoardFeet) + ' BF  +' + value + '%  =  ' + fmtBF(preview) + ' BF'}
        </Text>
      </View>
    </View>
  );
}

const ChipItem = memo(function ChipItem({
  pct,
  active,
  onChange,
}: {
  pct: number;
  active: boolean;
  onChange: (n: number) => void;
}) {
  const press = useCallback(() => onChange(pct), [pct, onChange]);
  return <SizeChip label={pct + '%'} active={active} onPress={press} height={44} />;
});

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  hint: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.secondary,
    marginBottom: 12,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
  },
  stepperRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  previewBox: {
    marginTop: 14,
    height: 46,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(217,123,77,0.45)',
    backgroundColor: 'rgba(217,123,77,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.colors.earth.terracotta,
  },
});

export const OverageSetter = memo(OverageSetterBase);
export default OverageSetter;
