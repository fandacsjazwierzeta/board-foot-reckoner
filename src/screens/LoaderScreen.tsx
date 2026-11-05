import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Ruler } from 'lucide-react-native';
import theme from '../constants/theme';
import ScreenBackground from '../components/ScreenBackground';
import {
  LOADER_DURATION_MS,
  LOADER_FADE_MS,
  LOADER_PROGRESS_MS,
} from '../constants/config';

type Props = {
  onDone: () => void;
};

const BAR_W = 190;

/**
 * The ONLY dark screen in the app — a walnut 0.92 overlay over the shared
 * background, non-interactive (brand plate + progress only), so the pHash
 * distance from Menu stays large (rule #14). Runs for exactly
 * LOADER_DURATION_MS (rule #13).
 */
export default function LoaderScreen({ onDone }: Props) {
  const plate = useRef(new Animated.Value(0)).current;
  const logoFade = useRef(new Animated.Value(0)).current;
  const screenFade = useRef(new Animated.Value(1)).current;
  // width animation -> useNativeDriver MUST be false
  const progress = useRef(new Animated.Value(0)).current;

  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const entry = Animated.parallel([
      Animated.spring(plate, {
        toValue: 1,
        tension: theme.animation.plate.tension,
        friction: theme.animation.plate.friction,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(logoFade, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]);

    const bar = Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_PROGRESS_MS,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    });

    entry.start();
    bar.start();

    const timer = setTimeout(() => {
      Animated.timing(screenFade, {
        toValue: 0,
        duration: LOADER_FADE_MS,
        useNativeDriver: true,
      }).start(() => doneRef.current());
    }, LOADER_DURATION_MS - LOADER_FADE_MS);

    return () => {
      clearTimeout(timer);
      entry.stop();
      bar.stop();
    };
  }, [plate, logoFade, progress, screenFade]);

  const plateScale = plate.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] });
  const logoLift = logoFade.interpolate({ inputRange: [0, 1], outputRange: [6, 0] });
  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View pointerEvents="box-none" style={[styles.root, { opacity: screenFade }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScreenBackground variant="loader">
        <View style={styles.centre}>
          <Animated.View
            pointerEvents="none"
            style={[styles.plate, { opacity: plate, transform: [{ scale: plateScale }] }]}>
            <View style={styles.plateHighlight} />
            <Animated.View
              style={[
                styles.logo,
                { opacity: logoFade, transform: [{ translateY: logoLift }] },
              ]}>
              <Ruler size={96} color={theme.colors.earth.greenBright} strokeWidth={1.4} />
            </Animated.View>
          </Animated.View>

          <Text style={[styles.brandLine, styles.brandFirst]}>BOARD FOOT</Text>
          <Text style={styles.brandLine}>RECKONER</Text>
          <Text style={styles.subtitle}>TALLY BOOK FOR TIMBER</Text>

          <View style={styles.track}>
            <View style={styles.trackInset} />
            <Animated.View pointerEvents="none" style={[styles.fillWrap, { width: barWidth }]}>
              <LinearGradient
                colors={theme.gradients.progress}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fill}
              />
              <View style={styles.fillHead} />
            </Animated.View>
          </View>

          <Text style={styles.caption}>LOADING...</Text>
        </View>

        <View style={styles.footer} pointerEvents="none">
          <View style={styles.footerGlyph}>
            <Ruler size={20} color={theme.colors.text.onDark} strokeWidth={1.6} />
          </View>
          <Text style={styles.footerText}>OFFLINE ESTIMATING TOOL</Text>
        </View>
      </ScreenBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1A100B' },
  centre: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  plate: {
    width: 168,
    height: 168,
    borderRadius: theme.radius.md,
    backgroundColor: '#3A2619',
    borderWidth: 2,
    borderColor: 'rgba(214,196,165,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...theme.shadows.plate,
  },
  plateHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  logo: { width: 132, height: 132, alignItems: 'center', justifyContent: 'center' },
  brandLine: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '900',
    letterSpacing: 4.5,
    color: theme.colors.text.onDark,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  brandFirst: { marginTop: 28 },
  subtitle: {
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 2.6,
    color: theme.colors.text.onDarkMuted,
    marginTop: 10,
  },
  track: {
    width: BAR_W,
    height: 6,
    borderRadius: theme.radius.xs,
    backgroundColor: 'rgba(239,230,213,0.16)',
    marginTop: 28,
    overflow: 'hidden',
  },
  trackInset: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  fillWrap: {
    height: 6,
    borderRadius: theme.radius.xs,
    overflow: 'hidden',
  },
  fill: { flex: 1, borderRadius: theme.radius.xs },
  fillHead: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  caption: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 3,
    color: 'rgba(239,230,213,0.45)',
    marginTop: 10,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 34,
  },
  footerGlyph: {
    width: 22,
    height: 22,
    opacity: 0.35,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 2.2,
    color: 'rgba(239,230,213,0.35)',
  },
});
