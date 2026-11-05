import React, { memo, useCallback } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';
import { Layers } from 'lucide-react-native';
import theme from '../constants/theme';
import {
  PLANK_MAX_W,
  PLANK_MIN_RATIO,
  RACK_BORDER,
  RACK_GUTTER,
  RACK_MAX_W,
  RACK_PAD,
  RACK_POST_W,
  ROW_H,
  UnitSystem,
} from '../constants/config';
import { BoardEntry, plankWidthPx } from '../game/lumber';
import { speciesById } from '../constants/config';
import { plankLabel } from '../utils/format';
import Plank from './Plank';

type Props = {
  boards: BoardEntry[];
  lastAddedId: string;
  unit: UnitSystem;
};

type Row = {
  key: string;
  widthPx: number;
  grad: string[];
  ink: string;
  label: string;
  animateIn: boolean;
};

const keyExtractor = (item: Row) => item.key;

const getItemLayout = (_data: ArrayLike<Row> | null | undefined, index: number) => ({
  length: ROW_H,
  offset: ROW_H * index,
  index,
});

function StackRackBase({ boards, lastAddedId, unit }: Props) {
  // newest first so a fresh plank is always on screen without scrolling
  const rows: Row[] = [];
  for (let i = boards.length - 1; i >= 0; i -= 1) {
    const b = boards[i];
    const def = speciesById(b.speciesId);
    rows.push({
      key: b.id,
      widthPx: plankWidthPx(b.widthIn, PLANK_MAX_W, PLANK_MIN_RATIO),
      grad: def.grad,
      ink: def.ink,
      label: plankLabel(b.thicknessIn, b.widthIn, b.lengthFt, b.qty, unit),
      animateIn: b.id === lastAddedId,
    });
  }

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Row>) => (
      <Plank
        widthPx={item.widthPx}
        grad={item.grad}
        ink={item.ink}
        label={item.label}
        animateIn={item.animateIn}
      />
    ),
    [],
  );

  return (
    <View style={styles.outer}>
      <View style={styles.rack}>
        <View style={styles.topLine} />
        <View style={styles.bottomLine} />
        <View style={[styles.post, styles.postLeft]} />
        <View style={[styles.post, styles.postRight]} />

        {rows.length > 0 ? (
          <FlatList
            data={rows}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            getItemLayout={getItemLayout}
            initialNumToRender={8}
            windowSize={5}
            removeClippedSubviews={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            style={styles.list}
          />
        ) : (
          <View style={styles.empty}>
            <View style={styles.emptyArt}>
              <Layers size={72} color={theme.colors.earth.walnut} strokeWidth={1.3} opacity={0.5} />
            </View>
            <Text style={styles.emptyTitle}>RACK EMPTY</Text>
            <Text style={styles.emptyHint}>ADD YOUR FIRST BOARD</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  rack: {
    width: RACK_MAX_W,
    flex: 1,
    minHeight: 120,
    padding: RACK_PAD,
    borderWidth: RACK_BORDER,
    borderColor: theme.colors.earth.walnut,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface.rack,
    overflow: 'hidden',
    ...theme.shadows.raised,
  },
  topLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  bottomLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(36,24,17,0.12)',
  },
  post: {
    position: 'absolute',
    top: RACK_PAD,
    bottom: RACK_PAD,
    width: RACK_POST_W,
    backgroundColor: theme.colors.earth.walnut,
    opacity: 0.85,
    borderRadius: 2,
  },
  postLeft: { left: RACK_PAD },
  postRight: { right: RACK_PAD },
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: RACK_GUTTER,
    paddingVertical: 2,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyArt: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 2.4,
    color: theme.colors.text.muted,
    marginTop: 10,
  },
  emptyHint: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: '#A3907A',
    marginTop: 4,
  },
});

export const StackRack = memo(StackRackBase);
export default StackRack;
