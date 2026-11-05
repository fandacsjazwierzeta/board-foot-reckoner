/**
 * WARM_EARTHY preset copy for BoardFootReckoner.
 * Accent hexes overridden to the sawmill-notebook brief; the `name` field is
 * kept exactly as it ships in preset.ts (rule #11b).
 */
export const theme = {
  name: 'warm-earthy',

  colors: {
    bg: {
      primary: '#EFE6D5',
      secondary: '#F6EEDE',
      tertiary: '#E3D5BC',
      accent: '#D6C4A5',
    },
    surface: {
      card: '#F7F1E4',
      rack: '#E3D5BC',
      alt: '#D6C4A5',
      sheet: '#F7F1E4',
    },
    earth: {
      walnut: '#5C3D2E',
      walnutLight: '#6B4836',
      walnutDeep: '#422A1E',
      green: '#2F8F6B',
      greenBright: '#38A87E',
      greenDeep: '#247355',
      terracotta: '#D97B4D',
      mustard: '#D9B36C',
      cream: '#EFE6D5',
    },
    text: {
      primary: '#241811',
      secondary: '#6B5744',
      muted: '#8A7560',
      onDark: '#EFE6D5',
      onDarkMuted: 'rgba(239,230,213,0.62)',
    },
    ui: {
      border: 'rgba(92,61,46,0.22)',
      borderStrong: 'rgba(92,61,46,0.30)',
      divider: 'rgba(36,24,17,0.12)',
      pencil: 'rgba(36,24,17,0.08)',
      fillSoft: 'rgba(92,61,46,0.08)',
      highlight: 'rgba(255,255,255,0.14)',
      overlay: 'rgba(26,16,11,0.55)',
    },
  },

  gradients: {
    menuBg: ['#F6EEDE', '#EFE6D5', '#E3D5BC'],
    gameBg: ['#F2EADB', '#EFE6D5', '#E6D8C0'],
    totalsBg: ['#F6EEDE', '#E9DCC6', '#DCCBAE'],
    loaderOverlay: ['rgba(26,16,11,0.92)', 'rgba(60,38,28,0.88)', 'rgba(20,12,8,0.95)'],
    walnut: ['#6B4836', '#5C3D2E', '#422A1E'],
    green: ['#38A87E', '#2F8F6B', '#247355'],
    progress: ['#2F8F6B', '#4FB68C'],
    sheetHeader: ['#F7F1E4', '#EFE6D5'],
  },

  typography: {
    hero: { fontSize: 42, fontWeight: '900' as const, letterSpacing: 3.2 },
    title: { fontSize: 28, fontWeight: '900' as const, letterSpacing: 3 },
    section: { fontSize: 15, fontWeight: '800' as const, letterSpacing: 2.2 },
    body: { fontSize: 13, fontWeight: '600' as const, letterSpacing: 0.2 },
    caption: { fontSize: 10, fontWeight: '700' as const, letterSpacing: 1.6 },
    button: { fontSize: 16, fontWeight: '900' as const, letterSpacing: 2.2 },
    number: { fontSize: 17, fontWeight: '800' as const, letterSpacing: 0.4 },
  },

  radius: { xs: 3, sm: 4, md: 8, lg: 8, pill: 8 },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 },

  shadows: {
    card: {
      shadowColor: '#5C3D2E',
      shadowOpacity: 0.16,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    raised: {
      shadowColor: '#5C3D2E',
      shadowOpacity: 0.2,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 7,
    },
    ctaWalnut: {
      shadowColor: '#5C3D2E',
      shadowOpacity: 0.42,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 10,
    },
    ctaGreen: {
      shadowColor: '#2F8F6B',
      shadowOpacity: 0.4,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 9,
    },
    panel: {
      shadowColor: '#5C3D2E',
      shadowOpacity: 0.18,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: -6 },
      elevation: 12,
    },
    plate: {
      shadowColor: '#000000',
      shadowOpacity: 0.5,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: 14,
    },
  },

  animation: {
    press: { tension: 300, friction: 12 },
    card: { tension: 50, friction: 8 },
    sheet: { tension: 52, friction: 9 },
    plate: { tension: 42, friction: 7 },
    fade: 320,
    pulse: 180,
  },
};

export type Theme = typeof theme;
export default theme;
