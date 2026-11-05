import React, { memo } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';

type Props = {
  label: string;
  Icon?: LucideIcon;
  tone?: 'walnut' | 'green';
  height?: number;
  width?: number | '100%';
  disabled?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON = 24; // fixed square — lineHeight of the label matches it (rule #20)

function PrimaryButtonBase({
  label,
  Icon,
  tone = 'green',
  height = 60,
  width,
  disabled = false,
  onPress,
  style,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale();
  const colors = tone === 'walnut' ? theme.gradients.walnut : theme.gradients.green;
  const shadow = tone === 'walnut' ? theme.shadows.ctaWalnut : theme.shadows.ctaGreen;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[
        styles.press,
        { height },
        width === undefined ? null : { width },
        disabled ? styles.disabled : null,
        style,
      ]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.fill, shadow, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.grad}>
          <View style={styles.topHighlight} />
          <View style={styles.row}>
            {Icon ? <Icon size={ICON} color="#FFFFFF" strokeWidth={2.4} /> : null}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { alignSelf: 'stretch' },
  disabled: { opacity: 0.55 },
  fill: {
    flex: 1,
    borderRadius: theme.radius.md,
  },
  grad: {
    flex: 1,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(239,230,213,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 16,
    lineHeight: ICON,
    fontWeight: '900',
    letterSpacing: 2.2,
    color: '#FFFFFF',
  },
});

export const PrimaryButton = memo(PrimaryButtonBase);
export default PrimaryButton;
