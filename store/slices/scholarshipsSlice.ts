import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Scholarship, PaginatedScholarshipsResponse, ApiErrorResponse } from '@/types/api';
import { getScholarships } from '@/lib/apiService';

interface ScholarshipsState {
  items: Scholarship[];
  filteredItems: Scholarship[];
  searchFilter: string;
  typeFilters: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  loading: boolean;
  error: ApiErrorResponse | string | null;
}

const initialState: ScholarshipsState = {
  items: [],
  filteredItems: [],
  searchFilter: '',
  typeFilters: [],
  dateRange: {
    start: null,
    end: null,
  },
  loading: false,
  error: null,
};

export const fetchScholarships = createAsyncThunk<
  PaginatedScholarshipsResponse,
  void,
  { rejectValue: ApiErrorResponse | string }
>('scholarships/fetchScholarships', async (_, { rejectWithValue }) => {
  try {
    const response = await getScholarships();
    return response;
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return rejectWithValue(error as ApiErrorResponse);
    }
    return rejectWithValue('An unexpected error occurred while fetching scholarships.');
  }
});

const scholarshipsSlice = createSlice({
  name: 'scholarships',
  initialState,
  reducers: {
    setSearchFilter: (state, action) => {
      state.searchFilter = action.payload;
      state.filteredItems = filterScholarships(
        state.items,
        state.searchFilter,
        state.typeFilters,
        state.dateRange
      );
    },
    setTypeFilters: (state, action) => {
      state.typeFilters = action.payload;
      state.filteredItems = filterScholarships(
        state.items,
        state.searchFilter,
        state.typeFilters,
        state.dateRange
      );
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
      state.filteredItems = filterScholarships(
        state.items,
        state.searchFilter,
        state.typeFilters,
        state.dateRange
      );
    },
    resetFilters: (state) => {
      state.searchFilter = '';
      state.typeFilters = [];
      state.dateRange = { start: null, end: null };
      state.filteredItems = state.items;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchScholarships.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScholarships.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.scholarships;
        state.filteredItems = filterScholarships(
          action.payload.scholarships,
          state.searchFilter,
          state.typeFilters,
          state.dateRange
        );
      })
      .addCase(fetchScholarships.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = action.error.message || 'Failed to fetch scholarships';
        }
      });
  },
});

const filterScholarships = (
  scholarships: Scholarship[],
  searchFilter: string,
  typeFilters: string[],
  dateRange: { start: Date | null; end: Date | null }
): Scholarship[] => {
  return scholarships.filter((scholarship) => {
    if (searchFilter) {
      const searchLower = searchFilter.toLowerCase();
      const matchesSearch =
        scholarship.title.toLowerCase().includes(searchLower) ||
        scholarship.description.toLowerCase().includes(searchLower) ||
        scholarship.provider.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    if (typeFilters.length > 0) {
      const typeLower = scholarship.type.toLowerCase();
      const matchesType = typeFilters.some(filterType => typeLower.includes(filterType.toLowerCase()));
      if (!matchesType) {
        return false;
      }
    }

    if (dateRange.start && dateRange.end) {
      const deadline = new Date(scholarship.deadline);
      const rangeStart = new Date(dateRange.start);
      const rangeEnd = new Date(dateRange.end);

      if (deadline < rangeStart || deadline > rangeEnd) {
        return false;
      }
    }

    return true;
  });
};

export const { setSearchFilter, setTypeFilters, setDateRange, resetFilters } =
  scholarshipsSlice.actions;
export default scholarshipsSlice.reducer;
