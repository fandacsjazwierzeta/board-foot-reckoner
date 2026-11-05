import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import theme from '../constants/theme';

type Props = {
  message: string;
  visible: boolean;
};

function ToastBase({ message, visible }: Props) {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(fade, {
      toValue: visible ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [visible, fade]);

  if (!visible) {
    return null;
  }

  const translateY = fade.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.toast, { opacity: fade, transform: [{ translateY }] }]}>
      <Check size={16} color={theme.colors.text.onDark} strokeWidth={3} />
      <Text style={styles.text} numberOfLines={1}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 96,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    paddingHorizontal: 18,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.earth.walnutDeep,
    borderWidth: 1,
    borderColor: 'rgba(239,230,213,0.22)',
  },
  text: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1.8,
    color: theme.colors.text.onDark,
  },
});

export const Toast = memo(ToastBase);
export default Toast;
