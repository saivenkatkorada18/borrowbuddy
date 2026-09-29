// src/components/ui/Button.tsx
import React from 'react';
import { motion, MotionConfig } from 'motion/react';
import { cn } from '../../lib/utils';
import { springBouncy } from '../../lib/motion';

type Variant = 'primary' | 'secondary' | 'ghost' | 'coral' | 'night';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-[#4338CA] text-white hover:bg-[#3730A3] border border-transparent shadow-md hover:shadow-[0_4px_20px_rgba(67,56,202,0.4)]',
  secondary:
    'bg-white text-[#1E1B4B] border border-[#E0E7FF] hover:border-[#A5B4FC] hover:bg-[#EEF2FF]',
  ghost:
    'bg-transparent text-[#4338CA] hover:bg-[#EEF2FF] border border-transparent',
  coral:
    'bg-[#FF6B4A] text-white border border-transparent shadow-md hover:shadow-[0_4px_20px_rgba(255,107,74,0.4)] hover:bg-[#e85a3a]',
  night:
    'bg-[#14123A] text-white border border-white/10 hover:bg-[#1E1B4B]',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-xl gap-1.5',
  md: 'px-6 py-3 text-base rounded-2xl gap-2',
  lg: 'px-8 py-4 text-lg rounded-2xl gap-2.5',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, icon, iconRight = false, className, children, disabled, ...props }, ref) => {
    return (
      <MotionConfig reducedMotion="user">
        <motion.button
          ref={ref}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={springBouncy}
          className={cn(
            'relative inline-flex items-center justify-center font-semibold font-display transition-colors duration-200 btn-shine select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
            variantStyles[variant],
            sizeStyles[size],
            className,
          )}
          disabled={disabled || loading}
          {...(props as React.ComponentProps<typeof motion.button>)}
        >
          {loading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {!iconRight && icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
          {iconRight && icon && <span className="flex-shrink-0">{icon}</span>}
        </motion.button>
      </MotionConfig>
    );
  },
);

Button.displayName = 'Button';
