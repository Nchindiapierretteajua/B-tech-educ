import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Bookmark {
  id: string;
  type: 'exam' | 'scholarship' | 'guide';
}

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

const STORAGE_KEY = '@bookmarks';

// Load bookmarks from storage
export const loadBookmarks = createAsyncThunk(
  'bookmarks/loadBookmarks',
  async () => {
    try {
      const storedBookmarks = await AsyncStorage.getItem(STORAGE_KEY);
      return storedBookmarks ? JSON.parse(storedBookmarks) : [];
    } catch (error) {
      throw new Error('Failed to load bookmarks');
    }
  }
);

// Save bookmarks to storage
const saveBookmarks = async (bookmarks: Bookmark[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Failed to save bookmarks:', error);
  }
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    toggleBookmark: (state, action) => {
      const { id, type } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.id === id && item.type === type
      );

      if (existingIndex === -1) {
        state.items.push({ id, type });
      } else {
        state.items.splice(existingIndex, 1);
      }

      // Save to storage after each change
      saveBookmarks(state.items);
    },
    clearBookmarks: (state) => {
      state.items = [];
      saveBookmarks([]);
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
