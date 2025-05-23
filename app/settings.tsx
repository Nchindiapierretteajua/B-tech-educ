import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  List,
  Switch,
  Text,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import Header from '@/components/ui/Header';
import theme from '@/theme';
import AnimatedTransition from '@/components/ui/AnimatedTransition';
import { usePreferences } from '@/hooks/usePreferences';

export default function SettingsScreen() {
  const router = useRouter();
  const { preferences, isLoading, updatePreference } = usePreferences();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Settings"
        showBackButton
        onBackPress={() => router.back()}
      />

      <ScrollView style={styles.content}>
        <AnimatedTransition entering="fadeIn" duration={400} delay={100}>
          <List.Section>
            <List.Subheader style={styles.sectionTitle}>
              Preferences
            </List.Subheader>
            <List.Item
              title="Notifications"
              description="Receive updates about exams and scholarships"
              left={(props) => <List.Icon {...props} icon="bell-outline" />}
              right={() => (
                <Switch
                  value={preferences.notifications}
                  onValueChange={(value) =>
                    updatePreference('notifications', value)
                  }
                  color={theme.colors.primary}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Dark Mode"
              description="Switch between light and dark theme"
              left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => (
                <Switch
                  value={preferences.darkMode}
                  onValueChange={(value) => updatePreference('darkMode', value)}
                  color={theme.colors.primary}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Offline Mode"
              description="Save content for offline access"
              left={(props) => (
                <List.Icon {...props} icon="cloud-off-outline" />
              )}
              right={() => (
                <Switch
                  value={preferences.offlineMode}
                  onValueChange={(value) =>
                    updatePreference('offlineMode', value)
                  }
                  color={theme.colors.primary}
                />
              )}
            />
          </List.Section>

          <List.Section>
            <List.Subheader style={styles.sectionTitle}>About</List.Subheader>
            <List.Item
              title="Version"
              description="1.0.0"
              left={(props) => (
                <List.Icon {...props} icon="information-outline" />
              )}
            />
            <Divider />
            <List.Item
              title="Terms of Service"
              left={(props) => (
                <List.Icon {...props} icon="file-document-outline" />
              )}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Privacy Policy"
              left={(props) => (
                <List.Icon {...props} icon="shield-account-outline" />
              )}
              onPress={() => {}}
            />
          </List.Section>
        </AnimatedTransition>
      </ScrollView>
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
  },
  sectionTitle: {
    fontFamily: theme.fonts.regular.fontFamily,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.primary,
    paddingTop: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
