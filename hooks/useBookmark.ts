import { useState, useEffect, useCallback } from 'react';
import { Bookmark } from '@/lib/types';
import * as storage from '@/lib/storage';

export const useBookmark = () => {
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

  const isBookmarked = useCallback(
    (id: string, type: Bookmark['type']) => {
      return bookmarks.some((b) => b.itemId === id && b.type === type);
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    async (id: string, type: Bookmark['type']) => {
      try {
        const isCurrentlyBookmarked = isBookmarked(id, type);
        if (isCurrentlyBookmarked) {
          const bookmark = bookmarks.find(
            (b) => b.itemId === id && b.type === type
          );
          if (bookmark) {
            await storage.removeBookmark(bookmark.id);
            setBookmarks((prev) => prev.filter((b) => b.id !== bookmark.id));
          }
        } else {
          const newBookmark: Bookmark = {
            id: Date.now().toString(),
            type,
            itemId: id,
            createdAt: new Date().toISOString(),
          };
          await storage.addBookmark(newBookmark);
          setBookmarks((prev) => [...prev, newBookmark]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to toggle bookmark')
        );
      }
    },
    [bookmarks, isBookmarked]
  );

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  return {
    bookmarks,
    loading,
    error,
    isBookmarked,
    toggleBookmark,
    refetch: loadBookmarks,
  };
};
