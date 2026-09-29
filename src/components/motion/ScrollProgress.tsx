// src/components/motion/ScrollProgress.tsx
import { motion, useScroll, useSpring, MotionConfig } from 'motion/react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-[9999] origin-left"
        style={{
          scaleX,
          background: 'linear-gradient(90deg, #4338CA, #0D9488, #FF6B4A)',
        }}
      />
    </MotionConfig>
  );
}
