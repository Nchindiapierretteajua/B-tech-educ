import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { APP_CONSTANTS } from '@/lib/constants'; 
import { Bookmark } from '@/lib/types';       
import * as storage from '@/lib/storage';     
import { RootState } from '..'; // Assuming RootState is in store/index.ts

// Types for thunk
export interface ToggleBookmarkArgs {
  itemId: string;
  type: Bookmark['type'];
}

interface ToggleBookmarkFulfilledPayload {
  newBookmark?: Bookmark; // Present if added
  itemId?: string;        // Present if removed
  type?: Bookmark['type'];  // Present if removed
  operation: 'added' | 'removed';
}

interface BookmarksState {
  items: Bookmark[];
  loading: boolean; // For initial load
  error: string | null;
  itemLoading: { [key: string]: boolean }; // For individual item toggle loading state
}

const initialState: BookmarksState = {
  items: [],
  loading: false,
  error: null,
  itemLoading: {},
};

// Load bookmarks from storage (existing thunk)
export const loadBookmarks = createAsyncThunk<Bookmark[], void, { rejectValue: string }>( // Added types
  'bookmarks/loadBookmarks',
  async (_, { rejectWithValue }) => { // Added rejectWithValue for typed errors
    try {
      return await storage.getBookmarks();
    } catch (error) {
      console.error('Failed to load bookmarks in thunk:', error);
      return rejectWithValue('Failed to load bookmarks'); // Use rejectWithValue
    }
  }
);

// Refactored toggleBookmark thunk
export const toggleBookmarkAsync = createAsyncThunk<
  ToggleBookmarkFulfilledPayload,
  ToggleBookmarkArgs,
  { state: RootState, rejectValue: string } // Added RootState for getState if needed, and rejectValue type
>(
  'bookmarks/toggleBookmarkAsync',
  async ({ itemId, type }, { getState, rejectWithValue }) => {
    // It's generally better to fetch fresh from storage before modification
    // to avoid race conditions if multiple toggles happen quickly or from different places.
    const existingBookmarks = await storage.getBookmarks(); 
    const existingBookmark = existingBookmarks.find(
      (item) => item.itemId === itemId && item.type === type
    );

    try {
      if (existingBookmark) {
        // Item is already bookmarked, so remove it
        await storage.removeBookmark(existingBookmark.id);
        return { itemId, type, operation: 'removed' };
      } else {
        // Item is not bookmarked, so add it
        const newBookmark: Bookmark = {
          id: Date.now().toString(), // Consider a more robust UUID if available/needed
          type,
          itemId,
          createdAt: new Date().toISOString(),
        };
        await storage.addBookmark(newBookmark);
        return { newBookmark, operation: 'added' };
      }
    } catch (error) {
      console.error('Failed to toggle bookmark in thunk:', error);
      return rejectWithValue(`Failed to ${existingBookmark ? 'remove' : 'add'} bookmark`);
    }
  }
);


const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    // Synchronous toggleBookmark removed
    clearBookmarks: (state) => {
      state.items = [];
      state.error = null; // Clear any previous errors
      // Fire and forget storage clear, or make this an async thunk too for full error handling
      storage.clearStorage().catch(err => {
        console.error("Failed to clear bookmarks from storage:", err);
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Load Bookmarks
      .addCase(loadBookmarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadBookmarks.fulfilled, (state, action: PayloadAction<Bookmark[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Failed to load bookmarks';
      })
      // Toggle Bookmark Async
      .addCase(toggleBookmarkAsync.pending, (state, action) => {
        const { itemId, type } = action.meta.arg;
        state.itemLoading[`${type}-${itemId}`] = true;
        state.error = null; // Clear previous errors on new attempt
      })
      .addCase(toggleBookmarkAsync.fulfilled, (state, action: PayloadAction<ToggleBookmarkFulfilledPayload>) => {
        const { newBookmark, itemId, type, operation } = action.payload;
        // Construct key carefully based on what's available in the payload for removal vs addition
        const itemKey = operation === 'removed' && itemId && type ? `${type}-${itemId}` 
                      : newBookmark ? `${newBookmark.type}-${newBookmark.itemId}` 
                      : undefined;

        if (operation === 'added' && newBookmark) {
          state.items.push(newBookmark);
        } else if (operation === 'removed' && itemId && type) {
          state.items = state.items.filter(
            (item) => !(item.itemId === itemId && item.type === type)
          );
        }
        if (itemKey) {
          delete state.itemLoading[itemKey];
        }
      })
      .addCase(toggleBookmarkAsync.rejected, (state, action) => {
        const { itemId, type } = action.meta.arg;
        // Construct key to ensure we clear the correct loading flag
        const itemKey = `${type}-${itemId}`;
        if (state.itemLoading[itemKey]) { // Check if the key exists before deleting
            delete state.itemLoading[itemKey];
        }
        state.error = action.payload || action.error.message || 'Failed to toggle bookmark';
      });
  },
});

export const { clearBookmarks } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;
