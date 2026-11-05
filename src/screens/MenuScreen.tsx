import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Home, Layers, Ruler, Scale } from 'lucide-react-native';
import theme from '../constants/theme';
import { DEFAULT_OVERAGE, SavedList } from '../constants/config';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import IconTile from '../components/IconTile';
import TotalPill from '../components/TotalPill';
import ListCard from '../components/ListCard';
import StatCard from '../components/StatCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { TABULAR, fmtBF } from '../utils/format';

type Props = {
  lists: SavedList[];
  onStart: () => void;
  onOpenSpecies: () => void;
};

/** M4 Asymmetric / Editorial: left-flush stencil heading, hero art pushed right. */
export default function MenuScreen({ lists, onStart, onOpenSpecies }: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const cards = useRef(new Animated.Value(0)).current;
  const cta = useRef(new Animated.Value(0.94)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const seq = Animated.parallel([
      Animated.timing(enter, { toValue: 1, duration: 320, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(120),
        Animated.timing(cards, { toValue: 1, duration: 320, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.delay(180),
        Animated.spring(cta, {
          toValue: 1,
          tension: theme.animation.card.tension,
          friction: theme.animation.card.friction,
          useNativeDriver: true,
        }),
      ]),
    ]);

    const lift = Animated.sequence([
      Animated.delay(90),
      Animated.spring(float, {
        toValue: 1,
        tension: theme.animation.card.tension,
        friction: theme.animation.card.friction,
        useNativeDriver: true,
      }),
    ]);

    seq.start();
    lift.start();
    return () => {
      seq.stop();
      lift.stop();
    };
  }, [enter, cards, cta, float]);

  const summary = useMemo(() => {
    let boardFeet = 0;
    let boards = 0;
    let kilograms = 0;
    let species = 0;
    for (let i = 0; i < lists.length; i += 1) {
      boardFeet += lists[i].boardFeet;
      boards += lists[i].boards;
      kilograms += lists[i].kilograms;
      species = Math.max(species, lists[i].speciesCount);
    }
    return { boardFeet, boards, kilograms, species };
  }, [lists]);

  const headingShift = enter.interpolate({ inputRange: [0, 1], outputRange: [-14, 0] });
  const cardsShift = cards.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });
  const floatShift = float.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });

  const showPills = lists.length > 0 && summary.boards > 0;
  const showLists = lists.length >= 2;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScreenBackground variant="menu">
        <ScreenHeader
          leftSlot={<IconTile Icon={Home} label="Home" onPress={onStart} />}
          rightSlot={
            <TotalPill caption="ALL LISTS" value={fmtBF(summary.boardFeet)} unit="BF" />
          }
        />

        <Animated.View
          pointerEvents="none"
          style={[styles.heroArt, { transform: [{ translateY: floatShift }] }]}>
          <Layers size={132} color={theme.colors.earth.walnut} strokeWidth={1.1} opacity={0.22} />
        </Animated.View>

        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.heading,
            { opacity: enter, transform: [{ translateX: headingShift }] },
          ]}>
          <Text style={styles.heroLine}>BOARD</Text>
          <Text style={styles.heroLine}>FOOT</Text>
          <Text style={styles.heroLineSub}>RECKONER</Text>
          <View style={styles.rule} />
          <Text style={styles.tagline}>BOARD FEET · CUBIC METRES · WEIGHT</Text>
        </Animated.View>

        <Animated.View
          pointerEvents="box-none"
          style={[styles.body, { opacity: cards, transform: [{ translateY: cardsShift }] }]}>
          {showLists ? (
            <View style={styles.listRow}>
              <ListCard
                name={lists[0].name}
                boards={lists[0].boards}
                boardFeet={lists[0].boardFeet}
                tone={lists[0].tone}
                onPress={onStart}
              />
              <ListCard
                name={lists[1].name}
                boards={lists[1].boards}
                boardFeet={lists[1].boardFeet}
                tone={lists[1].tone}
                onPress={onStart}
              />
            </View>
          ) : null}

          {showPills ? (
            <View style={styles.pillRow}>
              <View style={styles.pillSlot}>
                <StatCard
                  Icon={Layers}
                  value={String(summary.boards)}
                  label="BOARDS"
                  valueColor={theme.colors.earth.green}
                />
              </View>
              <View style={styles.pillSlot}>
                <StatCard
                  Icon={Ruler}
                  value={DEFAULT_OVERAGE + '%'}
                  label="OVERAGE"
                  valueColor={theme.colors.earth.mustard}
                />
              </View>
              <View style={styles.pillSlot}>
                <StatCard
                  Icon={Scale}
                  value={Math.round(summary.kilograms) + ' kg'}
                  label="WEIGHT"
                  valueColor={theme.colors.earth.terracotta}
                />
              </View>
            </View>
          ) : null}
        </Animated.View>

        <View style={styles.footer} pointerEvents="box-none">
          <Text style={[styles.hint, TABULAR]}>OFFLINE · NO ACCOUNTS · NO ADS</Text>

          <Animated.View
            pointerEvents="box-none"
            style={[styles.ctaRow, { transform: [{ scale: cta }] }]}>
            <PrimaryButton
              label="START LIST"
              Icon={Ruler}
              tone="walnut"
              height={60}
              width={212}
              onPress={onStart}
            />
            <SecondaryButton
              label="SPECIES"
              height={48}
              width={110}
              onPress={onOpenSpecies}
              style={styles.secondary}
            />
          </Animated.View>
        </View>
      </ScreenBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
  heroArt: {
    position: 'absolute',
    right: 10,
    top: 150,
    width: 150,
    height: 150,
    opacity: 0.96,
  },
  heading: {
    marginLeft: 20,
    marginTop: 18,
  },
  heroLine: {
    fontSize: 42,
    lineHeight: 44,
    fontWeight: '900',
    letterSpacing: 3.2,
    color: theme.colors.text.primary,
  },
  heroLineSub: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '900',
    letterSpacing: 3.2,
    color: theme.colors.earth.walnut,
  },
  rule: {
    width: 64,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: theme.colors.earth.green,
    marginTop: 10,
  },
  tagline: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.8,
    color: theme.colors.text.secondary,
    marginTop: 10,
    maxWidth: 208,
  },
  body: {
    marginTop: 26,
    paddingHorizontal: 20,
  },
  listRow: {
    flexDirection: 'row',
    gap: 12,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  pillSlot: { flex: 1 },
  footer: {
    marginTop: 'auto',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 18,
  },
  hint: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.text.muted,
    marginBottom: 8,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  secondary: { alignSelf: 'center' },
});
