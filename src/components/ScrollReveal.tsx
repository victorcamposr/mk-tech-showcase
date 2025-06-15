import { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-up' | 'fade-in';
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

export const ScrollReveal = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 300,
  className = '',
  once = true,
  threshold = 0.1,
}: ScrollRevealProps) => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold, once });

  const getAnimationClass = () => {
    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return 'opacity-0 translate-y-4';
        case 'fade-down':
          return 'opacity-0 -translate-y-4';
        case 'fade-left':
          return 'opacity-0 translate-x-4';
        case 'fade-right':
          return 'opacity-0 -translate-x-4';
        case 'scale-up':
          return 'opacity-0 scale-95';
        case 'fade-in':
        default:
          return 'opacity-0';
      }
    }
    return 'opacity-100 translate-y-0 translate-x-0 scale-100';
  };

  return (
    <div
      ref={elementRef}
      className={`transform transition-all ease-out ${getAnimationClass()} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
};