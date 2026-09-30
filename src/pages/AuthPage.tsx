// src/pages/AuthPage.tsx — Full-screen Split-Screen Animated Login/Signup Entry View
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, User, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { LoopArrow, LoopArrowSpinner } from '../components/LoopArrow';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ease } from '../lib/motion';

interface AuthPageProps {
  onSuccess: (name: string) => void;
}

// 6 Orbiting items with lender avatar pill & trust score chip
// 6 Orbiting items with lender avatar pill & trust score chip
const ORBIT_ITEMS = [
  { id: 'calc', icon: '🧮', name: 'Casio ClassWiz', lender: 'Aarav', avatarBg: '#4338CA', trust: 92, angle: 15, radius: 175, delay: 0 },
  { id: 'coat', icon: '🥼', name: 'Lab Coat (M)', lender: 'Priya', avatarBg: '#E11D48', trust: 90, angle: 75, radius: 195, delay: 0.15 },
  { id: 'charger', icon: '🔌', name: '67W Charger', lender: 'Ananya', avatarBg: '#0D9488', trust: 94, angle: 135, radius: 180, delay: 0.3 },
  { id: 'book', icon: '📚', name: 'B.S. Grewal Math', lender: 'Rohan', avatarBg: '#FF6B4A', trust: 88, angle: 195, radius: 200, delay: 0.45 },
  { id: 'umbrella', icon: '☂️', name: 'Wind Umbrella', lender: 'Sneha', avatarBg: '#7C3AED', trust: 91, angle: 255, radius: 185, delay: 0.6 },
  { id: 'ball', icon: '🏏', name: 'Cricket Kit', lender: 'Karthik', avatarBg: '#2563EB', trust: 85, angle: 315, radius: 190, delay: 0.75 },
];

const ROTATING_MESSAGES = [
  'Aarav just lent a Casio ClassWiz calculator',
  'Priya returned a lab coat on time',
  'Rohan saved ₹2,500 this week',
  'Sneha listed an Engineering Drafter kit',
  'Karthik lent a cricket kit for the weekend match',
];

function checkPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: 'bg-stone-200' };
  let s = 0;
  if (password.length >= 8) s += 1;
  if (password.length >= 12) s += 1;
  if (/[A-Z]/.test(password)) s += 1;
  if (/[0-9]/.test(password)) s += 1;
  if (/[^A-Za-z0-9]/.test(password)) s += 1;

  if (s <= 2) return { score: 25, label: 'Weak', color: 'bg-red-400' };
  if (s <= 3) return { score: 50, label: 'Fair', color: 'bg-amber-400' };
  if (s <= 4) return { score: 75, label: 'Good', color: 'bg-teal-500' };
  return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
}

function isUniversityDomain(email: string): boolean {
  return /(@.*(\.edu|\.edu\.in|\.ac\.in|\.ac\.[a-z]+|university|college|institute))/i.test(email.trim());
}

export function AuthPage({ onSuccess }: AuthPageProps) {
  const { login, signup, resetPassword, isConfigured } = useAuth();
  const { addToast } = useToast();

  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [msgIdx, setMsgIdx] = useState(0);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);

  // Errors & loading
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shakeField, setShakeField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Forgot password modal
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Setup help modal
  const [setupModalOpen, setSetupModalOpen] = useState(false);

  // Rotate ticker messages
  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % ROTATING_MESSAGES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const passwordStrength = useMemo(() => checkPasswordStrength(signupPassword), [signupPassword]);
  const isSignupEmailUni = useMemo(() => isUniversityDomain(signupEmail), [signupEmail]);
  const isLoginEmailUni = useMemo(() => isUniversityDomain(loginEmail), [loginEmail]);

  const triggerShake = (field: string) => {
    setShakeField(field);
    setTimeout(() => setShakeField(null), 500);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!loginEmail.trim()) {
      newErrors.loginEmail = 'University email is required';
      triggerShake('loginEmail');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) {
      newErrors.loginEmail = 'Please enter a valid email format';
      triggerShake('loginEmail');
    }

    if (!loginPassword) {
      newErrors.loginPassword = 'Password is required';
      triggerShake('loginPassword');
    } else if (loginPassword.length < 6) {
      newErrors.loginPassword = 'Password must be at least 6 characters';
      triggerShake('loginPassword');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const result = await login(loginEmail, loginPassword);
      if (result.error) {
        setErrors({ form: result.error });
        triggerShake('form');
        setIsSubmitting(false);
        return;
      }

      // Success — trigger exit animation and redirect
      const displayName = loginEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).trim() || 'Member';
      setIsExiting(true);
      onSuccess(displayName);
    } catch {
      setErrors({ form: 'An unexpected error occurred. Please try again.' });
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!signupName.trim() || signupName.trim().length < 2) {
      newErrors.signupName = 'Full name must be at least 2 characters';
      triggerShake('signupName');
    }

    if (!signupEmail.trim()) {
      newErrors.signupEmail = 'University email is required';
      triggerShake('signupEmail');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) {
      newErrors.signupEmail = 'Please enter a valid email format';
      triggerShake('signupEmail');
    }

    if (!signupPassword) {
      newErrors.signupPassword = 'Password is required';
      triggerShake('signupPassword');
    } else if (signupPassword.length < 8) {
      newErrors.signupPassword = 'Password must be at least 8 characters';
      triggerShake('signupPassword');
    }

    if (signupPassword !== signupConfirm) {
      newErrors.signupConfirm = 'Passwords do not match';
      triggerShake('signupConfirm');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const result = await signup(signupName, signupEmail, signupPassword);
      if (result.error) {
        setErrors({ form: result.error });
        triggerShake('form');
        setIsSubmitting(false);
        return;
      }

      setIsExiting(true);
      onSuccess(signupName.trim());
    } catch {
      setErrors({ form: 'Signup failed. Please try again.' });
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      addToast({ type: 'error', title: 'Invalid email', message: 'Please provide a valid university email address.' });
      return;
    }

    setForgotLoading(true);
    const res = await resetPassword(forgotEmail);
    setForgotLoading(false);
    setForgotOpen(false);

    if (res.success) {
      addToast({ type: 'success', title: 'Password Reset', message: res.message });
    } else {
      addToast({ type: 'error', title: 'Reset Error', message: res.message });
    }
  };

  const wordmark = 'BorrowBuddy'.split('');

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`fixed inset-0 z-[999] overflow-y-auto bg-[#FDFBF7] flex items-stretch transition-all duration-700 ${
          isExiting ? 'scale-105 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
        style={{
          clipPath: isExiting ? 'circle(150% at 50% 50%)' : 'circle(100% at 50% 50%)',
        }}
      >
        {/* Quick Demo/Setup Floating Chip */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          {!isConfigured && (
            <button
              onClick={() => setSetupModalOpen(true)}
              className="glass px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-800 hover:bg-white transition-all shadow-sm flex items-center gap-1.5 border border-indigo-200"
            >
              <Sparkles size={14} className="text-[#FF6B4A]" />
              <span>Demo Mode Active · Database Setup</span>
            </button>
          )}
        </div>

        <div className="w-full min-h-screen grid lg:grid-cols-[55fr_45fr]">

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* LEFT 55%: ANIMATED THEME PANEL */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-[#FDFBF7] via-[#F3F0F9] to-[#E9F3F2]">

            {/* Slow moving ambient gradient tints in indigo, teal and coral */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                background: [
                  'radial-gradient(ellipse 65% 55% at 25% 25%, rgba(67,56,202,0.09) 0%, transparent 70%), radial-gradient(ellipse 55% 45% at 75% 75%, rgba(13,148,136,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 20%, rgba(255,107,74,0.06) 0%, transparent 60%)',
                  'radial-gradient(ellipse 60% 50% at 30% 35%, rgba(13,148,136,0.09) 0%, transparent 70%), radial-gradient(ellipse 50% 55% at 70% 65%, rgba(67,56,202,0.09) 0%, transparent 70%), radial-gradient(ellipse 45% 45% at 75% 30%, rgba(255,107,74,0.07) 0%, transparent 60%)',
                  'radial-gradient(ellipse 65% 55% at 25% 25%, rgba(67,56,202,0.09) 0%, transparent 70%), radial-gradient(ellipse 55% 45% at 75% 75%, rgba(13,148,136,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 20%, rgba(255,107,74,0.06) 0%, transparent 60%)',
                ],
              }}
              transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#1E1B4B 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Top brand header */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#4338CA] flex items-center justify-center text-white shadow-md">
                  <LoopArrow size={28} color="white" strokeWidth={3.5} animate={false} />
                </div>
                <div>
                  <span className="font-display font-extrabold text-xl text-[#1E1B4B] tracking-tight">
                    Borrow<span className="text-[#4338CA]">Buddy</span>
                  </span>
                  <span className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Campus Sharing Network</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-indigo-100 text-xs font-bold text-indigo-900 shadow-sm">
                <span className="pulse-dot" />
                <span>14 items active on campus</span>
              </div>
            </div>

            {/* Center animated stage: Loop Arrow + Orbiting Item Pills */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center min-h-[460px]">

              {/* Central Loop Arrow with SVG path drawing in 1.2s */}
              <div className="relative flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease }}
                >
                  <LoopArrow size={180} color="#4338CA" strokeWidth={4.5} animate={true} />
                </motion.div>

                {/* Orbiting items along circular path */}
                {ORBIT_ITEMS.map((item) => {
                  const rad = (item.angle * Math.PI) / 180;
                  const x = Math.cos(rad) * item.radius;
                  const y = Math.sin(rad) * item.radius;

                  return (
                    <motion.div
                      key={item.id}
                      className="absolute flex items-center"
                      style={{ left: '50%', top: '50%' }}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        x: [x - 20, x - 14, x - 20],
                        y: [y - 12, y - 20, y - 12],
                      }}
                      transition={{
                        opacity: { delay: 1.0 + item.delay, duration: 0.5 },
                        scale: { delay: 1.0 + item.delay, duration: 0.5, type: 'spring', stiffness: 260 },
                        x: { delay: 1.0 + item.delay, duration: 3.5 + item.delay * 2, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' },
                        y: { delay: 1.0 + item.delay, duration: 3.5 + item.delay * 2, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' },
                      }}
                    >
                      <motion.div
                        className="glass px-2.5 py-1.5 rounded-2xl shadow-md border border-white/80 flex items-center gap-2 cursor-default group"
                        whileHover={{ scale: 1.08, zIndex: 30 }}
                      >
                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-base shadow-sm border border-stone-100 flex-shrink-0">
                          {item.icon}
                        </div>
                        <div className="pr-1">
                          <p className="text-xs font-bold text-[#1E1B4B] leading-none mb-1">{item.name}</p>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                              style={{ background: item.avatarBg }}
                            >
                              {item.lender.charAt(0)}
                            </span>
                            <span className="text-[10px] text-stone-500 font-medium">{item.lender}</span>
                            <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-1.5 py-0.2 rounded-full border border-teal-200">
                              ★ {item.trust}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Wordmark letter by letter reveal */}
              <div className="flex items-baseline gap-0 mt-8" aria-label="BorrowBuddy">
                {wordmark.map((char, i) => (
                  <motion.span
                    key={i}
                    className={`font-display font-extrabold text-4xl xl:text-5xl tracking-tight ${
                      i < 6 ? 'text-[#1E1B4B]' : 'text-[#4338CA]'
                    }`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + i * 0.04, duration: 0.45, ease }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              {/* Tagline reveal */}
              <motion.p
                className="text-stone-600 text-lg font-medium mt-3 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5, ease }}
              >
                Borrow instead of buy.
              </motion.p>
            </div>

            {/* Bottom rotating message line */}
            <div className="relative z-10 border-t border-stone-200/60 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <AnimatePresence mode="wait">
                  <motion.p
                    key={msgIdx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease }}
                    className="text-xs font-semibold text-stone-600"
                  >
                    {ROTATING_MESSAGES[msgIdx]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <span className="text-[11px] text-stone-400 font-medium">Safe · Verified · Peer-to-Peer</span>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* RIGHT 45%: FORM PANEL */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          <div className="relative flex flex-col justify-center px-6 sm:px-12 md:px-16 py-12 bg-white lg:border-l border-[#E0E7FF]">

            {/* Mobile Header (smaller animated header for mobile view) */}
            <div className="lg:hidden flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#4338CA] flex items-center justify-center text-white shadow-md mb-3">
                <LoopArrow size={32} color="white" strokeWidth={3.5} animate={true} />
              </div>
              <h1 className="font-display font-extrabold text-2xl text-[#1E1B4B]">
                Borrow<span className="text-[#4338CA]">Buddy</span>
              </h1>
              <p className="text-stone-500 text-sm mt-1">Borrow instead of buy.</p>
            </div>

            <div className="max-w-md w-full mx-auto">

              {/* Title & subtitle */}
              <div className="mb-6">
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1E1B4B]">
                  {tab === 'login' ? 'Welcome back 👋' : 'Create your account 🎉'}
                </h2>
                <p className="text-stone-500 text-sm mt-1.5">
                  {tab === 'login'
                    ? 'Log in to borrow items or manage your listings.'
                    : 'Join your university sharing community.'}
                </p>
              </div>

              {/* Sliding Tab Switcher */}
              <div className="relative flex p-1 bg-[#F5F1E8] rounded-2xl mb-6">
                {(['login', 'signup'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTab(t);
                      setErrors({});
                    }}
                    className={`relative flex-1 py-2.5 rounded-xl text-sm font-bold font-display transition-colors cursor-pointer text-center z-10 ${
                      tab === t ? 'text-[#1E1B4B]' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    {tab === t && (
                      <motion.div
                        layoutId="auth-tab-pill"
                        className="absolute inset-0 bg-white rounded-xl shadow-sm border border-stone-200/50"
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                      />
                    )}
                    <span className="relative z-10 capitalize">
                      {t === 'login' ? 'Log in' : 'Sign up'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Global form error */}
              {errors.form && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2"
                >
                  <span className="text-base">⚠️</span>
                  <span>{errors.form}</span>
                </motion.div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* LOGIN FORM */}
              {/* ───────────────────────────────────────────────────────────── */}
              <AnimatePresence mode="wait">
                {tab === 'login' && (
                  <motion.form
                    key="login-form"
                    onSubmit={handleLoginSubmit}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.25, ease }}
                    className="space-y-4"
                    noValidate
                  >
                    {/* University email */}
                    <div className={`relative ${shakeField === 'loginEmail' ? 'animate-shake' : ''}`}>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none">
                          <Mail size={17} />
                        </span>
                        <input
                          id="login-email"
                          type="email"
                          value={loginEmail}
                          onChange={(e) => {
                            setLoginEmail(e.target.value);
                            if (errors.loginEmail) setErrors((prev) => ({ ...prev, loginEmail: '' }));
                          }}
                          placeholder=" "
                          className={`peer w-full pl-10 pr-10 pt-6 pb-2 rounded-2xl border bg-white text-[#1E1B4B] text-base outline-none transition-all ${
                            errors.loginEmail
                              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                              : 'border-[#E0E7FF] focus:border-[#4338CA] focus:ring-3 focus:ring-indigo-100'
                          }`}
                        />
                        <label
                          htmlFor="login-email"
                          className={`absolute left-10 transition-all pointer-events-none font-medium select-none ${
                            loginEmail ? 'top-2 text-xs text-indigo-600' : 'top-1/2 -translate-y-1/2 text-stone-400 text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600'
                          }`}
                        >
                          University email
                        </label>
                        {isLoginEmailUni && (
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-teal-600 flex items-center" title="Recognized University Domain">
                            <ShieldCheck size={18} />
                          </span>
                        )}
                      </div>
                      {errors.loginEmail && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                          <span>•</span> {errors.loginEmail}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className={`relative ${shakeField === 'loginPassword' ? 'animate-shake' : ''}`}>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none">
                          <Lock size={17} />
                        </span>
                        <input
                          id="login-password"
                          type={showLoginPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => {
                            setLoginPassword(e.target.value);
                            if (errors.loginPassword) setErrors((prev) => ({ ...prev, loginPassword: '' }));
                          }}
                          placeholder=" "
                          className={`peer w-full pl-10 pr-12 pt-6 pb-2 rounded-2xl border bg-white text-[#1E1B4B] text-base outline-none transition-all ${
                            errors.loginPassword
                              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                              : 'border-[#E0E7FF] focus:border-[#4338CA] focus:ring-3 focus:ring-indigo-100'
                          }`}
                        />
                        <label
                          htmlFor="login-password"
                          className={`absolute left-10 transition-all pointer-events-none font-medium select-none ${
                            loginPassword ? 'top-2 text-xs text-indigo-600' : 'top-1/2 -translate-y-1/2 text-stone-400 text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600'
                          }`}
                        >
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer p-1"
                          aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                        >
                          {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.loginPassword && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                          <span>•</span> {errors.loginPassword}
                        </p>
                      )}
                    </div>

                    {/* Forgot password link */}
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(loginEmail);
                          setForgotOpen(true);
                        }}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#4338CA] text-white font-display font-bold text-base hover:bg-[#3730A3] active:scale-[0.98] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed mt-4 btn-shine"
                    >
                      {isSubmitting ? (
                        <>
                          <LoopArrowSpinner size={22} color="white" />
                          <span>Logging in…</span>
                        </>
                      ) : (
                        <span>Log in to BorrowBuddy →</span>
                      )}
                    </button>

                    {/* Notice */}
                    <div className="pt-2 text-center">
                      <p className="text-xs text-stone-400">
                        Use any university email (e.g. <code>sofia@oxford.ac.uk</code>).
                      </p>
                    </div>
                  </motion.form>
                )}

                {/* ───────────────────────────────────────────────────────────── */}
                {/* SIGNUP FORM */}
                {/* ───────────────────────────────────────────────────────────── */}
                {tab === 'signup' && (
                  <motion.form
                    key="signup-form"
                    onSubmit={handleSignupSubmit}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25, ease }}
                    className="space-y-4"
                    noValidate
                  >
                    {/* Full Name */}
                    <div className={`relative ${shakeField === 'signupName' ? 'animate-shake' : ''}`}>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none">
                          <User size={17} />
                        </span>
                        <input
                          id="signup-name"
                          type="text"
                          value={signupName}
                          onChange={(e) => {
                            setSignupName(e.target.value);
                            if (errors.signupName) setErrors((prev) => ({ ...prev, signupName: '' }));
                          }}
                          placeholder=" "
                          className={`peer w-full pl-10 pr-4 pt-6 pb-2 rounded-2xl border bg-white text-[#1E1B4B] text-base outline-none transition-all ${
                            errors.signupName
                              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                              : 'border-[#E0E7FF] focus:border-[#4338CA] focus:ring-3 focus:ring-indigo-100'
                          }`}
                        />
                        <label
                          htmlFor="signup-name"
                          className={`absolute left-10 transition-all pointer-events-none font-medium select-none ${
                            signupName ? 'top-2 text-xs text-indigo-600' : 'top-1/2 -translate-y-1/2 text-stone-400 text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600'
                          }`}
                        >
                          Full name
                        </label>
                      </div>
                      {errors.signupName && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                          <span>•</span> {errors.signupName}
                        </p>
                      )}
                    </div>

                    {/* University Email */}
                    <div className={`relative ${shakeField === 'signupEmail' ? 'animate-shake' : ''}`}>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none">
                          <Mail size={17} />
                        </span>
                        <input
                          id="signup-email"
                          type="email"
                          value={signupEmail}
                          onChange={(e) => {
                            setSignupEmail(e.target.value);
                            if (errors.signupEmail) setErrors((prev) => ({ ...prev, signupEmail: '' }));
                          }}
                          placeholder=" "
                          className={`peer w-full pl-10 pr-10 pt-6 pb-2 rounded-2xl border bg-white text-[#1E1B4B] text-base outline-none transition-all ${
                            errors.signupEmail
                              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                              : 'border-[#E0E7FF] focus:border-[#4338CA] focus:ring-3 focus:ring-indigo-100'
                          }`}
                        />
                        <label
                          htmlFor="signup-email"
                          className={`absolute left-10 transition-all pointer-events-none font-medium select-none ${
                            signupEmail ? 'top-2 text-xs text-indigo-600' : 'top-1/2 -translate-y-1/2 text-stone-400 text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600'
                          }`}
                        >
                          College email (.edu, .ac.in, .ac.*)
                        </label>
                        {isSignupEmailUni && (
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-teal-600 flex items-center" title="Verified College Email">
                            <ShieldCheck size={18} />
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-[11px] text-stone-500 font-medium">
                        Use your college email (for example name@college.ac.in) to become verified.
                      </p>
                      {errors.signupEmail && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                          <span>•</span> {errors.signupEmail}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className={`relative ${shakeField === 'signupPassword' ? 'animate-shake' : ''}`}>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none">
                          <Lock size={17} />
                        </span>
                        <input
                          id="signup-password"
                          type={showSignupPassword ? 'text' : 'password'}
                          value={signupPassword}
                          onChange={(e) => {
                            setSignupPassword(e.target.value);
                            if (errors.signupPassword) setErrors((prev) => ({ ...prev, signupPassword: '' }));
                          }}
                          placeholder=" "
                          className={`peer w-full pl-10 pr-12 pt-6 pb-2 rounded-2xl border bg-white text-[#1E1B4B] text-base outline-none transition-all ${
                            errors.signupPassword
                              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                              : 'border-[#E0E7FF] focus:border-[#4338CA] focus:ring-3 focus:ring-indigo-100'
                          }`}
                        />
                        <label
                          htmlFor="signup-password"
                          className={`absolute left-10 transition-all pointer-events-none font-medium select-none ${
                            signupPassword ? 'top-2 text-xs text-indigo-600' : 'top-1/2 -translate-y-1/2 text-stone-400 text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600'
                          }`}
                        >
                          Password (min 8 chars)
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer p-1"
                          aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                        >
                          {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                      {/* Password strength meter */}
                      {signupPassword && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-semibold">
                            <span className="text-stone-500">Password strength:</span>
                            <span className="text-stone-700">{passwordStrength.label}</span>
                          </div>
                          <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${passwordStrength.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${passwordStrength.score}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      )}

                      {errors.signupPassword && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                          <span>•</span> {errors.signupPassword}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className={`relative ${shakeField === 'signupConfirm' ? 'animate-shake' : ''}`}>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none">
                          <Lock size={17} />
                        </span>
                        <input
                          id="signup-confirm"
                          type={showSignupConfirm ? 'text' : 'password'}
                          value={signupConfirm}
                          onChange={(e) => {
                            setSignupConfirm(e.target.value);
                            if (errors.signupConfirm) setErrors((prev) => ({ ...prev, signupConfirm: '' }));
                          }}
                          placeholder=" "
                          className={`peer w-full pl-10 pr-12 pt-6 pb-2 rounded-2xl border bg-white text-[#1E1B4B] text-base outline-none transition-all ${
                            errors.signupConfirm
                              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                              : 'border-[#E0E7FF] focus:border-[#4338CA] focus:ring-3 focus:ring-indigo-100'
                          }`}
                        />
                        <label
                          htmlFor="signup-confirm"
                          className={`absolute left-10 transition-all pointer-events-none font-medium select-none ${
                            signupConfirm ? 'top-2 text-xs text-indigo-600' : 'top-1/2 -translate-y-1/2 text-stone-400 text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600'
                          }`}
                        >
                          Confirm password
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowSignupConfirm(!showSignupConfirm)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer p-1"
                          aria-label={showSignupConfirm ? 'Hide password' : 'Show password'}
                        >
                          {showSignupConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.signupConfirm && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                          <span>•</span> {errors.signupConfirm}
                        </p>
                      )}
                    </div>

                    {/* University Verification Notice */}
                    <div className="p-3 bg-[#F0FDF9] rounded-2xl border border-teal-200 flex items-start gap-2.5 text-xs text-teal-800">
                      <ShieldCheck size={16} className="text-teal-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Use your university email to become verified.</p>
                        <p className="text-teal-600 text-[11px] mt-0.5">
                          Verification is based on your academic email domain. No intrusive background checks.
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#4338CA] text-white font-display font-bold text-base hover:bg-[#3730A3] active:scale-[0.98] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed mt-4 btn-shine"
                    >
                      {isSubmitting ? (
                        <>
                          <LoopArrowSpinner size={22} color="white" />
                          <span>Creating account…</span>
                        </>
                      ) : (
                        <span>Create Account 🎉</span>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* FORGOT PASSWORD MODAL */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {forgotOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setForgotOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                className="relative z-10 card p-6 max-w-md w-full bg-white shadow-2xl"
              >
                <h3 className="font-display font-extrabold text-xl text-[#1E1B4B] mb-2">Reset your password</h3>
                <p className="text-stone-500 text-sm mb-5">
                  Enter your university email and we will send you a password reset link.
                </p>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@university.ac.uk"
                      className="w-full px-4 py-3 rounded-xl border border-[#E0E7FF] bg-white text-[#1E1B4B] text-sm focus:outline-none focus:border-[#4338CA]"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setForgotOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-500 hover:bg-stone-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="px-5 py-2.5 rounded-xl bg-[#4338CA] text-white text-sm font-bold shadow-md hover:bg-[#3730A3] cursor-pointer flex items-center gap-2"
                    >
                      {forgotLoading ? 'Sending…' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* DATABASE SETUP MODAL */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {setupModalOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setSetupModalOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                className="relative z-10 card p-6 max-w-lg w-full bg-white shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#4338CA] text-white flex items-center justify-center font-bold">
                      <HelpCircle size={18} />
                    </div>
                    <h3 className="font-display font-extrabold text-xl text-[#1E1B4B]">Supabase Setup Guide</h3>
                  </div>
                  <button
                    onClick={() => setSetupModalOpen(false)}
                    className="p-1 rounded-lg text-stone-400 hover:text-stone-600 text-lg cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 text-sm text-stone-600">
                  <div className="p-3 bg-indigo-50 rounded-xl text-indigo-900 text-xs font-medium">
                    ⚡ <strong>Demo Mode is currently active!</strong> You can log in or sign up immediately with any university email. To connect your live Supabase database, follow the 3 quick steps below:
                  </div>

                  <ol className="space-y-3 list-decimal list-inside text-xs leading-relaxed">
                    <li>
                      <strong>Create a Supabase Project:</strong> Go to{' '}
                      <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-indigo-600 underline">
                        supabase.com
                      </a>{' '}
                      and create a free project.
                    </li>
                    <li>
                      <strong>Run Schema & Seed SQL:</strong> In the Supabase SQL Editor, paste and run:
                      <div className="mt-1 font-mono text-[11px] bg-stone-100 p-2 rounded-lg text-stone-800">
                        1. /supabase/schema.sql<br />
                        2. /supabase/seed.sql
                      </div>
                    </li>
                    <li>
                      <strong>Add Environment Variables:</strong> Create <code>.env</code> in your root directory:
                      <pre className="mt-1 font-mono text-[11px] bg-stone-900 text-stone-100 p-2.5 rounded-lg overflow-x-auto">
                        VITE_SUPABASE_URL=https://your-ref.supabase.co{"\n"}
                        VITE_SUPABASE_ANON_KEY=your-anon-key
                      </pre>
                    </li>
                  </ol>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSetupModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-[#4338CA] text-white font-bold text-sm shadow-md hover:bg-[#3730A3] cursor-pointer"
                  >
                    Got it, thanks!
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </MotionConfig>
  );
}
