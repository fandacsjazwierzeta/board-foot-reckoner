import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StatusBar, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react-native';
import theme from '../constants/theme';
import { Totals } from '../game/lumber';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import IconTile from '../components/IconTile';
import TotalPill from '../components/TotalPill';
import SpeciesRow from '../components/SpeciesRow';
import TotalsHeroCard from '../components/TotalsHeroCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import Toast from '../components/Toast';
import { fmtBF } from '../utils/format';

type Props = {
  totals: Totals;
  listName: string;
  note?: string;
  onPlanAgain: () => void;
  onMenu: () => void;
  onSave: () => void;
};

const TOAST_MS = 1600;
const MAX_ROWS = 3;

/**
 * The `gameover` state of the machine — a discrete result screen, light tan and
 * centre-composed so it reads apart from both the dark Loader and the
 * left-flush Menu.
 */
export default function TotalsScreen({
  totals,
  listName,
  note,
  onPlanAgain,
  onMenu,
  onSave,
}: Props) {
  const [toast, setToast] = useState(false);
  const headFade = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const anim = Animated.timing(headFade, {
      toValue: 1,
      duration: 320,
      useNativeDriver: true,
    });
    anim.start();
    return () => {
      anim.stop();
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, [headFade]);

  const save = useCallback(() => {
    onSave();
    setToast(true);
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => setToast(false), TOAST_MS);
  }, [onSave]);

  const headLift = headFade.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });
  const rows = totals.bySpecies.slice(0, MAX_ROWS);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScreenBackground variant="totals">
        <ScreenHeader
          caption="TALLY"
          title={listName}
          leftSlot={<IconTile Icon={ArrowLeft} label="Back to lists" onPress={onMenu} />}
          rightSlot={<TotalPill caption="TOTAL" value={fmtBF(totals.boardFeet)} unit="BF" />}
        />

        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.head,
            { opacity: headFade, transform: [{ translateY: headLift }] },
          ]}>
          <View style={styles.stamp}>
            <CheckCircle2 size={56} color={theme.colors.earth.green} strokeWidth={1.8} />
          </View>
          <Text style={styles.headline}>TALLY COMPLETE</Text>
          <Text style={styles.subhead} numberOfLines={1}>
            {listName + ' · ' + totals.boards + ' BOARDS'}
          </Text>
        </Animated.View>

        <View style={styles.middle} pointerEvents="box-none">
          <TotalsHeroCard
            boardFeet={totals.boardFeet}
            cubicMetres={totals.cubicMetres}
            kilograms={totals.kilograms}
            overagePct={totals.overagePct}
            note={note}
          />

          {rows.length > 0 ? (
            <View style={styles.rows}>
              {rows.map((row, index) => (
                <SpeciesRow
                  key={row.id}
                  name={row.name}
                  boardFeet={row.boardFeet}
                  kilograms={row.kilograms}
                  share={row.share}
                  tone={row.tone}
                  index={index}
                />
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.footer} pointerEvents="box-none">
          <PrimaryButton
            label="PLAN AGAIN"
            Icon={RotateCcw}
            tone="green"
            height={58}
            width="100%"
            onPress={onPlanAgain}
          />
          <SecondaryButton label="SAVE LIST" height={46} width="100%" onPress={save} />
          <SecondaryButton label="MENU" tone="ghost" height={42} width="100%" onPress={onMenu} />
        </View>

        <Toast message="SAVED" visible={toast} />
      </ScreenBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
  head: {
    alignItems: 'center',
    marginTop: 2,
  },
  stamp: {
    width: 74,
    height: 74,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    letterSpacing: 3,
    color: theme.colors.text.primary,
    marginTop: 12,
    textAlign: 'center',
  },
  subhead: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.secondary,
    marginTop: 6,
  },
  // flex:1 + overflow hidden — the breakdown shrinks instead of pushing the
  // CTAs off the bottom of short screens.
  middle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 14,
    overflow: 'hidden',
  },
  rows: {
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    marginTop: 12,
    gap: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    paddingTop: 10,
    gap: 8,
  },
});
