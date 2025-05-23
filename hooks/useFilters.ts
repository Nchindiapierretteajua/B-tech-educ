import { useState, useCallback } from 'react';
import { validateFilterState } from '@/lib/validation';
import { APP_CONSTANTS } from '@/lib/constants';
import { FilterState, DateRange } from '@/lib/types';

export function useFilters(initialState: Partial<FilterState> = {}) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categories: [],
    dateRange: APP_CONSTANTS.FILTERS.DEFAULT_DATE_RANGE,
    ...initialState,
  });

  const [error, setError] = useState<string | null>(null);

  const updateSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setError(null);
  }, []);

  const updateCategories = useCallback((categories: string[]) => {
    setFilters((prev) => ({ ...prev, categories }));
    setError(null);
  }, []);

  const updateDateRange = useCallback((dateRange: DateRange) => {
    setFilters((prev) => ({ ...prev, dateRange }));
    setError(null);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      categories: [],
      dateRange: APP_CONSTANTS.FILTERS.DEFAULT_DATE_RANGE,
    });
    setError(null);
  }, []);

  const validateFilters = useCallback(() => {
    const validationError = validateFilterState(filters);
    setError(validationError);
    return !validationError;
  }, [filters]);

  return {
    filters,
    error,
    updateSearch,
    updateCategories,
    updateDateRange,
    resetFilters,
    validateFilters,
  };
}
