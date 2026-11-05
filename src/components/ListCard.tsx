import React, { memo } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';
import { TABULAR, fmtBF } from '../utils/format';

type Props = {
  name: string;
  boards: number;
  boardFeet: number;
  tone: string;
  ornament?: ImageSourcePropType;
  onPress: () => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function ListCardBase({ name, boards, boardFeet, tone, ornament, onPress }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={name}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.press}>
      <Animated.View pointerEvents="box-none" style={[styles.card, { transform: [{ scale }] }]}>
        <View style={[styles.edge, { backgroundColor: tone }]} />

        {ornament ? (
          <Image source={ornament} style={styles.ornament} resizeMode="contain" />
        ) : null}

        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[styles.meta, TABULAR]} numberOfLines={1}>
          {boards + ' BOARDS'}
        </Text>
        <Text style={[styles.total, TABULAR]} numberOfLines={1}>
          {fmtBF(boardFeet) + ' BF'}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { flex: 1, height: 92 },
  card: {
    flex: 1,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    overflow: 'hidden',
    ...theme.shadows.card,
  },
  edge: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  ornament: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 42,
    height: 42,
    opacity: 0.45,
  },
  name: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: theme.colors.text.primary,
  },
  meta: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: theme.colors.text.secondary,
    marginTop: 3,
  },
  total: {
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '900',
    letterSpacing: 0.4,
    color: theme.colors.earth.green,
    marginTop: 6,
  },
});

export const ListCard = memo(ListCardBase);
export default ListCard;
