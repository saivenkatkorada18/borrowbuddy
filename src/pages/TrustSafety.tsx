// src/pages/TrustSafety.tsx
import { useState } from 'react';
import { motion, MotionConfig } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle } from 'lucide-react';
import { submitReport } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Reveal } from '../components/motion/Reveal';
import { TrustRing } from '../components/TrustRing';
import { Input, Textarea } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

// Score simulator inputs
interface SimInputs {
  onTime: number;
  condition: number;
  verified: boolean;
  responseRate: number;
}

function calcScore(inputs: SimInputs): number {
  return Math.min(
    100,
    Math.round(
      inputs.onTime * 0.4 +
      inputs.condition * 0.3 +
      (inputs.verified ? 100 : 0) * 0.2 +
      inputs.responseRate * 0.1,
    ),
  );
}

const reportSchema = z.object({
  subject: z.string().min(3, 'Please enter a subject'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  email: z.string().email('Please enter a valid email'),
});
type ReportForm = z.infer<typeof reportSchema>;

export function TrustSafety() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [sim, setSim] = useState<SimInputs>({ onTime: 85, condition: 90, verified: true, responseRate: 80 });
  const [reportSuccess, setReportSuccess] = useState(false);
  const score = calcScore(sim);

  const form = useForm<ReportForm>({ resolver: zodResolver(reportSchema) });

  const onReport = form.handleSubmit(async (data) => {
    try {
      const success = await submitReport({
        subject: data.subject,
        description: data.description,
        email: data.email,
        userId: user?.id,
      });
      if (success) {
        setReportSuccess(true);
        addToast({ type: 'success', title: 'Report submitted', message: 'Thank you for helping keep BorrowBuddy safe.' });
      }
    } catch (err) {
      console.error('Failed to submit report:', err);
      addToast({ type: 'error', title: 'Error', message: 'Could not submit report. Please try again.' });
    }
  });

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6">

          {/* Hero */}
          <Reveal className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <TrustRing score={score} size={120} strokeWidth={8} glow />
              </div>
            </div>
            <h1 className="section-headline text-[#1E1B4B] mb-4">Trust & Safety</h1>
            <p className="text-stone-500 text-lg max-w-xl mx-auto">
              BorrowBuddy is built on mutual trust. Our Trust Score system creates accountability without surveillance.
            </p>
            <p className="text-stone-300 text-sm mt-2">
              Demo model · Disputable · No real background checks performed
            </p>
          </Reveal>

          {/* Score simulator */}
          <Reveal className="card p-8 mb-12">
            <h2 className="font-display font-bold text-2xl text-[#1E1B4B] mb-2">Trust Score simulator</h2>
            <p className="text-stone-500 text-sm mb-8">Adjust the sliders to see how different behaviours affect your score.</p>

            <div className="grid md:grid-cols-[1fr_auto] gap-10 items-center">
              <div className="space-y-6">
                {[
                  { key: 'onTime' as const, label: 'On-time return rate', weight: '40%', max: 100 },
                  { key: 'condition' as const, label: 'Condition rating avg', weight: '30%', max: 100 },
                  { key: 'responseRate' as const, label: 'Response rate', weight: '10%', max: 100 },
                ].map((input) => (
                  <div key={input.key}>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-stone-600">
                        {input.label} <span className="text-stone-300 text-xs">(weight: {input.weight})</span>
                      </label>
                      <span className="text-sm font-bold text-[#4338CA]">{sim[input.key]}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={input.max}
                      value={sim[input.key] as number}
                      onChange={(e) => setSim((prev) => ({ ...prev, [input.key]: Number(e.target.value) }))}
                      className="w-full accent-[#4338CA]"
                      aria-label={input.label}
                    />
                  </div>
                ))}

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div
                    className={`w-10 h-5.5 rounded-full relative transition-colors duration-200 ${sim.verified ? 'bg-[#4338CA]' : 'bg-stone-200'}`}
                    style={{ width: '2.5rem', height: '1.375rem' }}
                    onClick={() => setSim((prev) => ({ ...prev, verified: !prev.verified }))}
                    role="switch"
                    aria-checked={sim.verified}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSim((prev) => ({ ...prev, verified: !prev.verified }))}
                  >
                    <motion.div
                      className="absolute top-0.5 left-0.5 bg-white rounded-full shadow-sm"
                      style={{ width: '1.125rem', height: '1.125rem' }}
                      animate={{ x: sim.verified ? '1.125rem' : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  </div>
                  <span className="text-sm font-medium text-stone-600">Verified university email <span className="text-stone-300 text-xs">(weight: 20%)</span></span>
                </label>
              </div>

              {/* Live ring */}
              <div className="flex justify-center">
                <TrustRing score={score} size={120} strokeWidth={8} glow />
              </div>
            </div>
          </Reveal>

          {/* Report form */}
          <Reveal className="card p-8">
            <h2 className="font-display font-bold text-2xl text-[#1E1B4B] mb-2">Report an issue</h2>
            <p className="text-stone-500 text-sm mb-6">
              Experienced a problem with an exchange? Let us know.
              <span className="ml-1 text-stone-300">Demo form — nothing is submitted or stored.</span>
            </p>

            {reportSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-10 gap-4 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center"
                >
                  <CheckCircle size={32} className="text-teal-500" />
                </motion.div>
                <h3 className="font-display font-bold text-xl text-[#1E1B4B]">Report received</h3>
                <p className="text-stone-400 text-sm">Demo only — nothing was actually submitted.</p>
                <Button variant="secondary" onClick={() => { setReportSuccess(false); form.reset(); }}>
                  Submit another
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={onReport} className="space-y-4" noValidate>
                <Input label="Subject" type="text" error={form.formState.errors.subject?.message} {...form.register('subject')} />
                <Textarea label="Description" error={form.formState.errors.description?.message} {...form.register('description')} />
                <Input label="Your email" type="email" error={form.formState.errors.email?.message} {...form.register('email')} />
                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  loading={form.formState.isSubmitting}
                  className="w-full"
                >
                  Submit report
                </Button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </MotionConfig>
  );
}
