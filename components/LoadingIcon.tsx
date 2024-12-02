import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LoadingIcon: React.FC = () => {
  // Create an Animated value
  const tiltValue = new Animated.Value(0);

  // Function to trigger the animation
  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(tiltValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(tiltValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    startAnimation();
  }, []);

  // Interpolating the tilt value
  const tilt = tiltValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '15deg'], // Tilt degrees (adjust as needed)
  });

  return (
    <View style={styles.loadingIconContainer}>
      <Animated.View style={{ transform: [{ rotate: tilt }] }}>
        <MaterialCommunityIcons name="pot-steam" size={50} color="black" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
});

export default LoadingIcon;
