'use client';
import React from 'react';
import { StickyNote } from '@/components/sketch/StickyNote';
import { PaperClip, ScribbleUnderline } from '@/components/sketch/SVGDecorations';
import { Wallet, Send, PieChart, Target, ShieldAlert, TrendingUp } from 'lucide-react';

const FEATURES = [
  { icon: Wallet, title: 'Digital Wallet', desc: 'Hold your funds safely with bank-grade security, minus the boring interface.', color: 'yellow', rotate: -2 },
  { icon: Send, title: 'Send Money', desc: 'Transfer to anyone in seconds. UPI, Bank Transfer, or QR code supported.', color: 'blue', rotate: 1 },
  { icon: PieChart, title: 'Expense Tracking', desc: 'Auto-categorized expenses that look like a beautiful ledger journal.', color: 'pink', rotate: -1 },
  { icon: Target, title: 'Budget Goals', desc: 'Set monthly targets and get friendly nudges when you are close to the limit.', color: 'green', rotate: 2 },
  { icon: ShieldAlert, title: 'Fraud Shield', desc: 'Real-time AI monitoring to catch sketchy transactions before they clear.', color: 'purple', rotate: -1 },
  { icon: TrendingUp, title: 'Analytics', desc: 'Visualize your spending habits with gorgeous, hand-drawn charts.', color: 'yellow', rotate: 1 },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 px-4 bg-paper-white relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-display font-bold inline-block relative">
            Everything You Need
            <ScribbleUnderline className="text-marker-green" />
          </h2>
          <p className="mt-6 text-2xl font-body text-ink-medium max-w-2xl mx-auto">
            All the powerful financial tools, wrapped in an interface you will actually enjoy using.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {FEATURES.map((feat, i) => (
            <StickyNote 
              key={i} 
              color={feat.color as any} 
              size="lg" 
              rotate={feat.rotate}
              className="flex flex-col h-full"
            >
              <PaperClip className="absolute -top-6 right-8 w-10 text-ink-medium" />
              
              <div className="w-14 h-14 rounded-full border-2 border-ink-dark flex items-center justify-center bg-white/50 mb-6 shadow-sm">
                <feat.icon className="w-8 h-8 text-ink-dark" strokeWidth={1.5} />
              </div>
              
              <h3 className="text-3xl font-display font-bold mb-3">{feat.title}</h3>
              <p className="text-xl font-body leading-relaxed flex-grow">{feat.desc}</p>
            </StickyNote>
          ))}
        </div>
      </div>
    </section>
  );
}
