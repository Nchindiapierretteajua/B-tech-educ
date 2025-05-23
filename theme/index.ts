import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import colors from './colors';
import spacing from './spacing';
import { fonts, fontSizes, lineHeights, fontWeights } from './typography';

// Create a theme extending React Native Paper's theme
const theme = {
  ...DefaultTheme,
  // Override and add custom theme properties
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary.main,
    primaryContainer: colors.primary.light,
    secondary: colors.secondary.main,
    secondaryContainer: colors.secondary.light,
    tertiary: colors.accent.main,
    tertiaryContainer: colors.accent.light,
    error: colors.error.main,
    errorContainer: colors.error.light,
    background: colors.background.default,
    surface: colors.background.paper,
    surfaceVariant: colors.background.paper,
    onPrimary: colors.primary.contrast,
    onSecondary: colors.secondary.contrast,
    onTertiary: colors.accent.contrast,
    onError: colors.error.contrast,
    onBackground: colors.text.primary,
    onSurface: colors.text.primary,
    onSurfaceVariant: colors.text.secondary,
    outline: colors.border.main,
  },
  // Add our custom spacing
  spacing,
  // Add our custom typography
  fonts: {
    ...DefaultTheme.fonts,
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

export default theme;