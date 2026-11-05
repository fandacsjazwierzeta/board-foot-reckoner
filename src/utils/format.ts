import { IN_PER_MM, FT_PER_M, UnitSystem } from '../constants/config';

export const TABULAR = { fontVariant: ['tabular-nums' as const] };

export function fmtBF(value: number): string {
  return value.toFixed(1);
}

export function fmtM3(value: number): string {
  return value.toFixed(3);
}

export function fmtKg(value: number): string {
  return String(Math.round(value));
}

/** 1 -> "1", 1.25 -> "1.25", 8 -> "8" */
export function trimNum(value: number, decimals = 2): string {
  const fixed = value.toFixed(decimals);
  return fixed.replace(/\.?0+$/, '');
}

export function displayThickness(inches: number, unit: UnitSystem): string {
  if (unit === 'metric') {
    return String(Math.round(inches / IN_PER_MM));
  }
  return trimNum(inches, 2);
}

export function displayWidth(inches: number, unit: UnitSystem): string {
  if (unit === 'metric') {
    return String(Math.round(inches / IN_PER_MM));
  }
  return trimNum(inches, 1);
}

export function displayLength(feet: number, unit: UnitSystem): string {
  if (unit === 'metric') {
    return (feet / FT_PER_M).toFixed(2);
  }
  return trimNum(feet, 1);
}

export function unitLabels(unit: UnitSystem) {
  if (unit === 'metric') {
    return { thickness: 'MM', width: 'MM', length: 'M' };
  }
  return { thickness: 'IN', width: 'IN', length: 'FT' };
}

/** Short plank caption: "4/4 x 6in x 8ft  x2" — ASCII only (rule #15). */
export function plankLabel(
  thicknessIn: number,
  widthIn: number,
  lengthFt: number,
  qty: number,
  unit: UnitSystem,
): string {
  const u = unitLabels(unit);
  const t = displayThickness(thicknessIn, unit);
  const w = displayWidth(widthIn, unit);
  const l = displayLength(lengthFt, unit);
  return (
    t + u.thickness.toLowerCase() + ' x ' +
    w + u.width.toLowerCase() + ' x ' +
    l + u.length.toLowerCase() + '  x' + qty
  );
}
