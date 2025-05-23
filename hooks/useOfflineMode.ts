import { useCallback, useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { usePreferences } from '@/lib/preferences';
import { api } from '@/lib/api';
import { Exam, Scholarship, Guide } from '@/lib/types';

export function useOfflineMode() {
  const { preferences, updatePreference } = usePreferences();
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const toggleOfflineMode = useCallback(() => {
    updatePreference('offlineMode', !preferences.offlineMode);
  }, [preferences.offlineMode, updatePreference]);

  const syncData = useCallback(async () => {
    if (!isConnected || preferences.offlineMode) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch fresh data
      const [exams, scholarships, guides] = await Promise.all([
        api.exams.fetch(),
        api.scholarships.fetch(),
        api.guides.fetch(),
      ]);

      // TODO: Update local storage with fresh data
      console.log('Synced data:', { exams, scholarships, guides });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to sync data'));
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, preferences.offlineMode]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isConnected && !preferences.offlineMode) {
      syncData();
    }
  }, [isConnected, preferences.offlineMode, syncData]);

  return {
    isEnabled: preferences.offlineMode,
    isConnected,
    isLoading,
    error,
    toggleOfflineMode,
    syncData,
  };
}
