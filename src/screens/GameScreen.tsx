import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StatusBar, StyleSheet, View } from 'react-native';
import { ArrowLeft, Layers } from 'lucide-react-native';
import theme from '../constants/theme';
import {
  DEFAULT_BOARD,
  DEFAULT_SPECIES_ID,
  LIMITS,
  STEPS,
  THICKNESS_CHIPS,
  UnitSystem,
  speciesById,
} from '../constants/config';
import { Totals, clamp } from '../game/lumber';
import useLumberList from '../hooks/useLumberList';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import IconTile from '../components/IconTile';
import TotalPill from '../components/TotalPill';
import StackRack from '../components/StackRack';
import StatStrip from '../components/StatStrip';
import SizeChip from '../components/SizeChip';
import Stepper from '../components/Stepper';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import BottomSheet from '../components/BottomSheet';
import SpeciesTable from '../components/SpeciesTable';
import OverageSetter from '../components/OverageSetter';
import {
  displayLength,
  displayThickness,
  displayWidth,
  fmtBF,
  fmtKg,
  fmtM3,
  unitLabels,
} from '../utils/format';

type SheetKind = 'none' | 'species' | 'overage';

type Props = {
  listName: string;
  overagePct: number;
  initialSheet: SheetKind;
  onOverageChange: (next: number) => void;
  onExit: () => void;
  onFinish: (totals: Totals, listName: string) => void;
};

const ADD_LOCK_MS = 240;

export default function GameScreen({
  listName,
  overagePct,
  initialSheet,
  onOverageChange,
  onExit,
  onFinish,
}: Props) {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [thicknessIn, setThicknessIn] = useState(DEFAULT_BOARD.thicknessIn);
  const [widthIn, setWidthIn] = useState(DEFAULT_BOARD.widthIn);
  const [lengthFt, setLengthFt] = useState(DEFAULT_BOARD.lengthFt);
  const [qty, setQty] = useState(DEFAULT_BOARD.qty);
  const [speciesId, setSpeciesId] = useState(DEFAULT_SPECIES_ID);
  const [sheet, setSheet] = useState<SheetKind>(initialSheet);
  const [adding, setAdding] = useState(false);

  const { boards, totals, lastAddedId, addBoard } = useLumberList(overagePct);

  const enter = useRef(new Animated.Value(0)).current;
  const panel = useRef(new Animated.Value(0)).current;
  const lockRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const anim = Animated.parallel([
      Animated.timing(enter, { toValue: 1, duration: 260, useNativeDriver: true }),
      Animated.timing(panel, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]);
    anim.start();
    return () => {
      anim.stop();
      if (lockRef.current) {
        clearTimeout(lockRef.current);
      }
    };
  }, [enter, panel]);

  const step = STEPS[unit];
  const labels = unitLabels(unit);
  const species = speciesById(speciesId);

  const bump = useCallback(
    (
      value: number,
      delta: number,
      min: number,
      max: number,
      setter: (n: number) => void,
    ) => {
      const next = clamp(Math.round((value + delta) * 10000) / 10000, min, max);
      setter(next);
    },
    [],
  );

  const decThickness = useCallback(
    () => bump(thicknessIn, -step.thickness, LIMITS.thickness.min, LIMITS.thickness.max, setThicknessIn),
    [bump, thicknessIn, step.thickness],
  );
  const incThickness = useCallback(
    () => bump(thicknessIn, step.thickness, LIMITS.thickness.min, LIMITS.thickness.max, setThicknessIn),
    [bump, thicknessIn, step.thickness],
  );
  const decWidth = useCallback(
    () => bump(widthIn, -step.width, LIMITS.width.min, LIMITS.width.max, setWidthIn),
    [bump, widthIn, step.width],
  );
  const incWidth = useCallback(
    () => bump(widthIn, step.width, LIMITS.width.min, LIMITS.width.max, setWidthIn),
    [bump, widthIn, step.width],
  );
  const decLength = useCallback(
    () => bump(lengthFt, -step.length, LIMITS.length.min, LIMITS.length.max, setLengthFt),
    [bump, lengthFt, step.length],
  );
  const incLength = useCallback(
    () => bump(lengthFt, step.length, LIMITS.length.min, LIMITS.length.max, setLengthFt),
    [bump, lengthFt, step.length],
  );
  const decQty = useCallback(
    () => bump(qty, -1, LIMITS.qty.min, LIMITS.qty.max, setQty),
    [bump, qty],
  );
  const incQty = useCallback(
    () => bump(qty, 1, LIMITS.qty.min, LIMITS.qty.max, setQty),
    [bump, qty],
  );

  const toggleUnit = useCallback(() => {
    setUnit(prev => (prev === 'imperial' ? 'metric' : 'imperial'));
  }, []);

  const onAdd = useCallback(() => {
    if (adding) {
      return;
    }
    setAdding(true);
    addBoard({ thicknessIn, widthIn, lengthFt, qty, speciesId });
    lockRef.current = setTimeout(() => setAdding(false), ADD_LOCK_MS);
  }, [adding, addBoard, thicknessIn, widthIn, lengthFt, qty, speciesId]);

  const openSpecies = useCallback(() => setSheet('species'), []);
  const openOverage = useCallback(() => setSheet('overage'), []);
  const closeSheet = useCallback(() => setSheet('none'), []);

  const pickSpecies = useCallback((id: string) => {
    setSpeciesId(id);
    setSheet('none');
  }, []);

  const finish = useCallback(() => {
    onFinish(totals, listName);
  }, [onFinish, totals, listName]);

  const chips = useMemo(() => THICKNESS_CHIPS, []);

  const panelShift = panel.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScreenBackground variant="game">
        <ScreenHeader
          tone="surface"
          caption={species.name}
          title={listName}
          leftSlot={<IconTile Icon={ArrowLeft} label="Back to lists" onPress={onExit} />}
          rightSlot={<TotalPill value={fmtBF(totals.boardFeet)} unit="BF" />}
        />

        <Animated.View pointerEvents="box-none" style={[styles.area, { opacity: enter }]}>
          <StackRack boards={boards} lastAddedId={lastAddedId} unit={unit} />
        </Animated.View>

        <StatStrip
          boardFeet={fmtBF(totals.boardFeet)}
          cubicMetres={fmtM3(totals.cubicMetres)}
          kilograms={fmtKg(totals.kilograms)}
        />

        <Animated.View
          pointerEvents="box-none"
          style={[styles.panel, { transform: [{ translateY: panelShift }] }]}>
          <View style={styles.rowChips}>
            {chips.map(chip => (
              <ThicknessChip
                key={chip.label}
                label={chip.label}
                value={chip.value}
                active={unit === 'imperial' && Math.abs(thicknessIn - chip.value) < 0.001}
                onPick={setThicknessIn}
              />
            ))}
            <SizeChip
              label="METRIC"
              active={unit === 'metric'}
              onPress={toggleUnit}
              height={34}
            />
          </View>

          <View style={styles.rowSteppers}>
            <Stepper
              label="THICK"
              value={displayThickness(thicknessIn, unit)}
              unit={labels.thickness}
              onDec={decThickness}
              onInc={incThickness}
              height={50}
            />
            <Stepper
              label="WIDTH"
              value={displayWidth(widthIn, unit)}
              unit={labels.width}
              onDec={decWidth}
              onInc={incWidth}
              height={50}
            />
          </View>

          <View style={styles.rowSteppers}>
            <Stepper
              label="LENGTH"
              value={displayLength(lengthFt, unit)}
              unit={labels.length}
              onDec={decLength}
              onInc={incLength}
              height={50}
            />
            <Stepper
              label="QTY"
              value={String(qty)}
              unit="PCS"
              onDec={decQty}
              onInc={incQty}
              height={50}
            />
          </View>

          <View style={styles.rowCta}>
            <PrimaryButton
              label="DROP BOARD"
              Icon={Layers}
              tone="green"
              height={56}
              disabled={adding}
              onPress={onAdd}
            />
          </View>

          <SecondaryButton
            label="TOTALS SHEET"
            tone="solid"
            height={46}
            onPress={finish}
            style={styles.finish}
          />

          <View style={styles.rowSecondary}>
            <SecondaryButton
              label="SPECIES"
              height={44}
              onPress={openSpecies}
              style={styles.flexItem}
            />
            <SecondaryButton
              label={'OVERAGE ' + overagePct + '%'}
              height={44}
              onPress={openOverage}
              style={styles.flexItem}
            />
          </View>
        </Animated.View>

        <BottomSheet
          visible={sheet === 'species'}
          heightRatio={0.62}
          title="SPECIES TABLE"
          caption="DENSITY kg/m3"
          onClose={closeSheet}>
          <SpeciesTable selectedId={speciesId} onSelect={pickSpecies} />
        </BottomSheet>

        <BottomSheet
          visible={sheet === 'overage'}
          heightRatio={0.44}
          title="OVERAGE"
          caption="DEFECT AND MILLING ALLOWANCE"
          onClose={closeSheet}>
          <OverageSetter
            value={overagePct}
            baseBoardFeet={totals.rawBoardFeet}
            onChange={onOverageChange}
          />
        </BottomSheet>
      </ScreenBackground>
    </View>
  );
}

type ChipProps = {
  label: string;
  value: number;
  active: boolean;
  onPick: (n: number) => void;
};

function ThicknessChip({ label, value, active, onPick }: ChipProps) {
  const press = useCallback(() => onPick(value), [onPick, value]);
  return <SizeChip label={label} active={active} onPress={press} height={34} />;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
  area: {
    flex: 1,
    minHeight: 120,
  },
  panel: {
    backgroundColor: theme.colors.surface.card,
    borderTopLeftRadius: theme.radius.md,
    borderTopRightRadius: theme.radius.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.borderStrong,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    ...theme.shadows.panel,
  },
  rowChips: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  rowSteppers: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  rowCta: {
    marginBottom: 8,
  },
  rowSecondary: {
    flexDirection: 'row',
    gap: 8,
  },
  flexItem: { flex: 1 },
  finish: { width: '100%', marginBottom: 8 },
});
