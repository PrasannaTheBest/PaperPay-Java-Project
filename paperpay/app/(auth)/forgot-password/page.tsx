'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PaperCard } from '@/components/sketch/PaperCard';
import { SketchButton } from '@/components/sketch/SketchButton';
import { SketchInput } from '@/components/sketch/SketchInput';
import { ScribbleUnderline, CheckmarkSketch } from '@/components/sketch/SVGDecorations';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[url('/textures/paper-grid.png')] bg-paper-white bg-paper-grid py-12 px-4 flex flex-col items-center justify-center relative">
      <Link href="/" className="mb-12 text-4xl font-display font-bold">
        PaperPay
      </Link>

      <div className="w-full max-w-md">
        <PaperCard className="p-8 text-center" variant="sketch" shadow="xl" animateHover={false}>
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="w-20 h-20 mx-auto border-4 border-ink-dark rounded-full flex items-center justify-center bg-paper-tan mb-6 shadow-sketch-sm">
                  <Mail className="w-10 h-10 text-ink-dark" strokeWidth={1.5} />
                </div>
                
                <h2 className="text-3xl font-display font-bold mb-4 relative inline-block">
                  Lost your key?
                  <ScribbleUnderline className="text-marker-blue" />
                </h2>
                
                <p className="font-body text-ink-medium text-lg mb-8">
                  No worries. Enter your email and we'll send you a carrier pigeon with a reset link.
                </p>

                <form onSubmit={handleSubmit} className="text-left space-y-8">
                  <SketchInput
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <SketchButton
                    type="submit"
                    variant="primary"
                    className="w-full text-xl py-3"
                    isLoading={isLoading}
                  >
                    Send Reset Link
                  </SketchButton>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8"
              >
                <div className="w-24 h-24 mx-auto border-4 border-ink-dark rounded-full flex items-center justify-center bg-marker-green-light mb-6 shadow-sketch-sm relative">
                  <motion.div
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <CheckmarkSketch className="w-12 h-12 text-marker-green" />
                  </motion.div>
                </div>
                
                <h2 className="text-3xl font-display font-bold mb-4">Check your inbox!</h2>
                <p className="font-body text-ink-medium text-xl mb-8">
                  We've sent a magic link to <span className="font-bold border-b border-ink-dark border-dashed">{email}</span>
                </p>
                
                <Link href="/login">
                  <SketchButton variant="outline" className="text-lg py-2 px-8">
                    Back to Login
                  </SketchButton>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </PaperCard>
        
        {!isSubmitted && (
          <div className="mt-8 text-center">
            <Link href="/login" className="font-body text-ink-medium text-lg hover:text-marker-blue transition-colors">
              Wait, I remembered it!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
