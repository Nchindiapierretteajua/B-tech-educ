import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Text, Button, Surface, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
  const [showPicker, setShowPicker] = useState(false);
  const [activePicker, setActivePicker] = useState<'start' | 'end' | null>(
    null
  );
  const [tempStartDate, setTempStartDate] = useState<Date | null>(startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(endDate);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setShowPicker(true);
  };

  const handleDateChange = (event: any, date: Date | undefined) => {
    if (date) {
      if (activePicker === 'start') {
        setTempStartDate(date);
        if (tempEndDate && date > tempEndDate) {
          setTempEndDate(date);
        }
      } else {
        setTempEndDate(date);
      }
    }
    setActivePicker(null);
  };

  const handleApply = () => {
    onDateRangeChange(tempStartDate, tempEndDate);
    setShowPicker(false);
  };

  const handleClear = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    onDateRangeChange(null, null);
    setShowPicker(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Surface style={styles.container} elevation={2}>
          <TouchableOpacity
            style={styles.selector}
            onPress={handlePress}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="calendar-range"
              size={24}
              color={theme.colors.primary}
            />
            <View style={styles.dateContainer}>
              <Text style={styles.label}>Date Range</Text>
              <Text style={styles.dateText}>
                {startDate && endDate
                  ? `${formatDate(startDate)} - ${formatDate(endDate)}`
                  : 'Select date range'}
              </Text>
            </View>
            {(startDate || endDate) && (
              <IconButton
                icon="close"
                size={20}
                onPress={handleClear}
                style={styles.clearButton}
              />
            )}
          </TouchableOpacity>
        </Surface>
      </Animated.View>

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <Surface style={styles.modalContent} elevation={4}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date Range</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setShowPicker(false)}
              />
            </View>

            <View style={styles.dateButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  activePicker === 'start' && styles.activeDateButton,
                ]}
                onPress={() => setActivePicker('start')}
              >
                <Text style={styles.dateLabel}>Start Date</Text>
                <Text style={styles.dateValue}>
                  {formatDate(tempStartDate) || 'Select'}
                </Text>
              </TouchableOpacity>

              <View style={styles.dateSeparator} />

              <TouchableOpacity
                style={[
                  styles.dateButton,
                  activePicker === 'end' && styles.activeDateButton,
                ]}
                onPress={() => setActivePicker('end')}
              >
                <Text style={styles.dateLabel}>End Date</Text>
                <Text style={styles.dateValue}>
                  {formatDate(tempEndDate) || 'Select'}
                </Text>
              </TouchableOpacity>
            </View>

            {activePicker && (
              <DateTimePicker
                value={
                  activePicker === 'start'
                    ? tempStartDate || new Date()
                    : tempEndDate || new Date()
                }
                mode="date"
                minimumDate={
                  activePicker === 'end'
                    ? tempStartDate || undefined
                    : undefined
                }
                onChange={handleDateChange}
              />
            )}

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handleClear}
                style={styles.button}
                labelStyle={styles.buttonLabel}
              >
                Clear
              </Button>
              <Button
                mode="contained"
                onPress={handleApply}
                style={styles.button}
                labelStyle={styles.buttonLabel}
              >
                Apply
              </Button>
            </View>
          </Surface>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.roundness * 2,
    overflow: 'hidden',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  dateContainer: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 2,
  },
  dateText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.body.fontFamily,
  },
  clearButton: {
    margin: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness * 2,
    width: '90%',
    maxWidth: 400,
    padding: theme.spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fonts.heading.fontFamily,
    color: theme.colors.onSurface,
  },
  dateButtonsContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  dateButton: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.roundness,
  },
  activeDateButton: {
    backgroundColor: theme.colors.primaryContainer,
  },
  dateSeparator: {
    width: theme.spacing.md,
  },
  dateLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.xs,
  },
  dateValue: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.body.fontFamily,
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
  buttonLabel: {
    fontSize: theme.typography.sizes.sm,
  },
});

export default DateRangeSelector;
