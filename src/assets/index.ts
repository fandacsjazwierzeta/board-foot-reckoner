/**
 * Codex PNG contract. No image files were produced for this build, so the map
 * is empty and every lookup resolves to undefined — the UI draws vector
 * (lucide) and gradient fallbacks instead. Never add a require() for a name
 * that is not present in assets/.
 */
import { ImageSourcePropType } from 'react-native';

export const assets: Record<string, ImageSourcePropType | undefined> = {};

export default assets;
