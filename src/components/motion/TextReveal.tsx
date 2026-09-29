// src/components/motion/TextReveal.tsx — Staggered word/letter reveal
import { motion, useInView, MotionConfig } from 'motion/react';
import { useRef } from 'react';
import { ease } from '../../lib/motion';

interface TextRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  mode?: 'words' | 'letters';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

export function TextReveal({
  text,
  className = '',
  wordClassName = '',
  delay = 0,
  mode = 'words',
  as: Component = 'span',
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });

  const items = mode === 'words' ? text.split(' ') : text.split('');

  return (
    <MotionConfig reducedMotion="user">
      <Component className={className} ref={ref as any}>
        {items.map((item, i) => (
          <span key={i} className="inline-block overflow-hidden align-top mr-[0.25em] last:mr-0">
            <motion.span
              className={`inline-block ${wordClassName}`}
              initial={{ y: '110%', opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: '110%', opacity: 0 }}
              transition={{
                duration: 0.5,
                ease,
                delay: delay + i * (mode === 'words' ? 0.05 : 0.02),
              }}
            >
              {item === ' ' ? ' ' : item}
            </motion.span>
          </span>
        ))}
      </Component>
    </MotionConfig>
  );
}
