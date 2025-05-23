import React, { useState } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import theme from '@/theme';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateRangeChange: (start: Date | null, end: Date | null) => void;
  onClose: () => void;
  visible: boolean;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateRangeChange,
  onClose,
  visible,
}) => {
  const [tempStartDate, setTempStartDate] = useState<Date | null>(startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(endDate);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleApply = () => {
    onDateRangeChange(tempStartDate, tempEndDate);
    onClose();
  };

  const handleClear = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    onDateRangeChange(null, null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Date Range</Text>

          <View style={styles.dateContainer}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={styles.dateLabel}>Start Date</Text>
              <Text style={styles.dateValue}>
                {tempStartDate ? tempStartDate.toLocaleDateString() : 'Select'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={styles.dateLabel}>End Date</Text>
              <Text style={styles.dateValue}>
                {tempEndDate ? tempEndDate.toLocaleDateString() : 'Select'}
              </Text>
            </TouchableOpacity>
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={tempStartDate || new Date()}
              mode="date"
              onChange={(event, date) => {
                setShowStartPicker(false);
                if (date) setTempStartDate(date);
              }}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={tempEndDate || new Date()}
              mode="date"
              minimumDate={tempStartDate || undefined}
              onChange={(event, date) => {
                setShowEndPicker(false);
                if (date) setTempEndDate(date);
              }}
            />
          )}

          <View style={styles.buttonContainer}>
            <Button mode="outlined" onPress={handleClear} style={styles.button}>
              Clear
            </Button>
            <Button
              mode="contained"
              onPress={handleApply}
              style={styles.button}
            >
              Apply
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness * 2,
    padding: theme.spacing.lg,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: theme.typography.sizes.lg,
    // fontFamily: theme.typography.fonts.title.fontFamily,
    fontFamily: theme.typography.fonts.heading.fontFamily,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  dateContainer: {
    marginBottom: theme.spacing.lg,
  },
  dateButton: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.roundness,
    marginBottom: theme.spacing.sm,
  },
  dateLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.xs,
  },
  dateValue: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.onSurface,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  button: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
});

export default DateRangePicker;
