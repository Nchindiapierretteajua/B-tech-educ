import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Exam } from '@/types/exam';
import { mockExams } from '@/data/mockExams';

interface ExamsState {
  items: Exam[];
  filteredItems: Exam[];
  selectedMonth: number | null;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  loading: boolean;
  error: string | null;
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

export const fetchExams = createAsyncThunk('exams/fetchExams', async () => {
  // Simulating API call with mock data
  return new Promise<Exam[]>((resolve) => {
    setTimeout(() => resolve(mockExams), 500);
  });
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
        state.items = action.payload;
        state.filteredItems = filterExams(
          action.payload,
          state.selectedMonth,
          state.dateRange
        );
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch exams';
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

    // Filter by month if selected
    if (selectedMonth !== null) {
      const examMonth = examStartDate.getMonth();
      if (examMonth !== selectedMonth) {
        return false;
      }
    }

    // Filter by date range if selected
    if (dateRange.start && dateRange.end) {
      const rangeStart = new Date(dateRange.start);
      const rangeEnd = new Date(dateRange.end);

      // Check if exam dates overlap with the selected range
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
