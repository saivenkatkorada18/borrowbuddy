// src/components/TrustRing.tsx — Animated radial trust score ring
import { motion, useInView, MotionConfig } from 'motion/react';
import { useRef } from 'react';
import { CountUp } from './motion/CountUp';
import { getTrustLabel } from '../lib/utils';

interface TrustRingProps {
  score: number;
  size?: number;
  showLabel?: boolean;
  strokeWidth?: number;
  className?: string;
  glow?: boolean;
}

export function TrustRing({ score, size = 80, showLabel = true, strokeWidth = 6, className, glow = false }: TrustRingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference - (circumference * score) / 100;
  const { label, color } = getTrustLabel(score);

  return (
    <div ref={ref} className={`flex flex-col items-center gap-1 ${className}`}>
      <div
        className={`relative flex items-center justify-center rounded-full ${glow ? 'drop-shadow-[0_0_16px_rgba(13,148,136,0.4)]' : ''}`}
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} aria-hidden="true">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#E0E7FF"
            strokeWidth={strokeWidth}
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id={`trust-gradient-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#4338CA" />
            </linearGradient>
          </defs>
          {/* Progress ring */}
          <MotionConfig reducedMotion="user">
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={`url(#trust-gradient-${score})`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={isInView ? { strokeDashoffset: dashOffset } : {}}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            />
          </MotionConfig>
        </svg>
        {/* Score number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-extrabold text-[#1E1B4B]" style={{ fontSize: size * 0.25 }}>
            <CountUp end={score} duration={1.4} />
          </span>
        </div>
      </div>
      {showLabel && (
        <span className={`text-xs font-semibold font-display ${color}`}>{label}</span>
      )}
    </div>
  );
}
