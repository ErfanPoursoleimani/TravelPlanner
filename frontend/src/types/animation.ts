export type AnimationType = 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'bounce';

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
}

export interface AnimatedBoxProps {
  children: React.ReactNode;
  animation?: AnimationType;
  config?: AnimationConfig;
  className?: string;
  triggerOnce?: boolean;
  threshold?: number;
  rootMargin?: string;
}