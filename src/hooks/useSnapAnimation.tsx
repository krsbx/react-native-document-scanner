import {useRef} from 'react';
import {Animated} from 'react-native';

const useSnapAnimation = () => {
  const flashOpacity = useRef(new Animated.Value(0));

  const startSnapAnimation = () =>
    Animated.sequence([
      Animated.timing(flashOpacity.current, {
        toValue: 0.2,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(flashOpacity.current, {
        toValue: 0,
        duration: 50,
        useNativeDriver: false,
      }),
      Animated.timing(flashOpacity.current, {
        toValue: 0.6,
        delay: 100,
        duration: 120,
        useNativeDriver: false,
      }),
      Animated.timing(flashOpacity.current, {
        toValue: 0,
        duration: 90,
        useNativeDriver: false,
      }),
    ]).start();

  return {startSnapAnimation, flashOpacity: flashOpacity.current};
};

export default useSnapAnimation;
