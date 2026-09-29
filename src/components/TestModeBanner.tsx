// src/components/TestModeBanner.tsx — Razorpay Demo Mode Indicator
import React from 'react';
import { ShieldCheck, CreditCard, Sparkles } from 'lucide-react';
import { RAZORPAY_KEY_ID } from '../lib/razorpay';

interface TestModeBannerProps {
  amountINR?: number;
  className?: string;
  compact?: boolean;
}

export const TestModeBanner: React.FC<TestModeBannerProps> = ({
  amountINR,
  className = '',
  compact = false,
}) => {
  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold ${className}`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Razorpay Test Sandbox</span>
      </div>
    );
  }

  return (
    <div
      className={`p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-emerald-50 border border-indigo-200/80 shadow-xs ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#4338CA] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <CreditCard size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-[#1E1B4B]">
              Razorpay Demo Payment Mode
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-wider">
              Test Mode
            </span>
          </div>
          <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
            {amountINR && amountINR > 0
              ? `A demo security deposit of ₹${amountINR.toLocaleString('en-IN')} will be authorized via Razorpay Sandbox. Use any test card, UPI, or netbanking — zero real charges.`
              : 'Interactive sandbox checkout powered by Razorpay. Zero real financial transactions.'}
          </p>
          <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-stone-500">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck size={12} className="text-emerald-600" />
              Key: {RAZORPAY_KEY_ID.substring(0, 12)}...
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-indigo-700">
              <Sparkles size={11} />
              Simulated OTP / UPI Success
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
