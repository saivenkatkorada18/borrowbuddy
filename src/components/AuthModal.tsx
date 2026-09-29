// src/components/AuthModal.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, MotionConfig } from 'motion/react';
import { Mail, Lock, User } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
  onSuccess?: () => void;
}

export function AuthModal({ open, onClose, initialTab = 'login', onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);
  const { login, signup } = useAuth();
  const { addToast } = useToast();

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const signupForm = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  const handleLogin = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      addToast({ type: 'success', title: 'Welcome back! 👋', message: 'You\'re now logged in.' });
      onSuccess?.();
      onClose();
    } catch {
      addToast({ type: 'error', title: 'Login failed', message: 'Please check your credentials.' });
    }
  };

  const handleSignup = async (data: SignupForm) => {
    try {
      await signup(data.name, data.email, data.password);
      addToast({ type: 'success', title: `Welcome, ${data.name}! 🎉`, message: 'Your account has been created.' });
      onSuccess?.();
      onClose();
    } catch {
      addToast({ type: 'error', title: 'Sign up failed', message: 'Please try again.' });
    }
  };

  React.useEffect(() => { setTab(initialTab); }, [initialTab, open]);

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="p-6">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#EEF2FF] rounded-2xl mb-3">
            <svg width="28" height="28" viewBox="0 0 170 150" fill="none" aria-hidden="true">
              <path d="M 60 30 C 90 10, 130 10, 140 40 C 155 75, 130 110, 90 115 C 50 120, 20 90, 25 55 C 30 30, 55 18, 60 30 M 45 22 L 60 30 L 50 45" stroke="#4338CA" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-[#1E1B4B]">
            {tab === 'login' ? 'Welcome back' : 'Join BorrowBuddy'}
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            {tab === 'login' ? 'Log in to your account' : 'Start borrowing and lending today'}
          </p>
        </div>

        {/* Tab switcher */}
        <MotionConfig reducedMotion="user">
          <div className="flex gap-1 p-1 bg-[#F5F1E8] rounded-2xl mb-6">
            {(['login', 'signup'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative flex-1 py-2 rounded-xl text-sm font-semibold font-display transition-colors cursor-pointer ${tab === t ? 'text-[#1E1B4B]' : 'text-stone-400'}`}
              >
                {tab === t && (
                  <motion.div
                    layoutId="auth-tab-bg"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 capitalize">{t === 'login' ? 'Log in' : 'Sign up'}</span>
              </button>
            ))}
          </div>

          {/* Login form */}
          {tab === 'login' && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className="space-y-4"
              noValidate
            >
              <Input
                label="University email"
                type="email"
                autoComplete="email"
                icon={<Mail size={16} />}
                error={loginForm.formState.errors.email?.message}
                {...loginForm.register('email')}
              />
              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                icon={<Lock size={16} />}
                error={loginForm.formState.errors.password?.message}
                {...loginForm.register('password')}
              />
              <Button
                variant="primary"
                size="lg"
                loading={loginForm.formState.isSubmitting}
                className="w-full mt-2"
                type="submit"
              >
                Log in
              </Button>
              <p className="text-center text-xs text-stone-400 mt-2">
                Demo only · Use any email & password (min 6 chars)
              </p>
            </motion.form>
          )}

          {/* Signup form */}
          {tab === 'signup' && (
            <motion.form
              key="signup"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              onSubmit={signupForm.handleSubmit(handleSignup)}
              className="space-y-4"
              noValidate
            >
              <Input
                label="Full name"
                type="text"
                autoComplete="name"
                icon={<User size={16} />}
                error={signupForm.formState.errors.name?.message}
                {...signupForm.register('name')}
              />
              <div>
                <Input
                  label="College email (e.g. name@college.ac.in)"
                  type="email"
                  autoComplete="email"
                  icon={<Mail size={16} />}
                  error={signupForm.formState.errors.email?.message}
                  {...signupForm.register('email')}
                />
                <p className="mt-1 text-[11px] text-stone-500 font-medium">
                  Use your college email (for example name@college.ac.in) to become verified.
                </p>
              </div>
              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                icon={<Lock size={16} />}
                error={signupForm.formState.errors.password?.message}
                {...signupForm.register('password')}
              />
              <Button
                variant="primary"
                size="lg"
                loading={signupForm.formState.isSubmitting}
                className="w-full mt-2"
                type="submit"
              >
                Create account
              </Button>
              <p className="text-center text-xs text-stone-400 mt-2">
                Use your university email to get verified · Demo only
              </p>
            </motion.form>
          )}
        </MotionConfig>
      </div>
    </Modal>
  );
}
