import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { APP_CONSTANTS } from '@/lib/constants';
import { Bookmark } from '@/lib/types';
import * as storage from '@/lib/storage';

interface BookmarksState {
  items: Bookmark[];
  loading: boolean;
  error: string | null;
}

const initialState: BookmarksState = {
  items: [],
  loading: false,
  error: null,
};

// Load bookmarks from storage
export const loadBookmarks = createAsyncThunk(
  'bookmarks/loadBookmarks',
  async () => {
    try {
      return await storage.getBookmarks();
    } catch (error) {
      throw new Error('Failed to load bookmarks');
    }
  }
);

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    toggleBookmark: (state, action) => {
      const { itemId, type } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.itemId === itemId && item.type === type
      );

      if (existingIndex === -1) {
        const newBookmark: Bookmark = {
          id: Date.now().toString(),
          type,
          itemId,
          createdAt: new Date().toISOString(),
        };
        state.items.push(newBookmark);
        storage.addBookmark(newBookmark);
      } else {
        const bookmark = state.items[existingIndex];
        state.items.splice(existingIndex, 1);
        storage.removeBookmark(bookmark.id);
      }
    },
    clearBookmarks: (state) => {
      state.items = [];
      storage.clearStorage();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBookmarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadBookmarks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load bookmarks';
      });
  },
});

export const { toggleBookmark, clearBookmarks } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;
