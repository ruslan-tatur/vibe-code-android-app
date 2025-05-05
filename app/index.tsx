import { Text, View, LayoutChangeEvent, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import Dot from "./components/dot";
import MenuDrawer from "./components/menu-drawer";
import GoalModal from "./components/goal-modal";
import { Goal } from './data/types';
import { calculateProgress } from "./utils/progress";
import { goalsService } from "./data/goals-service";
import { useDatabaseReady } from "./providers/database-provider";

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
    backgroundColor: '#f7f9fc',
  },
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: "center",
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  headerSpacer: { width: 42 },
  mainArea: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignContent: 'space-around',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
    padding: 8,
  },
  bottomBar: {
    padding: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  progressBarContainer: {
    width: '80%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#34c759',
    borderRadius: 4
  },
  progressText: {
    marginLeft: 10,
    color: '#333',
    fontWeight: '500'
  }
});

// Extracted ProgressBar component
const ProgressBar = ({ percentage }: { percentage: number }) => (
  <View style={styles.progressBarContainer}>
    <View style={[styles.progressBar, { width: `${percentage}%` }]} />
  </View>
);

export default function Index() {
  const [totalDots, setTotalDots] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);

  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  const [goalEditModalVisible, setGoalEditModalVisible] = useState(false);
  const [editingGoalIndex, setEditingGoalIndex] = useState<number | null>(null);

  const dbReady = useDatabaseReady();

  // Get current goal data
  const currentGoal = goals[currentGoalIndex];

  // Calculate progress percentage based on goal type
  let progressPercentage = calculateProgress(currentGoal);

  // Load goals from DB on mount
  useEffect(() => {
    if (!dbReady) return;

    async function fetchGoals() {
      try {
        const loadedGoals = await goalsService.getGoals();
        if (loadedGoals.length > 0) {
          setGoals(loadedGoals);
        } else {
          // If no goals, set a default
          setGoals([{ name: "New Goal", progress: 0, type: 'percentage' }]);
        }
      } catch (error) {
        console.error("Failed to load goals:", error);
        setGoals([{ name: "New Goal", progress: 0, type: 'percentage' }]);
      }
    }
    fetchGoals();
  }, [dbReady]);

  // Function to show edit modal for a specific goal
  const editGoal = (index: number) => {
    setEditingGoalIndex(index);
    setGoalEditModalVisible(true);
  };

  // Function to add a new goal
  const addNewGoal = () => {
    setEditingGoalIndex(null);
    setGoalEditModalVisible(true);
  };

  // Function to save a new or edited goal
  const saveGoal = async (goal: Goal) => {
    try {
      const id = await goalsService.saveGoal(goal);
      const newGoal = { ...goal, id };

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

      setGoals(newGoals);

      // If we deleted the current goal or a goal before it, adjust the current index
      if (newGoals.length === 0) {
        // If no goals left, reset to default
        setGoals([{ name: "New Goal", progress: 0, type: 'percentage' }]);
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
      }
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
  const dotSize = 40;

  // Function to handle layout event
  const handleMainAreaLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    // Calculate dots based on actual dimensions
    const dotsPerRow = Math.floor(width / dotSize);
    const dotsPerColumn = Math.floor(height / dotSize);
    setTotalDots(dotsPerRow * dotsPerColumn);
  };

  // Calculate how many dots should be marked as completed based on percentage
  const completedDots = Math.floor(totalDots * (progressPercentage / 100));

  return (
    <View style={styles.container}>
      {/* Header - with hamburger menu */}
      <View style={styles.header}>
        <HamburgerIcon onPress={() => setMenuVisible(true)} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => editGoal(currentGoalIndex)}>
            <Text style={styles.headerTitle}>{currentGoal.name}</Text>
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
      <View style={styles.bottomBar}>
        <ProgressBar percentage={progressPercentage} />
        <Text style={styles.progressText}>{progressPercentage}%</Text>
      </View>
    </View>
  );
}
