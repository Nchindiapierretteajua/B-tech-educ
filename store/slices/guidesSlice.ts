import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Guide } from '@/types/guide';
import { mockGuides } from '@/data/mockGuides';

interface GuidesState {
  items: Guide[];
  filteredItems: Guide[];
  selectedCategory: string | null;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: GuidesState = {
  items: [],
  filteredItems: [],
  selectedCategory: null,
  searchQuery: '',
  loading: false,
  error: null,
  lastUpdated: null,
};

const STORAGE_KEY = '@guides_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Load guides from cache or fetch new data
export const fetchGuides = createAsyncThunk(
  'guides/fetchGuides',
  async (_, { getState }) => {
    try {
      // Try to load from cache first
      const cachedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (cachedData) {
        const { items, timestamp } = JSON.parse(cachedData);
        const state = getState() as { guides: GuidesState };

        // Use cache if it's still valid
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          return items;
        }
      }

      // If no cache or expired, fetch new data
      // TODO: Replace with actual API call
      const newData = mockGuides;

      // Save to cache
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          items: newData,
          timestamp: Date.now(),
        })
      );

      return newData;
    } catch (error) {
      // If fetch fails, try to use cache even if expired
      const cachedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (cachedData) {
        const { items } = JSON.parse(cachedData);
        return items;
      }
      throw new Error('Failed to fetch guides');
    }
  }
);

const guidesSlice = createSlice({
  name: 'guides',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.filteredItems = filterGuides(
        state.items,
        state.searchQuery,
        state.selectedCategory
      );
    },
    searchGuides: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredItems = filterGuides(
        state.items,
        state.searchQuery,
        state.selectedCategory
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGuides.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGuides.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.filteredItems = filterGuides(
          action.payload,
          state.searchQuery,
          state.selectedCategory
        );
        state.lastUpdated = Date.now();
      })
      .addCase(fetchGuides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch guides';
      });
  },
});

const filterGuides = (
  guides: Guide[],
  searchQuery: string,
  selectedCategory: string | null
): Guide[] => {
  return guides.filter((guide) => {
    // Filter by search term
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        guide.title.toLowerCase().includes(searchLower) ||
        guide.description.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Filter by category
    if (selectedCategory) {
      if (guide.category !== selectedCategory) {
        return false;
      }
    }

    return true;
  });
};

export const { setSelectedCategory, searchGuides } = guidesSlice.actions;
export default guidesSlice.reducer;
