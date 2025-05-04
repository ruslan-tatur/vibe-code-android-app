import Modal from 'react-native-modal';
import { useState, useEffect } from "react";
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text, View, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { Goal, GoalType } from '../data/types';

const styles = StyleSheet.create({
  modal: {
    margin: 20,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  inputError: {
    borderColor: '#ff4d4f',
  },
  textInput: {
    padding: 10,
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 12,
    marginBottom: 10,
  },
  typeRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#e6f7ff',
    borderColor: '#1890ff',
  },
  section: {
    marginBottom: 15,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: '#ff4d4f',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
  },
  actionButtons: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginRight: 10,
  },
  saveButton: {
    padding: 10,
    backgroundColor: '#1890ff',
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
  },
});

const GoalModal = ({
  visible,
  onClose,
  onSave,
  onDelete,
  initialGoal,
  isEditing,
}: {
  visible: boolean;
  initialGoal?: Goal;
  isEditing: boolean;
  onClose: () => void;
  onSave: (goal: Goal) => void;
  onDelete?: () => void;
}) => {
  const [name, setName] = useState(initialGoal?.name || '');
  const [type, setType] = useState<GoalType>(initialGoal?.type || 'percentage');
  const [progress, setProgress] = useState(initialGoal?.progress || 0);
  const [displayProgress, setDisplayProgress] = useState(initialGoal?.progress || 0);
  const [endDate, setEndDate] = useState<Date | undefined>(initialGoal?.endDate);
  const [startDate, setStartDate] = useState<Date | undefined>(initialGoal?.startDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    endDate?: string;
    startDate?: string;
  }>({});

  useEffect(() => {
    if (visible) {
      setName(initialGoal?.name || '');
      setType(initialGoal?.type || 'percentage');
      setProgress(initialGoal?.progress || 0);
      setEndDate(initialGoal?.endDate);
      setStartDate(initialGoal?.startDate);
      setShowDatePicker(false);
      setShowStartDatePicker(false);
      setErrors({});
    }
  }, [visible, initialGoal]);

  const validateForm = (): boolean => {
    const newErrors: { name?: string; endDate?: string; startDate?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Goal description is required';
    } else if (name.length > 50) {
      newErrors.name = 'Goal description must be 50 characters or less';
    }

    if (type === 'timeframe') {
      if (!startDate) {
        newErrors.startDate = 'Start date is required';
      }

      if (!endDate) {
        newErrors.endDate = 'End date is required for timeframe goals';
      }

      // Validate that startDate is before endDate
      if (startDate && endDate && startDate.getTime() >= endDate.getTime()
      ) {
        newErrors.startDate = 'Start date must be before end date';
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        name: name.trim(),
        progress,
        type,
        ...(type === 'timeframe' && { startDate, endDate }),
      });
      onClose();
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        <Text style={styles.title}>
          {initialGoal ? 'Edit Goal' : 'New Goal'}
        </Text>

        {/* Goal Name Input */}
        <Text style={styles.label}>Goal Description:</Text>
        <View style={[
          styles.inputContainer,
          errors.name && styles.inputError,
          { marginBottom: errors.name ? 5 : 15 }
        ]}>
          <TextInput
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) {
                setErrors({ ...errors, name: undefined });
              }
            }}
            style={styles.textInput}
            placeholder="Enter your goal"
            maxLength={50}
          />
        </View>
        {errors.name && (
          <Text style={styles.errorText}>{errors.name}</Text>
        )}

        {/* Goal Type Selection */}
        <Text style={styles.label}>Goal Type:</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'percentage' && styles.typeButtonActive,
              { marginRight: 5 }
            ]}
            onPress={() => {
              setType('percentage');
              if (errors.endDate) {
                setErrors({ ...errors, endDate: undefined });
              }
            }}
          >
            <Text>Percentage</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'timeframe' && styles.typeButtonActive,
              { marginLeft: 5 }
            ]}
            onPress={() => setType('timeframe')}
          >
            <Text>Timeframe</Text>
          </TouchableOpacity>
        </View>

        {/* Conditional Fields based on Type */}
        {type === 'percentage' && (
          <View style={styles.section}>
            <Text style={styles.label}>Initial Progress ({displayProgress}%):</Text>
            <Slider
              value={progress}
              onValueChange={value => setDisplayProgress(Math.round(value))}
              onSlidingComplete={value => {
                setProgress(Math.round(value));
                setDisplayProgress(Math.round(value));
              }}
              minimumValue={0}
              maximumValue={100}
              step={1}
              minimumTrackTintColor="#1890ff"
              maximumTrackTintColor="#d9d9d9"
            />
          </View>
        )}

        {type === 'timeframe' && (
          <View style={{ marginBottom: errors.endDate ? 5 : 15 }}>
            <Text style={styles.label}>Start Date:</Text>
            <TouchableOpacity
              onPress={() => setShowStartDatePicker(true)}
              style={[
                styles.datePicker,
                errors.startDate && styles.inputError,
                { marginBottom: errors.startDate ? 5 : 15 }
              ]}
            >
              <Text style={{ flex: 1 }}>
                {startDate ? startDate.toLocaleDateString() : "No date selected"}
              </Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate || new Date()}
                mode="date"
                display="calendar"
                onChange={(event, selectedDate) => {
                  if (event.type === "set") {
                    const currentDate = selectedDate || startDate;
                    setStartDate(currentDate);
                    if (errors.startDate) {
                      setErrors({ ...errors, startDate: undefined });
                    }
                  }
                  setShowStartDatePicker(false);
                }}
                style={{ marginLeft: 10 }}
              />
            )}
            {errors.startDate && (
              <Text style={styles.errorText}>{errors.startDate}</Text>
            )}

            <Text style={styles.label}>Target End Date:</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={[
                styles.datePicker,
                errors.endDate && styles.inputError
              ]}
            >
              <Text style={{ flex: 1 }}>
                {endDate ? endDate.toLocaleDateString() : "No date selected"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={endDate || new Date()}
                mode="date"
                display="calendar"
                onChange={(event, selectedDate) => {
                  if (event.type === "set") {
                    const currentDate = selectedDate || endDate;
                    setEndDate(currentDate);
                    if (errors.endDate) {
                      setErrors({ ...errors, endDate: undefined });
                    }
                  }
                  setShowDatePicker(false);
                }}
                minimumDate={new Date()}
                style={{ marginLeft: 10 }}
              />
            )}
            {errors.endDate && (
              <Text style={styles.errorText}>{errors.endDate}</Text>
            )}
          </View>
        )}

        {/* Buttons */}
        <View style={styles.buttonRow}>
          {isEditing && onDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={onDelete}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GoalModal;
