import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Guide, PaginatedGuidesResponse, ApiErrorResponse } from '@/types/api';
import { getGuides } from '@/lib/apiService';

interface GuidesState {
  items: Guide[];
  filteredItems: Guide[];
  selectedCategory: string | null;
  searchQuery: string;
  loading: boolean;
  error: ApiErrorResponse | string | null;
  lastUpdated: number | null;
  isStaleData?: boolean; // Flag to indicate if displayed data is from stale cache
}

const initialState: GuidesState = {
  items: [],
  filteredItems: [],
  selectedCategory: null,
  searchQuery: '',
  loading: false,
  error: null,
  lastUpdated: null,
  isStaleData: false,
};

const STORAGE_KEY = '@guides_cache_v2'; // Consider versioning cache key if structure changes
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CachedGuidesData {
  data: PaginatedGuidesResponse;
  timestamp: number;
}

export const fetchGuides = createAsyncThunk<
  PaginatedGuidesResponse, // Success return type
  void, 
  { rejectValue: ApiErrorResponse | string; state: { guides: GuidesState } } // ThunkAPI types
>('guides/fetchGuides', async (_, { rejectWithValue, dispatch }) => {
  let cachedStoredData: CachedGuidesData | null = null;

  try {
    const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (storedValue) {
      cachedStoredData = JSON.parse(storedValue) as CachedGuidesData;
      if (cachedStoredData && cachedStoredData.data && cachedStoredData.timestamp) {
        if (Date.now() - cachedStoredData.timestamp < CACHE_EXPIRY) {
          console.log('Using valid cache for guides.');
          // Dispatch an action to clear isStaleData if we're using fresh cache
          dispatch(guidesSlice.actions.setDataFreshness(false));
          return cachedStoredData.data;
        }
        console.log('Guides cache is stale.');
      }
    }
  } catch (e) {
    console.error('Failed to load guides from cache:', e);
    // Proceed to fetch from API if cache loading fails
  }

  try {
    console.log('Fetching guides from API...');
    const apiResponse = await getGuides();
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ data: apiResponse, timestamp: Date.now() }));
      console.log('Guides cache updated.');
    } catch (e) {
      console.error('Failed to save guides to cache:', e);
    }
    // Dispatch an action to clear isStaleData if we're using fresh API data
    dispatch(guidesSlice.actions.setDataFreshness(false));
    return apiResponse;
  } catch (apiError) {
    console.error('Failed to fetch guides from API:', apiError);
    if (cachedStoredData && cachedStoredData.data) {
      console.warn('API fetch failed, using stale cache for guides.');
      // Dispatch an action to set isStaleData if we're using stale cache
      dispatch(guidesSlice.actions.setDataFreshness(true));
      return cachedStoredData.data; // Return stale data as a fallback
    }
    // If API fails and no cache (even stale), reject
    if (typeof apiError === 'object' && apiError !== null && 'message' in apiError) {
      return rejectWithValue(apiError as ApiErrorResponse);
    }
    return rejectWithValue('An unexpected error occurred while fetching guides.');
  }
});

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
    // New reducer to manage data freshness state
    setDataFreshness: (state, action: { payload: boolean }) => {
      state.isStaleData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGuides.pending, (state) => {
        state.loading = true;
        state.error = null;
        // Don't reset isStaleData here, let fulfilled/rejected handle it
      })
      .addCase(fetchGuides.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.guides;
        state.filteredItems = filterGuides(
          action.payload.guides,
          state.searchQuery,
          state.selectedCategory
        );
        state.lastUpdated = Date.now(); 
        // isStaleData is set by the thunk via dispatch
        state.error = null; // Clear previous errors on success
      })
      .addCase(fetchGuides.rejected, (state, action) => {
        state.loading = false;
        // Only set error if not using stale cache (which would be a fulfilled case)
        // The thunk logic now returns stale cache as 'fulfilled' with a flag.
        // This 'rejected' case means API failed AND no stale cache was available.
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = action.error.message || 'Failed to fetch guides';
        }
        // If rejected, it implies we couldn't even use stale cache.
        state.isStaleData = false; 
      });
  },
});

const filterGuides = (
  guides: Guide[],
  searchQuery: string,
  selectedCategory: string | null
): Guide[] => {
  return guides.filter((guide) => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        guide.title.toLowerCase().includes(searchLower) ||
        (guide.description && guide.description.toLowerCase().includes(searchLower)) ||
        guide.category.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    if (selectedCategory) {
      if (guide.category.toLowerCase() !== selectedCategory.toLowerCase()) { 
        return false;
      }
    }

    return true;
  });
};

export const { setSelectedCategory, searchGuides, setDataFreshness } = guidesSlice.actions;
export default guidesSlice.reducer;
