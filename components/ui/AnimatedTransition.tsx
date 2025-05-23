import React, { ReactNode } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface AnimatedTransitionProps {
  children: ReactNode;
  style?: ViewStyle;
  entering?: 'fadeIn' | 'slideInRight' | 'slideInUp' | 'zoomIn';
  duration?: number;
  delay?: number;
  onAnimationComplete?: () => void;
}

const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  children,
  style,
  entering = 'fadeIn',
  duration = 400,
  delay = 0,
  onAnimationComplete,
}) => {
  // Shared values for animations
  const opacity = useSharedValue(entering === 'fadeIn' || entering === 'zoomIn' ? 0 : 1);
  const translateX = useSharedValue(entering === 'slideInRight' ? 100 : 0);
  const translateY = useSharedValue(entering === 'slideInUp' ? 50 : 0);
  const scale = useSharedValue(entering === 'zoomIn' ? 0.8 : 1);
  
  // Animation completed flag
  const animationCompleted = useSharedValue(false);

  useEffect(() => {
    // Callback for animation completion
    const handleAnimationComplete = () => {
      onAnimationComplete?.();
    };
    
    // Delay the animation start if specified
    const timeoutId = setTimeout(() => {
      // Configure animations based on the entering type
      if (entering === 'fadeIn' || entering === 'zoomIn') {
        opacity.value = withTiming(1, {
          duration,
          easing: Easing.out(Easing.ease),
        }, (finished) => {
          if (finished && !animationCompleted.value) {
            animationCompleted.value = true;
            if (onAnimationComplete) {
              runOnJS(handleAnimationComplete)();
            }
          }
        });
      }
      
      if (entering === 'slideInRight') {
        translateX.value = withTiming(0, {
          duration,
          easing: Easing.out(Easing.ease),
        });
      }
      
      if (entering === 'slideInUp') {
        translateY.value = withTiming(0, {
          duration,
          easing: Easing.out(Easing.ease),
        });
      }
      
      if (entering === 'zoomIn') {
        scale.value = withTiming(1, {
          duration,
          easing: Easing.out(Easing.ease),
        });
      }
    }, delay);
    
    return () => clearTimeout(timeoutId);
  }, [entering, duration, delay, opacity, translateX, translateY, scale, onAnimationComplete, animationCompleted]);
  
  // Animated style based on the animation type
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });
  
  return (
    <Animated.View style={[styles.container, style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Base styles
  },
});

export default AnimatedTransition;