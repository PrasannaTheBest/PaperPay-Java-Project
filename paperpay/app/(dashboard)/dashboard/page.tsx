'use client';

import React from 'react';
import { WalletCard } from '@/components/dashboard/WalletCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { SpendingSummary } from '@/components/dashboard/SpendingSummary';
import { ScribbleUnderline } from '@/components/sketch/SVGDecorations';
import { useAuthStore } from '@/lib/auth/store';

export default function DashboardPage() {
  const user = useAuthStore(s => s.user);
  
  return (
    <div className="space-y-8 pb-12">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-display font-bold relative inline-block">
          Good Morning, {user?.fullName?.split(' ')[0] || 'there'}!
          <ScribbleUnderline className="text-marker-yellow" />
        </h1>
        <p className="text-xl font-body text-ink-medium mt-2">Here's a sketch of your finances today.</p>
      </header>

      <section>
        <WalletCard />
      </section>

      <section className="pt-4">
        <QuickActions />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        <div className="lg:col-span-1">
          <SpendingSummary />
        </div>
      </section>
    </div>
  );
}
