import React from 'react';
import { StyleSheet, View, StatusBar, ViewStyle } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ArrowLeft, Settings } from 'lucide-react-native';
import theme from '@/theme';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showSettingsButton?: boolean;
  onBackPress?: () => void;
  style?: ViewStyle;
  bgColor?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showSettingsButton = false,
  onBackPress,
  style,
  bgColor = theme.colors.surface,
}) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }, style]}>
      <View style={styles.content}>
        {showBackButton && (
          <IconButton
            icon={() => <ArrowLeft size={24} color={theme.colors.onSurface} />}
            onPress={handleBackPress}
            style={styles.backButton}
          />
        )}

        <Text
          variant="headlineSmall"
          style={[
            styles.title,
            { fontFamily: theme.typography.fonts.heading.fontFamily },
            showBackButton && styles.titleWithBack,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {showSettingsButton && (
          <IconButton
            icon={() => <Settings size={24} color={theme.colors.onSurface} />}
            onPress={handleSettingsPress}
            style={styles.settingsButton}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight || 48,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginLeft: -8,
  },
  title: {
    flex: 1,
    color: theme.colors.onSurface,
  },
  titleWithBack: {
    marginLeft: theme.spacing.sm,
  },
  settingsButton: {
    marginRight: -8,
  },
});

export default Header;
