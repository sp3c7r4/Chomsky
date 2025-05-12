import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import { DeviceMotion } from 'expo-sensors';

const { width } = Dimensions.get('window');
const EYE_CONTAINER_SIZE = width * 0.8; // Container for both eyes
const EYE_SIZE = EYE_CONTAINER_SIZE * 0.4; // Size of one eye socket
const PUPIL_SIZE = EYE_SIZE * 0.4; // Size of the pupil
const MAX_OFFSET = (EYE_SIZE - PUPIL_SIZE) / 2 - 5; // Max distance pupil can move from center
const SENSITIVITY = 30; // How much tilt affects movement

const Blob = () => {
  const [hasPermission, setHasPermission] = useState(null);
  // Use useRef for animated values to prevent re-creation on re-renders
  const pupilOffsetX = useRef(new Animated.Value(0)).current;
  const pupilOffsetY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Request permission
    (async () => {
      const { status } = await DeviceMotion.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    // Subscribe to device motion updates
    let subscription;
    if (hasPermission) {
      DeviceMotion.setUpdateInterval(50); // Update frequency (ms)
      subscription = DeviceMotion.addListener(motionData => {
        if (motionData && motionData.rotation) {
          // Gamma: Left/Right tilt, Beta: Front/Back tilt (use radians)
          let { gamma, beta } = motionData.rotation;

          // Clamp values to prevent extreme jumps & calculate target offset
          const targetX = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, gamma * SENSITIVITY));
          const targetY = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, beta * SENSITIVITY));

          // Animate pupils smoothly to the target offset
          Animated.spring(pupilOffsetX, {
            toValue: targetX,
            useNativeDriver: true, // Essential for performance
            friction: 7, // Adjust for desired springiness
            tension: 100,
          }).start();

          Animated.spring(pupilOffsetY, {
            toValue: targetY,
            useNativeDriver: true,
            friction: 7,
            tension: 100,
          }).start();
        }
      });
    }

    // Cleanup: remove listener when component unmounts
    return () => {
      subscription && subscription.remove();
    };
    // Rerun effect if permission status changes
  }, [hasPermission, pupilOffsetX, pupilOffsetY]);

  const pupilTransformStyle = {
    transform: [
      { translateX: pupilOffsetX },
      { translateY: pupilOffsetY },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.eyesContainer}>
        {/* Left Eye */}
        <View style={styles.eyeSocket}>
          <Animated.View style={[styles.pupil, pupilTransformStyle]} />
        </View>
        {/* Right Eye */}
        <View style={styles.eyeSocket}>
          <Animated.View style={[styles.pupil, pupilTransformStyle]} />
        </View>
      </View>
      {!hasPermission && <Text style={styles.permissionText}>Sensor permission needed</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Light background
  },
  eyesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: EYE_CONTAINER_SIZE,
  },
  eyeSocket: {
    width: EYE_SIZE,
    height: EYE_SIZE,
    borderRadius: EYE_SIZE / 2,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Keep pupil inside
  },
  pupil: {
    width: PUPIL_SIZE,
    height: PUPIL_SIZE,
    borderRadius: PUPIL_SIZE / 2,
    backgroundColor: 'black',
    position: 'absolute', // Needed for transform positioning relative to center
  },
  permissionText: {
      marginTop: 20,
      color: 'red',
  }
});

export default Blob;

// --- How to use it in your App.js ---
// import React from 'react';
// import FollowingEyes from './FollowingEyes'; // Assuming you saved the code as FollowingEyes.js
//
// export default function App() {
//   return <FollowingEyes />;
// }
// ---