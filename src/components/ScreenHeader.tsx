import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { HEADER_H, HEADER_PAD_TOP } from '../constants/config';

type Props = {
  caption?: string;
  title?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  tone?: 'plain' | 'surface';
};

/**
 * The ONE header used by Menu, Game and Totals (rule #12 of the QA list) —
 * same padding, same rule, same type scale on every screen.
 */
function ScreenHeaderBase({ caption, title, leftSlot, rightSlot, tone = 'plain' }: Props) {
  return (
    <View style={[styles.wrap, tone === 'surface' ? styles.surface : null]}>
      <View style={styles.side}>{leftSlot}</View>

      <View style={styles.centre}>
        {caption ? <Text style={styles.caption}>{caption}</Text> : null}
        {title ? (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
      </View>

      <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: HEADER_PAD_TOP,
    height: HEADER_PAD_TOP + HEADER_H,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  surface: {
    backgroundColor: 'rgba(92,61,46,0.10)',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.border,
  },
  side: {
    width: 100,
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  centre: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.secondary,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.8,
    color: theme.colors.text.primary,
    marginTop: 2,
  },
});

export const ScreenHeader = memo(ScreenHeaderBase);
export default ScreenHeader;
