// src/lib/trust.ts — Trust score calculation and helpers
import type { UserProfile } from '../types';

export interface TrustFactors {
  onTimeRate: number; // 0-100
  conditionRating: number; // 0-100 (from 1-5 scale)
  verifiedEmail: boolean;
  activityScore: number; // 0-100
}

/**
 * Calculates a user's Trust Score (0-100) from profile metrics.
 * Weights:
 * - On-time return rate: 40%
 * - Item condition average: 30%
 * - University email verification: 20%
 * - Activity / Response rate: 10%
 */
export function calculateTrustScore(profile: Partial<UserProfile>): number {
  const completedBorrows = profile.completed_borrows || 0;
  const onTimeReturns = profile.on_time_returns || 0;
  const avgCondition = profile.avg_condition !== undefined ? Number(profile.avg_condition) : 5.0;
  const verified = profile.verified_email ?? true;
  const completedLends = profile.completed_lends || 0;

  // If new user with no history, sensible starting score
  if (completedBorrows === 0 && completedLends === 0) {
    let score = 80;
    if (verified) score += 10;
    return Math.min(100, Math.max(0, score));
  }

  // On-time rate
  const onTimeRate = completedBorrows > 0
    ? Math.min(100, Math.round((onTimeReturns / completedBorrows) * 100))
    : 95;

  // Condition rate (scale 0-5 to 0-100)
  const conditionRate = Math.min(100, Math.max(0, Math.round((avgCondition / 5.0) * 100)));

  // Verification factor
  const verificationRate = verified ? 100 : 0;

  // Activity rate
  const totalActivity = completedBorrows + completedLends;
  const activityRate = Math.min(100, 70 + totalActivity * 3);

  const finalScore = Math.round(
    onTimeRate * 0.4 +
    conditionRate * 0.3 +
    verificationRate * 0.2 +
    activityRate * 0.1,
  );

  return Math.min(100, Math.max(10, finalScore));
}

export function getTrustBadge(score: number): { label: string; color: string; bg: string; border: string } {
  if (score >= 90) {
    return {
      label: 'Highly Trusted',
      color: 'text-teal-700',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
    };
  }
  if (score >= 75) {
    return {
      label: 'Trusted Member',
      color: 'text-indigo-700',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
    };
  }
  if (score >= 60) {
    return {
      label: 'Active Member',
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    };
  }
  return {
    label: 'New Member',
    color: 'text-stone-600',
    bg: 'bg-stone-100',
    border: 'border-stone-200',
  };
}
