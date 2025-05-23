import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import theme from '@/theme';

export const useAppTheme = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // Create dark theme version if needed
  const darkTheme = {
    ...MD3DarkTheme,
    ...theme,
    colors: {
      ...MD3DarkTheme.colors,
      ...theme.colors,
      background: '#121212',
      surface: '#1E1E1E',
      text: {
        primary: '#FFFFFF',
        secondary: '#AAAAAA',
        disabled: '#666666',
        hint: '#666666',
        inverse: '#121212',
      },
    }
  };
  
  // Return appropriate theme based on device settings
  return isDarkMode ? darkTheme : theme;
};