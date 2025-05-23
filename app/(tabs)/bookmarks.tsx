import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SectionList, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { Text, Chip } from 'react-native-paper';
import { RootState, AppDispatch } from '@/store';
import { Scholarship } from '@/types/scholarship';
import { Exam } from '@/types/exam';
import { Guide } from '@/types/guide';
import { Bookmark } from '@/lib/types';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import { BookmarkX } from 'lucide-react-native';
import theme from '@/theme';
import AnimatedTransition from '@/components/ui/AnimatedTransition';
import { loadBookmarks, toggleBookmark } from '@/store/slices/bookmarksSlice';

type BookmarkedItem = {
  bookmark: Bookmark;
  details: Scholarship | Exam | Guide;
};

type Section = {
  title: string;
  data: BookmarkedItem[];
};

type Category = 'all' | 'scholarship' | 'exam' | 'guide';

export default function BookmarksScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const bookmarks = useSelector((state: RootState) => state.bookmarks.items);
  const scholarships = useSelector(
    (state: RootState) => state.scholarships.items
  );
  const exams = useSelector((state: RootState) => state.exams.items);
  const guides = useSelector((state: RootState) => state.guides.items);

  useEffect(() => {
    dispatch(loadBookmarks());
  }, [dispatch]);

  // Create a merged array of bookmarked items with their details
  const bookmarkedItems = bookmarks
    .map((bookmark) => {
      if (bookmark.type === 'scholarship') {
        const scholarship = scholarships.find((s) => s.id === bookmark.itemId);
        if (scholarship) {
          return {
            bookmark,
            details: scholarship,
          } as BookmarkedItem;
        }
      } else if (bookmark.type === 'exam') {
        const exam = exams.find((e) => e.id === bookmark.itemId);
        if (exam) {
          return {
            bookmark,
            details: exam,
          } as BookmarkedItem;
        }
      } else if (bookmark.type === 'guide') {
        const guide = guides.find((g) => g.id === bookmark.itemId);
        if (guide) {
          return {
            bookmark,
            details: guide,
          } as BookmarkedItem;
        }
      }
      return null;
    })
    .filter((item): item is BookmarkedItem => item !== null);

  // Filter items based on selected category
  const filteredItems =
    selectedCategory === 'all'
      ? bookmarkedItems
      : bookmarkedItems.filter(
          (item) => item.bookmark.type === selectedCategory
        );

  // Group bookmarked items by type
  const sections: Section[] = [
    {
      title: 'Scholarships',
      data: filteredItems.filter(
        (item) => item.bookmark.type === 'scholarship'
      ),
    },
    {
      title: 'Exams',
      data: filteredItems.filter((item) => item.bookmark.type === 'exam'),
    },
    {
      title: 'Guides',
      data: filteredItems.filter((item) => item.bookmark.type === 'guide'),
    },
  ].filter((section) => section.data.length > 0);

  const handleItemPress = (item: BookmarkedItem) => {
    if (item.bookmark.type === 'scholarship') {
      router.push({
        pathname: '/scholarship/[id]',
        params: { id: item.bookmark.itemId },
      });
    } else if (item.bookmark.type === 'exam') {
      router.push({
        pathname: '/exam/[id]',
        params: { id: item.bookmark.itemId },
      });
    } else if (item.bookmark.type === 'guide') {
      router.push({
        pathname: '/guide/[id]',
        params: { id: item.bookmark.itemId },
      });
    }
  };

  const handleUnfavorite = (item: BookmarkedItem) => {
    dispatch(
      toggleBookmark({ itemId: item.bookmark.itemId, type: item.bookmark.type })
    );
  };

  const renderBookmarkedItem = ({
    item,
    index,
  }: {
    item: BookmarkedItem;
    index: number;
  }) => {
    const details = item.details;
    let caption = '';
    let displayTitle = '';

    if (item.bookmark.type === 'scholarship') {
      const scholarship = details as Scholarship;
      displayTitle = scholarship.title;
      caption = `Deadline: ${new Date(
        scholarship.deadline
      ).toLocaleDateString()}`;
    } else if (item.bookmark.type === 'exam') {
      const exam = details as Exam;
      displayTitle = exam.name;
      caption = `Date: ${new Date(
        exam.registrationEndDate
      ).toLocaleDateString()}`;
    } else if (item.bookmark.type === 'guide') {
      const guide = details as Guide;
      displayTitle = guide.title;
      caption = `${guide.category}`;
    }

    return (
      <Card
        id={item.bookmark.itemId}
        type={item.bookmark.type}
        title={displayTitle}
        description={details.description}
        imageUrl={details.imageUrl}
        caption={caption}
        onPress={() => handleItemPress(item)}
        index={index}
      />
    );
  };

  const renderSectionHeader = ({ section }: { section: Section }) => (
    <View style={styles.sectionHeader}>
      <Text
        variant="titleMedium"
        style={[
          styles.sectionTitle,
          { fontFamily: theme.typography.fonts.heading.fontFamily },
        ]}
      >
        {section.title}
      </Text>
      <Text
        variant="bodySmall"
        style={[
          styles.sectionCount,
          { fontFamily: theme.typography.fonts.body.fontFamily },
        ]}
      >
        {section.data.length} {section.data.length === 1 ? 'item' : 'items'}
      </Text>
    </View>
  );

  const renderCategoryTabs = () => (
    <View
      // horizontal
      // showsHorizontalScrollIndicator={false}
      // contentContainerStyle={styles.categoryTabs}
      style={styles.categoryTabs}
    >
      <Chip
        selected={selectedCategory === 'all'}
        onPress={() => setSelectedCategory('all')}
        style={styles.categoryChip}
        textStyle={styles.categoryChipText}
      >
        All
      </Chip>
      <Chip
        selected={selectedCategory === 'scholarship'}
        onPress={() => setSelectedCategory('scholarship')}
        style={styles.categoryChip}
        textStyle={styles.categoryChipText}
      >
        Scholarships
      </Chip>
      <Chip
        selected={selectedCategory === 'exam'}
        onPress={() => setSelectedCategory('exam')}
        style={styles.categoryChip}
        textStyle={styles.categoryChipText}
      >
        Exams
      </Chip>
      <Chip
        selected={selectedCategory === 'guide'}
        onPress={() => setSelectedCategory('guide')}
        style={styles.categoryChip}
        textStyle={styles.categoryChipText}
      >
        Guides
      </Chip>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Saved Items" showSettingsButton />
      {renderCategoryTabs()}
      <View style={styles.content}>
        {sections.length > 0 ? (
          <AnimatedTransition entering="fadeIn" duration={400}>
            <SectionList
              sections={sections}
              renderItem={renderBookmarkedItem}
              renderSectionHeader={renderSectionHeader}
              keyExtractor={(item) =>
                `${item.bookmark.type}-${item.bookmark.itemId}`
              }
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              stickySectionHeadersEnabled={false}
              ItemSeparatorComponent={() => (
                <View style={styles.itemSeparator} />
              )}
              SectionSeparatorComponent={() => (
                <View style={styles.sectionSeparator} />
              )}
            />
          </AnimatedTransition>
        ) : (
          <EmptyState
            title="No saved items yet"
            description="Bookmark scholarships, exams, and guides to access them quickly here."
            icon={<BookmarkX size={64} color={theme.colors.onSurfaceVariant} />}
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
  listContainer: {
    paddingBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  sectionTitle: {
    color: theme.colors.onSurface,
  },
  sectionCount: {
    color: theme.colors.onSurfaceVariant,
  },
  itemSeparator: {
    height: theme.spacing.md,
  },
  sectionSeparator: {
    height: theme.spacing.lg,
  },
  categoryTabs: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    // alignItems: 'center',
    flexDirection: 'row',
  },
  categoryChip: {
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceVariant,
  },
  categoryChipText: {
    color: theme.colors.onSurfaceVariant,
  },
});
