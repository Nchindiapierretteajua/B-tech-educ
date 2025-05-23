import React from 'react';
import { StyleSheet, ViewStyle, TouchableOpacity, View } from 'react-native';
import { Card as PaperCard, Text } from 'react-native-paper';
import { Heart } from 'lucide-react-native';
import { useBookmark } from '@/hooks/useBookmark';
import theme from '@/theme';
import AnimatedTransition from './AnimatedTransition';

interface CardProps {
  id: string;
  type: 'scholarship' | 'exam' | 'guide';
  title: string;
  description: string;
  imageUrl?: string;
  caption?: string;
  onPress: () => void;
  style?: ViewStyle;
  index?: number; // For staggered animation
}

const Card: React.FC<CardProps> = ({
  id,
  type,
  title,
  description,
  imageUrl,
  caption,
  onPress,
  style,
  index = 0,
}) => {
  const { isBookmarked, toggleBookmark } = useBookmark();
  const bookmarked = isBookmarked(id, type);

  const handleBookmarkPress = (e: any) => {
    e.stopPropagation();
    toggleBookmark(id, type);
  };

  // Calculate staggered animation delay
  const animationDelay = 100 + index * 100; // 100ms delay for first item, then 100ms increment per item

  const containerStyle = {
    ...styles.container,
    ...(style || {}),
  };

  return (
    <AnimatedTransition
      entering="fadeIn"
      duration={400}
      delay={animationDelay}
      style={containerStyle}
    >
      <PaperCard mode="elevated" style={styles.card} onPress={onPress}>
        {imageUrl && (
          <PaperCard.Cover source={{ uri: imageUrl }} style={styles.cover} />
        )}
        <PaperCard.Content style={styles.content}>
          <View style={styles.titleContainer}>
            <Text
              variant="titleMedium"
              style={[
                styles.title,
                { fontFamily: theme.typography.fonts.subheading.fontFamily },
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
            <TouchableOpacity
              onPress={handleBookmarkPress}
              style={styles.bookmarkButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Heart
                size={22}
                color={
                  bookmarked
                    ? theme.colors.primary
                    : theme.colors.onSurfaceVariant
                }
                fill={bookmarked ? theme.colors.primary : 'transparent'}
              />
            </TouchableOpacity>
          </View>

          <Text
            variant="bodySmall"
            numberOfLines={2}
            style={styles.description}
            ellipsizeMode="tail"
          >
            {description}
          </Text>

          {caption && (
            <Text
              variant="labelSmall"
              style={styles.caption}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {caption}
            </Text>
          )}
        </PaperCard.Content>
      </PaperCard>
    </AnimatedTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    elevation: 2,
  },
  cover: {
    height: 140,
    borderTopLeftRadius: theme.roundness,
    borderTopRightRadius: theme.roundness,
  },
  content: {
    paddingVertical: theme.spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  title: {
    flex: 1,
    marginRight: theme.spacing.md,
    color: theme.colors.onSurface,
  },
  bookmarkButton: {
    padding: theme.spacing.xs,
    marginTop: -theme.spacing.xs,
    marginRight: -theme.spacing.xs,
  },
  description: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.onSurfaceVariant,
    lineHeight: theme.typography.lineHeights.body * theme.typography.sizes.sm,
  },
  caption: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fonts.bodyBold.fontFamily,
  },
});

export default Card;
