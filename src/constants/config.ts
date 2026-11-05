import { Dimensions } from 'react-native';

/**
 * Tunable parameters for BoardFootReckoner.
 * LOADER_DURATION_MS is EXACTLY 8000 (rule #13) — shorter values race the
 * screenshot capture window and make the Loader indistinguishable from Menu.
 */
export const LOADER_DURATION_MS = 8000;
export const LOADER_PROGRESS_MS = 7400;
export const LOADER_FADE_MS = 320;

export const HAPTICS_ENABLED = true;
export const THUD_MS = 12;

export const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

/* ---------- Rack geometry (rule #4 / #5) ---------- */
export const RACK_MAX_W = Math.min(SCREEN_W - 32, 380);
export const RACK_PAD = 10;
export const RACK_BORDER = 2;
export const RACK_FRAME = RACK_PAD + RACK_BORDER; // 12
export const RACK_INNER_W = RACK_MAX_W - 2 * RACK_FRAME;
export const RACK_POST_W = 6;
export const RACK_GUTTER = RACK_POST_W + 4; // keeps planks clear of the posts
export const PLANK_MAX_W = RACK_INNER_W - 2 * RACK_GUTTER;
export const PLANK_MIN_RATIO = 0.28;
export const ROW_H = 40;
export const VISIBLE_ROWS = 7;

/* ---------- Layout bands (rule #3: header / area / controls) ---------- */
export const HEADER_PAD_TOP = 44;
export const HEADER_H = 72;
export const STAT_STRIP_H = 56;

/* ---------- Units ---------- */
export type UnitSystem = 'imperial' | 'metric';

export const IN_PER_MM = 1 / 25.4;
export const FT_PER_M = 3.280839895;
export const M3_PER_BF = 0.002359737;

export const STEPS = {
  imperial: { thickness: 0.25, width: 0.5, length: 0.5 },
  // metric steps expressed in the internal imperial units
  metric: { thickness: 5 * IN_PER_MM, width: 10 * IN_PER_MM, length: 0.1 * FT_PER_M },
};

export const LIMITS = {
  thickness: { min: 0.25, max: 4 },
  width: { min: 1, max: 24 },
  length: { min: 0.5, max: 20 },
  qty: { min: 1, max: 99 },
};

export const DEFAULT_BOARD = {
  thicknessIn: 1,
  widthIn: 6,
  lengthFt: 8,
  qty: 1,
};

export const THICKNESS_CHIPS = [
  { label: '4/4', value: 1 },
  { label: '5/4', value: 1.25 },
  { label: '6/4', value: 1.5 },
  { label: '8/4', value: 2 },
];

export const OVERAGE_CHIPS = [0, 5, 10, 15, 20];
export const DEFAULT_OVERAGE = 10;
export const OVERAGE_LIMITS = { min: 0, max: 40, step: 1 };

/* ---------- Species density table (kg/m3 at 12% MC) ---------- */
export type SpeciesDef = {
  id: string;
  name: string;
  density: number;
  grad: string[];
  tone: string;
  ink: string;
};

export const SPECIES: SpeciesDef[] = [
  { id: 'pine', name: 'PINE', density: 510, grad: ['#E0BC8C', '#C9A071', '#A8814F'], tone: '#C9A071', ink: '#3A2616' },
  { id: 'spruce', name: 'SPRUCE', density: 450, grad: ['#E6CCA6', '#D2B48C', '#B2946C'], tone: '#D2B48C', ink: '#3A2616' },
  { id: 'oak_red', name: 'OAK (RED)', density: 700, grad: ['#C2945F', '#A97B4F', '#8A6239'], tone: '#A97B4F', ink: '#F3E7D4' },
  { id: 'oak_white', name: 'OAK (WHITE)', density: 755, grad: ['#D0AC7E', '#B9956A', '#977851'], tone: '#B9956A', ink: '#3A2616' },
  { id: 'maple', name: 'MAPLE (HARD)', density: 705, grad: ['#EBD3A9', '#D8BE92', '#B89C70'], tone: '#D8BE92', ink: '#3A2616' },
  { id: 'walnut', name: 'WALNUT', density: 640, grad: ['#8A5E41', '#6E4730', '#55331F'], tone: '#6E4730', ink: '#F3E7D4' },
  { id: 'cherry', name: 'CHERRY', density: 580, grad: ['#A55C41', '#8C4A33', '#6F3827'], tone: '#8C4A33', ink: '#F3E7D4' },
  { id: 'ash', name: 'ASH', density: 675, grad: ['#D4BC96', '#BFA67F', '#9E855E'], tone: '#BFA67F', ink: '#3A2616' },
  { id: 'birch', name: 'BIRCH', density: 670, grad: ['#EFDCB8', '#E0CDA9', '#BFA887'], tone: '#E0CDA9', ink: '#3A2616' },
  { id: 'poplar', name: 'POPLAR', density: 455, grad: ['#DED2AD', '#CFC19B', '#AC9E78'], tone: '#CFC19B', ink: '#3A2616' },
];

export const DEFAULT_SPECIES_ID = 'oak_red';

export const SPECIES_BY_ID: Record<string, SpeciesDef> = SPECIES.reduce(
  (acc, s) => {
    acc[s.id] = s;
    return acc;
  },
  {} as Record<string, SpeciesDef>,
);

export function speciesById(id: string): SpeciesDef {
  return SPECIES_BY_ID[id] || SPECIES_BY_ID[DEFAULT_SPECIES_ID];
}

/* ---------- Seed lists so Menu never reads as an empty skeleton ---------- */
export type SavedList = {
  id: string;
  name: string;
  boards: number;
  boardFeet: number;
  kilograms: number;
  speciesCount: number;
  tone: string;
};

export const SEED_LISTS: SavedList[] = [
  { id: 'seed-oak', name: 'OAK SHELVES', boards: 18, boardFeet: 96.4, kilograms: 159, speciesCount: 2, tone: '#5C3D2E' },
  { id: 'seed-pine', name: 'PINE DECK', boards: 26, boardFeet: 148.2, kilograms: 178, speciesCount: 3, tone: '#2F8F6B' },
];

export const DEFAULT_LIST_NAME = 'CUT LIST 03';
