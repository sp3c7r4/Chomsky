import React, { useEffect, useRef } from 'react';
import { Animated, View, Image, StyleSheet } from 'react-native';

const FloatingImage = ({ source, style, containerStyle }:{containerStyle?: any}) => {
  // Create animated value for vertical movement
  const translateY = useRef(new Animated.Value(0)).current;

  // Setup animation when component mounts
  useEffect(() => {
    // Create sequence: move down 10px, then move up 10px
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 10, // Move down 10 pixels
          duration: 2000, // Over 2 seconds
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -10, // Move up 10 pixels from original position
          duration: 2000, // Over 2 seconds
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      // Cleanup animation if component unmounts
      translateY.stopAnimation();
    };
  }, []);

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.Image
        source={source}
        resizeMode="contain"
        style={[
          style,
          {
            transform: [{ translateY }], // Apply vertical animation
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default FloatingImage;

// Example usage:
// <FloatingImage 
//   source={require('@/assets/images/your-image.png')} 
//   style={{ width: 200, height: 200 }} 
// />