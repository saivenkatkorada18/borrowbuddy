// src/pages/Dashboard.tsx — Student Dashboard with Indian Rupee, 16 categories listing modal, and campus selection
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Clock, Package, TrendingUp, Plus } from 'lucide-react';
import { getMyBorrowings, getMyListings, createItem } from '../lib/api';
import { formatINR, formatDateIndian, getTrustLabel } from '../lib/utils';
import { ALL_CATEGORIES, CATEGORY_META, INDIAN_CAMPUSES } from '../lib/data';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { TrustRing } from '../components/TrustRing';
import { ItemArtwork } from '../components/ItemArtwork';
import { ItemCard } from '../components/ItemCard';
import { Tabs, TabPanel } from '../components/ui/Tabs';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Reveal } from '../components/motion/Reveal';
import { CountUp } from '../components/motion/CountUp';
import type { BorrowRequest, Item } from '../types';

const listSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  category: z.enum([
    'calculators',
    'lab-coats',
    'books',
    'chargers',
    'adapters',
    'power-banks',
    'laptops',
    'headphones',
    'electronics',
    'umbrellas',
    'sports',
    'tools',
    'kitchen',
    'stationery',
    'hostel-essentials',
    'cameras',
  ] as [string, ...string[]]),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  depositINR: z
    .string()
    .min(1, 'Please enter a deposit amount in ₹')
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && Number.isInteger(num) && num >= 0 && num <= 10000;
    }, 'Deposit must be an integer between ₹0 and ₹10,000'),
  campus: z.string().min(1, 'Please choose a campus zone'),
  condition: z.enum(['Excellent', 'Good', 'Fair']),
});
type ListForm = z.infer<typeof listSchema>;

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-teal-50 text-teal-700',
  pending: 'bg-amber-50 text-amber-700',
  returned: 'bg-[#EEF2FF] text-[#4338CA]',
  approved: 'bg-green-50 text-green-700',
  declined: 'bg-red-50 text-red-500',
};

const TABS = [
  { id: 'overview', label: 'Overview', icon: <TrendingUp size={14} /> },
  { id: 'borrowing', label: 'Borrowing', icon: <Package size={14} /> },
  { id: 'lending', label: 'My Listed Items', icon: <Clock size={14} /> },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function Dashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [listModalOpen, setListModalOpen] = useState(false);
  const [listStep, setListStep] = useState(1);
  const [borrowing, setBorrowing] = useState<BorrowRequest[]>([]);
  const [lending, setLending] = useState<Item[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<ListForm>({
    resolver: zodResolver(listSchema) as any,
    defaultValues: {
      category: 'calculators',
      campus: 'Central Library',
      condition: 'Good',
      depositINR: '0',
    },
  });

  // Load borrowing and lending data from API
  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      if (!user) return;
      try {
        const [borrows, items] = await Promise.all([
          getMyBorrowings(user.id),
          getMyListings(user.id),
        ]);
        if (mounted) {
          setBorrowing(borrows);
          setLending(items);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, [user]);

  const activeBorrow = borrowing.find((r) => r.status === 'pending');

  const onList = form.handleSubmit(async (data) => {
    if (listStep < 2) {
      setListStep(2);
      return;
    }
    if (!user) return;
    try {
      const depositNum = parseInt(data.depositINR, 10) || 0;
      await createItem(
        {
          title: data.title,
          category: data.category,
          description: data.description,
          condition: data.condition,
          depositINR: depositNum,
          campus: data.campus,
          minTrustRequired: depositNum >= 4000 ? 70 : 0,
        },
        {
          id: user.id,
          name: user.name,
          email: user.email,
          trustScore: user.trustScore,
          verified: user.verified,
        }
      );
      addToast({
        type: 'success',
        title: 'Item listed on campus! 🎉',
        message: 'Your item is now visible to students across all blocks.',
      });
      setListModalOpen(false);
      setListStep(1);
      form.reset();
      // Refresh listings
      const items = await getMyListings(user.id);
      setLending(items);
    } catch (err) {
      console.error('Failed to list item:', err);
      addToast({ type: 'error', title: 'Error', message: 'Could not list item. Please try again.' });
    }
  });

  if (!user) return null;

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#F5F1E8] pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-6">

          {/* Welcome header personalised with logged-in user's name */}
          <Reveal className="card p-6 mb-6 bg-white border border-[#E0E7FF]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <TrustRing score={user.trustScore} size={72} strokeWidth={6} glow />
              <div className="flex-1">
                <p className="text-stone-400 text-xs sm:text-sm font-medium">{getGreeting()},</p>
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1E1B4B]">
                  {user.name}
                </h1>
                <p className={`text-xs sm:text-sm font-semibold ${getTrustLabel(user.trustScore).color} mt-0.5`}>
                  {getTrustLabel(user.trustScore).label} · Trust Score {user.trustScore} · {user.course || 'Campus Member'}
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => { setListStep(1); setListModalOpen(true); }}
                icon={<Plus size={14} />}
                className="shadow-sm"
              >
                List an item
              </Button>
            </div>
          </Reveal>

          {/* Return reminder */}
          {activeBorrow && (
            <Reveal className="mb-6">
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 flex items-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0"
                >
                  <Clock size={20} />
                </motion.div>
                <div>
                  <p className="font-semibold font-display text-amber-900 text-sm">Return due soon</p>
                  <p className="text-amber-700 text-xs">
                    "{activeBorrow.item.title}" — due {formatDateIndian(activeBorrow.endDate)}
                  </p>
                </div>
                <span className="ml-auto sticker sticker-lemon">Due in 2 days</span>
              </div>
            </Reveal>
          )}

          {/* Quick stats in Indian Rupee */}
          <Reveal className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Items borrowed', value: 8, icon: '📦' },
              { label: 'Items listed', value: lending.length || 3, icon: '📋' },
              { label: 'Estimated savings', value: 3600, prefix: '₹', icon: '💰' },
            ].map((stat) => (
              <div key={stat.label} className="card p-4 text-center bg-white border border-[#E0E7FF]">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="font-display font-extrabold text-xl sm:text-2xl text-[#1E1B4B]">
                  {stat.prefix || ''}<CountUp end={stat.value} />
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </Reveal>

          {/* Tabs */}
          <Reveal className="mb-6">
            <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
          </Reveal>

          {/* Tab content */}
          <TabPanel id="overview" activeTab={activeTab}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6 bg-white border border-[#E0E7FF]">
                <h2 className="font-display font-bold text-lg text-[#1E1B4B] mb-4">Recent activity</h2>
                <div className="space-y-3">
                  {borrowing.length > 0 ? (
                    borrowing.slice(0, 4).map((req) => (
                      <div key={req.id} className="flex items-center gap-3 py-2 border-b border-[#F3F4F6] last:border-0">
                        <ItemArtwork category={req.item.category} seed={req.item.imageSeed} size={40} float={false} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-[#1E1B4B] truncate">{req.item.title}</p>
                          <p className="text-xs text-stone-400">
                            {formatDateIndian(req.startDate)} → {formatDateIndian(req.endDate)}
                          </p>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[req.status] || 'bg-stone-100 text-stone-600'}`}>
                          {req.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-stone-400 text-xs py-4 text-center">No recent borrow requests</p>
                  )}
                </div>
              </div>

              {/* Quick lending summary */}
              <div className="card p-6 bg-white border border-[#E0E7FF]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-display font-bold text-lg text-[#1E1B4B]">My items in circulation</h2>
                  <Button variant="ghost" size="sm" onClick={() => { setListStep(1); setListModalOpen(true); }}>
                    + Add item
                  </Button>
                </div>
                <div className="space-y-3">
                  {lending.length > 0 ? (
                    lending.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-3 py-2 border-b border-[#F3F4F6] last:border-0">
                        <ItemArtwork category={item.category} seed={item.imageSeed} size={40} float={false} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-[#1E1B4B] truncate">{item.title}</p>
                          <p className="text-xs text-teal-600 font-semibold">
                            {(item.depositINR ?? item.deposit ?? 0) === 0 ? 'Free deposit' : `${formatINR(item.depositINR ?? item.deposit ?? 0)} deposit`}
                          </p>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${item.available ? 'bg-teal-50 text-teal-700' : 'bg-stone-100 text-stone-500'}`}>
                          {item.available ? 'Available' : 'Lent out'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-stone-400 text-xs">
                      You haven't listed any items yet. Help campus peers and earn Trust Score!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel id="borrowing" activeTab={activeTab}>
            <div className="card p-6 bg-white border border-[#E0E7FF]">
              <h2 className="font-display font-bold text-lg text-[#1E1B4B] mb-4">My Borrow Requests</h2>
              <div className="space-y-4">
                {borrowing.map((req) => (
                  <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] gap-4">
                    <div className="flex items-center gap-4">
                      <ItemArtwork category={req.item.category} seed={req.item.imageSeed} size={54} float={false} />
                      <div>
                        <h3 className="font-display font-bold text-base text-[#1E1B4B]">{req.item.title}</h3>
                        <p className="text-xs text-stone-500">
                          Lender: <strong>{req.lender?.name || 'Peer'}</strong> ({req.lender?.course || 'Campus'})
                        </p>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {formatDateIndian(req.startDate)} to {formatDateIndian(req.endDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#4338CA]">
                        Deposit: {formatINR(req.item.depositINR ?? req.item.deposit ?? 0)}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[req.status] || 'bg-stone-100 text-stone-600'}`}>
                        {req.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>

          <TabPanel id="lending" activeTab={activeTab}>
            <div className="card p-6 bg-white border border-[#E0E7FF]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-display font-bold text-lg text-[#1E1B4B]">My Listed Items ({lending.length})</h2>
                  <p className="text-stone-400 text-xs">Items you are sharing with students on campus.</p>
                </div>
                <Button variant="primary" size="sm" onClick={() => { setListStep(1); setListModalOpen(true); }} icon={<Plus size={14} />}>
                  List new item
                </Button>
              </div>

              {lending.length === 0 ? (
                <div className="text-center py-12 text-stone-400">
                  <p className="text-sm font-medium mb-4">No items listed yet.</p>
                  <Button variant="secondary" onClick={() => { setListStep(1); setListModalOpen(true); }}>
                    List your first item
                  </Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lending.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </TabPanel>

        </div>

        {/* List Item Modal with 16 Categories and Deposit in ₹ (0-10,000) */}
        <Modal
          open={listModalOpen}
          onClose={() => { setListModalOpen(false); setListStep(1); form.reset(); }}
          title="List an item for borrowing"
          size="md"
        >
          <div className="px-6 pb-6">
            {/* Step indicator */}
            <div className="flex gap-2 mb-6">
              {['Item details', 'Pricing & Campus'].map((s, i) => (
                <div key={s} className="flex-1">
                  <div className={`h-1.5 rounded-full mb-1 transition-colors ${listStep > i ? 'bg-[#4338CA]' : 'bg-[#E0E7FF]'}`} />
                  <span className={`text-xs font-semibold ${listStep > i ? 'text-[#4338CA]' : 'text-stone-400'}`}>{s}</span>
                </div>
              ))}
            </div>

            <form onSubmit={onList} className="space-y-4" noValidate>
              <AnimatePresence mode="wait">
                {listStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <Input
                      label="Item Title"
                      placeholder="e.g. Casio FX-991EX Calculator, Cotton Lab Coat (M), Mi Power Bank"
                      error={form.formState.errors.title?.message}
                      {...form.register('title')}
                    />

                    <div>
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">
                        Category
                      </label>
                      <select
                        className="w-full px-4 py-3 rounded-xl border border-[#E0E7FF] bg-white text-sm text-[#1E1B4B] focus:outline-none focus:border-[#4338CA]"
                        {...form.register('category')}
                        aria-label="Category selector"
                      >
                        {ALL_CATEGORIES.map((c) => {
                          const meta = CATEGORY_META[c];
                          return (
                            <option key={c} value={c}>
                              {meta?.icon} {meta?.label || c}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <Textarea
                      label="Description"
                      placeholder="Describe the condition, included cables or cases, and helpful details for fellow students (min 20 characters)..."
                      error={form.formState.errors.description?.message}
                      {...form.register('description')}
                    />

                    <div>
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">
                        Condition
                      </label>
                      <div className="flex gap-2">
                        {(['Excellent', 'Good', 'Fair'] as const).map((c) => (
                          <label key={c} className="flex-1">
                            <input
                              type="radio"
                              value={c}
                              {...form.register('condition')}
                              className="sr-only"
                              defaultChecked={c === 'Good'}
                            />
                            <div
                              className={`cursor-pointer text-center px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-colors ${
                                form.watch('condition') === c
                                  ? 'bg-[#4338CA] text-white border-[#4338CA]'
                                  : 'bg-white text-stone-600 border-[#E0E7FF]'
                              }`}
                            >
                              {c}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Button variant="primary" size="lg" className="w-full" type="submit">
                      Next: Pricing & Campus →
                    </Button>
                  </motion.div>
                )}

                {listStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Deposit in ₹ (0 to 10,000, integer only) */}
                    <div>
                      <Input
                        label="Refundable Deposit (₹)"
                        type="number"
                        step="1"
                        min="0"
                        max="10000"
                        placeholder="0 for Free to borrow, or e.g. 500"
                        error={form.formState.errors.depositINR?.message}
                        {...form.register('depositINR')}
                      />
                      <p className="text-xs text-stone-400 mt-1">
                        Enter 0 for free borrowing. Deposits between ₹0 and ₹10,000 (integer only).
                      </p>
                    </div>

                    {/* Campus meetup zone */}
                    <div>
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">
                        Campus Meetup Location
                      </label>
                      <select
                        className="w-full px-4 py-3 rounded-xl border border-[#E0E7FF] bg-white text-sm text-[#1E1B4B] focus:outline-none focus:border-[#4338CA]"
                        {...form.register('campus')}
                        aria-label="Campus meetup location"
                      >
                        {INDIAN_CAMPUSES.map((camp) => (
                          <option key={camp} value={camp}>
                            {camp}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="p-3 bg-[#EEF2FF] rounded-xl text-xs text-[#4338CA] font-medium">
                      ℹ️ Listings with deposits ₹4,000+ automatically require a borrower Trust Score of 70+ to ensure item safety.
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button variant="secondary" size="lg" className="flex-1" type="button" onClick={() => setListStep(1)}>
                        ← Back
                      </Button>
                      <Button variant="primary" size="lg" className="flex-1" type="submit" loading={form.formState.isSubmitting}>
                        Publish Listing 🎉
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </Modal>
      </div>
    </MotionConfig>
  );
}
