// src/components/layout/Footer.tsx
import { Link } from 'react-router-dom';
import { LoopArrow } from '../LoopArrow';

export function Footer() {
  return (
    <footer className="bg-[#1E1B4B] text-white pt-16 pb-8 overflow-hidden relative">
      {/* Oversized wordmark */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="font-display font-extrabold text-white/5 leading-none whitespace-nowrap"
          style={{ fontSize: 'clamp(4rem, 18vw, 14rem)' }}
          aria-hidden="true"
        >
          BorrowBuddy
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-[#4338CA] rounded-full flex items-center justify-center">
                <LoopArrow size={24} color="white" strokeWidth={3} animate={false} />
              </div>
              <span className="font-display font-bold text-xl">
                Borrow<span className="text-[#A5B4FC]">Buddy</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Peer-to-peer item lending for university students. Borrow instead of buy.
            </p>
            <p className="text-white/30 text-xs mt-4">Demo only · No real transactions</p>
          </div>

          {/* Links */}
          {[
            {
              heading: 'Product',
              links: [
                { to: '/explore', label: 'Explore Items' },
                { to: '/how-it-works', label: 'How It Works' },
                { to: '/trust', label: 'Trust & Safety' },
                { to: '/dashboard', label: 'Dashboard' },
              ],
            },
            {
              heading: 'Community',
              links: [
                { to: '/', label: 'For Borrowers' },
                { to: '/', label: 'For Lenders' },
                { to: '/', label: 'University Partners' },
                { to: '/', label: 'Ambassador Program' },
              ],
            },
            {
              heading: 'Company',
              links: [
                { to: '/', label: 'About Us' },
                { to: '/', label: 'Blog' },
                { to: '/', label: 'Privacy Policy' },
                { to: '/', label: 'Terms of Service' },
              ],
            },
          ].map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-display font-bold uppercase tracking-widest text-white/40 mb-4">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="group text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © 2025 BorrowBuddy · Demo project · Not a real service
          </p>
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <span>Made with</span>
            <span className="text-[#FF6B4A]">♥</span>
            <span>React + Vite + Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
