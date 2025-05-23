import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { Text, Button, Divider, ProgressBar, Card } from 'react-native-paper';
import { BookOpen, Users, Clock } from 'lucide-react-native';
import { RootState } from '@/store';
import { useBookmark } from '@/hooks/useBookmark';
import Header from '@/components/ui/Header';
import EmptyState from '@/components/ui/EmptyState';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import theme from '@/theme';
import AnimatedTransition from '@/components/ui/AnimatedTransition';

export default function GuideDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, loading } = useSelector((state: RootState) => state.guides);
  const guide = items.find(item => item.id === id);
  const { isBookmarked, toggleBookmark } = useBookmark();
  
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = guide?.steps.length || 0;
  const progress = totalSteps > 0 ? currentStep / totalSteps : 0;
  
  const bookmarked = isBookmarked(id || '', 'guide');
  
  const handleNextStep = () => {
    if (guide && currentStep < guide.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleBookmarkPress = () => {
    toggleBookmark(id || '', 'guide');
  };
  
  if (loading) {
    return <LoadingIndicator message="Loading guide..." />;
  }
  
  if (!guide) {
    return (
      <EmptyState
        title="Guide not found"
        description="The guide you're looking for doesn't exist or has been removed."
        actionLabel="Go Back to Guides"
        onActionPress={() => {}}
      />
    );
  }
  
  const currentStepData = guide.steps[currentStep];
  
  return (
    <View style={styles.container}>
      <Header 
        title="Educational Guide" 
        showBackButton
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {guide.imageUrl && (
          <AnimatedTransition entering="fadeIn" duration={600}>
            <Image
              source={{ uri: guide.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </AnimatedTransition>
        )}
        
        <View style={styles.content}>
          <AnimatedTransition entering="fadeIn" duration={400} delay={100}>
            <Text
              variant="headlineMedium"
              style={[styles.title, { fontFamily: theme.typography.fonts.heading.fontFamily }]}
            >
              {guide.title}
            </Text>
            
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Users size={16} color={theme.colors.onSurfaceVariant} />
                <Text variant="bodySmall" style={styles.metaText}>
                  For {guide.audience === 'all' ? 'Everyone' : guide.audience}s
                </Text>
              </View>
              
              <View style={styles.metaItem}>
                <BookOpen size={16} color={theme.colors.onSurfaceVariant} />
                <Text variant="bodySmall" style={styles.metaText}>
                  {guide.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Text>
              </View>
              
              <View style={styles.metaItem}>
                <Clock size={16} color={theme.colors.onSurfaceVariant} />
                <Text variant="bodySmall" style={styles.metaText}>
                  Updated: {new Date(guide.lastUpdated).toLocaleDateString()}
                </Text>
              </View>
            </View>
            
            <Text variant="bodyMedium" style={styles.description}>
              {guide.description}
            </Text>
            
            <Button
              mode={bookmarked ? "contained-tonal" : "outlined"}
              style={styles.saveButton}
              onPress={handleBookmarkPress}
            >
              {bookmarked ? "Saved" : "Save Guide"}
            </Button>
            
            <Divider style={styles.divider} />
            
            <View style={styles.progressContainer}>
              <Text variant="titleMedium" style={styles.progressText}>
                Step {currentStep + 1} of {totalSteps}
              </Text>
              <ProgressBar 
                progress={progress} 
                color={theme.colors.primary}
                style={styles.progressBar}
              />
            </View>
          </AnimatedTransition>
          
          <AnimatedTransition key={currentStep} entering="fadeIn" duration={400}>
            <Card style={styles.stepCard}>
              <Card.Content>
                <Text
                  variant="titleLarge"
                  style={[styles.stepTitle, { fontFamily: theme.typography.fonts.subheading.fontFamily }]}
                >
                  {currentStepData.title}
                </Text>
                
                {currentStepData.imageUrl && (
                  <Image
                    source={{ uri: currentStepData.imageUrl }}
                    style={styles.stepImage}
                    resizeMode="cover"
                  />
                )}
                
                <Text variant="bodyMedium" style={styles.stepDescription}>
                  {currentStepData.description}
                </Text>
              </Card.Content>
            </Card>
            
            <View style={styles.navigationContainer}>
              <Button
                mode="outlined"
                onPress={handlePreviousStep}
                disabled={currentStep === 0}
                style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
              >
                Previous
              </Button>
              
              <Button
                mode="contained"
                onPress={handleNextStep}
                disabled={currentStep === totalSteps - 1}
                style={[styles.navButton, currentStep === totalSteps - 1 && styles.navButtonDisabled]}
              >
                Next
              </Button>
            </View>
          </AnimatedTransition>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: theme.spacing.xxl,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  metaText: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.onSurfaceVariant,
  },
  description: {
    marginBottom: theme.spacing.md,
  },
  saveButton: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  divider: {
    marginBottom: theme.spacing.lg,
  },
  progressContainer: {
    marginBottom: theme.spacing.lg,
  },
  progressText: {
    marginBottom: theme.spacing.sm,
    fontFamily: theme.typography.fonts.subheading.fontFamily,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  stepCard: {
    marginBottom: theme.spacing.lg,
  },
  stepTitle: {
    marginBottom: theme.spacing.md,
  },
  stepImage: {
    width: '100%',
    height: 180,
    borderRadius: theme.roundness,
    marginBottom: theme.spacing.md,
  },
  stepDescription: {
    lineHeight: 24,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  navButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
});