import { useState, useCallback } from 'react';
// import { ApiError } from '../types';
import { ApiError } from '@/lib/types';

export function useErrorHandler() {
  const [error, setError] = useState<Error | ApiError | null>(null);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof Error) {
      setError(err);
    } else if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      'message' in err
    ) {
      setError(err as ApiError);
    } else {
      setError(new Error('An unknown error occurred'));
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getErrorMessage = useCallback(() => {
    if (!error) return '';
    if ('code' in error) {
      return `${error.code}: ${error.message}`;
    }
    return error.message;
  }, [error]);

  return {
    error,
    handleError,
    clearError,
    getErrorMessage,
  };
}
