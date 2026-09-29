// src/components/ui/Toast.tsx
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { toastVariants } from '../../lib/motion';

const ICONS = {
  success: <CheckCircle size={18} className="text-teal-500" />,
  error: <AlertCircle size={18} className="text-red-500" />,
  info: <Info size={18} className="text-[#4338CA]" />,
  warning: <AlertTriangle size={18} className="text-amber-500" />,
};

const COLORS = {
  success: 'border-teal-200 bg-teal-50',
  error: 'border-red-200 bg-red-50',
  info: 'border-indigo-200 bg-[#EEF2FF]',
  warning: 'border-amber-200 bg-amber-50',
};

const PROGRESS_COLORS = {
  success: 'bg-teal-400',
  error: 'bg-red-400',
  info: 'bg-[#4338CA]',
  warning: 'bg-amber-400',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none"
        aria-live="polite"
        aria-label="Notifications"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              variants={toastVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={`pointer-events-auto relative w-80 rounded-2xl border shadow-lg overflow-hidden ${COLORS[toast.type]}`}
              role="alert"
            >
              {/* Progress bar */}
              <motion.div
                className={`absolute top-0 left-0 h-1 ${PROGRESS_COLORS[toast.type]}`}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: 'linear' }}
              />
              <div className="flex items-start gap-3 p-4 pt-5">
                <span className="flex-shrink-0 mt-0.5">{ICONS[toast.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold font-display text-sm text-[#1E1B4B]">{toast.title}</p>
                  {toast.message && (
                    <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{toast.message}</p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-white/60 transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
