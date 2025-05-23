import {
  MD3LightTheme as DefaultTheme,
  MD3DarkTheme,
} from 'react-native-paper';
import colors from './colors';
import spacing from './spacing';
import { fonts, fontSizes, lineHeights, fontWeights } from './typography';

const createTheme = (isDark: boolean) => {
  const baseTheme = isDark ? MD3DarkTheme : DefaultTheme;

  return {
    ...baseTheme,
    // Override and add custom theme properties
    colors: {
      ...baseTheme.colors,
      primary: colors.primary.main,
      primaryContainer: colors.primary.light,
      secondary: colors.secondary.main,
      secondaryContainer: colors.secondary.light,
      tertiary: colors.accent.main,
      tertiaryContainer: colors.accent.light,
      error: colors.error.main,
      errorContainer: colors.error.light,
      background: isDark ? colors.background.dark : colors.background.default,
      surface: isDark ? colors.neutral.darkest : colors.background.paper,
      surfaceVariant: isDark ? colors.neutral.darker : colors.background.paper,
      onPrimary: colors.primary.contrast,
      onSecondary: colors.secondary.contrast,
      onTertiary: colors.accent.contrast,
      onError: colors.error.contrast,
      onBackground: isDark ? colors.text.inverse : colors.text.primary,
      onSurface: isDark ? colors.text.inverse : colors.text.primary,
      onSurfaceVariant: isDark ? colors.text.inverse : colors.text.secondary,
      outline: isDark ? colors.border.dark : colors.border.main,
    },
    // Add our custom spacing
    spacing,
    // Add our custom typography
    fonts: {
      ...baseTheme.fonts,
      // Override defaults with our custom fonts
      regular: fonts.body,
      medium: fonts.subheading,
      bold: fonts.heading,
    },
    // Export our additional typography settings
    typography: {
      fonts,
      sizes: fontSizes,
      lineHeights,
      weights: fontWeights,
    },
    // Add custom border radius
    roundness: 8,
    // Add animation configs
    animation: {
      scale: 1.0,
    },
  };
};

// Export both light and dark themes
export const lightTheme = createTheme(false);
export const darkTheme = createTheme(true);

// Default export for backward compatibility
export default lightTheme;
