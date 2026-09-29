// src/components/ui/Accordion.tsx
import { useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <MotionConfig reducedMotion="user">
      <div className={cn('space-y-3', className)} role="list">
        {items.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={cn(
                'rounded-2xl border overflow-hidden transition-colors duration-200',
                isOpen ? 'border-[#A5B4FC] bg-[#EEF2FF]/50' : 'border-[#E0E7FF] bg-white',
              )}
              role="listitem"
            >
              <button
                id={`accordion-btn-${item.id}`}
                aria-expanded={isOpen}
                aria-controls={`accordion-panel-${item.id}`}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="w-full flex items-center justify-between px-6 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4338CA] focus-visible:outline-offset-2 rounded-2xl"
              >
                <span className={cn('font-semibold font-display text-base', isOpen ? 'text-[#4338CA]' : 'text-[#1E1B4B]')}>
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className={cn('flex-shrink-0 ml-4', isOpen ? 'text-[#4338CA]' : 'text-stone-400')}
                >
                  <Plus size={20} />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`accordion-panel-${item.id}`}
                    role="region"
                    aria-labelledby={`accordion-btn-${item.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="px-6 pb-5 text-stone-600 leading-relaxed">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </MotionConfig>
  );
}
