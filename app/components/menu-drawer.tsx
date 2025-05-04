import { useState } from "react";
import { Text, View, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import Modal from 'react-native-modal';
import { Goal } from "../data/types";
import { calculateProgress } from "../utils/progress";

const styles = StyleSheet.create({
  modal: { margin: 0 },
  container: { flex: 1, flexDirection: 'row' },
  drawer: {
    width: '70%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerText: { fontSize: 22, fontWeight: 'bold' },
  scrollView: { flex: 1 },
  goalItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  goalItemActive: {
    backgroundColor: '#f0f0f0',
  },
  confirmDeleteContainer: { padding: 15 },
  confirmDeleteText: { fontSize: 14, marginBottom: 10 },
  confirmDeleteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  confirmButton: {
    padding: 8,
    backgroundColor: '#ff4d4f',
    borderRadius: 4,
  },
  confirmButtonText: { color: 'white' },
  goalRow: { flexDirection: 'row', alignItems: 'center' },
  goalInfo: { flex: 1, padding: 15 },
  goalName: { fontSize: 16 },
  goalProgress: { fontSize: 12, color: 'gray' },
  deleteButton: { padding: 15 },
  deleteButtonText: { color: 'red' },
  addGoalButton: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  addGoalText: { color: 'blue', fontSize: 16 },
  overlay: { flex: 1 },
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
                {confirmDelete === index ? (
                  <View style={styles.confirmDeleteContainer}>
                    <Text style={styles.confirmDeleteText}>
                      Delete "{goal.name}"?
                    </Text>
                    <View style={styles.confirmDeleteActions}>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setConfirmDelete(null)}
                      >
                        <Text>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={() => {
                          onDeleteGoal(index);
                          setConfirmDelete(null);
                        }}
                      >
                        <Text style={styles.confirmButtonText}>Confirm</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
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
                )}
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
  );
};

export default MenuDrawer
