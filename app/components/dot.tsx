import { View, StyleSheet } from "react-native";

export default function Dot({ isCompleted }: { isCompleted: boolean }) {
  return (
    <View
      style={[
        styles.dot,
        isCompleted ? styles.dotCompleted : styles.dotIncomplete,
        styles.dotShadow,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    margin: 10,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#f4f6fa',
  },
  dotCompleted: {
    backgroundColor: '#34c759',
    borderColor: '#30bced',
  },
  dotIncomplete: {
    backgroundColor: '#e0e0e0',
    borderColor: '#e5e7eb',
  },
  dotShadow: {
    shadowColor: '#30bced',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
});
