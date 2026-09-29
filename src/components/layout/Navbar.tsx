// src/components/layout/Navbar.tsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LoopArrow } from '../LoopArrow';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

const NAV_LINKS = [
  { href: '/explore', label: 'Explore' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/trust', label: 'Trust & Safety' },
];

interface NavbarProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export function Navbar({ onLoginClick, onSignupClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <motion.nav
        className={cn(
          'fixed top-4 left-1/2 z-[200] w-[calc(100%-2rem)] max-w-5xl',
          '-translate-x-1/2',
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={cn(
            'glass rounded-full px-4 py-2.5 flex items-center justify-between transition-all duration-300',
            scrolled ? 'shadow-lg' : 'shadow-md',
          )}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4338CA] rounded-full px-1"
            aria-label="BorrowBuddy home"
          >
            <div className="w-8 h-8 bg-[#4338CA] rounded-full flex items-center justify-center">
              <LoopArrow size={24} color="white" strokeWidth={3.5} animate={false} />
            </div>
            <span className="font-display font-800 text-lg text-[#1E1B4B] hidden sm:block">
              Borrow<span className="text-[#4338CA]">Buddy</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150',
                  location.pathname === link.href
                    ? 'text-[#4338CA]'
                    : 'text-stone-600 hover:text-[#1E1B4B]',
                )}
              >
                {location.pathname === link.href && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-[#EEF2FF] rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Auth actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button variant="secondary" size="sm" className="hidden sm:flex items-center gap-1.5">
                    <User size={14} />
                    {user?.name?.split(' ')[0]}
                  </Button>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-full text-stone-500 hover:text-[#1E1B4B] hover:bg-[#EEF2FF] transition-colors"
                  aria-label="Log out"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={onLoginClick} className="hidden sm:flex">
                  Log in
                </Button>
                <Button variant="primary" size="sm" onClick={onSignupClick}>
                  Sign up
                </Button>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-full text-stone-600 hover:bg-[#EEF2FF] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X size={20} />
                  </motion.span>
                ) : (
                  <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 glass rounded-3xl p-4 shadow-xl"
            >
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.2 }}
                  >
                    <Link
                      to={link.href}
                      className={cn(
                        'flex items-center px-4 py-3 rounded-2xl text-base font-medium transition-colors',
                        location.pathname === link.href
                          ? 'bg-[#EEF2FF] text-[#4338CA]'
                          : 'text-stone-600 hover:bg-[#EEF2FF]',
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="mt-3 pt-3 border-t border-[#E0E7FF] flex flex-col gap-2">
                  {isAuthenticated ? (
                    <>
                      <Link to="/dashboard">
                        <Button variant="secondary" size="md" className="w-full">
                          Dashboard
                        </Button>
                      </Link>
                      <Button variant="ghost" size="md" onClick={logout} className="w-full">
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="primary" size="md" onClick={onSignupClick} className="w-full">
                        Sign up free
                      </Button>
                      <Button variant="ghost" size="md" onClick={onLoginClick} className="w-full">
                        Log in
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </MotionConfig>
  );
}
