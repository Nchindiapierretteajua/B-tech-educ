import React from 'react';
import { StyleSheet, View, ScrollView, Image, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { Text, Button, Chip, Divider } from 'react-native-paper';
import { Calendar, School, FileText, Download } from 'lucide-react-native';
import { RootState } from '@/store';
import { useBookmark } from '@/hooks/useBookmark';
import Header from '@/components/ui/Header';
import EmptyState from '@/components/ui/EmptyState';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import theme from '@/theme';
import AnimatedTransition from '@/components/ui/AnimatedTransition';

export default function ExamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, loading } = useSelector((state: RootState) => state.exams);
  const exam = items.find(item => item.id === id);
  const { isBookmarked, toggleBookmark } = useBookmark();
  
  const bookmarked = isBookmarked(id || '', 'exam');
  
  const handleDocumentDownload = () => {
    if (exam && exam.documentUrl) {
      Linking.openURL(exam.documentUrl);
    }
  };
  
  const handleBookmarkPress = () => {
    toggleBookmark(id || '', 'exam');
  };
  
  if (loading) {
    return <LoadingIndicator message="Loading exam details..." />;
  }
  
  if (!exam) {
    return (
      <EmptyState
        title="Exam not found"
        description="The exam you're looking for doesn't exist or has been removed."
        actionLabel="Go Back to Exams"
        onActionPress={() => {}}
      />
    );
  }
  
  return (
    <View style={styles.container}>
      <Header 
        title="Exam Details" 
        showBackButton
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {exam.imageUrl && (
          <AnimatedTransition entering="fadeIn" duration={600}>
            <Image
              source={{ uri: exam.imageUrl }}
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
              {exam.name}
            </Text>
            
            <Text
              variant="titleMedium"
              style={[styles.fullName, { fontFamily: theme.typography.fonts.subheading.fontFamily }]}
            >
              {exam.fullName}
            </Text>
            
            <View style={styles.organizerContainer}>
              <School size={18} color={theme.colors.onSurfaceVariant} />
              <Text
                variant="bodyMedium"
                style={styles.organizer}
              >
                {exam.organizingBody}
              </Text>
              
              <Chip
                mode="flat"
                style={styles.levelChip}
              >
                {exam.level.charAt(0).toUpperCase() + exam.level.slice(1)}
              </Chip>
            </View>
            
            <View style={styles.dateContainer}>
              <Calendar size={18} color={theme.colors.primary} />
              <Text style={styles.date}>
                {new Date(exam.startDate).toLocaleDateString()} - {new Date(exam.endDate).toLocaleDateString()}
              </Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Description
            </Text>
            
            <Text variant="bodyMedium" style={styles.description}>
              {exam.description}
            </Text>
            
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text variant="titleSmall" style={styles.infoLabel}>
                  Registration Period
                </Text>
                <Text variant="bodyMedium" style={styles.infoValue}>
                  {new Date(exam.registrationStartDate).toLocaleDateString()} - {new Date(exam.registrationEndDate).toLocaleDateString()}
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text variant="titleSmall" style={styles.infoLabel}>
                  Registration Fee
                </Text>
                <Text variant="bodyMedium" style={styles.infoValue}>
                  {exam.fees}
                </Text>
              </View>
              
              {exam.resultDate && (
                <View style={styles.infoItem}>
                  <Text variant="titleSmall" style={styles.infoLabel}>
                    Results Expected
                  </Text>
                  <Text variant="bodyMedium" style={styles.infoValue}>
                    {new Date(exam.resultDate).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
            
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Eligibility
            </Text>
            
            {exam.eligibility.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text variant="bodyMedium" style={styles.listItemText}>
                  {item}
                </Text>
              </View>
            ))}
            
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Subjects
            </Text>
            
            {exam.subjects.map((subject, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text variant="bodyMedium" style={styles.listItemText}>
                  {subject}
                </Text>
              </View>
            ))}
            
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Examination Venues
            </Text>
            
            {exam.venues.map((venue, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text variant="bodyMedium" style={styles.listItemText}>
                  {venue}
                </Text>
              </View>
            ))}
            
            <View style={styles.actionButtonsContainer}>
              {exam.documentUrl && (
                <Button
                  mode="contained"
                  icon={() => <FileText size={18} color={theme.colors.onPrimary} />}
                  style={styles.syllabusButton}
                  contentStyle={styles.buttonContent}
                  onPress={handleDocumentDownload}
                >
                  Download Syllabus
                </Button>
              )}
              
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
    marginBottom: theme.spacing.xs,
  },
  fullName: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.md,
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  organizer: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.onSurfaceVariant,
    flex: 1,
  },
  levelChip: {
    backgroundColor: theme.colors.secondary.lighter,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  date: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.primary,
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
  infoContainer: {
    marginBottom: theme.spacing.md,
  },
  infoItem: {
    marginBottom: theme.spacing.sm,
  },
  infoLabel: {
    fontFamily: theme.typography.fonts.bodyBold.fontFamily,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
  infoValue: {
    color: theme.colors.primary.dark,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.xs,
  },
  bulletPoint: {
    marginRight: theme.spacing.sm,
    color: theme.colors.primary,
    fontSize: 16,
  },
  listItemText: {
    flex: 1,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.xl,
  },
  syllabusButton: {
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