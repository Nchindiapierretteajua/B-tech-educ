import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bookmark } from '@/lib/types';
import { AppDispatch, RootState } from '@/store';
import {
  toggleBookmarkAsync,
  // loadBookmarks, // loadBookmarks is likely dispatched globally, e.g., in App.tsx or main tab screens
  ToggleBookmarkArgs
} from '@/store/slices/bookmarksSlice';

export const useBookmark = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Select bookmark data from Redux store
  const bookmarks = useSelector((state: RootState) => state.bookmarks.items);
  const itemLoading = useSelector((state: RootState) => state.bookmarks.itemLoading);
  const overallLoading = useSelector((state: RootState) => state.bookmarks.loading); // For initial load if needed
  const error = useSelector((state: RootState) => state.bookmarks.error);

  const isBookmarked = useCallback(
    (id: string, type: Bookmark['type']) => {
      return bookmarks.some((b) => b.itemId === id && b.type === type);
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (id: string, type: Bookmark['type']) => {
      const payload: ToggleBookmarkArgs = { itemId: id, type };
      dispatch(toggleBookmarkAsync(payload));
    },
    [dispatch]
  );

  // Function to check loading status for a specific item
  const isItemToggling = useCallback(
    (id: string, type: Bookmark['type']) => {
      return itemLoading[`${type}-${id}`] || false;
    },
    [itemLoading]
  );

  // The hook might not need its own refetch if data is loaded globally.
  // If a component using this hook needs to trigger a global load, 
  // it could dispatch loadBookmarks itself or we can expose a refetch here.
  // For now, let's assume bookmarks are loaded by a higher-level component.
  // const refetch = useCallback(() => {
  //   dispatch(loadBookmarks());
  // }, [dispatch]);

  return {
    bookmarks, // The raw list of bookmarks from Redux
    loading: overallLoading, // Global loading state for bookmarks list
    error,    // Global error state for bookmarks list
    isBookmarked,
    toggleBookmark,
    isItemToggling, // Expose this to allow UI to react to individual item loading
    // refetch, // Optionally expose refetch if needed
  };
};
