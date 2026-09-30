// src/pages/ItemDetail.tsx — Localised Item Detail & Borrow Request Flow in ₹
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { ArrowLeft, MapPin, CheckCircle, ShieldAlert, CreditCard } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getItem, getItems, createRequest } from '../lib/api';
import { formatINR, formatDateIndian } from '../lib/utils';
import { CATEGORY_META } from '../lib/data';
import { openRazorpayCheckout } from '../lib/razorpay';
import { TestModeBanner } from '../components/TestModeBanner';
import { ItemArtwork } from '../components/ItemArtwork';
import { TrustRing } from '../components/TrustRing';
import { ItemCard } from '../components/ItemCard';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Magnetic } from '../components/motion/Magnetic';
import { Reveal } from '../components/motion/Reveal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { Item } from '../types';

const datesSchema = z
  .object({
    startDate: z.string().min(1, 'Please select a start date'),
    endDate: z.string().min(1, 'Please select an end date'),
  })
  .refine((data) => !data.startDate || !data.endDate || data.endDate >= data.startDate, {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  });

const messageSchema = z.object({
  message: z.string().trim().min(10, 'Message must be at least 10 characters'),
});

interface BorrowFormData {
  startDate: string;
  endDate: string;
  message: string;
}

type BorrowStep = 'dates' | 'message' | 'confirm' | 'pending' | 'success';

const stepIndex: Record<BorrowStep, number> = {
  dates: 0,
  message: 1,
  confirm: 2,
  pending: 3,
  success: 3,
};

export function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addToast } = useToast();
  const [item, setItem] = useState<Item | null>(null);
  const [relatedItems, setRelatedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState<BorrowStep>('dates');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [formData, setFormData] = useState<Partial<BorrowFormData>>({});

  const form = useForm<BorrowFormData>({
    defaultValues: {
      startDate: '',
      endDate: '',
      message: '',
    },
  });

  // Load item and related items from API
  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const [itemData, allItems] = await Promise.all([
          getItem(id || ''),
          getItems(),
        ]);
        if (!mounted) return;
        setItem(itemData);
        if (itemData) {
          const related = allItems
            .filter((i) => i.id !== itemData.id && i.category === itemData.category)
            .slice(0, 4);
          setRelatedItems(related);
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to load item:', err);
        if (mounted) setLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#4338CA] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-stone-500">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28">
        <div className="text-center">
          <h1 className="font-display font-extrabold text-3xl text-[#1E1B4B] mb-4">Item not found</h1>
          <Button variant="primary" onClick={() => navigate('/explore')}>Back to Explore</Button>
        </div>
      </div>
    );
  }

  const deposit = item.depositINR ?? item.deposit ?? 0;
  const minTrust = item.minTrustRequired ?? 0;
  const userTrust = user?.trustScore ?? 85;
  const hasTrustIssue = minTrust > 0 && userTrust < minTrust;
  const catLabel = (CATEGORY_META as any)[item.category]?.label || item.category;

  const openModal = () => {
    if (!isAuthenticated) {
      addToast({ type: 'info', title: 'Please log in', message: 'You need a student account to borrow items.' });
      return;
    }
    if (hasTrustIssue) {
      addToast({
        type: 'warning',
        title: 'Trust Score Requirement',
        message: `This item requires a Trust Score of ${minTrust}+. Your current score is ${userTrust}.`,
      });
      return;
    }
    setStep('dates');
    setPaymentId(null);
    setIsProcessingPayment(false);
    const today = new Date().toISOString().split('T')[0];
    const duration = item.suggestedDurationDays || 3;
    const defaultEnd = new Date(Date.now() + duration * 86400000).toISOString().split('T')[0];
    form.reset({
      startDate: today,
      endDate: defaultEnd,
      message: '',
    });
    setFormData({
      startDate: today,
      endDate: defaultEnd,
      message: '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setStep('dates');
    setIsProcessingPayment(false);
  };

  const handleDatesNext = (e: React.FormEvent) => {
    e.preventDefault();
    form.clearErrors();
    const startDate = form.getValues('startDate');
    const endDate = form.getValues('endDate');

    const result = datesSchema.safeParse({ startDate, endDate });
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as 'startDate' | 'endDate';
        if (field) {
          form.setError(field, { message: issue.message });
        }
      });
      return;
    }

    if (item?.maxDurationDays && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > item.maxDurationDays) {
        form.setError('endDate', { message: `Maximum borrow duration is ${item.maxDurationDays} days` });
        return;
      }
    }

    setFormData((prev) => ({ ...prev, startDate, endDate }));
    setStep('message');
  };

  const handleMessageNext = (e: React.FormEvent) => {
    e.preventDefault();
    form.clearErrors('message');
    const message = form.getValues('message');

    const result = messageSchema.safeParse({ message });
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        form.setError('message', { message: issue.message });
      });
      return;
    }

    setFormData((prev) => ({ ...prev, message }));
    setStep('confirm');
  };

  const handleConfirmSubmit = async () => {
    if (!item || !user) return;

    if (deposit > 0) {
      setIsProcessingPayment(true);
      await openRazorpayCheckout({
        amountINR: deposit,
        itemTitle: item.title,
        campus: typeof item.campus === 'string' ? item.campus : 'Campus Zone',
        user: {
          name: user.name,
          email: user.email,
        },
        onSuccess: async (rzpRes) => {
          setIsProcessingPayment(false);
          setPaymentId(rzpRes.razorpay_payment_id);
          setStep('pending');
          try {
            await createRequest(
              {
                itemId: item.id,
                item,
                startDate: formData.startDate || form.getValues('startDate') || '',
                endDate: formData.endDate || form.getValues('endDate') || '',
                message: formData.message || form.getValues('message') || '',
                paymentId: rzpRes.razorpay_payment_id,
                depositAmount: deposit,
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
              title: 'Demo Deposit Authorized',
              message: `Razorpay Transaction ID: ${rzpRes.razorpay_payment_id}`,
            });
            await new Promise((r) => setTimeout(r, 1000));
            setStep('success');
          } catch (err) {
            console.error('Failed to create request after payment:', err);
            addToast({ type: 'error', title: 'Request failed', message: 'Could not submit borrow request.' });
            setStep('confirm');
          }
        },
        onDismiss: () => {
          setIsProcessingPayment(false);
          addToast({
            type: 'info',
            title: 'Payment Dismissed',
            message: 'You can retry Razorpay demo authorization whenever ready.',
          });
        },
        onError: () => {
          setIsProcessingPayment(false);
        },
      });
      return;
    }

    // Zero deposit item
    setStep('pending');
    try {
      await createRequest(
        {
          itemId: item.id,
          item,
          startDate: formData.startDate || form.getValues('startDate') || '',
          endDate: formData.endDate || form.getValues('endDate') || '',
          message: formData.message || form.getValues('message') || '',
          depositAmount: 0,
        },
        {
          id: user.id,
          name: user.name,
          email: user.email,
          trustScore: user.trustScore,
          verified: user.verified,
        }
      );
      await new Promise((r) => setTimeout(r, 1000));
      setStep('success');
    } catch (err) {
      console.error('Failed to create request:', err);
      addToast({ type: 'error', title: 'Request failed', message: 'Could not submit borrow request.' });
      setStep('confirm');
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-6">

          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-500 hover:text-[#4338CA] transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Explore</span>
            </Link>
          </div>

          {/* High-value Trust Warning Banner if applicable */}
          {minTrust >= 70 && (
            <Reveal className="mb-6">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900">
                <ShieldAlert size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold">High-Value Listing Notice: </span>
                  This listing requires a minimum Trust Score of <span className="font-extrabold text-amber-950">{minTrust}</span> to request.
                  {hasTrustIssue ? (
                    <p className="mt-1 text-amber-800">
                      Your current score is <strong>{userTrust}</strong>. Complete more campus item returns on time to unlock high-value laptops and cameras.
                    </p>
                  ) : (
                    <span className="text-amber-800 ml-1">
                      Your score is verified at <strong>{userTrust}</strong>. You are qualified to request this item.
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          )}

          <div className="grid md:grid-cols-[1fr_360px] gap-10 items-start">
            {/* Left: Item information */}
            <div>
              {/* Artwork preview hero */}
              <Reveal className="card p-8 flex items-center justify-center bg-[#F5F1E8] mb-8 relative rounded-3xl overflow-hidden">
                <ItemArtwork category={item.category} seed={item.imageSeed} size={180} float />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="text-xs font-bold text-[#4338CA] uppercase tracking-wider bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                    {catLabel}
                  </span>
                  {item.campus && (
                    <span className="text-xs font-semibold text-stone-700 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <MapPin size={12} className="text-[#4338CA]" />
                      {item.campus}
                    </span>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <span className="sticker sticker-teal text-xs">
                    Condition: {item.condition}
                  </span>
                </div>
              </Reveal>

              {/* Title & Description */}
              <Reveal className="mb-6">
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1E1B4B] mb-3">
                  {item.title}
                </h1>
                <p className="text-stone-600 text-base leading-relaxed">
                  {item.description}
                </p>
              </Reveal>

              {/* Rules & Guidelines */}
              {item.rules && item.rules.length > 0 && (
                <Reveal className="card p-6 mb-6 bg-white border border-[#E0E7FF]">
                  <h2 className="font-display font-bold text-base text-[#1E1B4B] mb-3">
                    Lender's borrowing rules
                  </h2>
                  <ul className="space-y-2">
                    {item.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4338CA] mt-2 flex-shrink-0" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}

              {/* Pickup location info */}
              <Reveal className="card p-5 mb-8 bg-[#EEF2FF]/60 border border-[#E0E7FF]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#4338CA] text-white flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#4338CA] uppercase tracking-wider">Meetup & Pickup Location</p>
                    <p className="text-sm font-semibold text-[#1E1B4B]">{item.pickupMethod || 'Campus meetup spot'}</p>
                    <p className="text-xs text-stone-500">{item.campus} · Approximately {item.distance?.toFixed(1) ?? '0.4'} km away</p>
                  </div>
                </div>
              </Reveal>

              {/* Lender Profile Card */}
              <Reveal className="card p-6 bg-white border border-[#E0E7FF]">
                <h2 className="font-display font-bold text-sm text-stone-400 uppercase tracking-wider mb-4">
                  Lent by student peer
                </h2>
                <div className="flex items-center gap-4">
                  <TrustRing score={item.owner.trustScore} size={64} strokeWidth={5} glow />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-lg text-[#1E1B4B]">{item.owner.name}</span>
                      {item.owner.verified && (
                        <span className="sticker sticker-teal text-[11px]">✓ Verified Email</span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                      {item.owner.course || 'Student Member'}
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      {item.owner.onTimeReturns}/{item.owner.totalReturns} on-time returns · {item.owner.trustScore} Trust Score
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right: Sticky booking panel */}
            <div className="relative">
              <div className="sticky top-28">
                <Reveal className="card p-6 mb-4 bg-white border border-[#E0E7FF] shadow-sm">
                  {/* Pricing Display in ₹ */}
                  <div className="mb-4">
                    {deposit === 0 ? (
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-display font-extrabold text-3xl text-teal-600">Free</span>
                          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">Zero Deposit</span>
                        </div>
                        <p className="text-xs text-stone-400 mt-1">
                          No deposit required. Lent to help peers around campus.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline justify-between gap-1.5 flex-wrap">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-display font-extrabold text-3xl text-[#1E1B4B]">
                              {formatINR(deposit)}
                            </span>
                            <span className="text-xs text-stone-400 font-medium">refundable demo deposit</span>
                          </div>
                          <TestModeBanner compact />
                        </div>
                        <p className="text-xs text-stone-400 mt-1">
                          Held symbolically in Razorpay Sandbox. No real money charged.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Availability indicator */}
                  <div className={`flex items-center gap-2 mb-6 text-xs sm:text-sm font-semibold ${item.available ? 'text-teal-600' : 'text-stone-400'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${item.available ? 'pulse-dot' : 'bg-stone-300'}`} />
                    {item.available ? 'Available to borrow right now' : `Currently borrowed (Available from ${item.availableFrom ? formatDateIndian(item.availableFrom) : 'next week'})`}
                  </div>

                  {/* Action button */}
                  <Magnetic>
                    <Button
                      variant={item.available && !hasTrustIssue ? 'primary' : 'secondary'}
                      size="lg"
                      className="w-full shadow-sm"
                      onClick={openModal}
                      disabled={!item.available || hasTrustIssue}
                      id={`borrow-btn-${item.id}`}
                    >
                      {!item.available
                        ? 'Currently unavailable'
                        : hasTrustIssue
                        ? `Needs Trust Score ${minTrust}+`
                        : 'Request to borrow'}
                    </Button>
                  </Magnetic>

                  <p className="text-center text-[11px] text-stone-400 mt-3 font-medium">
                    Demo application · No real payment or deposit transfer
                  </p>
                </Reveal>
              </div>
            </div>
          </div>

          {/* Related items */}
          {relatedItems.length > 0 && (
            <Reveal className="mt-16">
              <h2 className="font-display font-bold text-2xl text-[#1E1B4B] mb-6">
                More in {catLabel}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedItems.map((ri) => (
                  <ItemCard key={ri.id} item={ri} />
                ))}
              </div>
            </Reveal>
          )}
        </div>

        {/* Borrow Request Modal */}
        <Modal open={modalOpen} onClose={closeModal} title="Request to Borrow" size="md">
          <div className="px-6 pb-6">
            {/* Step progress bar */}
            {step !== 'success' && step !== 'pending' && (
              <div className="flex gap-2 mb-6">
                {['Dates', 'Message', 'Confirm'].map((s, i) => (
                  <div key={s} className="flex-1 flex flex-col gap-1">
                    <div className={`h-1.5 rounded-full transition-colors duration-300 ${stepIndex[step] >= i ? 'bg-[#4338CA]' : 'bg-[#E0E7FF]'}`} />
                    <span className={`text-[11px] font-semibold ${stepIndex[step] >= i ? 'text-[#4338CA]' : 'text-stone-300'}`}>{s}</span>
                  </div>
                ))}
              </div>
            )}

            <AnimatePresence mode="wait">
              {step === 'dates' && (
                <motion.div key="dates" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                  <form onSubmit={handleDatesNext} className="space-y-4">
                    <Input
                      label="Start Date"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      error={form.formState.errors.startDate?.message}
                      {...form.register('startDate')}
                    />
                    <Input
                      label="End Date"
                      type="date"
                      min={form.watch('startDate') || new Date().toISOString().split('T')[0]}
                      error={form.formState.errors.endDate?.message}
                      {...form.register('endDate')}
                    />
                    <div className="text-xs text-stone-500 bg-[#F9FAFB] p-3 rounded-xl border border-stone-200">
                      Suggested borrow duration: <strong>{item.suggestedDurationDays || 3} days</strong> (max {item.maxDurationDays || 7} days).
                    </div>
                    <Button variant="primary" size="lg" className="w-full" type="submit">
                      Next: Add note to lender →
                    </Button>
                  </form>
                </motion.div>
              )}

              {step === 'message' && (
                <motion.div key="message" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                  <form onSubmit={handleMessageNext} className="space-y-4">
                    <Textarea
                      label={`Message to ${item.owner.name}`}
                      placeholder="Hi! I need this for our semester exam / practical viva this week. Will return on time."
                      error={form.formState.errors.message?.message}
                      {...form.register('message')}
                    />
                    <div className="flex gap-3">
                      <Button variant="secondary" size="lg" className="flex-1" type="button" onClick={() => setStep('dates')}>
                        ← Back
                      </Button>
                      <Button variant="primary" size="lg" className="flex-1" type="submit">
                        Review Request →
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 'confirm' && (
                <motion.div key="confirm" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                  <div className="space-y-4">
                    {deposit > 0 && <TestModeBanner amountINR={deposit} />}

                    <div className="card p-4 space-y-2.5 text-xs sm:text-sm bg-[#F9FAFB] border border-[#E5E7EB]">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Item</span>
                        <span className="font-bold text-[#1E1B4B]">{item.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Dates</span>
                        <span className="font-semibold text-stone-800">
                          {formData.startDate ? formatDateIndian(formData.startDate) : ''} → {formData.endDate ? formatDateIndian(formData.endDate) : ''}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Pickup Zone</span>
                        <span className="font-semibold text-stone-800">{item.campus}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-stone-200">
                        <span className="text-stone-500">Refundable Deposit</span>
                        <span className="font-extrabold text-[#4338CA] text-sm">
                          {formatINR(deposit)}
                        </span>
                      </div>
                      {deposit > 0 && (
                        <div className="flex justify-between text-[11px] text-stone-400">
                          <span>Platform Fee (Beta)</span>
                          <span className="text-teal-600 font-semibold">₹0 Free</span>
                        </div>
                      )}
                      {formData.message && (
                        <div className="flex flex-col gap-1 pt-2 border-t border-stone-200">
                          <span className="text-stone-500 text-xs">Note to lender</span>
                          <p className="font-medium text-stone-800 text-xs italic bg-white p-2.5 rounded-lg border border-stone-200">
                            "{formData.message}"
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="secondary"
                        size="lg"
                        className="flex-1"
                        onClick={() => setStep('message')}
                        disabled={isProcessingPayment}
                      >
                        ← Back
                      </Button>
                      <Button
                        variant="primary"
                        size="lg"
                        className="flex-1 shadow-sm flex items-center justify-center gap-2"
                        onClick={handleConfirmSubmit}
                        loading={isProcessingPayment}
                      >
                        {deposit > 0 ? (
                          <>
                            <CreditCard size={18} />
                            <span>Authorize {formatINR(deposit)} (Demo)</span>
                          </>
                        ) : (
                          'Send Request (Free)'
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'pending' && (
                <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-8 gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 rounded-full border-4 border-[#E0E7FF] border-t-[#4338CA]"
                  />
                  <p className="text-stone-600 font-medium text-sm">
                    {deposit > 0 ? 'Connecting to Razorpay Sandbox & submitting request…' : `Submitting request to ${item.owner.name}…`}
                  </p>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 gap-4 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 shadow-sm"
                  >
                    <CheckCircle size={36} />
                  </motion.div>
                  <h3 className="font-display font-extrabold text-2xl text-[#1E1B4B]">Request sent! 🎉</h3>
                  <p className="text-stone-500 text-xs sm:text-sm max-w-sm">
                    {item.owner.name} will be notified. Once accepted, you can coordinate pickup at {item.campus}.
                  </p>

                  {paymentId && (
                    <div className="w-full text-left bg-emerald-50/90 border border-emerald-200 rounded-xl p-3.5 space-y-1.5 text-xs text-emerald-950 mt-1">
                      <div className="flex items-center justify-between font-bold text-emerald-900">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Razorpay Demo Payment Authorized
                        </span>
                        <span className="font-extrabold text-[#4338CA]">{formatINR(deposit)}</span>
                      </div>
                      <div className="text-[11px] text-emerald-800 flex justify-between">
                        <span className="text-emerald-700">Transaction ID:</span>
                        <span className="font-mono font-semibold">{paymentId}</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 pt-1 border-t border-emerald-200/60">
                        Held in demo escrow. Automatically refunded when you return {item.title} to {item.owner.name} in good condition.
                      </p>
                    </div>
                  )}

                  <Button variant="primary" size="lg" onClick={closeModal} className="mt-2 px-8">
                    Done
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Modal>
      </div>
    </MotionConfig>
  );
}
