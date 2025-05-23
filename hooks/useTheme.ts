import { useCallback } from 'react';
// import { THEME } from '../constants';
import { THEME } from '@/lib/constants';
import { usePreferences } from '@/lib/preferences';

export function useTheme() {
  const { preferences, updatePreference } = usePreferences();

  const toggleDarkMode = useCallback(() => {
    updatePreference('darkMode', !preferences.darkMode);
  }, [preferences.darkMode, updatePreference]);

  const colors = preferences.darkMode
    ? {
        ...THEME.COLORS,
        BACKGROUND: '#000000',
        SURFACE: '#1C1C1E',
        TEXT: '#FFFFFF',
        TEXT_SECONDARY: '#8E8E93',
        BORDER: '#38383A',
      }
    : THEME.COLORS;

  return {
    colors,
    spacing: THEME.SPACING,
    typography: THEME.TYPOGRAPHY,
    borderRadius: THEME.BORDER_RADIUS,
    isDarkMode: preferences.darkMode,
    toggleDarkMode,
  };
}
