import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { SCREEN_H } from '../constants/config';

export type BackgroundVariant = 'loader' | 'menu' | 'game' | 'totals';

type Props = {
  variant: BackgroundVariant;
  children?: React.ReactNode;
};

const GRADIENTS: Record<BackgroundVariant, string[]> = {
  loader: theme.gradients.loaderOverlay,
  menu: theme.gradients.menuBg,
  game: theme.gradients.gameBg,
  totals: theme.gradients.totalsBg,
};

const ENDS: Record<BackgroundVariant, { x: number; y: number }> = {
  loader: { x: 1, y: 1 },
  menu: { x: 0.6, y: 1 },
  game: { x: 0, y: 1 },
  totals: { x: 0, y: 1 },
};

/** Paper ruling behind the content — tally-book flavour, drawn under everything. */
function Ruling({ opacity, count, gap, top }: { opacity: number; count: number; gap: number; top: number }) {
  const lines = [];
  for (let i = 0; i < count; i += 1) {
    lines.push(
      <View
        key={'rule-' + i}
        style={[styles.rule, { top: top + i * gap, opacity }]}
      />,
    );
  }
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {lines}
    </View>
  );
}

function ScreenBackgroundBase({ variant, children }: Props) {
  const isLoader = variant === 'loader';

  return (
    <View style={[styles.fill, isLoader ? styles.baseDark : styles.baseLight]}>
      <LinearGradient
        colors={GRADIENTS[variant]}
        start={{ x: 0, y: 0 }}
        end={ENDS[variant]}
        style={StyleSheet.absoluteFill}
      />

      {isLoader ? (
        <View style={styles.decor} pointerEvents="none">
          <View style={styles.loaderBlob} />
          <Ruling opacity={0.07} count={3} gap={34} top={SCREEN_H * 0.66} />
        </View>
      ) : (
        <View style={styles.decor} pointerEvents="none">
          <View style={[styles.blobWalnut, variant === 'totals' ? styles.blobCentred : null]} />
          <View style={styles.blobGreen} />
          <Ruling opacity={variant === 'game' ? 0.06 : 0.08} count={7} gap={96} top={120} />
          {variant === 'game' ? <View style={styles.marginLine} /> : null}
        </View>
      )}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  baseLight: { backgroundColor: theme.colors.bg.primary },
  baseDark: { backgroundColor: '#1A100B' },
  decor: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  rule: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#241811',
  },
  blobWalnut: {
    position: 'absolute',
    right: -90,
    top: -70,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(92,61,46,0.07)',
  },
  blobCentred: {
    right: undefined,
    alignSelf: 'center',
    top: 60,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(47,143,107,0.10)',
  },
  blobGreen: {
    position: 'absolute',
    left: -80,
    bottom: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(47,143,107,0.08)',
  },
  marginLine: {
    position: 'absolute',
    left: 28,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(217,123,77,0.25)',
  },
  loaderBlob: {
    position: 'absolute',
    alignSelf: 'center',
    top: '18%',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(47,143,107,0.14)',
  },
});

export const ScreenBackground = memo(ScreenBackgroundBase);
export default ScreenBackground;
