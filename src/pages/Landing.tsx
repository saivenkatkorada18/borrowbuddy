// src/pages/Landing.tsx — Full landing page with Indian Localisation, INR Savings Calculator, Exam-season row, and 12-Bento Grid
import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, MotionConfig } from 'motion/react';
import { ArrowRight, ChevronRight, Sparkles, BookOpen, Gift, CheckCircle } from 'lucide-react';
import { Reveal } from '../components/motion/Reveal';
import { Stagger, StaggerItem } from '../components/motion/Stagger';
import { CountUp } from '../components/motion/CountUp';
import { Marquee } from '../components/motion/Marquee';
import { Magnetic } from '../components/motion/Magnetic';
import { ItemCard } from '../components/ItemCard';
import { TrustRing } from '../components/TrustRing';
import { ItemArtwork } from '../components/ItemArtwork';
import { Accordion } from '../components/ui/Accordion';
import { Button } from '../components/ui/Button';
import { MOCK_ITEMS, MOCK_USERS, STATS, CATEGORY_META } from '../lib/data';
import { formatINR } from '../lib/utils';
import type { Category } from '../types';

interface LandingProps {
  onLogin?: () => void;
  onSignup?: () => void;
  onExplore?: () => void;
}

// ── Marquee items matching user prompt specification ─────────────────────────
const MARQUEE_TEXTS = [
  { label: 'Calculators', emoji: '🧮' },
  { label: 'Laptops', emoji: '💻' },
  { label: 'Power banks', emoji: '🔋' },
  { label: 'Headphones', emoji: '🎧' },
  { label: 'Chargers & adapters', emoji: '🔌' },
  { label: 'Textbooks', emoji: '📚' },
  { label: 'Lab coats', emoji: '🥼' },
  { label: 'Sports gear', emoji: '🏏' },
  { label: 'Hostel essentials', emoji: '🏠' },
];

// ── Live ticker messages with Indian student context ─────────────────────────
const LIVE_MESSAGES = [
  'Aarav just lent a Casio ClassWiz calculator · 2 min ago',
  'Priya returned a lab coat on time · 5 min ago',
  'Rohan saved ₹2,500 borrowing textbooks · 12 min ago',
  'Sneha listed an Engineering Drafter kit · 20 min ago',
  'Karthik lent a Kashmir willow cricket kit · 35 min ago',
];

// ── 12 Most Popular Categories for Bento Grid ─────────────────────────────────
const POPULAR_BENTO_CATS: Array<{ category: Category; span: string; accent: string; bg: string }> = [
  { category: 'calculators', span: 'col-span-2 row-span-2', accent: '#4338CA', bg: '#EEF2FF' },
  { category: 'laptops', span: 'col-span-1 row-span-1', accent: '#0284C7', bg: '#F0F9FF' },
  { category: 'power-banks', span: 'col-span-1 row-span-1', accent: '#059669', bg: '#ECFDF5' },
  { category: 'headphones', span: 'col-span-1 row-span-1', accent: '#E11D48', bg: '#FFF1F2' },
  { category: 'chargers', span: 'col-span-1 row-span-1', accent: '#7C3AED', bg: '#F5F3FF' },
  { category: 'lab-coats', span: 'col-span-2 row-span-1', accent: '#0D9488', bg: '#F0FDF9' },
  { category: 'books', span: 'col-span-1 row-span-1', accent: '#D97706', bg: '#FFFBEB' },
  { category: 'adapters', span: 'col-span-1 row-span-1', accent: '#2563EB', bg: '#EFF6FF' },
  { category: 'sports', span: 'col-span-1 row-span-1', accent: '#16A34A', bg: '#F0FFF4' },
  { category: 'hostel-essentials', span: 'col-span-1 row-span-1', accent: '#EA580C', bg: '#FFF7ED' },
  { category: 'umbrellas', span: 'col-span-1 row-span-1', accent: '#9333EA', bg: '#FAF5FF' },
  { category: 'electronics', span: 'col-span-1 row-span-1', accent: '#0891B2', bg: '#ECFEFF' },
];

// ── FAQ data rewritten in Indian student context ──────────────────────────────
const FAQ = [
  {
    id: 'f1',
    question: 'How does BorrowBuddy work on campus?',
    answer: 'Browse available items near your block or library, submit a request with your dates and purpose (like semester exams or practical viva), and meet the lender at designated spots like the Central Library foyer or hostel gates. Return on time in clean condition. Simple and zero hassle.',
  },
  {
    id: 'f2',
    question: 'Why borrow instead of buying lab coats or drafters?',
    answer: 'Students often need a white cotton lab coat for only one chemistry semester or an engineering drafter for a 1st-year drawing course. Borrowing from seniors saves hundreds of rupees and stops cupboards from filling with single-use gear.',
  },
  {
    id: 'f3',
    question: 'How does the Trust Score protect high-value items like laptops & cameras?',
    answer: 'Trust Score (0–100) measures on-time return rate, item condition feedback, and verified email. High-value items like MacBooks and DSLR cameras require a minimum trust score of 70–85 to request, ensuring mutual accountability.',
  },
  {
    id: 'f4',
    question: 'Are deposits real or demo?',
    answer: 'All deposits shown (₹0 to ₹8,000) are demo figures to illustrate the platform model. In this demonstration, no real money or bank transactions change hands.',
  },
  {
    id: 'f5',
    question: 'What if an item is accidentally damaged in the hostel?',
    answer: 'Report it promptly through the platform within 24 hours. The dispute resolution process guides both parties to agree on repairs or compensation amicably, backed by college student verification.',
  },
];

// ── Testimonials in Indian student context ────────────────────────────────────
const TESTIMONIALS = [
  {
    id: 't1',
    quote: 'Borrowed a Casio ClassWiz calculator for my semester exams. Saved ₹1,200 and made a new friend in Boys Hostel!',
    name: 'Aarav Sharma',
    course: 'B.Tech CSE, Year 3',
    score: 92,
  },
  {
    id: 't2',
    quote: 'I only needed a lab coat for one practical chemistry term and lab record submission. Borrowed one for free in minutes.',
    name: 'Ananya Iyer',
    course: 'B.Sc Chemistry, Year 2',
    score: 94,
  },
  {
    id: 't3',
    quote: 'Shared my cricket kit and badminton rackets during inter-hostel tournament week. Trust Score makes peer sharing worry-free.',
    name: 'Rohan Mehta',
    course: 'B.Tech ECE, Year 4',
    score: 88,
  },
];

// ── How it works steps ────────────────────────────────────────────────────────
const HOW_STEPS = [
  {
    num: '01',
    title: 'Discover nearby',
    desc: 'Find calculators, lab coats, books, and adapters listed by students in your hostel or department.',
    color: '#4338CA',
  },
  {
    num: '02',
    title: 'Request with dates',
    desc: 'Pick your dates for exams, project viva, or sports week. The lender accepts your request.',
    color: '#0D9488',
  },
  {
    num: '03',
    title: 'Collect & return',
    desc: 'Meet at Central Library, Canteen Court, or hostel entrance. Return on time to boost your Trust Score.',
    color: '#FF6B4A',
  },
];

export function Landing({ onSignup, onExplore }: LandingProps) {
  const navigate = useNavigate();
  const [liveIdx, setLiveIdx] = useState(0);
  const [trustProfile, setTrustProfile] = useState<'aarav' | 'rohan'>('aarav');
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

  // Parallax scroll for hero card stack
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  // Live pill rotation
  useEffect(() => {
    const t = setInterval(() => setLiveIdx((i) => (i + 1) % LIVE_MESSAGES.length), 3200);
    return () => clearInterval(t);
  }, []);

  const handleSave = (id: string) => {
    setSavedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const currentTrustUser = trustProfile === 'aarav' ? MOCK_USERS[0] : MOCK_USERS[2];

  // 1. Popular rotating mix from 8 different categories
  const popularMix = useMemo(() => {
    const targetCats: Category[] = [
      'laptops',
      'power-banks',
      'headphones',
      'calculators',
      'books',
      'lab-coats',
      'adapters',
      'sports',
    ];
    return targetCats
      .map((cat) => MOCK_ITEMS.find((item) => item.category === cat))
      .filter(Boolean) as typeof MOCK_ITEMS;
  }, []);

  // 2. Exam-season essentials row (Calculators, textbooks, drafter, clipboard, pen set)
  const examEssentials = useMemo(() => {
    const ids = ['item-401', 'item-501', 'item-405', 'item-407', 'item-403', 'item-508'];
    return ids.map((id) => MOCK_ITEMS.find((i) => i.id === id)).filter(Boolean) as typeof MOCK_ITEMS;
  }, []);

  // 3. Free to borrow row (Deposit = 0 items)
  const freeItems = useMemo(() => {
    return MOCK_ITEMS.filter((i) => (i.depositINR ?? i.deposit ?? 0) === 0 && i.available).slice(0, 6);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="overflow-x-hidden">
        {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
        <section ref={heroRef} className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-[#FDFBF7]">
          {/* Subtle background blob */}
          <div
            className="absolute top-10 right-0 w-96 h-96 rounded-full pointer-events-none opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(circle, #E0E7FF 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-10 left-10 w-80 h-80 rounded-full pointer-events-none opacity-30 blur-3xl"
            style={{ background: 'radial-gradient(circle, #CCFBF1 0%, transparent 70%)' }}
          />

          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left: Headline & CTA */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEF2FF] border border-[#E0E7FF] text-[#4338CA] text-xs font-bold mb-6">
                <Sparkles size={13} className="text-[#FF6B4A]" />
                <span>Smart student item sharing on campus</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#1E1B4B] leading-[1.08] mb-6 tracking-tight">
                <Headline />
              </h1>

              <p className="text-stone-600 text-lg sm:text-xl mb-8 leading-relaxed max-w-lg">
                Stop spending thousands on items you only need for one semester. Borrow calculators, lab coats, power banks, and books from peers around your campus.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Magnetic>
                  <Button variant="primary" size="lg" onClick={onExplore || (() => navigate('/explore'))} iconRight icon={<ArrowRight size={16} />}>
                    Explore items
                  </Button>
                </Magnetic>
                <Button variant="secondary" size="lg" onClick={onSignup || (() => navigate('/explore'))}>
                  Join with email
                </Button>
              </div>

              <div className="flex items-center gap-6 mt-8 pt-8 border-t border-[#E0E7FF] text-xs text-stone-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-teal-600" /> Free & deposit items
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-teal-600" /> Verified college profiles
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-teal-600" /> ₹0 platform fees
                </span>
              </div>
            </div>

            {/* Right: Floating stacked item cards mockup */}
            <motion.div
              className="relative hidden md:flex items-center justify-center"
              style={{ y: heroY }}
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative w-80 h-96">
                {/* 3 Stacked realistic preview cards with Indian prices and lenders */}
                {[
                  {
                    id: 'hero-1',
                    title: 'Casio FX-991EX ClassWiz',
                    category: 'calculators' as Category,
                    deposit: 350,
                    lender: 'Aarav (92 trust)',
                    seed: 401,
                    campus: 'Central Library',
                    rot: -3,
                    x: 0,
                    y: 0,
                  },
                  {
                    id: 'hero-2',
                    title: 'White Cotton Lab Coat (M)',
                    category: 'lab-coats' as Category,
                    deposit: 0,
                    lender: 'Ananya (94 trust)',
                    seed: 601,
                    campus: 'Science Block',
                    rot: 2,
                    x: 24,
                    y: 28,
                  },
                  {
                    id: 'hero-3',
                    title: 'Mi 20000mAh Power Bank',
                    category: 'power-banks' as Category,
                    deposit: 800,
                    lender: 'Rohan (88 trust)',
                    seed: 201,
                    campus: 'Boys Hostel',
                    rot: -1,
                    x: 48,
                    y: 56,
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.id}
                    className="absolute w-64 card p-4 bg-white/95 backdrop-blur-md border border-[#E0E7FF] shadow-lg cursor-pointer"
                    style={{ left: `${item.x}px`, top: `${item.y}px`, zIndex: 3 - i }}
                    animate={{ rotate: [item.rot, item.rot + 1.5, item.rot] }}
                    transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
                    whileHover={{ zIndex: 10, scale: 1.05, rotate: 0 }}
                    onClick={() => navigate('/explore')}
                  >
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="w-12 h-12 rounded-xl bg-[#F5F1E8] flex items-center justify-center overflow-hidden flex-shrink-0">
                        <ItemArtwork category={item.category} seed={item.seed} size={42} float={false} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1E1B4B] truncate">{item.title}</p>
                        <p className="text-[11px] font-semibold text-[#4338CA]">
                          {item.deposit === 0 ? 'Free to borrow' : `${formatINR(item.deposit)} deposit`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-[#EEF2FF]">
                      <span className="truncate">{item.lender}</span>
                      <span className="bg-stone-100 px-1.5 py-0.5 rounded text-[10px] text-stone-600 truncate max-w-[100px]">
                        {item.campus}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Live activity pill */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={liveIdx}
                  className="absolute -bottom-4 left-0 right-0 mx-auto w-max max-w-[300px] glass rounded-full px-4 py-2 text-xs font-semibold text-stone-700 shadow-xl flex items-center gap-2 border border-white"
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="pulse-dot" />
                  <span className="truncate">{LIVE_MESSAGES[liveIdx]}</span>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* ── MARQUEE STRIP ────────────────────────────────────────────────── */}
        <div className="bg-[#1E1B4B] py-4 overflow-hidden border-y border-[#312E81]">
          <Marquee speed={32}>
            {MARQUEE_TEXTS.map((item) => (
              <span key={item.label} className="inline-flex items-center gap-2 px-6 text-white/80 text-sm font-semibold tracking-wide">
                <span>{item.emoji}</span>
                <span>{item.label}</span>
                <span className="text-white/30 ml-4 font-normal">·</span>
              </span>
            ))}
          </Marquee>
        </div>

        {/* ── IMPACT STRIP (in ₹) ───────────────────────────────────────────── */}
        <section className="py-16 bg-[#FDFBF7] border-b border-[#E0E7FF]/60">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#E0E7FF]">
              {[
                { end: STATS.totalBorrows, suffix: '+', label: 'Items borrowed on campus' },
                { end: STATS.activeLenders, suffix: '+', label: 'Active student lenders' },
                { end: STATS.itemsListed, suffix: '+', label: 'Items listed across blocks' },
                { raw: `₹${STATS.totalSavedINR}`, label: 'Saved by students (demo)' },
              ].map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.1} className="flex flex-col items-center text-center py-4 px-2">
                  <span className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#1E1B4B]">
                    {stat.raw ? stat.raw : <CountUp end={stat.end!} />}
                    {stat.suffix || ''}
                  </span>
                  <p className="text-stone-500 text-xs sm:text-sm mt-2 font-medium">{stat.label}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 12 POPULAR CATEGORIES BENTO GRID + VIEW ALL TILE ─────────────── */}
        <section className="py-20 bg-[#F5F1E8]">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal className="mb-12 text-center">
              <h2 className="section-headline text-[#1E1B4B] mb-3">Browse by category</h2>
              <p className="text-stone-500 text-lg">
                Explore the top campus categories or jump straight into all items.
              </p>
            </Reveal>

            <Stagger className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 auto-rows-[145px]">
              {POPULAR_BENTO_CATS.map((cat) => {
                const meta = CATEGORY_META[cat.category];
                return (
                  <StaggerItem key={cat.category} className={cat.span}>
                    <motion.button
                      className="w-full h-full rounded-3xl p-5 flex flex-col justify-between text-left overflow-hidden relative group cursor-pointer border border-white/70 shadow-sm"
                      style={{ background: cat.bg }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/explore?category=${cat.category}`)}
                      aria-label={`Browse ${meta?.label || cat.category}`}
                    >
                      <div className="absolute -right-3 -bottom-3 opacity-25 group-hover:opacity-40 transition-opacity">
                        <ItemArtwork category={cat.category} seed={10} size={110} float={false} />
                      </div>
                      <div>
                        <span className="text-xl mb-1 block">{meta?.icon}</span>
                        <h3 className="font-display font-extrabold text-[#1E1B4B] text-base sm:text-lg leading-tight">
                          {meta?.label || cat.category}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 text-xs sm:text-sm font-bold" style={{ color: cat.accent }}>
                        <span>Explore</span>
                        <ChevronRight size={14} />
                      </div>
                    </motion.button>
                  </StaggerItem>
                );
              })}

              {/* 13th Tile: "View all categories" */}
              <StaggerItem className="col-span-2 sm:col-span-1 md:col-span-2">
                <motion.button
                  className="w-full h-full rounded-3xl p-6 flex flex-col justify-between text-left overflow-hidden relative group cursor-pointer bg-[#1E1B4B] text-white shadow-md hover:bg-[#312E81] transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/explore')}
                  aria-label="View all categories in Explore"
                >
                  <div>
                    <span className="text-xs uppercase tracking-widest text-teal-400 font-bold mb-1 block">
                      All 16 Categories
                    </span>
                    <h3 className="font-display font-extrabold text-white text-xl leading-tight">
                      View all items & categories →
                    </h3>
                  </div>
                  <p className="text-white/60 text-xs">
                    Stationery, kitchen gear, tools, cameras, and more
                  </p>
                </motion.button>
              </StaggerItem>
            </Stagger>
          </div>
        </section>

        {/* ── POPULAR RIGHT NOW (Mix of 8 categories) ───────────────────────── */}
        <section className="py-20 bg-[#FDFBF7]">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <h2 className="section-headline text-[#1E1B4B] mb-2">Popular right now</h2>
                <p className="text-stone-500">A rotating mix of items students are borrowing this week.</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/explore')} iconRight icon={<ArrowRight size={14} />}>
                See all items ({MOCK_ITEMS.length})
              </Button>
            </Reveal>

            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {popularMix.map((item) => (
                <StaggerItem key={item.id}>
                  <ItemCard item={item} saved={savedItems.has(item.id)} onSave={handleSave} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ── EXAM-SEASON ESSENTIALS (Horizontal Row) ──────────────────────── */}
        <section className="py-20 bg-[#FAF8F5] border-t border-[#E0E7FF]/60">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
                  <BookOpen size={13} className="text-amber-600" />
                  <span>Semester Exam & Viva Season</span>
                </div>
                <h2 className="section-headline text-[#1E1B4B] mb-1">Exam-season essentials</h2>
                <p className="text-stone-500 text-sm">
                  Calculators, syllabus reference textbooks, exam clipboards, and drafting kits for submission week.
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => navigate('/explore?category=calculators')}>
                View calculators & stationery
              </Button>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {examEssentials.map((item) => (
                <ItemCard key={item.id} item={item} saved={savedItems.has(item.id)} onSave={handleSave} />
              ))}
            </div>
          </div>
        </section>

        {/* ── FREE TO BORROW ROW ───────────────────────────────────────────── */}
        <section className="py-20 bg-[#FDFBF7] border-t border-[#E0E7FF]/60">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-2">
                  <Gift size={13} className="text-teal-600" />
                  <span>Zero Deposit Peer Sharing</span>
                </div>
                <h2 className="section-headline text-[#1E1B4B] mb-1">Free to borrow</h2>
                <p className="text-stone-500 text-sm">
                  Lent generously by students who want to help their campus peers with no deposit required.
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => navigate('/explore')}>
                Explore all free items
              </Button>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {freeItems.map((item) => (
                <ItemCard key={item.id} item={item} saved={savedItems.has(item.id)} onSave={handleSave} />
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
        <section className="py-24 bg-[#F5F1E8] overflow-hidden">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal className="text-center mb-16">
              <h2 className="section-headline text-[#1E1B4B] mb-3">How it works</h2>
              <p className="text-stone-500 text-lg">Three steps. Zero hassle on campus.</p>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-8">
              {HOW_STEPS.map((step, i) => (
                <Reveal key={step.num} delay={i * 0.15} className="relative">
                  <div className="card p-8 h-full bg-white border border-[#E0E7FF]">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-display font-extrabold text-white text-lg mb-5"
                      style={{ background: step.color }}
                    >
                      {step.num}
                    </div>
                    <h3 className="font-display font-bold text-xl text-[#1E1B4B] mb-3">{step.title}</h3>
                    <p className="text-stone-500 leading-relaxed text-sm sm:text-base">{step.desc}</p>
                  </div>
                  {i < HOW_STEPS.length - 1 && (
                    <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight size={24} className="text-[#A5B4FC]" />
                    </div>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST SCORE NIGHT SECTION ────────────────────────────────────── */}
        <section className="section-night py-24 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 50% 60% at 20% 50%, rgba(99,102,241,0.2) 0%, transparent 60%), radial-gradient(ellipse 40% 50% at 80% 50%, rgba(13,148,136,0.15) 0%, transparent 60%)',
            }}
          />
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <Reveal className="text-center mb-12">
              <h2 className="section-headline mb-3 text-white">Built on campus trust.</h2>
              <p className="text-white/60 text-lg max-w-lg mx-auto">
                The Trust Score creates accountability without requiring intrusive surveillance.
              </p>
              <p className="text-white/30 text-xs sm:text-sm mt-2">
                Demo model only · Based on on-time returns & verified college domain (.ac.in / .edu)
              </p>
            </Reveal>

            {/* Profile toggle */}
            <div className="flex justify-center gap-3 mb-10">
              {(['aarav', 'rohan'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setTrustProfile(p)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold font-display transition-all cursor-pointer ${
                    trustProfile === p ? 'bg-white text-[#1E1B4B]' : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  {p === 'aarav' ? 'Aarav Sharma (92)' : 'Rohan Mehta (88)'}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Large trust ring */}
              <Reveal className="flex-shrink-0">
                <TrustRing score={currentTrustUser.trustScore} size={200} strokeWidth={12} glow showLabel />
              </Reveal>

              {/* Score breakdown bars */}
              <div className="flex-1 w-full space-y-5">
                {[
                  {
                    label: 'On-time returns',
                    value: Math.round((currentTrustUser.onTimeReturns / currentTrustUser.totalReturns) * 100),
                    weight: '40%',
                  },
                  {
                    label: 'Item condition avg',
                    value: currentTrustUser.trustScore >= 90 ? 98 : 88,
                    weight: '30%',
                  },
                  {
                    label: 'Verified email',
                    value: currentTrustUser.verified ? 100 : 0,
                    weight: '20%',
                  },
                  {
                    label: 'Campus response rate',
                    value: currentTrustUser.trustScore >= 90 ? 95 : 82,
                    weight: '10%',
                  },
                ].map((bar, i) => (
                  <Reveal key={bar.label} delay={i * 0.1}>
                    <div className="flex items-center gap-4">
                      <div className="w-40 flex-shrink-0">
                        <p className="text-white/80 text-sm font-medium">{bar.label}</p>
                        <p className="text-white/30 text-xs">weight: {bar.weight}</p>
                      </div>
                      <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-teal-400 to-indigo-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${bar.value}%` }}
                          transition={{ delay: i * 0.1 + 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                      <span className="text-white/60 text-sm w-10 text-right">{bar.value}%</span>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* Proof badges */}
              <div className="flex flex-col gap-3">
                <div className="sticker sticker-teal !transform-none">✓ Verified .ac.in email</div>
                <div className="sticker sticker-indigo !transform-none">
                  {currentTrustUser.onTimeReturns}/{currentTrustUser.totalReturns} on-time
                </div>
                <div className="sticker sticker-lemon !transform-none">4.9 condition avg</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SAVINGS CALCULATOR WITH ITEM SELECTOR (in ₹) ────────────────── */}
        <section className="py-20 bg-[#FDFBF7]">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal className="text-center mb-12">
              <h2 className="section-headline text-[#1E1B4B] mb-3">Community Savings Calculator</h2>
              <p className="text-stone-500 text-lg">
                See how much money students avoid spending by sharing instead of buying new.
              </p>
            </Reveal>

            <SavingsCalculator />
          </div>
        </section>

        {/* ── TESTIMONIALS (Indian Student Context) ────────────────────────── */}
        <section className="py-20 bg-[#F5F1E8]">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal className="text-center mb-12">
              <h2 className="section-headline text-[#1E1B4B] mb-3">Real student stories</h2>
              <p className="text-stone-500">From hostel wings to library study halls.</p>
            </Reveal>
            <Stagger className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <StaggerItem key={t.id} className="card p-6 flex flex-col gap-4 bg-white border border-[#E0E7FF]">
                  <p className="text-stone-600 italic leading-relaxed text-sm sm:text-base">"{t.quote}"</p>
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[#EEF2FF]">
                    <div className="w-10 h-10 rounded-full bg-[#4338CA] flex items-center justify-center text-white font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold font-display text-sm text-[#1E1B4B]">{t.name}</p>
                      <p className="text-xs text-stone-400">{t.course}</p>
                    </div>
                    <TrustRing score={t.score} size={40} strokeWidth={4} showLabel={false} className="ml-auto" />
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="py-20 bg-[#FDFBF7]">
          <div className="max-w-2xl mx-auto px-6">
            <Reveal className="text-center mb-12">
              <h2 className="section-headline text-[#1E1B4B] mb-3">Frequently Asked Questions</h2>
            </Reveal>
            <Accordion items={FAQ} />
          </div>
        </section>

        {/* ── FINAL CTA (night) ─────────────────────────────────────────────── */}
        <section className="section-night py-28 relative overflow-hidden text-center">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,107,74,0.12) 0%, transparent 60%)',
            }}
          />
          <Reveal className="max-w-2xl mx-auto px-6 relative z-10">
            <h2 className="section-headline mb-6 text-white">
              Start borrowing.<br />
              <span className="text-[#FF6B4A]">Stop buying.</span>
            </h2>
            <p className="text-white/60 text-lg mb-10">
              Join thousands of Indian students who share smarter across campus.
            </p>
            <Magnetic>
              <Button
                variant="coral"
                size="lg"
                className="glow-coral text-xl px-10 py-5"
                onClick={onSignup || (() => navigate('/explore'))}
                id="final-cta-btn"
              >
                Join BorrowBuddy →
              </Button>
            </Magnetic>
          </Reveal>
        </section>
      </div>
    </MotionConfig>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Headline() {
  const words = ['Borrow what you', 'need.', 'Share what you', 'have.'];
  return (
    <motion.span className="block">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="block"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {i === 1 || i === 3 ? <HighlightWord word={word} /> : word}
        </motion.span>
      ))}
    </motion.span>
  );
}

function HighlightWord({ word }: { word: string }) {
  return (
    <span className="relative inline-block text-[#4338CA]">
      {word}
      <svg
        className="absolute -bottom-2 left-0 w-full overflow-visible"
        height="12"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d="M 2 8 Q 25 2 50 8 Q 75 14 98 8"
          stroke="#FF6B4A"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </span>
  );
}

// ── Savings Calculator with Item Selector in INR ──────────────────────────────
const ITEM_PRICES = [
  { id: 'calc', name: 'Calculator', price: 1000, icon: '🧮' },
  { id: 'coat', name: 'Lab coat', price: 450, icon: '🥼' },
  { id: 'book', name: 'Textbook', price: 800, icon: '📚' },
  { id: 'power', name: 'Power bank', price: 1200, icon: '🔋' },
];

function SavingsCalculator() {
  const [students, setStudents] = useState(120);
  const [selectedItemId, setSelectedItemId] = useState('calc');

  const selectedItem = ITEM_PRICES.find((i) => i.id === selectedItemId) || ITEM_PRICES[0];
  // Calculate avoided duplicate purchases and spend avoided
  const avoidedPurchases = Math.round(students * 1.5);
  const spendAvoided = avoidedPurchases * selectedItem.price;

  return (
    <Reveal className="card p-8 max-w-xl mx-auto text-center bg-white border border-[#E0E7FF] shadow-md">
      <h3 className="font-display font-bold text-[#1E1B4B] text-xl mb-1">
        Student Community Spend Avoided
      </h3>
      <p className="text-stone-500 text-sm mb-6">
        Select an essential campus item and drag the slider to estimate cumulative savings.
      </p>

      {/* Item selector chips */}
      <div className="flex gap-2 justify-center flex-wrap mb-6">
        {ITEM_PRICES.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedItemId(item.id)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
              selectedItemId === item.id
                ? 'bg-[#4338CA] text-white border-[#4338CA] shadow-sm'
                : 'bg-[#F9FAFB] text-stone-600 border-[#E5E7EB] hover:border-[#A5B4FC]'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
            <span className={selectedItemId === item.id ? 'text-white/80' : 'text-stone-400 font-normal'}>
              (₹{item.price})
            </span>
          </button>
        ))}
      </div>

      {/* Student Count Slider (10 to 500) */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-xs text-stone-400 w-8 font-semibold">10</span>
        <input
          type="range"
          min={10}
          max={500}
          step={5}
          value={students}
          onChange={(e) => setStudents(Number(e.target.value))}
          className="flex-1 accent-[#4338CA]"
          aria-label="Number of students on platform"
        />
        <span className="text-xs text-stone-400 w-12 font-semibold">500</span>
      </div>

      <div className="text-2xl font-display font-extrabold text-[#1E1B4B] mb-6">
        {students} participating students
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#EEF2FF] rounded-2xl p-5 border border-[#E0E7FF]">
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#4338CA]">
            <CountUp end={avoidedPurchases} />
          </div>
          <div className="text-xs text-stone-600 mt-1 font-medium">
            duplicate {selectedItem.name.toLowerCase()} purchases avoided
          </div>
        </div>

        <div className="bg-[#F0FDF9] rounded-2xl p-5 border border-teal-100">
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-teal-700">
            <CountUp end={spendAvoided} prefix="₹" />
          </div>
          <div className="text-xs text-teal-800 mt-1 font-medium">
            Community spend avoided
          </div>
        </div>
      </div>

      <p className="text-[11px] text-stone-400 mt-4">
        Demo simulation based on standard Indian college campus retail prices.
      </p>
    </Reveal>
  );
}
