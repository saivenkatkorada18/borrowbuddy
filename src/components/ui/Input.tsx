// src/components/ui/Input.tsx — Floating label input
import React, { useState } from 'react';
import { motion, MotionConfig } from 'motion/react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, onChange, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    const [hasVal, setHasVal] = useState(Boolean(props.value || props.defaultValue));
    const isFloated =
      focused ||
      hasVal ||
      Boolean(props.value || props.defaultValue) ||
      props.type === 'date' ||
      props.type === 'time' ||
      props.type === 'datetime-local';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasVal(Boolean(e.target.value));
      onChange?.(e);
    };

    return (
      <MotionConfig reducedMotion="user">
        <div className={cn('relative', className)}>
          <div className="relative">
            {icon && (
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none">
                {icon}
              </span>
            )}
            <input
              ref={ref}
              id={inputId}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={handleChange}
              className={cn(
                'peer w-full px-4 pt-6 pb-2 rounded-xl border bg-white text-[#1E1B4B] text-base outline-none transition-all duration-200',
                'border-[#E0E7FF] focus:border-[#4338CA]',
                'focus:shadow-[0_0_0_3px_rgba(67,56,202,0.15)]',
                error && 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]',
                icon ? 'pl-10' : '',
              )}
              {...props}
            />
            <label
              htmlFor={inputId}
              className={cn(
                'absolute left-4 transition-all duration-200 pointer-events-none select-none font-medium',
                icon ? 'left-10' : '',
                isFloated
                  ? 'top-2 text-xs text-indigo-500'
                  : 'top-1/2 -translate-y-1/2 text-stone-400 text-base',
              )}
            >
              {label}
            </label>
            {/* Animated focus ring */}
            {focused && (
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ boxShadow: error ? '0 0 0 3px rgba(239,68,68,0.15)' : '0 0 0 3px rgba(67,56,202,0.15)' }}
              />
            )}
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="6" fill="#FCA5A5" />
                <path d="M7 4v3M7 9.5v.5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {error}
            </motion.p>
          )}
        </div>
      </MotionConfig>
    );
  },
);

Input.displayName = 'Input';

// Textarea variant
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, onChange, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    const [hasVal, setHasVal] = useState(Boolean(props.value || props.defaultValue));
    const isFloated = focused || hasVal || Boolean(props.value || props.defaultValue);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHasVal(Boolean(e.target.value));
      onChange?.(e);
    };

    return (
      <div className={cn('relative', className)}>
        <textarea
          ref={ref}
          id={inputId}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={handleChange}
          rows={4}
          className={cn(
            'peer w-full px-4 pt-7 pb-3 rounded-xl border bg-white text-[#1E1B4B] text-base outline-none transition-all duration-200 resize-none',
            'border-[#E0E7FF] focus:border-[#4338CA]',
            'focus:shadow-[0_0_0_3px_rgba(67,56,202,0.15)]',
            error && 'border-red-400 focus:border-red-500',
          )}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            'absolute left-4 transition-all duration-200 pointer-events-none select-none font-medium',
            isFloated
              ? 'top-2 text-xs text-indigo-500'
              : 'top-4 text-stone-400 text-base',
          )}
        >
          {label}
        </label>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
