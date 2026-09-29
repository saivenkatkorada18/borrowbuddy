// src/components/motion/Tilt.tsx
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, MotionConfig } from 'motion/react';
import { spring } from '../../lib/motion';

interface TiltProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export function Tilt({ children, className, maxTilt = 6 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shine, setShine] = useState({ x: 50, y: 50 });
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
      setRotateY(dx * maxTilt);
      setRotateX(-dy * maxTilt);
      setShine({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
    },
    [maxTilt, isTouch],
  );

  const handleMouseLeave = useCallback(() => {
    if (isTouch) return;
    setRotateX(0);
    setRotateY(0);
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
        animate={{ rotateX, rotateY }}
        transition={spring}
        style={{ transformStyle: 'preserve-3d', perspective: 800 }}
      >
        {/* Shine overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
          style={{
            background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.18) 0%, transparent 70%)`,
          }}
        />
        {children}
      </motion.div>
    </MotionConfig>
  );
}
