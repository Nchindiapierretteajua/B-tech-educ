import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SearchX } from 'lucide-react-native';
import AnimatedTransition from './AnimatedTransition';
import theme from '@/theme';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results found',
  description = `Try adjusting your search or filters to find what you're looking for.`,
  icon,
  actionLabel,
  onActionPress,
  style,
}) => {
  return (
    <AnimatedTransition entering="fadeIn" style={[styles.container, style]}>
      <View style={styles.content}>
        {icon || <SearchX size={64} color={theme.colors.onSurfaceVariant} />}

        <Text
          variant="headlineSmall"
          style={[
            styles.title,
            { fontFamily: theme.typography.fonts.heading.fontFamily },
          ]}
        >
          {title}
        </Text>

        <Text variant="bodyMedium" style={styles.description}>
          {description}
        </Text>

        {actionLabel && onActionPress && (
          <Button
            mode="contained"
            onPress={onActionPress}
            style={styles.button}
          >
            {actionLabel}
          </Button>
        )}
      </View>
    </AnimatedTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.xl,
  },
  button: {
    marginTop: theme.spacing.md,
  },
});

export default EmptyState;
