import React from 'react';
import type { CSSProperties } from 'react'
import { useInView } from '../hooks/useInView';
import type { AnimatedBoxProps, AnimationType } from '../types/animation';

const AnimatedBox: React.FC<AnimatedBoxProps> = ({
  children,
  animation = 'fadeIn',
  config = {},
  className = '',
  triggerOnce = false,
  threshold = 0.1,
  rootMargin = "0px"
}) => {
  const { duration = 0.6, delay = 0, easing = 'ease' } = config;
  const { ref, inView } = useInView({ threshold, triggerOnce, rootMargin });

  const getAnimationStyles = (animationType: AnimationType, isVisible: boolean): CSSProperties => {
    const baseTransition = `all ${duration}s ${easing} ${delay}s`;

    const animations: Record<AnimationType, CSSProperties> = {
      fadeIn: {
        opacity: isVisible ? 1 : 0,
        transition: baseTransition,
      },
      slideUp: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transition: baseTransition,
      },
      slideDown: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-50px)',
        transition: baseTransition,
      },
      slideLeft: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
        transition: baseTransition,
      },
      slideRight: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
        transition: baseTransition,
      },
      scale: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.8)',
        transition: baseTransition,
      },
      bounce: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.3) translateY(50px)',
        transition: `all ${duration}s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${delay}s`,
      },
    };

    return animations[animationType];
  };

  return (
    <div
      ref={ref}
      className={className}
      style={getAnimationStyles(animation, inView)}
    >
      {children}
    </div>
  );
};

export default AnimatedBox;