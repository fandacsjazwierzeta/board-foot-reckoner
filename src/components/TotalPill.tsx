import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { TABULAR } from '../utils/format';

type Props = {
  caption?: string;
  value: string;
  unit: string;
};

function TotalPillBase({ caption, value, unit }: Props) {
  return (
    <View style={styles.wrap}>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
      <View style={styles.pill}>
        <Text style={[styles.value, TABULAR]} numberOfLines={1}>
          {value + ' ' + unit}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'flex-end' },
  caption: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.secondary,
    marginBottom: 3,
  },
  pill: {
    height: 34,
    minWidth: 84,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.earth.walnut,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239,230,213,0.18)',
  },
  value: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.colors.text.onDark,
  },
});

export const TotalPill = memo(TotalPillBase);
export default TotalPill;
