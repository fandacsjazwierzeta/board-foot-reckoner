import React, { memo } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';

type Props = {
  label: string;
  onPress: () => void;
  height?: number;
  width?: number | '100%';
  tone?: 'outline' | 'solid' | 'ghost';
  style?: StyleProp<ViewStyle>;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function SecondaryButtonBase({
  label,
  onPress,
  height = 48,
  width,
  tone = 'outline',
  style,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.press, { height }, width === undefined ? null : { width }, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.fill,
          tone === 'solid' ? styles.solid : null,
          tone === 'ghost' ? styles.ghost : null,
          { transform: [{ scale }] },
        ]}>
        <Text
          style={[styles.label, tone === 'solid' ? styles.labelSolid : null]}
          numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { alignSelf: 'stretch' },
  fill: {
    flex: 1,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
    backgroundColor: theme.colors.ui.fillSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: {
    backgroundColor: theme.colors.earth.walnut,
    borderColor: 'rgba(239,230,213,0.22)',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: theme.colors.earth.walnut,
  },
  labelSolid: {
    color: theme.colors.text.onDark,
    fontSize: 13,
    letterSpacing: 2,
  },
});

export const SecondaryButton = memo(SecondaryButtonBase);
export default SecondaryButton;
