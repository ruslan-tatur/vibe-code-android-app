import { Animated, Easing, StyleSheet, ViewStyle } from "react-native";
import { useEffect, useRef } from "react";

const styles = StyleSheet.create({
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    margin: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
});

const getDotStyle = (isCompleted: boolean): ViewStyle => ({
  backgroundColor: isCompleted ? '#34c759' : '#e0e0e0',
  shadowColor: isCompleted ? '#34c759' : 'transparent',
});

const Dot = ({ isCompleted }: { isCompleted: boolean }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800 + Math.random() * 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800 + Math.random() * 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        })
      ]).start(animate);
    };

    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.dot,
        getDotStyle(isCompleted),
        { opacity }
      ]}
    />
  );
};

export default Dot;
