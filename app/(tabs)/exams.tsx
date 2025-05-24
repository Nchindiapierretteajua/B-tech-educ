import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { AppDispatch, RootState } from '@/store';
import {
  fetchExams,
  setSelectedMonth,
  setDateRange,
} from '@/store/slices/examsSlice';
import { Exam } from '@/types/api';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';
import FilterChip from '@/components/ui/FilterChip';
import DateRangeSelector from '@/components/ui/DateRangeSelector';
import EmptyState from '@/components/ui/EmptyState';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import theme from '@/theme';
import AnimatedTransition from '@/components/ui/AnimatedTransition';

export default function ExamsScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { filteredItems, selectedMonth, dateRange, loading, error } =
    useSelector((state: RootState) => state.exams);

  // Month names for filtering
  const months = [
    { id: 0, name: 'January' },
    { id: 1, name: 'February' },
    { id: 2, name: 'March' },
    { id: 3, name: 'April' },
    { id: 4, name: 'May' },
    { id: 5, name: 'June' },
    { id: 6, name: 'July' },
    { id: 7, name: 'August' },
    { id: 8, name: 'September' },
    { id: 9, name: 'October' },
    { id: 10, name: 'November' },
    { id: 11, name: 'December' },
  ];

  useEffect(() => {
    dispatch(fetchExams());
  }, [dispatch]);

  const handleMonthFilter = (monthId: number) => {
    dispatch(setSelectedMonth(selectedMonth === monthId ? null : monthId));
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    dispatch(setDateRange({ start, end }));
  };

  const handleExamPress = (exam: Exam) => {
    router.push({
      pathname: '/exam/[id]',
      params: { id: exam.id },
    });
  };

  const renderExam = ({ item, index }: { item: Exam; index: number }) => (
    <Card
      id={item.id}
      type="exam"
      title={item.name}
      description={item.description}
      imageUrl={item.imageUrl}
      caption={`${new Date(item.startDate).toLocaleDateString()} - ${new Date(
        item.endDate
      ).toLocaleDateString()}`}
      onPress={() => handleExamPress(item)}
      index={index}
    />
  );

  if (loading && filteredItems.length === 0) {
    return <LoadingIndicator message="Loading exam calendar..." />;
  }

  if (error) {
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error
                          ? (error as { message: string }).message
                          : typeof error === 'string' ? error : 'An unknown error occurred.';
    return (
      <EmptyState
        title="Couldn't load exams"
        description={errorMessage}
        actionLabel="Try Again"
        onActionPress={() => dispatch(fetchExams())}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Exam Calendar" showSettingsButton />

      <View style={styles.content}>
        <AnimatedTransition entering="fadeIn" duration={400} delay={100}>
          <DateRangeSelector
            startDate={dateRange.start}
            endDate={dateRange.end}
            onDateRangeChange={handleDateRangeChange}
          />
        </AnimatedTransition>

        <AnimatedTransition entering="fadeIn" duration={400} delay={200}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {months.map((month) => (
              <FilterChip
                key={month.id.toString()}
                label={month.name}
                selected={selectedMonth === month.id}
                onPress={() => handleMonthFilter(month.id)}
              />
            ))}
          </ScrollView>
        </AnimatedTransition>

        {filteredItems.length > 0 ? (
          <FlatList
            data={filteredItems}
            renderItem={renderExam}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState
            title="No exams found"
            description={
              selectedMonth !== null
                ? `No exams scheduled for ${months[selectedMonth].name}.`
                : dateRange.start && dateRange.end
                ? `No exams scheduled between ${dateRange.start.toLocaleDateString()} and ${dateRange.end.toLocaleDateString()}.`
                : 'No exams found in the system.'
            }
            actionLabel={
              selectedMonth !== null || (dateRange.start && dateRange.end)
                ? 'Clear Filters'
                : 'Refresh'
            }
            onActionPress={() => {
              if (selectedMonth !== null) {
                dispatch(setSelectedMonth(null));
              }
              if (dateRange.start && dateRange.end) {
                dispatch(setDateRange({ start: null, end: null }));
              }
              if (!selectedMonth && !dateRange.start && !dateRange.end) {
                dispatch(fetchExams());
              }
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  filtersContainer: {
    paddingBottom: theme.spacing.md,
  },
  listContainer: {
    paddingBottom: theme.spacing.xl,
  },
});
