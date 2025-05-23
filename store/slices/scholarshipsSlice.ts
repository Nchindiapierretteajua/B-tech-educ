import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Scholarship } from '@/types/scholarship';
import { mockScholarships } from '@/data/mockScholarships';

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
  error: string | null;
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

export const fetchScholarships = createAsyncThunk(
  'scholarships/fetchScholarships',
  async () => {
    // Simulating API call with mock data
    return new Promise<Scholarship[]>((resolve) => {
      setTimeout(() => resolve(mockScholarships), 500);
    });
  }
);

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
        state.items = action.payload;
        state.filteredItems = filterScholarships(
          action.payload,
          state.searchFilter,
          state.typeFilters,
          state.dateRange
        );
      })
      .addCase(fetchScholarships.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch scholarships';
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
    // Filter by search term
    if (searchFilter) {
      const searchLower = searchFilter.toLowerCase();
      const matchesSearch =
        scholarship.title.toLowerCase().includes(searchLower) ||
        scholarship.description.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Filter by type
    if (typeFilters.length > 0) {
      if (!typeFilters.includes(scholarship.type)) {
        return false;
      }
    }

    // Filter by date range
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
