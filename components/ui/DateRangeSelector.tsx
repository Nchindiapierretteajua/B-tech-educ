import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import theme from '@/theme';

interface DateRangeSelectorProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateRangeChange: (start: Date | null, end: Date | null) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  onDateRangeChange,
}) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleStartDateChange = (event: any, date?: Date) => {
    setShowStartPicker(false);
    if (date) {
      onDateRangeChange(date, endDate);
    }
  };

  const handleEndDateChange = (event: any, date?: Date) => {
    setShowEndPicker(false);
    if (date) {
      onDateRangeChange(startDate, date);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={styles.dateLabel}>Start Date</Text>
          <Text style={styles.dateValue}>
            {startDate ? startDate.toLocaleDateString() : 'Select'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={styles.dateLabel}>End Date</Text>
          <Text style={styles.dateValue}>
            {endDate ? endDate.toLocaleDateString() : 'Select'}
          </Text>
        </TouchableOpacity>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          onChange={handleStartDateChange}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          minimumDate={startDate || undefined}
          onChange={handleEndDateChange}
        />
      )}

      {(startDate || endDate) && (
        <Button
          mode="outlined"
          onPress={() => onDateRangeChange(null, null)}
          style={styles.clearButton}
        >
          Clear Dates
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  dateButton: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.roundness,
  },
  dateLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.onSurface,
  },
  clearButton: {
    marginTop: theme.spacing.sm,
  },
});

export default DateRangeSelector;
