'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PaperCard } from '@/components/sketch/PaperCard';
import { SketchButton } from '@/components/sketch/SketchButton';
import { SketchInput } from '@/components/sketch/SketchInput';
import { ScribbleUnderline, TapeStrip } from '@/components/sketch/SVGDecorations';
import { StickyNote } from '@/components/sketch/StickyNote';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';
import { useAuthStore } from '@/lib/auth/store';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((s) => s.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Basic validation
    if (!email) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }
    if (!password) {
      setError('Please enter your password');
      setIsLoading(false);
      return;
    }
    
    try {
      const data: any = await api.auth.login(email, password);
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
      } else if (err.statusCode === 401) {
        setError('Invalid email or password. Please try again.');
      } else if (err.statusCode === 403) {
        setError('Your account has been deactivated. Please contact support.');
      } else {
        setError(err.apiMessage || 'Login failed. Please try again.');
      }
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper-white flex flex-col md:flex-row">
      
      {/* LEFT: Illustration */}
      <div className="hidden md:flex flex-1 bg-paper-warm p-12 flex-col items-center justify-center relative border-r-2 border-ink-dark overflow-hidden">
        <TapeStrip className="top-8" />
        
        <Link href="/" className="absolute top-8 left-8 text-3xl font-display font-bold">
          PaperPay
        </Link>
        
        <motion.div 
          className="relative"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
        >
          <div className="w-64 h-64 border-4 border-ink-dark rounded-[40px] rotate-[-5deg] bg-paper-cream flex items-center justify-center shadow-sketch-xl">
            <Wallet className="w-32 h-32 text-ink-dark" strokeWidth={1} />
          </div>
          
          {/* Falling coins simulation */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute -top-10 w-12 h-12 rounded-full border-2 border-ink-dark bg-marker-yellow flex items-center justify-center font-display font-bold text-ink-dark shadow-sketch-sm"
              initial={{ y: -50, x: Math.random() * 100 - 50, opacity: 0 }}
              animate={{ y: 150, opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.7 }}
            >
              ₹
            </motion.div>
          ))}
        </motion.div>

        <div className="absolute top-1/4 right-12">
          <StickyNote color="green" size="sm" rotate={12} pinned>
            <p className="font-bold">256-bit encrypted!</p>
          </StickyNote>
        </div>
        
        <div className="absolute bottom-1/4 left-12">
          <StickyNote color="blue" size="sm" rotate={-8}>
            <p className="font-bold text-center">100k+ Users<br/>and counting...</p>
          </StickyNote>
        </div>
      </div>

      {/* RIGHT: Login Form */}
      <div className="flex-1 p-6 md:p-12 flex items-center justify-center relative">
        <div className="absolute inset-0 paper-texture opacity-30 pointer-events-none"></div>
        
        <div className="w-full max-w-md">
          <div className="md:hidden text-center mb-8">
            <Link href="/" className="text-4xl font-display font-bold">
              PaperPay
            </Link>
          </div>

          <PaperCard className="p-8 pb-12 w-full" variant="sketch" shadow="xl" animateHover={false}>
            <h2 className="text-4xl font-display font-bold mb-8 text-center relative inline-block">
              Welcome Back
              <ScribbleUnderline className="text-marker-blue" />
            </h2>

            <form onSubmit={handleLogin} className="space-y-6">
              <SketchInput
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                isValid={email.includes('@')}
              />
              
              <SketchInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                isValid={password.length > 3}
              />

              <div className="text-right pt-2 pb-6">
                <Link href="/forgot-password" className="font-body text-marker-blue border-b-2 border-marker-blue border-dashed hover:text-marker-red transition-colors">
                  Forgot password?
                </Link>
              </div>

              <SketchButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full text-2xl py-4"
                isLoading={isLoading}
              >
                Log In
              </SketchButton>

              {error && (
                <p className="mt-4 text-center font-body text-marker-red font-bold text-lg animate-pulse">
                  ⚠️ {error}
                </p>
              )}
            </form>

            <div className="mt-8 text-center relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-ink-dark border-dashed"></div>
              </div>
              <span className="relative bg-paper-white px-4 font-body text-ink-medium text-lg">or draw with</span>
            </div>

            <div className="mt-8 flex space-x-4">
              <SketchButton variant="outline" className="flex-1 py-3 text-lg">Google</SketchButton>
              <SketchButton variant="outline" className="flex-1 py-3 text-lg">GitHub</SketchButton>
            </div>
            
            <p className="mt-8 text-center font-body text-ink-medium text-lg">
              Don't have an account?{' '}
              <Link href="/register" className="text-marker-blue border-b-2 border-marker-blue border-dashed font-bold">
                Sign up free
              </Link>
            </p>
          </PaperCard>
        </div>
      </div>
    </div>
  );
}
