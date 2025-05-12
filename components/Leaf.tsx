import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

const FallingLeaf = ({ source, startLeft }:{ source: any, startLeft: any }) => {
  const animY = useRef(new Animated.Value(-20)).current;
  const animX = useRef(new Animated.Value(startLeft)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  const fall = () => {
    animY.setValue(-20);
    rotate.setValue(0);

    const sway = Math.random() * 20 - 10; // small side sway
    const duration = 6000 + Math.random() * 2000;

    Animated.parallel([
      Animated.timing(animY, {
        toValue: height + 20,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(animX, {
        toValue: startLeft + sway,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // restart with new left position
      animX.setValue(Math.random() * width);
      fall();
    });
  };

  useEffect(() => {
    const delay = Math.random() * 5000; // stagger start
    setTimeout(fall, delay);
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.Image
      source={source}
      resizeMode="contain"
      style={[
        styles.leaf,
        {
          transform: [
            { translateY: animY },
            { translateX: animX },
            { rotate: spin }, 
          ],
        },
      ]}
    />
  );
};

const App = () => {
  const leaves = [require('@/assets/icon/leaf.png'), require('@/assets/icon/health.png')];

  return (
    <View style={styles.container}>
      {Array.from({ length: 6 }).map((_, i) => (
        <FallingLeaf
          key={i}
          source={leaves[i % leaves.length]}
          startLeft={Math.random() * width}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // your background
  },
  leaf: {
    position: 'absolute',
    width: 10,
    height: 10,
    opacity: 0.8,
  },
});

export default App;
