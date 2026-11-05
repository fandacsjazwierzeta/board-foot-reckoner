import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';
import { TABULAR } from '../utils/format';

type Props = {
  Icon: LucideIcon;
  value: string;
  label: string;
  valueColor: string;
};

/**
 * The ONE stat pill, identical on Menu and Totals (rule #21).
 * NOTE: `card` uses width:'100%', never flex:1 — the parent slot is already
 * flex:1 and nesting the two collapses the card (rule #19a).
 */
function StatCardBase({ Icon, value, label, valueColor }: Props) {
  return (
    <View style={[styles.card, { borderColor: valueColor + '55' }]}>
      <View style={[styles.iconWrap, { backgroundColor: valueColor + '22' }]}>
        <Icon size={22} color={valueColor} strokeWidth={2.4} />
      </View>
      <Text style={[styles.value, TABULAR, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    backgroundColor: theme.colors.surface.card,
    ...theme.shadows.card,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  label: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.text.secondary,
    marginTop: 3,
  },
});

export const StatCard = memo(StatCardBase);
export default StatCard;
