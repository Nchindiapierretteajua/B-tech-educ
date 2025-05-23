import React, { useState } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Chip } from 'react-native-paper';
import theme from '@/theme';
import DateRangePicker from './DateRangePicker';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
  isDateRange?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  onDateRangeChange?: (start: Date | null, end: Date | null) => void;
}

const FilterChip: React.FC<FilterChipProps> = ({
  label,
  selected,
  onPress,
  style,
  isDateRange = false,
  startDate = null,
  endDate = null,
  onDateRangeChange,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handlePress = () => {
    if (isDateRange) {
      setShowDatePicker(true);
    } else {
      onPress();
    }
  };

  const getDisplayLabel = () => {
    if (!isDateRange || !selected) return label;
    if (startDate && endDate) {
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    }
    return label;
  };

  return (
    <>
      <Chip
        selected={selected}
        onPress={handlePress}
        style={[
          styles.chip,
          selected ? styles.chipSelected : styles.chipUnselected,
          style,
        ]}
        textStyle={[
          styles.text,
          selected ? styles.textSelected : styles.textUnselected,
        ]}
        showSelectedCheck={false}
        elevated
      >
        {getDisplayLabel()}
      </Chip>

      {isDateRange && (
        <DateRangePicker
          visible={showDatePicker}
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={(start, end) => {
            if (onDateRangeChange) {
              onDateRangeChange(start, end);
            }
          }}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  chip: {
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.roundness * 3,
    height: 36,
  },
  chipSelected: {
    backgroundColor: theme.colors.primary,
  },
  chipUnselected: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  text: {
    fontFamily: theme.typography.fonts.body.fontFamily,
    fontSize: theme.typography.sizes.sm,
  },
  textSelected: {
    color: theme.colors.onPrimary,
  },
  textUnselected: {
    color: theme.colors.onSurfaceVariant,
  },
});

export default FilterChip;
