'use client';

import React from 'react';
import { Send, Download, Receipt, Plus } from 'lucide-react';
import { StickyNote } from '@/components/sketch/StickyNote';
import { motion } from 'framer-motion';
import Link from 'next/link';

const ACTIONS = [
  { label: 'Send Money', icon: Send, color: 'blue', href: '/send-money' },
  { label: 'Receive', icon: Download, color: 'green', href: '/receive-money' },
  { label: 'Pay Bills', icon: Receipt, color: 'pink', href: '/bills' },
  { label: 'Add Money', icon: Plus, color: 'yellow', href: '/add-money' },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {ACTIONS.map((action, i) => (
        <Link key={i} href={action.href} className="block">
          <StickyNote 
            color={action.color as any} 
            size="sm" 
            rotate={i % 2 === 0 ? -2 : 2}
            className="flex flex-col items-center justify-center py-6 cursor-pointer"
          >
            <motion.div 
              className="w-16 h-16 rounded-full border-2 border-ink-dark bg-white/50 flex items-center justify-center mb-3 shadow-sketch-sm"
              whileHover={{ rotate: [-5, 5, -5, 0], scale: 1.1 }}
              transition={{ duration: 0.4 }}
            >
              <action.icon className="w-8 h-8 text-ink-dark" strokeWidth={1.5} />
            </motion.div>
            <p className="font-display font-bold text-lg text-center leading-tight">
              {action.label.split(' ').map((word, j) => <React.Fragment key={j}>{word}<br/></React.Fragment>)}
            </p>
          </StickyNote>
        </Link>
      ))}
    </div>
  );
}
