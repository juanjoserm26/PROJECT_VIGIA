'use client';

import { useEffect, useRef, useState, ReactNode, ElementType } from 'react';

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  variant?: 'up' | 'fade' | 'zoom' | 'slide';
  delay?: 1 | 2 | 3 | 4 | 5;
  threshold?: number;
}

export default function Reveal({
  children,
  as: Component = 'div',
  className = '',
  variant = 'up',
  delay,
  threshold = 0.15,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  const variantClass =
    variant === 'fade'
      ? 'reveal-fade'
      : variant === 'zoom'
      ? 'reveal-zoom'
      : variant === 'slide'
      ? 'reveal-slide'
      : '';

  const delayClass = delay ? `reveal-delay-${delay}` : '';

  return (
    <Component
      ref={ref}
      className={`reveal ${variantClass} ${delayClass} ${inView ? 'in-view' : ''} ${className}`}
    >
      {children}
    </Component>
  );
}
