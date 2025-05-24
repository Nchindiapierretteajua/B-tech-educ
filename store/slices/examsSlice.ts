import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Exam, PaginatedExamsResponse, ApiErrorResponse } from '@/types/api'; 
import { getExams } from '@/lib/apiService'; 

interface ExamsState {
  items: Exam[];
  filteredItems: Exam[];
  selectedMonth: number | null;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  loading: boolean;
  error: ApiErrorResponse | string | null; 
  // Future: Add pagination state if needed (total, page, limit, totalPages)
}

const initialState: ExamsState = {
  items: [],
  filteredItems: [],
  selectedMonth: null,
  dateRange: {
    start: null,
    end: null,
  },
  loading: false,
  error: null,
};

export const fetchExams = createAsyncThunk<
  PaginatedExamsResponse, 
  void, 
  { rejectValue: ApiErrorResponse | string } 
>('exams/fetchExams', async (_, { rejectWithValue }) => {
  try {
    const response = await getExams(); 
    return response;
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return rejectWithValue(error as ApiErrorResponse);
    }
    return rejectWithValue('An unexpected error occurred while fetching exams.');
  }
});

const examsSlice = createSlice({
  name: 'exams',
  initialState,
  reducers: {
    setSelectedMonth: (state, action) => {
      state.selectedMonth = action.payload;
      state.filteredItems = filterExams(
        state.items,
        state.selectedMonth,
        state.dateRange
      );
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
      state.filteredItems = filterExams(
        state.items,
        state.selectedMonth,
        state.dateRange
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.exams; 
        state.filteredItems = filterExams(
          action.payload.exams,
          state.selectedMonth,
          state.dateRange
        );
        // TODO: Store pagination info (action.payload.total, .page, .limit, .totalPages) if needed
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = action.error.message || 'Failed to fetch exams';
        }
      });
  },
});

const filterExams = (
  exams: Exam[],
  selectedMonth: number | null,
  dateRange: { start: Date | null; end: Date | null }
): Exam[] => {
  return exams.filter((exam) => {
    const examStartDate = new Date(exam.startDate);
    const examEndDate = new Date(exam.endDate);

    if (selectedMonth !== null) {
      const examMonth = examStartDate.getMonth();
      if (examMonth !== selectedMonth) {
        return false;
      }
    }

    if (dateRange.start && dateRange.end) {
      const rangeStart = new Date(dateRange.start);
      const rangeEnd = new Date(dateRange.end);

      return (
        (examStartDate >= rangeStart && examStartDate <= rangeEnd) ||
        (examEndDate >= rangeStart && examEndDate <= rangeEnd) ||
        (examStartDate <= rangeStart && examEndDate >= rangeEnd)
      );
    }

    return true;
  });
};

export const { setSelectedMonth, setDateRange } = examsSlice.actions;
export default examsSlice.reducer;
