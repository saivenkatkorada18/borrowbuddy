// src/lib/motion.ts — Motion design system tokens and utilities
import type { Variants, Transition } from 'motion/react';

// ─── Easing ───────────────────────────────────────────────────────────────────
export const ease = [0.22, 1, 0.36, 1] as const;
export const easeIn = [0.4, 0, 1, 1] as const;
export const easeOut = [0, 0, 0.6, 1] as const;

// ─── Spring configs ───────────────────────────────────────────────────────────
export const spring = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 24,
};

export const springGentle = {
  type: 'spring' as const,
  stiffness: 160,
  damping: 28,
};

export const springBouncy = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 17,
};

// ─── Durations ────────────────────────────────────────────────────────────────
export const duration = {
  fast: 0.18,
  base: 0.45,
  slow: 0.8,
} as const;

// ─── Stagger ──────────────────────────────────────────────────────────────────
export const staggerDelay = 0.07;

// ─── Reusable transitions ─────────────────────────────────────────────────────
export const transitionBase: Transition = {
  duration: duration.base,
  ease,
};

export const transitionFast: Transition = {
  duration: duration.fast,
  ease,
};

export const transitionSlow: Transition = {
  duration: duration.slow,
  ease,
};

// ─── Variant factories ────────────────────────────────────────────────────────

/** Fade + rise from below (24px) — for Reveal */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: transitionBase,
  },
};

/** Scale fade for modals and overlays */
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: spring,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: transitionFast,
  },
};

/** Slide in from right (page transitions) */
export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: 12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.base, ease },
  },
  exit: {
    opacity: 0,
    x: -12,
    transition: { duration: duration.fast, ease },
  },
};

/** Stagger container */
export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
    },
  },
};

/** Stagger child — fade + rise */
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease },
  },
};

/** Backdrop for modals */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitionFast },
  exit: { opacity: 0, transition: transitionFast },
};

/** Toast slide in from right */
export const toastVariants: Variants = {
  hidden: { opacity: 0, x: 48, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: spring,
  },
  exit: {
    opacity: 0,
    x: 48,
    scale: 0.96,
    transition: transitionFast,
  },
};

/** Card hover lift — for use with whileHover */
export const cardHoverProps = {
  whileHover: { y: -6, scale: 1.005 },
  transition: spring,
};

/** Button hover/tap */
export const buttonHoverProps = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
  transition: springBouncy,
};

/** Shake for validation errors */
export const shakeVariants: Variants = {
  idle: { x: 0 },
  shake: {
    x: [0, -8, 8, -6, 6, -4, 4, 0],
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
};
