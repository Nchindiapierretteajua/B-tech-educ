import React from 'react';
import { StyleSheet, View, ScrollView, Image, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { Text, Button, Chip, Divider } from 'react-native-paper';
import { Calendar, Info, FileText, Link as LinkIcon } from 'lucide-react-native';
import { RootState } from '@/store';
import { useBookmark } from '@/hooks/useBookmark';
import Header from '@/components/ui/Header';
import EmptyState from '@/components/ui/EmptyState';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import theme from '@/theme';
import AnimatedTransition from '@/components/ui/AnimatedTransition';

export default function ScholarshipDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, loading } = useSelector((state: RootState) => state.scholarships);
  const scholarship = items.find(item => item.id === id);
  const { isBookmarked, toggleBookmark } = useBookmark();
  
  const bookmarked = isBookmarked(id || '', 'scholarship');
  
  const handleApplyPress = () => {
    if (scholarship) {
      Linking.openURL(scholarship.applicationUrl);
    }
  };
  
  const handleBookmarkPress = () => {
    toggleBookmark(id || '', 'scholarship');
  };
  
  if (loading) {
    return <LoadingIndicator message="Loading scholarship details..." />;
  }
  
  if (!scholarship) {
    return (
      <EmptyState
        title="Scholarship not found"
        description="The scholarship you're looking for doesn't exist or has been removed."
        actionLabel="Go Back to Scholarships"
        onActionPress={() => {}}
      />
    );
  }
  
  return (
    <View style={styles.container}>
      <Header 
        title="Scholarship Details" 
        showBackButton
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {scholarship.imageUrl && (
          <AnimatedTransition entering="fadeIn" duration={600}>
            <Image
              source={{ uri: scholarship.imageUrl }}
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
              {scholarship.title}
            </Text>
            
            <View style={styles.providerContainer}>
              <Text
                variant="titleMedium"
                style={[styles.provider, { fontFamily: theme.typography.fonts.subheading.fontFamily }]}
              >
                {scholarship.provider}
              </Text>
              
              <View style={styles.typeContainer}>
                <Chip
                  mode="flat"
                  style={styles.typeChip}
                >
                  {scholarship.type.charAt(0).toUpperCase() + scholarship.type.slice(1)}
                </Chip>
                
                <Chip
                  mode="flat"
                  style={styles.countryChip}
                >
                  {scholarship.country}
                </Chip>
              </View>
            </View>
            
            <View style={styles.deadlineContainer}>
              <Calendar size={18} color={theme.colors.error.main} />
              <Text style={styles.deadline}>
                Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
              </Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Description
            </Text>
            
            <Text variant="bodyMedium" style={styles.description}>
              {scholarship.description}
            </Text>
            
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Scholarship Amount
            </Text>
            
            <Text variant="bodyMedium" style={styles.amount}>
              {scholarship.amount}
            </Text>
            
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Eligibility Requirements
            </Text>
            
            {scholarship.eligibility.map((requirement, index) => (
              <View key={index} style={styles.requirementItem}>
                <Info size={16} color={theme.colors.primary} />
                <Text variant="bodyMedium" style={styles.requirementText}>
                  {requirement}
                </Text>
              </View>
            ))}
            
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Required Documents
            </Text>
            
            {scholarship.requirements.map((document, index) => (
              <View key={index} style={styles.requirementItem}>
                <FileText size={16} color={theme.colors.secondary.main} />
                <Text variant="bodyMedium" style={styles.requirementText}>
                  {document}
                </Text>
              </View>
            ))}
            
            <View style={styles.applicationLinkContainer}>
              <LinkIcon size={16} color={theme.colors.primary} />
              <Text 
                variant="bodyMedium" 
                style={styles.applicationLink}
                onPress={handleApplyPress}
              >
                {scholarship.applicationUrl}
              </Text>
            </View>
            
            <Text variant="labelSmall" style={styles.lastUpdated}>
              Last updated: {new Date(scholarship.lastUpdated).toLocaleDateString()}
            </Text>
            
            <View style={styles.actionButtonsContainer}>
              <Button
                mode="contained"
                style={styles.applyButton}
                contentStyle={styles.buttonContent}
                onPress={handleApplyPress}
              >
                Apply Now
              </Button>
              
              <Button
                mode={bookmarked ? "contained-tonal" : "outlined"}
                style={styles.saveButton}
                contentStyle={styles.buttonContent}
                onPress={handleBookmarkPress}
              >
                {bookmarked ? "Saved" : "Save"}
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
  providerContainer: {
    marginBottom: theme.spacing.md,
  },
  provider: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.xs,
  },
  typeContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.xs,
  },
  typeChip: {
    backgroundColor: theme.colors.primary.lighter,
    marginRight: theme.spacing.sm,
  },
  countryChip: {
    backgroundColor: theme.colors.secondary.lighter,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  deadline: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.error.main,
    fontFamily: theme.typography.fonts.bodyBold.fontFamily,
  },
  divider: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.typography.fonts.subheading.fontFamily,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  description: {
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  amount: {
    fontFamily: theme.typography.fonts.bodyBold.fontFamily,
    color: theme.colors.primary.dark,
    marginBottom: theme.spacing.md,
  },
  requirementItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  requirementText: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  applicationLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  applicationLink: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  lastUpdated: {
    color: theme.colors.onSurfaceVariant,
    marginTop: theme.spacing.md,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.xl,
  },
  applyButton: {
    flex: 2,
    marginRight: theme.spacing.sm,
  },
  saveButton: {
    flex: 1,
  },
  buttonContent: {
    height: 48,
  },
});