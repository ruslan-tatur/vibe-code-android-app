import Modal from 'react-native-modal';
import { useState, useEffect } from "react";
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text, View, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { Goal, GoalType } from '../data/types';
import DeleteConfirmationModal from './delete-confirmation-modal';

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 8,
    minWidth: 320,
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#22223b',
    marginBottom: 24,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  label: {
    marginBottom: 6,
    color: '#22223b',
    fontWeight: '600',
    fontSize: 15,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 7,
    backgroundColor: '#f7f9fc',
  },
  inputError: {
    borderColor: '#ff4d4f',
  },
  textInput: {
    padding: 12,
    fontSize: 16,
    color: '#22223b',
    backgroundColor: 'transparent',
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 2,
  },
  typeRow: {
    flexDirection: 'row',
    marginBottom: 18,
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 7,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#e6f7ff',
    borderColor: '#30bced',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 7,
    padding: 12,
    backgroundColor: '#f7f9fc',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    alignItems: 'center',
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#ff4d4f',
    borderRadius: 7,
    marginRight: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    marginLeft: 'auto',
    gap: 8,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#f0f0f0',
    borderRadius: 7,
    marginRight: 6,
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#30bced',
    borderRadius: 7,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
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
  const [type, setType] = useState<GoalType>(initialGoal?.type || GoalType.Percentage);
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (visible) {
      setName(initialGoal?.name || '');
      setType(initialGoal?.type || GoalType.Percentage);
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
        id: initialGoal?.id,
        name: name.trim(),
        progress,
        type,
        ...(type === 'timeframe' && { startDate, endDate }),
      });
      onClose();
    }
  };

  return (
    <>
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
                type === GoalType.Percentage && styles.typeButtonActive,
                { marginRight: 5 }
              ]}
              onPress={() => {
                setType(GoalType.Percentage);
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
              onPress={() => setType(GoalType.Timeframe)}
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
                onPress={() => setShowDeleteConfirm(true)}
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
      {isEditing && onDelete && (
        <DeleteConfirmationModal
          visible={showDeleteConfirm}
          title="Delete Goal"
          message={`Are you sure you want to delete "${initialGoal?.name}"?`}
          onDelete={() => {
            onDelete();
            setShowDeleteConfirm(false);
            onClose();
          }}
          onCancel={() => setShowDeleteConfirm(false)}
          deleteLabel="Delete Goal"
          cancelLabel="Cancel"
        />
      )}
    </>
  );
};

export default GoalModal;
