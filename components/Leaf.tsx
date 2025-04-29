import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const AnimatedLeaf = ({ delay = 0 }) => {
  const animX = useRef(new Animated.Value(Math.random() * width)).current;
  const animY = useRef(new Animated.Value(Math.random() * height)).current;

  const moveLeaf = () => {
    const newX = Math.random() * (width - 50);
    const newY = Math.random() * (height - 50);

    Animated.parallel([
      Animated.timing(animX, {
        toValue: newX,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(animY, {
        toValue: newY,
        duration: 3000,
        useNativeDriver: true,
      }),
    ]).start(() => moveLeaf());
  };

  useEffect(() => {
    const timeout = setTimeout(moveLeaf, delay);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.Image
      source={require('@/assets/icon/leaf.png')}
      resizeMode={"contain"}
      style={[
        styles.leaf,
        {
          transform: [{ translateX: animX }, { translateY: animY }],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  leaf: {
    position: 'absolute',
    width: 10,
    height: 10,
    opacity: 0.7,
  },
});
export default AnimatedLeaf