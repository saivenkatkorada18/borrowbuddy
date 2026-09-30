// src/components/SplashScreen.tsx — Full-screen animated entry experience
import { motion, MotionConfig } from 'motion/react';
import { LoopArrow } from './LoopArrow';
import { Button } from './ui/Button';

interface SplashScreenProps {
  onLogin: () => void;
  onSignup: () => void;
  onGuest: () => void;
}

// Orbiting item icons
const ORBIT_ITEMS = [
  { label: '📐', angle: 0, radius: 140, delay: 0 },
  { label: '🧪', angle: 45, radius: 150, delay: 0.1 },
  { label: '🔌', angle: 90, radius: 145, delay: 0.2 },
  { label: '📚', angle: 135, radius: 155, delay: 0.3 },
  { label: '☂️', angle: 180, radius: 140, delay: 0.4 },
  { label: '🏀', angle: 225, radius: 150, delay: 0.5 },
  { label: '🎸', angle: 270, radius: 145, delay: 0.6 },
  { label: '🔧', angle: 315, radius: 150, delay: 0.7 },
];

function OrbitItem({ label, angle, radius, delay }: { label: string; angle: number; radius: number; delay: number }) {
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;

  return (
    <motion.div
      className="absolute flex items-center justify-center"
      style={{ left: '50%', top: '50%' }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: [x - 16, x - 12, x - 16],
        y: [y - 16, y - 20, y - 16],
      }}
      transition={{
        opacity: { delay: delay + 1.4, duration: 0.5 },
        scale: { delay: delay + 1.4, duration: 0.5, type: 'spring', stiffness: 300 },
        x: { delay: delay + 1.4, duration: 3 + delay, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' },
        y: { delay: delay + 1.4, duration: 3 + delay, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' },
      }}
    >
      <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl border border-[#E0E7FF]">
        {label}
      </div>
    </motion.div>
  );
}

export function SplashScreen({ onLogin, onSignup, onGuest }: SplashScreenProps) {
  const wordmark = 'BorrowBuddy'.split('');

  return (
    <MotionConfig reducedMotion="user">
      <div className="fixed inset-0 bg-[#FDFBF7] flex flex-col items-center justify-center z-[500] overflow-hidden">
        {/* Background mesh gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(99,102,241,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 70% 70%, rgba(13,148,136,0.06) 0%, transparent 60%)',
          }}
        />

        {/* Orbit items — hidden on small screens */}
        <div className="absolute hidden md:block">
          {ORBIT_ITEMS.map((item) => (
            <OrbitItem key={item.angle} {...item} />
          ))}
        </div>

        {/* Centre content */}
        <div className="relative flex flex-col items-center gap-6 z-10">
          {/* Loop arrow drawing in */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <LoopArrow size={120} color="#4338CA" strokeWidth={4} animate={true} />
          </motion.div>

          {/* Wordmark letter by letter */}
          <div className="flex items-baseline gap-0" aria-label="BorrowBuddy">
            {wordmark.map((char, i) => (
              <motion.span
                key={i}
                className={`font-display font-extrabold text-4xl md:text-5xl tracking-tight ${i < 6 ? 'text-[#1E1B4B]' : 'text-[#4338CA]'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Tagline */}
          <motion.p
            className="text-stone-500 text-base md:text-lg font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.6 }}
          >
            Borrow instead of buy.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 mt-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Button variant="primary" size="lg" onClick={onLogin} id="splash-login-btn">
              Log in
            </Button>
            <Button variant="secondary" size="lg" onClick={onSignup} id="splash-signup-btn">
              Sign up free
            </Button>
          </motion.div>

          {/* Guest link */}
          <motion.button
            className="text-sm text-stone-400 hover:text-[#4338CA] transition-colors underline underline-offset-4 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3, duration: 0.5 }}
            onClick={onGuest}
            id="splash-guest-btn"
          >
            Continue as guest (demo)
          </motion.button>

          {/* Note */}
          <motion.p
            className="text-xs text-stone-300 text-center max-w-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.5 }}
          >
            Use your email to become verified · Demo only
          </motion.p>
        </div>
      </div>
    </MotionConfig>
  );
}
