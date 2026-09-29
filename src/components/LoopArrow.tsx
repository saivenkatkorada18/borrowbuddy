// src/components/LoopArrow.tsx — SVG Loop Arrow with Drawing Animation
import { motion } from 'motion/react';
import { ease } from '../lib/motion';

interface LoopArrowProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  animate?: boolean;
}

export function LoopArrow({ size = 140, color = '#4338CA', strokeWidth = 4, animate = true }: LoopArrowProps) {
  const pathD =
    'M20,70 C20,35 45,15 75,15 C105,15 125,35 125,60 C125,85 105,100 85,100 L50,100 M50,100 L60,90 M50,100 L60,110';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loop Arrow"
    >
      <motion.path
        d={pathD}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={
          animate
            ? {
                pathLength: { duration: 1.2, ease },
                opacity: { duration: 0.3, ease },
              }
            : {}
        }
      />
    </svg>
  );
}

interface LoopArrowSpinnerProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function LoopArrowSpinner({ size = 24, color = '#4338CA', strokeWidth = 3 }: LoopArrowSpinnerProps) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      style={{ width: size, height: size }}
    >
      <LoopArrow size={size} color={color} strokeWidth={strokeWidth} animate={false} />
    </motion.div>
  );
}
