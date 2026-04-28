'use client';

import React, { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api/client';
import { Transaction } from '@/lib/mock-data/transactions';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { PaperCard } from '@/components/sketch/PaperCard';
import { ShoppingBag, Coffee, Utensils, Zap, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.transactions.list(0, 5);
        setTransactions(data || []);
      } catch (err: any) {
        if (err instanceof ApiError) {
          setError(err.statusCode === 0 ? 'Network error. Please check your connection.' : err.apiMessage);
        } else {
          setError(err.message || 'Failed to load transactions');
        }
        console.error('Failed to load transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'food': return <Utensils className="w-5 h-5" />;
      case 'shopping': return <ShoppingBag className="w-5 h-5" />;
      case 'entertainment': return <Zap className="w-5 h-5" />;
      default: return <Wallet className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end mb-6">
        <h3 className="font-display font-bold text-3xl">Recent Activity</h3>
        <button className="font-body text-ink-medium hover:text-marker-blue border-b border-dashed border-ink-medium hover:border-marker-blue transition-colors">
          View All
        </button>
      </div>

      {error && (
        <PaperCard variant="sketch" className="p-6 bg-marker-red/10 border-marker-red">
          <p className="font-body text-marker-red">⚠️ {error}</p>
        </PaperCard>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 border-2 border-ink-dark/20 border-dashed rounded-md animate-pulse bg-paper-tan/20"></div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <PaperCard variant="sketch" className="p-8 text-center bg-paper-cream border-dashed flex flex-col items-center">
          <Wallet className="w-16 h-16 text-ink-faint mb-4" strokeWidth={1} />
          <p className="font-display text-2xl text-ink-medium">No transactions yet!</p>
          <p className="font-body text-ink-faint mt-2">Start by sending or receiving money to see your activity here.</p>
        </PaperCard>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 4, y: -2 }}
              className="flex items-center p-3 border-2 border-ink-dark rounded-[2px_8px_2px_6px_/_8px_2px_6px_2px] bg-paper-white shadow-sm hover:shadow-sketch-sm transition-all"
            >
              <div className="w-12 h-12 rounded-full border-2 border-ink-dark bg-paper-tan flex items-center justify-center mr-4">
                {getIcon(tx.category)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-xl truncate">{tx.merchant}</p>
                <p className="font-body text-ink-faint text-sm">{format(new Date(tx.date), 'MMM dd, yyyy')}</p>
              </div>

              <div className="text-right">
                <p className={cn(
                  "font-mono font-bold text-xl",
                  tx.type === 'income' ? 'text-marker-green' : 'text-marker-red'
                )}>
                  {tx.type === 'income' ? '+' : '-'}₹{tx.amount}
                </p>
                <span className="inline-block px-2 py-0.5 bg-sticky-yellow border border-ink-dark/20 text-xs font-body rounded-sm transform rotate-[-2deg]">
                  {tx.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
