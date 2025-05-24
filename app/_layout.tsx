import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { SplashScreen } from 'expo-router';
import { lightTheme, darkTheme } from '@/theme';
import { store } from '@/store';
import { loadBookmarks } from '@/store/slices/bookmarksSlice';
import { usePreferences } from '@/hooks/usePreferences';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { preferences, isLoading: preferencesLoading } = usePreferences();
  const isDarkMode = preferences.darkMode;

  if (preferencesLoading) {
    // Show a loader while preferences are loading to prevent theme flash
    // Using theme colors for the loader itself, defaults to light if theme isn't loaded yet
    const initialBgColor = preferences.darkMode ? darkTheme.colors.background : lightTheme.colors.background;
    const initialIndicatorColor = preferences.darkMode ? darkTheme.colors.primary : lightTheme.colors.primary;
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: initialBgColor }}>
        <ActivityIndicator size="large" color={initialIndicatorColor} />
      </View>
    );
  }

  return (
    <PaperProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </PaperProvider>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-Bold': Poppins_700Bold,
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-Bold': Nunito_700Bold,
  });

  // Load bookmarks when app starts
  useEffect(() => {
    store.dispatch(loadBookmarks());
  }, []);

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <StoreProvider store={store}>
      <AppContent />
    </StoreProvider>
  );
}
