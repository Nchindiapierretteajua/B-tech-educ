import { useState, useEffect, useCallback } from 'react';
import { Preferences } from '@/lib/types';
import * as storage from '@/lib/storage';
import { APP_CONSTANTS } from '@/lib/constants';

const defaultPreferences: Preferences = {
  notifications: true,
  darkMode: false,
  offlineMode: false,
};

export const usePreferences = () => {
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stored = await storage.getItem<Preferences>(
        APP_CONSTANTS.STORAGE_KEYS.PREFERENCES
      );
      if (stored) {
        setPreferences(stored);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to load preferences')
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePreference = useCallback(
    async <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
      try {
        setError(null);
        const newPreferences = { ...preferences, [key]: value };
        await storage.setItem(
          APP_CONSTANTS.STORAGE_KEYS.PREFERENCES,
          newPreferences
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
    isLoading,
    error,
    updatePreference,
    refetch: loadPreferences,
  };
};
