// src/components/motion/Marquee.tsx
import React from 'react';
import { motion, MotionConfig } from 'motion/react';

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function Marquee({ children, speed = 30, className }: MarqueeProps) {
  const [paused, setPaused] = React.useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`overflow-hidden ${className}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        aria-label="Scrolling marquee"
      >
        <motion.div
          className="flex gap-0 whitespace-nowrap"
          animate={{ x: [0, '-50%'] }}
          transition={{
            duration: speed,
            ease: 'linear',
            repeat: Infinity,
          }}
          style={{ animationPlayState: paused ? 'paused' : 'running' }}
        >
          <span className="flex items-center gap-0">{children}</span>
          <span className="flex items-center gap-0" aria-hidden>
            {children}
          </span>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
