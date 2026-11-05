import React, { memo, useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { X } from 'lucide-react-native';
import theme from '../constants/theme';
import { SCREEN_H } from '../constants/config';
import usePressScale from '../hooks/usePressScale';

type Props = {
  visible: boolean;
  heightRatio: number;
  title: string;
  caption?: string;
  ornament?: ImageSourcePropType;
  onClose: () => void;
  children: React.ReactNode;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function CloseButton({ onPress }: { onPress: () => void }) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.9);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Close sheet"
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.closePress}>
      <Animated.View pointerEvents="box-none" style={[styles.closeFill, { transform: [{ scale }] }]}>
        <X size={20} color={theme.colors.earth.walnut} strokeWidth={2.6} />
      </Animated.View>
    </Pressable>
  );
}

function BottomSheetBase({
  visible,
  heightRatio,
  title,
  caption,
  ornament,
  onClose,
  children,
}: Props) {
  const slide = useRef(new Animated.Value(0)).current;
  const sheetH = Math.round(SCREEN_H * heightRatio);

  useEffect(() => {
    const anim = visible
      ? Animated.spring(slide, {
          toValue: 1,
          tension: theme.animation.sheet.tension,
          friction: theme.animation.sheet.friction,
          useNativeDriver: true,
        })
      : Animated.timing(slide, { toValue: 0, duration: 180, useNativeDriver: true });
    anim.start();
    return () => anim.stop();
  }, [visible, slide]);

  if (!visible) {
    return null;
  }

  const translateY = slide.interpolate({ inputRange: [0, 1], outputRange: [320, 0] });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close sheet"
        onPress={onClose}
        style={styles.backdropPress}>
        <Animated.View style={[styles.backdrop, { opacity: slide }]} pointerEvents="none" />
      </Pressable>

      <Animated.View
        pointerEvents="box-none"
        style={[styles.sheet, { height: sheetH, transform: [{ translateY }] }]}>
        <View style={styles.grabber} />

        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {caption ? (
              <Text style={styles.caption} numberOfLines={1}>
                {caption}
              </Text>
            ) : null}
          </View>

          {ornament ? (
            <Image source={ornament} style={styles.ornament} resizeMode="contain" />
          ) : null}

          <CloseButton onPress={onClose} />
        </View>

        <View style={styles.body}>{children}</View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdropPress: { ...StyleSheet.absoluteFillObject },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.ui.overlay,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.surface.sheet,
    borderTopLeftRadius: theme.radius.md,
    borderTopRightRadius: theme.radius.md,
    borderTopWidth: 2,
    borderTopColor: theme.colors.earth.walnut,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 18,
  },
  grabber: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.ui.divider,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  headerText: { flex: 1 },
  title: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '900',
    letterSpacing: 2.2,
    color: theme.colors.text.primary,
  },
  caption: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.secondary,
    marginTop: 3,
  },
  ornament: {
    width: 44,
    height: 44,
    marginRight: 12,
    opacity: 0.9,
  },
  closePress: { width: 44, height: 44 },
  closeFill: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.ui.fillSoft,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, paddingTop: 10 },
});

export const BottomSheet = memo(BottomSheetBase);
export default BottomSheet;
