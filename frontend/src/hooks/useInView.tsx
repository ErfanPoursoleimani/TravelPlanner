import { useState, useEffect, useRef } from 'react';
import type { RefObject } from 'react';

interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseInViewReturn {
  ref: RefObject<HTMLDivElement>;
  inView: boolean;
}

export const useInView = (options: UseInViewOptions = {}): UseInViewReturn => {
  const [inView, setInView] = useState<boolean>(false);
  const [hasTriggered, setHasTriggered] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null!);

  const { threshold = 0.1, rootMargin = '0px', triggerOnce = false } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        const isIntersecting = entry.isIntersecting;
        
        if (triggerOnce) {
          if (isIntersecting && !hasTriggered) {
            setInView(true);
            setHasTriggered(true);
          }
        } else {
          setInView(isIntersecting);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { ref, inView };
};