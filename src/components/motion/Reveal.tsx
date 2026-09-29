// src/components/motion/Reveal.tsx
import React from 'react';
import { motion, useInView, MotionConfig } from 'motion/react';
import { revealVariants } from '../../lib/motion';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        ref={ref}
        variants={revealVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className={className}
        style={{ transitionDelay: `${delay}s` }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
