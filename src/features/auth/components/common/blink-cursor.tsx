import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

export const BlinkingCursor = () => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return <Animated.View style={[styles.cursor, { opacity }]} />;
};

const styles = StyleSheet.create({
  cursor: {
    width: 2,
    height: 25,
    backgroundColor: "#914C24",
    position: "absolute",
  },
});
