import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal Component
 * Provides smooth scroll-triggered reveal animations (slide up, slide down, slide in)
 * as elements enter the viewport during scrolling.
 *
 * Props:
 * - children: React nodes to animate
 * - direction: 'up' | 'down' | 'left' | 'right' | 'fade' (default: 'up')
 * - delay: delay in milliseconds (default: 0)
 * - duration: duration in milliseconds (default: 600)
 * - distance: translate distance (default: '28px')
 * - threshold: IntersectionObserver threshold (default: 0.1)
 * - className: additional CSS class names
 * - style: inline style overrides
 */
export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 600,
  distance = '28px',
  threshold = 0.1,
  className = '',
  style = {},
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once revealed, unobserve to keep element visible
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [threshold]);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}, 0)`;
      case 'down':
        return `translate3d(0, -${distance}, 0)`;
      case 'left':
        return `translate3d(${distance}, 0, 0)`;
      case 'right':
        return `translate3d(-${distance}, 0, 0)`;
      case 'fade':
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  const dynamicStyle = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: 'opacity, transform',
    ...style
  };

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal ${className}`}
      style={dynamicStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export default ScrollReveal;
