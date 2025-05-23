import { configureStore } from '@reduxjs/toolkit';
import scholarshipsReducer from './slices/scholarshipsSlice';
import examsReducer from './slices/examsSlice';
import guidesReducer from './slices/guidesSlice';
import bookmarksReducer from './slices/bookmarksSlice';

export const store = configureStore({
  reducer: {
    scholarships: scholarshipsReducer,
    exams: examsReducer,
    guides: guidesReducer,
    bookmarks: bookmarksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;