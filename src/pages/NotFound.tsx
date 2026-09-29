// src/pages/NotFound.tsx
import { Link } from 'react-router-dom';
import { motion, MotionConfig } from 'motion/react';
import { LoopArrow } from '../components/LoopArrow';
import { Button } from '../components/ui/Button';
import { Home } from 'lucide-react';

export function NotFound() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center px-6 text-center pt-28 pb-20">
        {/* Looping arrow animation */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="mb-8"
        >
          <LoopArrow size={120} color="#4338CA" strokeWidth={3} animate={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="sticker sticker-coral inline-flex mb-6 text-base px-4 py-2">404</div>
          <h1 className="font-display font-extrabold text-4xl text-[#1E1B4B] mb-4">
            This item was never lent out.
          </h1>
          <p className="text-stone-400 text-lg max-w-sm mx-auto mb-10">
            The page you're looking for doesn't exist. But there's plenty waiting on the Explore page.
          </p>
          <Link to="/">
            <Button variant="primary" size="lg" icon={<Home size={16} />}>
              Back to home
            </Button>
          </Link>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
