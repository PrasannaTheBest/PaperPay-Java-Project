'use client';

import React, { useEffect, useState } from 'react';
import { PaperCard } from '@/components/sketch/PaperCard';
import { SketchButton } from '@/components/sketch/SketchButton';
import { CircleHighlight, TapeStrip, PaperClip } from '@/components/sketch/SVGDecorations';
import { motion } from 'framer-motion';
import { api, ApiError } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

export function WalletCard() {
  const [balance, setBalance] = useState(0);
  const [targetBalance, setTargetBalance] = useState(0);
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data: any = await api.wallet.get();
        const realBalance = parseFloat(data.balance) || 0;
        setTargetBalance(realBalance);
        setUpiId(data.upiId || '');

        // Animate counter up to real balance
        let current = 0;
        const increment = realBalance / 50;
        const interval = setInterval(() => {
          current += increment;
          if (current >= realBalance) {
            setBalance(realBalance);
            clearInterval(interval);
          } else {
            setBalance(current);
          }
        }, 20);
        return () => clearInterval(interval);
      } catch (err: any) {
        // Only show error if it's not a network error on first load
        if (err instanceof ApiError && err.statusCode !== 0) {
          setError('Unable to load wallet information');
          console.error('Wallet fetch error:', err);
        }
        // Set balance to 0 for guests/offline
        setBalance(0);
      }
    };
    
    fetchWallet();
  }, []);

  const handleAddMoney = async () => {
    const amt = prompt('Enter amount to add (₹):');
    if (amt && parseFloat(amt) > 0) {
      try {
        await api.wallet.addMoney(parseFloat(amt));
        // Refresh wallet
        window.location.reload();
      } catch (err: any) {
        alert(err.apiMessage || 'Failed to add money');
      }
    }
  };

  const handleWithdraw = async () => {
    const amt = prompt('Enter amount to withdraw (₹):');
    if (amt && parseFloat(amt) > 0) {
      try {
        await api.wallet.withdraw(parseFloat(amt));
        window.location.reload();
      } catch (err: any) {
        alert(err.apiMessage || 'Failed to withdraw');
      }
    }
  };

  return (
    <PaperCard 
      variant="sketch" 
      shadow="xl" 
      className="p-8 pb-10 w-full relative overflow-hidden bg-paper-cream border-2"
      hasTape
      hasClip
    >
      {/* Watermark */}
      <div className="absolute top-1/2 right-12 -translate-y-1/2 rotate-[-15deg] opacity-10 pointer-events-none">
        <div className="border-8 border-ink-dark rounded-xl p-4">
          <span className="font-display font-bold text-6xl tracking-widest text-ink-dark uppercase">Verified</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-marker-red/10 border border-marker-red text-marker-red rounded-sm font-body text-sm">
          ⚠️ {error}
        </div>
      )}

      <div className="relative z-10">
        <p className="font-body text-ink-medium text-xl mb-2 ml-2">Available Balance</p>
        
        <div className="relative inline-block mb-8">
          <h2 className="font-display text-7xl md:text-8xl font-bold text-ink-dark">
            ₹ {balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <CircleHighlight className="w-[110%] h-[120%] -left-[5%] -top-[10%]" />
        </div>

        {upiId && (
          <p className="font-body text-ink-medium text-lg mb-6 ml-1">
            📱 Your UPI ID: <span className="font-bold text-marker-blue">{upiId}</span>
          </p>
        )}

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <SketchButton variant="primary" size="lg" className="px-8 w-full sm:w-auto"
            onClick={handleAddMoney}>
            Add Money
          </SketchButton>
          <SketchButton variant="outline" size="lg" className="px-8 w-full sm:w-auto"
            onClick={handleWithdraw}>
            Withdraw
          </SketchButton>
        </div>
      </div>
    </PaperCard>
  );
}
