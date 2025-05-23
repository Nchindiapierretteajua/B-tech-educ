import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { AppDispatch, RootState } from '@/store';
import {
  fetchScholarships,
  setSearchFilter,
  setTypeFilters,
  setDateRange,
  resetFilters,
} from '@/store/slices/scholarshipsSlice';
import { Scholarship } from '@/types/scholarship';
import Header from '@/components/ui/Header';
import SearchBar from '@/components/ui/SearchBar';
import Card from '@/components/ui/Card';
import FilterChip from '@/components/ui/FilterChip';
import DateRangeSelector from '@/components/ui/DateRangeSelector';
import EmptyState from '@/components/ui/EmptyState';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import theme from '@/theme';
import AnimatedTransition from '@/components/ui/AnimatedTransition';

export default function ScholarshipsScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { filteredItems, dateRange, loading, error } = useSelector(
    (state: RootState) => state.scholarships
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Scholarship types for filtering
  const scholarshipTypes = [
    { id: 'undergraduate', label: 'Undergraduate' },
    { id: 'postgraduate', label: 'Postgraduate' },
    { id: 'research', label: 'Research' },
  ];

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchScholarships());
  }, [dispatch]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    dispatch(setSearchFilter(query));
  };

  const handleTypeFilter = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];

    setSelectedTypes(newTypes);
    dispatch(setTypeFilters(newTypes));
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    dispatch(setDateRange({ start, end }));
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
    dispatch(resetFilters());
  };

  const handleScholarshipPress = (scholarship: Scholarship) => {
    router.push({
      pathname: '/scholarship/[id]',
      params: { id: scholarship.id },
    });
  };

  const renderScholarship = ({
    item,
    index,
  }: {
    item: Scholarship;
    index: number;
  }) => (
    <Card
      id={item.id}
      type="scholarship"
      title={item.title}
      description={item.description}
      imageUrl={item.imageUrl}
      caption={`Deadline: ${new Date(item.deadline).toLocaleDateString()}`}
      onPress={() => handleScholarshipPress(item)}
      index={index}
    />
  );

  if (loading && filteredItems.length === 0) {
    return <LoadingIndicator message="Loading scholarships..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="Couldn't load scholarships"
        description={error}
        actionLabel="Try Again"
        onActionPress={() => dispatch(fetchScholarships())}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Scholarships & Opportunities" showSettingsButton />

      <View style={styles.content}>
        <SearchBar
          placeholder="Search scholarships"
          value={searchQuery}
          onChangeText={handleSearch}
        />

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
            {scholarshipTypes.map((type) => (
              <FilterChip
                key={type.id}
                label={type.label}
                selected={selectedTypes.includes(type.id)}
                onPress={() => handleTypeFilter(type.id)}
              />
            ))}
          </ScrollView>
        </AnimatedTransition>

        {filteredItems.length > 0 ? (
          <FlatList
            data={filteredItems}
            renderItem={renderScholarship}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState
            title="No scholarships found"
            description={
              dateRange.start && dateRange.end
                ? `No scholarships available between ${dateRange.start.toLocaleDateString()} and ${dateRange.end.toLocaleDateString()}.`
                : "Try adjusting your search or filters to find what you're looking for."
            }
            actionLabel="Clear Filters"
            onActionPress={handleClearFilters}
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
