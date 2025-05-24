import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ScrollView, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { AppDispatch, RootState } from '@/store';
import { fetchGuides, setSelectedCategory, searchGuides } from '@/store/slices/guidesSlice';
import { Guide } from '@/types/api';
import Header from '@/components/ui/Header';
import SearchBar from '@/components/ui/SearchBar';
import Card from '@/components/ui/Card';
import FilterChip from '@/components/ui/FilterChip';
import EmptyState from '@/components/ui/EmptyState';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import theme from '@/theme';
import AnimatedTransition from '@/components/ui/AnimatedTransition';

export default function GuidesScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { filteredItems, selectedCategory, loading, error, isStaleData } = useSelector((state: RootState) => state.guides);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Guide categories for filtering
  const categories = [
    { id: 'exams', label: 'Exams' },
    { id: 'scholarships', label: 'Scholarships' },
    { id: 'school-registration', label: 'School Registration' },
    { id: 'documentation', label: 'Documentation' },
    { id: 'education-system', label: 'Education System' },
  ];
  
  useEffect(() => {
    dispatch(fetchGuides());
  }, [dispatch]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    dispatch(searchGuides(query));
  };
  
  const handleCategoryFilter = (category: string) => {
    dispatch(setSelectedCategory(selectedCategory === category ? null : category));
    // Also apply any existing search
    if (searchQuery) {
      dispatch(searchGuides(searchQuery));
    }
  };
  
  const handleClearFilters = () => {
    setSearchQuery('');
    dispatch(setSelectedCategory(null));
    dispatch(searchGuides(''));
  };
  
  const handleGuidePress = (guide: Guide) => {
    router.push({
      pathname: '/guide/[id]',
      params: { id: guide.id }
    });
  };
  
  const renderGuide = ({ item, index }: { item: Guide; index: number }) => (
    <Card
      id={item.id}
      type="guide"
      title={item.title}
      description={item.description}
      imageUrl={item.imageUrl}
      caption={`For ${item.audience === 'ALL' ? 'Everyone' : item.audience}s`}
      onPress={() => handleGuidePress(item)}
      index={index}
    />
  );
  
  if (loading && filteredItems.length === 0) {
    return <LoadingIndicator message="Loading guides..." />;
  }
  
  if (error) {
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error 
                          ? (error as { message: string }).message 
                          : typeof error === 'string' ? error : 'An unknown error occurred.';
    return (
      <EmptyState
        title="Couldn't load guides"
        description={errorMessage}
        actionLabel="Try Again"
        onActionPress={() => dispatch(fetchGuides())}
      />
    );
  }
  
  return (
    <View style={styles.container}>
      <Header 
        title="Educational Guides" 
        showSettingsButton
      />
      
      <View style={styles.content}>
        <SearchBar
          placeholder="Search guides"
          value={searchQuery}
          onChangeText={handleSearch}
        />

        {/* Stale Data Indicator */}
        {isStaleData && !loading && (
          <AnimatedTransition entering="fadeIn" duration={300}>
            <View style={styles.staleDataContainer}>
              <Text style={styles.staleDataText}>
                Showing older data. Pull down to refresh for the latest guides.
              </Text>
            </View>
          </AnimatedTransition>
        )}
        
        <AnimatedTransition entering="fadeIn" duration={400} delay={200}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {categories.map((category) => (
              <FilterChip
                key={category.id}
                label={category.label}
                selected={selectedCategory === category.id}
                onPress={() => handleCategoryFilter(category.id)}
              />
            ))}
          </ScrollView>
        </AnimatedTransition>
        
        {filteredItems.length > 0 ? (
          <FlatList
            data={filteredItems}
            renderItem={renderGuide}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState
            title="No guides found"
            description="Try adjusting your search or filters to find what you're looking for."
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
  staleDataContainer: {
    backgroundColor: theme.colors.tertiaryContainer,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 4,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  staleDataText: {
    color: theme.colors.onTertiaryContainer,
    fontSize: 13,
    textAlign: 'center',
    fontFamily: theme.fonts.regular.fontFamily,
  },
});