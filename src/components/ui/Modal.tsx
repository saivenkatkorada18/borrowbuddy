// src/components/ui/Modal.tsx
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { X } from 'lucide-react';
import { backdropVariants, scaleInVariants, staggerContainerVariants } from '../../lib/motion';
import { cn } from '../../lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Modal({ open, onClose, title, children, size = 'md', className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Focus trap + Esc handler
  useEffect(() => {
    if (!open) return;
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];

    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        if (!focusable?.length) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="absolute inset-0 bg-[#1E1B4B]/50 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Panel */}
            <motion.div
              ref={panelRef}
              variants={scaleInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                'relative w-full bg-white rounded-3xl shadow-2xl overflow-hidden',
                sizeMap[size],
                className,
              )}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E0E7FF]">
                  <h2 className="text-xl font-bold font-display text-[#1E1B4B]">{title}</h2>
                  <button
                    ref={firstFocusableRef}
                    onClick={onClose}
                    className="p-2 rounded-xl text-stone-400 hover:text-[#1E1B4B] hover:bg-[#EEF2FF] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4338CA]"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}

              {/* Content with stagger */}
              <motion.div
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {children}
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
