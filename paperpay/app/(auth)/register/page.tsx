'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PaperCard } from '@/components/sketch/PaperCard';
import { SketchButton } from '@/components/sketch/SketchButton';
import { SketchInput } from '@/components/sketch/SketchInput';
import { ScribbleUnderline, ArrowSketch } from '@/components/sketch/SVGDecorations';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';
import { useAuthStore } from '@/lib/auth/store';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((s) => s.login);

  // Form state collected across steps
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '',
    password: '', confirmPassword: '',
    monthlyBudget: 20000, currency: 'INR',
  });

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) { handleNext(); return; }
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    try {
      const data: any = await api.auth.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        currency: formData.currency,
        monthlyBudget: formData.monthlyBudget,
      });
      login(data.token, {
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      });
      router.push('/dashboard');
    } catch (err: any) {
      if (err.statusCode === 0) {
        setError('Unable to connect to server. Please check your internet connection.');
      } else if (err.apiMessage?.includes('already registered')) {
        setError('This email is already registered. Please log in instead.');
      } else if (err.apiMessage?.includes('Password')) {
        setError(err.apiMessage);
      } else {
        setError(err.apiMessage || 'Registration failed. Please try again.');
      }
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 50, rotateY: -15 },
    in: { opacity: 1, x: 0, rotateY: 0 },
    out: { opacity: 0, x: -50, rotateY: 15 }
  };

  const pageTransition: any = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.4
  };

  return (
    <div className="min-h-screen bg-paper-white py-12 px-4 flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 paper-texture pointer-events-none opacity-40"></div>
      
      <Link href="/" className="mb-8 text-4xl font-display font-bold relative z-10">
        PaperPay
      </Link>

      <div className="w-full max-w-lg relative z-10">
        {/* Notebook Tabs */}
        <div className="flex pl-4 -mb-1 relative z-0">
          {[1, 2, 3].map(i => (
            <div 
              key={i}
              className={`
                px-6 py-2 border-2 border-b-0 border-ink-dark rounded-t-lg mr-2 font-display text-xl transition-colors cursor-pointer
                ${step === i ? 'bg-paper-cream border-b-paper-cream z-10' : 'bg-paper-tan/50 text-ink-medium hover:bg-paper-tan mt-2'}
              `}
              onClick={() => step > i && setStep(i)}
            >
              Step {i}
            </div>
          ))}
        </div>

        <PaperCard className="p-8 w-full z-10 rounded-tl-none bg-paper-cream" variant="sketch" shadow="xl" animateHover={false}>
          
          <form onSubmit={handleSubmit} className="overflow-hidden min-h-[350px] relative">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-display font-bold mb-6">
                    Who are you?
                    <ScribbleUnderline className="text-marker-blue w-1/2" />
                  </h2>
                  <SketchInput label="Full Name" required value={formData.fullName}
                    onChange={(e: any) => setFormData(p => ({ ...p, fullName: e.target.value }))} />
                  <SketchInput label="Email Address" type="email" required value={formData.email}
                    onChange={(e: any) => setFormData(p => ({ ...p, email: e.target.value }))} />
                  <SketchInput label="Phone Number" type="tel" value={formData.phone}
                    onChange={(e: any) => setFormData(p => ({ ...p, phone: e.target.value }))} />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-display font-bold mb-6">
                    Keep it secret.
                    <ScribbleUnderline className="text-marker-red w-1/2" />
                  </h2>
                  <SketchInput label="Create Password" type="password" required value={formData.password}
                    onChange={(e: any) => setFormData(p => ({ ...p, password: e.target.value }))} />
                  <SketchInput label="Confirm Password" type="password" required value={formData.confirmPassword}
                    onChange={(e: any) => setFormData(p => ({ ...p, confirmPassword: e.target.value }))} />
                  
                  <div className="p-4 border-2 border-dashed border-ink-dark/30 bg-white/50 rounded-md">
                    <p className="font-body text-ink-medium mb-2">Password must contain:</p>
                    <ul className="list-disc pl-5 font-body text-ink-medium space-y-1">
                      <li>At least 8 characters</li>
                      <li>One special character</li>
                      <li>One number</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-display font-bold mb-6">
                    Make it yours.
                    <ScribbleUnderline className="text-marker-green w-1/2" />
                  </h2>
                  <SketchInput label="Monthly Budget Goal (₹)" type="number" value={formData.monthlyBudget}
                    onChange={(e: any) => setFormData(p => ({ ...p, monthlyBudget: e.target.value }))} />
                  
                  <div className="mb-6">
                    <p className="font-body text-ink-faint text-lg mb-2">Primary Currency</p>
                    <select 
                      className="w-full bg-transparent border-b-2 border-ink-dark/30 py-2 font-display text-xl outline-none focus:border-marker-blue focus:border-b-[3px] appearance-none"
                      value={formData.currency}
                      onChange={(e) => setFormData(p => ({ ...p, currency: e.target.value }))}
                    >
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-3 mt-8">
                    <input type="checkbox" id="terms" className="w-5 h-5 accent-marker-blue border-2 border-ink-dark" required />
                    <label htmlFor="terms" className="font-body text-lg">
                      I agree to the <span className="underline decoration-wavy decoration-marker-blue">terms & conditions</span>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-12 pt-6 border-t-2 border-ink-dark border-dashed">
              {step > 1 ? (
                <SketchButton type="button" variant="ghost" onClick={handlePrev} className="px-4">
                  Back
                </SketchButton>
              ) : (
                <div></div>
              )}
              
              <SketchButton
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="px-8"
              >
                {step < 3 ? 'Next Step' : 'Finish & Dive In'}
              </SketchButton>
            </div>
            {error && (
              <p className="mt-4 text-center font-body text-marker-red font-bold animate-pulse">
                ⚠️ {error}
              </p>
            )}
          </form>
        </PaperCard>
        
        <p className="mt-8 text-center font-body text-ink-medium text-lg relative z-10">
          Already have an account?{' '}
          <Link href="/login" className="text-marker-blue border-b-2 border-marker-blue border-dashed font-bold">
            Log in instead
          </Link>
        </p>
      </div>
    </div>
  );
}
