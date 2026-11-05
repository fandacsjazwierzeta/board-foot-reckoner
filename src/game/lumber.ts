import { M3_PER_BF, speciesById } from '../constants/config';

export type BoardEntry = {
  id: string;
  thicknessIn: number;
  widthIn: number;
  lengthFt: number;
  qty: number;
  speciesId: string;
};

export type SpeciesTotal = {
  id: string;
  name: string;
  tone: string;
  boardFeet: number;
  kilograms: number;
  share: number; // 0..1
};

export type Totals = {
  entries: number;
  boards: number;
  rawBoardFeet: number;
  boardFeet: number;
  cubicMetres: number;
  kilograms: number;
  overagePct: number;
  bySpecies: SpeciesTotal[];
};

/** bf = (t[in] * w[in] * l[ft] * qty) / 12 */
export function boardFeetOf(entry: BoardEntry): number {
  return (entry.thicknessIn * entry.widthIn * entry.lengthFt * entry.qty) / 12;
}

export function cubicMetresOf(boardFeet: number): number {
  return boardFeet * M3_PER_BF;
}

export function kilogramsOf(boardFeet: number, densityKgM3: number): number {
  return cubicMetresOf(boardFeet) * densityKgM3;
}

export function applyOverage(value: number, overagePct: number): number {
  return value * (1 + overagePct / 100);
}

export function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

/** Width of a plank in px, ALWAYS derived from the rack inner width (rule #4). */
export function plankWidthPx(widthIn: number, maxPx: number, minRatio: number): number {
  const ratio = clamp(widthIn / 12, minRatio, 1);
  return Math.floor(maxPx * ratio);
}

export function computeTotals(entries: BoardEntry[], overagePct: number): Totals {
  const perSpecies = new Map<string, number>();
  let rawBoardFeet = 0;
  let boards = 0;

  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];
    const bf = boardFeetOf(entry);
    rawBoardFeet += bf;
    boards += entry.qty;
    perSpecies.set(entry.speciesId, (perSpecies.get(entry.speciesId) || 0) + bf);
  }

  const boardFeet = applyOverage(rawBoardFeet, overagePct);
  const cubicMetres = cubicMetresOf(boardFeet);

  let kilograms = 0;
  const bySpecies: SpeciesTotal[] = [];

  perSpecies.forEach((rawBf, id) => {
    const def = speciesById(id);
    const bf = applyOverage(rawBf, overagePct);
    const kg = kilogramsOf(bf, def.density);
    kilograms += kg;
    bySpecies.push({
      id,
      name: def.name,
      tone: def.tone,
      boardFeet: bf,
      kilograms: kg,
      share: boardFeet > 0 ? bf / boardFeet : 0,
    });
  });

  bySpecies.sort((a, b) => b.boardFeet - a.boardFeet);

  return {
    entries: entries.length,
    boards,
    rawBoardFeet,
    boardFeet,
    cubicMetres,
    kilograms,
    overagePct,
    bySpecies,
  };
}
