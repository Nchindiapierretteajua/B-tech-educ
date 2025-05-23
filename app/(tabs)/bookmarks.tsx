import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { RootState } from '@/store';
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

type BookmarkedItem = {
  bookmark: Bookmark;
  details: Scholarship | Exam | Guide;
};

export default function BookmarksScreen() {
  const router = useRouter();
  const bookmarks = useSelector((state: RootState) => state.bookmarks.items);
  const scholarships = useSelector(
    (state: RootState) => state.scholarships.items
  );
  const exams = useSelector((state: RootState) => state.exams.items);
  const guides = useSelector((state: RootState) => state.guides.items);

  // Create a merged array of bookmarked items with their details
  const bookmarkedItems = bookmarks
    .map((bookmark) => {
      if (bookmark.type === 'scholarship') {
        const scholarship = scholarships.find((s) => s.id === bookmark.id);
        if (scholarship) {
          return {
            bookmark,
            details: scholarship,
          } as BookmarkedItem;
        }
      } else if (bookmark.type === 'exam') {
        const exam = exams.find((e) => e.id === bookmark.id);
        if (exam) {
          return {
            bookmark,
            details: exam,
          } as BookmarkedItem;
        }
      } else if (bookmark.type === 'guide') {
        const guide = guides.find((g) => g.id === bookmark.id);
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

  // Sort bookmarks by most recent first
  const sortedBookmarks = [...bookmarkedItems].sort(
    (a, b) =>
      new Date(b.bookmark.createdAt).getTime() -
      new Date(a.bookmark.createdAt).getTime()
  );

  const handleItemPress = (item: BookmarkedItem) => {
    if (item.bookmark.type === 'scholarship') {
      router.push({
        pathname: '/scholarship/[id]',
        params: { id: item.bookmark.id },
      });
    } else if (item.bookmark.type === 'exam') {
      router.push({
        pathname: '/exam/[id]',
        params: { id: item.bookmark.id },
      });
    } else if (item.bookmark.type === 'guide') {
      router.push({
        pathname: '/guide/[id]',
        params: { id: item.bookmark.id },
      });
    }
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

    if (item.bookmark.type === 'scholarship') {
      const scholarship = details as Scholarship;
      caption = `Deadline: ${new Date(
        scholarship.deadline
      ).toLocaleDateString()}`;
    } else if (item.bookmark.type === 'exam') {
      const exam = details as Exam;
      caption = `Date: ${new Date(
        exam.registrationDeadline
      ).toLocaleDateString()}`;
    } else if (item.bookmark.type === 'guide') {
      const guide = details as Guide;
      caption = `${guide.category}`;
    }

    return (
      <Card
        id={item.bookmark.id}
        type={item.bookmark.type}
        title={details.title}
        description={details.description}
        imageUrl={details.imageUrl}
        caption={caption}
        onPress={() => handleItemPress(item)}
        index={index}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Saved Items" showSettingsButton />

      <View style={styles.content}>
        {sortedBookmarks.length > 0 ? (
          <AnimatedTransition entering="fadeIn" duration={400}>
            <FlatList
              data={sortedBookmarks}
              renderItem={renderBookmarkedItem}
              keyExtractor={(item) =>
                `${item.bookmark.type}-${item.bookmark.id}`
              }
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
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
});
