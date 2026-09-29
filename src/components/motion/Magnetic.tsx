// src/components/motion/Magnetic.tsx
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, MotionConfig } from 'motion/react';
import { spring } from '../../lib/motion';

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export function Magnetic({ children, strength = 8, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isTouchDevice = !window.matchMedia('(hover: hover)').matches || 'ontouchstart' in window;
      setIsTouch(isTouchDevice);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouch || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      setPos({ x: dx * strength, y: dy * strength });
    },
    [strength, isTouch],
  );

  const handleMouseLeave = useCallback(() => {
    if (isTouch) return;
    setPos({ x: 0, y: 0 });
  }, [isTouch]);

  if (isTouch) {
    return <div className={className}>{children}</div>;
  }

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        ref={ref}
        className={className}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ x: pos.x, y: pos.y }}
        transition={spring}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
