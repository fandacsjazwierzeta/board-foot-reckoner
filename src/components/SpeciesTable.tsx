import React, { memo, useCallback } from 'react';
import { FlatList, ListRenderItemInfo, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { SPECIES, SpeciesDef } from '../constants/config';
import { TABULAR } from '../utils/format';

type Props = {
  selectedId: string;
  onSelect: (id: string) => void;
};

const ROW_H = 52;
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

const keyExtractor = (item: SpeciesDef) => item.id;

const getItemLayout = (_d: ArrayLike<SpeciesDef> | null | undefined, index: number) => ({
  length: ROW_H,
  offset: ROW_H * index,
  index,
});

type RowProps = {
  item: SpeciesDef;
  selected: boolean;
  onSelect: (id: string) => void;
};

const SpeciesRowItem = memo(function SpeciesRowItem({ item, selected, onSelect }: RowProps) {
  const press = useCallback(() => onSelect(item.id), [item.id, onSelect]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.name}
      accessibilityState={{ selected }}
      hitSlop={HIT}
      onPress={press}
      style={[styles.row, selected ? styles.rowSelected : null]}>
      <View style={[styles.edge, { backgroundColor: selected ? theme.colors.earth.green : item.tone }]} />
      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={[styles.density, TABULAR]} numberOfLines={1}>
        {item.density}
      </Text>
    </Pressable>
  );
});

function SpeciesTableBase({ selectedId, onSelect }: Props) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<SpeciesDef>) => (
      <SpeciesRowItem item={item} selected={item.id === selectedId} onSelect={onSelect} />
    ),
    [selectedId, onSelect],
  );

  return (
    <FlatList
      data={SPECIES}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      initialNumToRender={10}
      windowSize={5}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    height: ROW_H,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
  },
  rowSelected: {
    backgroundColor: 'rgba(47,143,107,0.08)',
  },
  edge: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 4,
    borderRadius: 2,
  },
  name: {
    flex: 1,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
  density: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    color: theme.colors.earth.green,
  },
});

export const SpeciesTable = memo(SpeciesTableBase);
export default SpeciesTable;
