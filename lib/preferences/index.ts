import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONSTANTS } from '../constants';

export interface Preferences {
  notifications: boolean;
  darkMode: boolean;
  offlineMode: boolean;
}

const defaultPreferences: Preferences = {
  notifications: true,
  darkMode: false,
  offlineMode: false,
};

export function usePreferences() {
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadPreferences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const stored = await AsyncStorage.getItem(
        APP_CONSTANTS.STORAGE_KEYS.PREFERENCES
      );
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to load preferences')
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePreference = useCallback(
    async <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
      try {
        setError(null);
        const newPreferences = { ...preferences, [key]: value };
        await AsyncStorage.setItem(
          APP_CONSTANTS.STORAGE_KEYS.PREFERENCES,
          JSON.stringify(newPreferences)
        );
        setPreferences(newPreferences);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to update preferences')
        );
      }
    },
    [preferences]
  );

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return {
    preferences,
    loading,
    error,
    updatePreference,
    refetch: loadPreferences,
  };
}
