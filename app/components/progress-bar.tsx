import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const styles = StyleSheet.create({
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
  progressBarContainer: {
    width: '75%',
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 7,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#34c759',
    borderRadius: 7,
  },
  progressText: {
    color: '#22223b',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.2,
  }
});

const ProgressBar = ({ percentage }: { percentage: number }) => (
  <View style={styles.bottomBar}>
    <View style={styles.progressBarContainer}>
      <LinearGradient
        colors={['#34c759', '#30bced']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.progressBar, { width: `${percentage}%` }]}
      />
    </View>
    <Text style={styles.progressText}>{percentage}%</Text>
  </View>

);

export default ProgressBar