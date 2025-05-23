import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';
import { Search } from 'lucide-react-native';
import theme from '@/theme';
import AnimatedTransition from './AnimatedTransition';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: ViewStyle;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search',
  value,
  onChangeText,
  style,
  autoFocus = false,
}) => {
  const paperTheme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <AnimatedTransition entering="fadeIn" duration={400} style={[styles.container, style]}>
      <Searchbar
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.searchBar,
          isFocused && styles.searchBarFocused,
        ]}
        inputStyle={styles.input}
        iconColor={paperTheme.colors.onSurfaceVariant}
        placeholderTextColor={paperTheme.colors.onSurfaceVariant}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        icon={() => <Search size={20} color={paperTheme.colors.onSurfaceVariant} />}
        autoFocus={autoFocus}
      />
    </AnimatedTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  searchBar: {
    borderRadius: theme.roundness * 3,
    backgroundColor: theme.colors.surfaceVariant,
    elevation: 0,
    height: 48,
  },
  searchBarFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  input: {
    fontFamily: theme.typography.fonts.body.fontFamily,
    fontSize: theme.typography.sizes.md,
  },
});

export default SearchBar;