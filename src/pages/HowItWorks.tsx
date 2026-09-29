// src/pages/HowItWorks.tsx
import { useState } from 'react';
import { motion, MotionConfig } from 'motion/react';
import { Reveal } from '../components/motion/Reveal';
import { Stagger, StaggerItem } from '../components/motion/Stagger';
import { Shield, Clock, Star, MessageSquare, ArrowRight, RotateCcw } from 'lucide-react';

const BORROWER_STEPS = [
  {
    num: '01',
    title: 'Browse & discover',
    desc: 'Search items listed by students near you. Filter by category, trust score, daily rate, and condition.',
    icon: '🔍',
    color: '#4338CA',
  },
  {
    num: '02',
    title: 'Request to borrow',
    desc: 'Send a request with your dates and a short message to the lender. They\'ll review and respond.',
    icon: '📨',
    color: '#0D9488',
  },
  {
    num: '03',
    title: 'Pick up the item',
    desc: 'Arrange a convenient pick-up time and location with the lender. Verify the item is in the stated condition.',
    icon: '🤝',
    color: '#FF6B4A',
  },
  {
    num: '04',
    title: 'Return on time',
    desc: 'Return the item in the same condition on or before the agreed date. This keeps your Trust Score high.',
    icon: '⏰',
    color: '#4338CA',
  },
];

const LENDER_STEPS = [
  {
    num: '01',
    title: 'List your item',
    desc: 'Create a listing with photos, a description, daily rate, and deposit. Takes under 2 minutes.',
    icon: '📋',
    color: '#4338CA',
  },
  {
    num: '02',
    title: 'Review requests',
    desc: 'Receive borrow requests and review the borrower\'s Trust Score before approving or declining.',
    icon: '✅',
    color: '#0D9488',
  },
  {
    num: '03',
    title: 'Hand over safely',
    desc: 'Meet the borrower, verify their identity if desired, and hand over the item with the deposit confirmed.',
    icon: '📦',
    color: '#FF6B4A',
  },
  {
    num: '04',
    title: 'Get it back & earn',
    desc: 'Receive your item back, confirm its condition, and release the deposit. Earn from things you already own.',
    icon: '💰',
    color: '#4338CA',
  },
];

const SAFETY_TILES = [
  { icon: <Shield size={22} />, title: 'Trust Scores', desc: 'Every user has a public Trust Score built from return history and ratings.' },
  { icon: <Clock size={22} />, title: 'On-time tracking', desc: 'Late returns are tracked and reflected in the borrower\'s score.' },
  { icon: <Star size={22} />, title: 'Condition ratings', desc: 'Both sides rate the condition after each exchange.' },
  { icon: <MessageSquare size={22} />, title: 'Dispute resolution', desc: 'Report issues within 24h. Our team mediates any dispute.' },
  { icon: <RotateCcw size={22} />, title: 'Return reminders', desc: 'Automated reminders are sent 24h before the return date.' },
  { icon: <ArrowRight size={22} />, title: 'Verified accounts', desc: 'University email verification reduces anonymous bad actors.' },
];

export function HowItWorks() {
  const [track, setTrack] = useState<'borrower' | 'lender'>('borrower');
  const steps = track === 'borrower' ? BORROWER_STEPS : LENDER_STEPS;

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6">

          {/* Header */}
          <Reveal className="text-center mb-12">
            <h1 className="section-headline text-[#1E1B4B] mb-4">How BorrowBuddy works</h1>
            <p className="text-stone-500 text-lg max-w-xl mx-auto">
              Simple, transparent peer-to-peer item lending — built on trust.
            </p>
          </Reveal>

          {/* Track toggle */}
          <Reveal className="flex justify-center mb-12">
            <div className="flex gap-1 p-1.5 bg-[#EEF2FF] rounded-2xl">
              {(['borrower', 'lender'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTrack(t)}
                  className={`relative px-6 py-2.5 rounded-xl text-sm font-semibold font-display capitalize cursor-pointer transition-colors ${track === t ? 'text-[#1E1B4B]' : 'text-stone-400 hover:text-stone-600'}`}
                >
                  {track === t && (
                    <motion.div
                      layoutId="track-bg"
                      className="absolute inset-0 bg-white rounded-xl shadow-sm"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">I want to {t === 'borrower' ? 'borrow' : 'lend'}</span>
                </button>
              ))}
            </div>
          </Reveal>

          {/* Steps */}
          <div className="relative mb-20">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#E0E7FF] hidden md:block" />

            <Stagger className="space-y-8" key={track}>
              {steps.map((step, i) => (
                <StaggerItem key={step.num} className="relative md:pl-20">
                  {/* Node */}
                  <motion.div
                    className="absolute left-0 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-display font-extrabold text-base hidden md:flex"
                    style={{ background: step.color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                  >
                    {step.num}
                  </motion.div>

                  <div className="card p-6 hover:border-[#A5B4FC] transition-colors">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl flex-shrink-0">{step.icon}</span>
                      <div>
                        <h3 className="font-display font-bold text-xl text-[#1E1B4B] mb-2">{step.title}</h3>
                        <p className="text-stone-500 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* Safety block */}
          <Reveal className="mb-12 text-center">
            <h2 className="section-headline text-[#1E1B4B] mb-3">Safety & guidelines</h2>
            <p className="text-stone-500 max-w-xl mx-auto">Designed to keep every exchange safe, fair, and dispute-free.</p>
          </Reveal>

          <Stagger className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {SAFETY_TILES.map((tile) => (
              <StaggerItem key={tile.title} className="card p-5">
                <div className="w-10 h-10 bg-[#EEF2FF] rounded-xl flex items-center justify-center text-[#4338CA] mb-3">
                  {tile.icon}
                </div>
                <h3 className="font-display font-bold text-[#1E1B4B] mb-1">{tile.title}</h3>
                <p className="text-stone-500 text-sm">{tile.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </MotionConfig>
  );
}
