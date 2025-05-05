import { Text, View, LayoutChangeEvent, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import Dot from "./components/dot";
import MenuDrawer from "./components/menu-drawer";
import GoalModal from "./components/goal-modal";
import { Goal, GoalType } from './data/types';
import { calculateProgress } from "./utils/progress";
import { goalsService } from "./data/goals-service";
import { useDatabaseReady } from "./providers/database-provider";
import ProgressBar from "./components/progress-bar";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hamburger menu icon component
const HamburgerIcon = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={{ padding: 10 }}>
    <View style={{ width: 22, height: 2, backgroundColor: '#333', marginBottom: 5, borderRadius: 1 }} />
    <View style={{ width: 22, height: 2, backgroundColor: '#333', marginBottom: 5, borderRadius: 1 }} />
    <View style={{ width: 22, height: 2, backgroundColor: '#333', borderRadius: 1 }} />
  </TouchableOpacity>
);

// Generalized styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: "center",
    paddingVertical: 22,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#22223b',
    letterSpacing: 0.5,
  },
  headerSpacer: { width: 42 },
  mainArea: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignContent: 'space-around',
    margin: 20,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
  },
  bottomBar: {
    paddingVertical: 22,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
});

const createDefaultGoal = async (): Promise<Goal> => {
  return await goalsService.saveGoal({
    name: "New Goal",
    progress: 0,
    type: GoalType.Percentage,
  })
};

export default function Index() {
  const [totalDots, setTotalDots] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);

  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentGoalIndex, setCurrentGoalIndex] = useState(-1);
  const [goalEditModalVisible, setGoalEditModalVisible] = useState(false);
  const [editingGoalIndex, setEditingGoalIndex] = useState<number | null>(null);

  const dbReady = useDatabaseReady();

  // Load goals from DB on mount
  useEffect(() => {
    if (!dbReady) return;

    async function fetchGoals() {
      try {
        const loadedGoals = await goalsService.getGoals();
        let initialGoals = loadedGoals;
        if (loadedGoals.length === 0) {
          // If no goals, set a default with id
          initialGoals = [await createDefaultGoal()];
        }
        setGoals(initialGoals);

        // Try to restore last selected goal index
        const savedIndex = await AsyncStorage.getItem('currentGoalIndex');
        let index = 0;
        if (savedIndex !== null) {
          const parsed = parseInt(savedIndex, 10);
          if (!isNaN(parsed) && parsed >= 0 && parsed < initialGoals.length) {
            index = parsed;
          }
        }
        setCurrentGoalIndex(index);
      } catch (error) {
        console.error("Failed to load goals:", error);
        setGoals([await createDefaultGoal()]);
        setCurrentGoalIndex(0);
      }
    }
    fetchGoals();
  }, [dbReady]);

  // Save currentGoalIndex to AsyncStorage whenever it changes
  useEffect(() => {
    if (currentGoalIndex !== -1) {
      AsyncStorage.setItem('currentGoalIndex', currentGoalIndex.toString());
    }
  }, [currentGoalIndex]);

  if (currentGoalIndex === -1) {
    return null;
  }

  // Function to add a new goal
  const addNewGoal = () => {
    setEditingGoalIndex(null);
    setGoalEditModalVisible(true);
  };

  // Function to show edit modal for a specific goal
  const editGoal = (index: number) => {
    setEditingGoalIndex(index);
    setGoalEditModalVisible(true);
  };

  // Function to save a new or edited goal
  const saveGoal = async (goal: Goal) => {
    try {
      const newGoal = await goalsService.saveGoal(goal);

      let newGoals;
      if (editingGoalIndex !== null) {
        // Edit existing goal
        newGoals = [...goals];
        newGoals[editingGoalIndex] = newGoal;
      } else {
        // Add new goal
        newGoals = [...goals, newGoal];
        setCurrentGoalIndex(newGoals.length - 1);
      }
      setGoals(newGoals);
    } catch (error) {
      console.error("Failed to save goal:", error);
    }
  };

  // Function to delete a goal
  const deleteGoal = async (index: number) => {
    try {
      const goalToDelete = goals[index];
      if (goalToDelete.id) {
        await goalsService.deleteGoal(goalToDelete.id);
      }

      const newGoals = [...goals];
      newGoals.splice(index, 1);

      // If we deleted the current goal or a goal before it, adjust the current index
      if (newGoals.length === 0) {
        // If no goals left, reset to default with id
        setGoals([await createDefaultGoal()]);
        setCurrentGoalIndex(0);
      } else if (index <= currentGoalIndex) {
        // If we deleted the current goal or one before it
        if (currentGoalIndex >= newGoals.length) {
          // If current index is now out of bounds
          setCurrentGoalIndex(Math.max(0, newGoals.length - 1));
        } else if (index < currentGoalIndex) {
          // If we deleted a goal before the current one, shift index down
          setCurrentGoalIndex(currentGoalIndex - 1);
        }

        setGoals(newGoals);
      }

      setMenuVisible(false);
    } catch (error) {
      console.error("Failed to delete goal:", error);
    }
  };

  // Function to delete the current goal from edit modal
  const deleteCurrentGoal = () => {
    if (editingGoalIndex !== null) {
      deleteGoal(editingGoalIndex);
      setGoalEditModalVisible(false);
    }
  };

  // Each dot takes up roughly 40x40 space (20px dot + 10px margin on each side)
  const dotSize = 42;

  // Function to handle layout event
  const handleMainAreaLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    // Calculate dots based on actual dimensions
    const dotsPerRow = Math.floor(width / dotSize);
    const dotsPerColumn = Math.floor(height / dotSize);

    setTotalDots(dotsPerRow * dotsPerColumn);
  };

  const progressPercentage = calculateProgress(goals[currentGoalIndex]);

  // Calculate how many dots should be marked as completed based on percentage
  const completedDots = Math.round(totalDots * (progressPercentage / 100));

  return (
    <View style={styles.container}>
      {/* Header - with hamburger menu */}
      <View style={styles.header}>
        <HamburgerIcon onPress={() => setMenuVisible(true)} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => editGoal(currentGoalIndex)}>
            <Text style={styles.headerTitle}>{goals[currentGoalIndex].name}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Menu drawer */}
      <MenuDrawer
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        goals={goals}
        currentGoalIndex={currentGoalIndex}
        onSelectGoal={setCurrentGoalIndex}
        onAddGoal={addNewGoal}
        onDeleteGoal={deleteGoal}
      />

      <GoalModal
        visible={goalEditModalVisible}
        initialGoal={editingGoalIndex !== null ? goals[editingGoalIndex] : undefined}
        isEditing={editingGoalIndex !== null}
        onSave={saveGoal}
        onDelete={editingGoalIndex !== null ? deleteCurrentGoal : undefined}
        onClose={() => setGoalEditModalVisible(false)}
      />

      {/* Main area with green blinky dots */}
      <View
        onLayout={handleMainAreaLayout}
        style={styles.mainArea}
      >
        {Array(totalDots).fill(0).map((_, index) => (
          <Dot key={index} isCompleted={index < completedDots} />
        ))}
      </View>

      {/* Bottom line with text */}
      <ProgressBar percentage={progressPercentage} />
    </View>
  );
}
