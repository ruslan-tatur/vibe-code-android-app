import { useState } from "react";
import { Text, View, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import Modal from 'react-native-modal';
import { Goal } from "../data/types";
import { calculateProgress } from "../utils/progress";
import DeleteConfirmationModal from './delete-confirmation-modal';

const styles = StyleSheet.create({
  modal: { margin: 0 },
  container: { flex: 1, flexDirection: 'row' },
  drawer: {
    width: '75%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderRightWidth: 0.5,
    borderColor: '#e5e7eb',
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f7f9fc',
    borderTopRightRadius: 18,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#22223b',
    letterSpacing: 0.5,
  },
  scrollView: { flex: 1 },
  goalItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f4f6fa',
    backgroundColor: 'white',
  },
  goalItemActive: {
    backgroundColor: '#e6f7ff',
  },
  confirmDeleteContainer: {
    padding: 18,
    backgroundColor: '#fff0f0',
    borderRadius: 10,
    margin: 8,
    borderWidth: 1,
    borderColor: '#ff4d4f',
  },
  confirmDeleteText: {
    fontSize: 15,
    marginBottom: 12,
    color: '#ff4d4f',
    fontWeight: '600',
  },
  confirmDeleteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 7,
    marginRight: 8,
  },
  confirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ff4d4f',
    borderRadius: 7,
  },
  confirmButtonText: { color: 'white', fontWeight: '600' },
  goalRow: { flexDirection: 'row', alignItems: 'center' },
  goalInfo: { flex: 1, padding: 18 },
  goalName: { fontSize: 17, fontWeight: '600', color: '#22223b' },
  goalProgress: { fontSize: 13, color: '#30bced', fontWeight: '500', marginTop: 2 },
  deleteButton: { padding: 18 },
  deleteButtonText: { color: '#ff4d4f', fontWeight: '600' },
  addGoalButton: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
    borderBottomRightRadius: 18,
  },
  addGoalText: { color: '#30bced', fontSize: 17, fontWeight: '700' },
  overlay: { flex: 1 },
  deleteSheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  deleteSheetTitle: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: '#22223b'
  },
  deleteSheetMessage: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  deleteSheetDeleteButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ff4d4f',
  },
  deleteSheetDeleteButtonText: {
    color: '#ff3b30',
    fontWeight: '700',
    fontSize: 17,
    textAlign: 'center'
  },
  deleteSheetCancelButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
  },
  deleteSheetCancelButtonText: {
    color: '#007aff',
    fontWeight: '600',
    fontSize: 17,
    textAlign: 'center'
  },
});

const MenuDrawer = ({
  visible,
  onClose,
  goals,
  currentGoalIndex,
  onSelectGoal,
  onAddGoal,
  onDeleteGoal
}: {
  visible: boolean;
  onClose: () => void;
  goals: Goal[];
  currentGoalIndex: number;
  onSelectGoal: (index: number) => void;
  onAddGoal: () => void;
  onDeleteGoal: (index: number) => void;
}) => {
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  return (
    <>
      <Modal
        isVisible={visible}
        onBackdropPress={onClose}
        onBackButtonPress={onClose}
        animationIn="slideInLeft"
        animationOut="slideOutLeft"
        style={styles.modal}
      >
        <View style={styles.container}>
          <View style={styles.drawer}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Your Goals</Text>
            </View>
            <ScrollView style={styles.scrollView}>
              {goals.map((goal, index) => (
                <View
                  key={index}
                  style={[
                    styles.goalItem,
                    currentGoalIndex === index && styles.goalItemActive,
                  ]}
                >
                  <View style={styles.goalRow}>
                    <TouchableOpacity
                      style={styles.goalInfo}
                      onPress={() => {
                        onSelectGoal(index);
                        onClose();
                      }}
                    >
                      <Text style={styles.goalName}>{goal.name}</Text>
                      <Text style={styles.goalProgress}>
                        Progress: {calculateProgress(goal)}%
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => setConfirmDelete(index)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.addGoalButton}
              onPress={() => {
                onAddGoal();
                onClose();
              }}
            >
              <Text style={styles.addGoalText}>+ Add New Goal</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.overlay} onPress={onClose} />
        </View>
      </Modal>

      {/* Apple-style Delete Confirmation Modal */}
      <DeleteConfirmationModal
        visible={confirmDelete !== null}
        title="Delete Goal"
        message={
          confirmDelete !== null
            ? `Are you sure you want to delete "${goals[confirmDelete].name}"?`
            : "Are you sure you want to delete this goal?"
        }
        onDelete={() => {
          if (confirmDelete !== null) {
            onDeleteGoal(confirmDelete);
            setConfirmDelete(null);
          }
        }}
        onCancel={() => setConfirmDelete(null)}
        deleteLabel="Delete Goal"
        cancelLabel="Cancel"
      />
    </>
  );
};

export default MenuDrawer
