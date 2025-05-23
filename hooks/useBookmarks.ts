import { useState, useEffect, useCallback } from 'react';
import { Bookmark } from '../types';
import * as storage from '../storage';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await storage.getBookmarks();
      setBookmarks(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to load bookmarks')
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const addBookmark = useCallback(async (bookmark: Bookmark) => {
    try {
      setError(null);
      await storage.addBookmark(bookmark);
      setBookmarks((prev) => [...prev, bookmark]);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to add bookmark')
      );
    }
  }, []);

  const removeBookmark = useCallback(async (bookmarkId: string) => {
    try {
      setError(null);
      await storage.removeBookmark(bookmarkId);
      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to remove bookmark')
      );
    }
  }, []);

  const isBookmarked = useCallback(
    async (itemId: string, type: Bookmark['type']) => {
      try {
        return await storage.isBookmarked(itemId, type);
      } catch (err) {
        console.error('Failed to check bookmark status:', err);
        return false;
      }
    },
    []
  );

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  return {
    bookmarks,
    loading,
    error,
    addBookmark,
    removeBookmark,
    isBookmarked,
    refetch: loadBookmarks,
  };
}
