import React, { memo } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';

type Props = {
  Icon: LucideIcon;
  onPress?: () => void;
  label: string;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** 40x40 kraft tile holding one 22x22 vector glyph. */
function IconTileBase({ Icon, onPress, label }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.92);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.press}>
      <Animated.View pointerEvents="box-none" style={[styles.tile, { transform: [{ scale }] }]}>
        <Icon size={22} color={theme.colors.earth.walnut} strokeWidth={2} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: 40, height: 40 },
  tile: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const IconTile = memo(IconTileBase);
export default IconTile;
