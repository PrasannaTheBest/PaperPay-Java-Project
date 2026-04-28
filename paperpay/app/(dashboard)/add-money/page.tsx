'use client';
import React, { useState } from 'react';
import { PaperCard } from '@/components/sketch/PaperCard';
import { SketchButton } from '@/components/sketch/SketchButton';
import { ScribbleUnderline, TapeStrip } from '@/components/sketch/SVGDecorations';
import { SketchInput } from '@/components/sketch/SketchInput';
import { motion } from 'framer-motion';
import { Plus, CreditCard, Landmark, Wallet } from 'lucide-react';
import { api } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

export default function AddMoneyPage() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleAdd = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    try {
      await api.wallet.addMoney(parseFloat(amount));
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err) {
      alert('Failed to add money');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 relative inline-block">
        Add Money
        <ScribbleUnderline className="text-marker-yellow" />
      </h1>

      <PaperCard variant="sketch" className="p-8 bg-paper-cream relative" shadow="xl">
        <div className="absolute -top-4 -left-4">
          <TapeStrip color="yellow" rotate={-15} />
        </div>

        {success ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
            <div className="w-20 h-20 bg-marker-green-light rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-ink-dark">
              <Plus className="w-10 h-10 text-marker-green" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-2">Success!</h2>
            <p className="font-body text-xl text-ink-medium">₹{amount} has been added to your wallet.</p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <SketchInput 
              label="Enter Amount (₹)" 
              type="number" 
              placeholder="500" 
              value={amount}
              onChange={(e: any) => setAmount(e.target.value)}
            />

            <div className="flex space-x-3">
              {['100', '500', '1000', '2000'].map(val => (
                <button 
                  key={val} 
                  onClick={() => setAmount(val)}
                  className="px-4 py-2 border-2 border-ink-dark rounded-md bg-white hover:bg-paper-tan font-body font-bold transition-all"
                >
                  +₹{val}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <p className="font-display font-bold text-xl mb-4">Payment Method</p>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
                  { id: 'netbank', name: 'Net Banking', icon: Landmark },
                  { id: 'other', name: 'Other Wallet', icon: Wallet },
                ].map(method => (
                  <label key={method.id} className="flex items-center p-4 border-2 border-ink-dark rounded-lg bg-white cursor-pointer hover:bg-paper-tan/20 transition-colors">
                    <input type="radio" name="method" className="w-5 h-5 accent-marker-blue mr-4" defaultChecked={method.id === 'card'} />
                    <method.icon className="w-6 h-6 mr-3 text-ink-medium" />
                    <span className="font-body font-bold text-lg">{method.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <SketchButton 
              size="lg" 
              className="w-full text-2xl py-4" 
              onClick={handleAdd}
              isLoading={loading}
            >
              Deposit ₹{amount || '0'}
            </SketchButton>
          </div>
        )}
      </PaperCard>
    </div>
  );
}
