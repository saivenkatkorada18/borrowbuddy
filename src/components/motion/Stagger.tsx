// src/components/motion/Stagger.tsx
import React from 'react';
import { motion, MotionConfig } from 'motion/react';
import { staggerContainerVariants, staggerItemVariants } from '../../lib/motion';

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function Stagger({ children, className, delay = 0.1 }: StaggerProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        variants={{
          ...staggerContainerVariants,
          visible: {
            transition: {
              staggerChildren: 0.07,
              delayChildren: delay,
            },
          },
        }}
        initial="hidden"
        animate="visible"
        className={className}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
}
