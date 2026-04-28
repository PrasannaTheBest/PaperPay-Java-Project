'use client';

import React from 'react';
import { PaperCard } from '@/components/sketch/PaperCard';
import { ScribbleUnderline, ArrowSketch } from '@/components/sketch/SVGDecorations';
import { Zap, Smartphone, Wifi, Tv, Droplets, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const BILL_TYPES = [
  { name: 'Electricity', icon: Zap, color: 'yellow' },
  { name: 'Mobile', icon: Smartphone, color: 'blue' },
  { name: 'Broadband', icon: Wifi, color: 'green' },
  { name: 'DTH', icon: Tv, color: 'pink' },
  { name: 'Water', icon: Droplets, color: 'blue' },
  { name: 'Rent', icon: Home, color: 'yellow' },
];

export default function BillsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold relative inline-block">
          Pay Bills
          <ScribbleUnderline className="text-marker-pink" />
        </h1>
        <p className="text-xl font-body text-ink-medium mt-2">Clear your dues with a single sketch.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {BILL_TYPES.map((bill, i) => (
          <motion.div
            key={bill.name}
            whileHover={{ y: -5, rotate: i % 2 === 0 ? -1 : 1 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <PaperCard variant="sketch" className="p-8 text-center bg-paper-cream cursor-pointer group hover:bg-white transition-colors h-full flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full border-2 border-ink-dark flex items-center justify-center mb-4 bg-marker-${bill.color}-light group-hover:scale-110 transition-transform`}>
                <bill.icon className="w-8 h-8 text-ink-dark" />
              </div>
              <h3 className="font-display font-bold text-2xl">{bill.name}</h3>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowSketch direction="right" className="w-8 h-8 text-marker-blue mx-auto" />
              </div>
            </PaperCard>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 p-10 border-4 border-dashed border-ink-dark/20 rounded-xl text-center bg-paper-tan/10 relative overflow-hidden">
        <div className="absolute top-2 right-4 rotate-12 opacity-10">
          <Zap className="w-32 h-32" />
        </div>
        <h3 className="font-display font-bold text-3xl mb-4">Coming Soon: Auto-Pay</h3>
        <p className="font-body text-xl text-ink-medium max-w-md mx-auto">
          We're sketching out a feature to automatically pay your bills every month. Stay tuned!
        </p>
      </div>
    </div>
  );
}
