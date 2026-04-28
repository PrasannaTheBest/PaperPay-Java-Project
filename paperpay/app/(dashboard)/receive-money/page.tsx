  'use client';

import React from 'react';
import { PaperCard } from '@/components/sketch/PaperCard';
import { ScribbleUnderline, PaperClip } from '@/components/sketch/SVGDecorations';
import { QrCode, Copy, Share2 } from 'lucide-react';
import { useAuthStore } from '@/lib/auth/store';
import { motion } from 'framer-motion';

export default function ReceiveMoneyPage() {
  const user = useAuthStore(s => s.user);
  const upiId = `${user?.fullName?.toLowerCase().replace(' ', '')}@paperpay`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    alert('UPI ID copied to clipboard!');
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 relative inline-block">
        Receive Money
        <ScribbleUnderline className="text-marker-green" />
      </h1>

      <PaperCard variant="sketch" className="p-10 bg-paper-cream text-center relative" shadow="xl">
        <div className="absolute top-6 right-6">
          <PaperClip className="w-12 h-12" />
        </div>

        <div className="mb-8">
          <p className="font-body text-ink-medium text-xl mb-2">Scan this QR Code</p>
          <div className="w-64 h-64 mx-auto border-4 border-ink-dark p-4 bg-white shadow-sketch-lg rotate-[-2deg] relative">
            <div className="w-full h-full bg-[url('/textures/paper-grid.png')] flex items-center justify-center relative overflow-hidden">
               <QrCode className="w-48 h-48 text-ink-dark" />
               <motion.div 
                  className="absolute left-0 right-0 h-1 bg-marker-green/30"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="font-body text-ink-medium text-lg">Your Personal UPI ID</p>
          <div className="flex items-center justify-center space-x-2 bg-white border-2 border-ink-dark p-4 rounded-lg">
            <span className="font-display font-bold text-2xl text-marker-blue">{upiId}</span>
            <button onClick={copyToClipboard} className="p-2 hover:bg-paper-tan rounded-md transition-colors">
              <Copy className="w-6 h-6 text-ink-medium" />
            </button>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t-2 border-ink-dark border-dashed flex justify-center space-x-8">
          <button className="flex flex-col items-center group">
            <div className="w-12 h-12 rounded-full border-2 border-ink-dark bg-white flex items-center justify-center group-hover:bg-marker-blue-light transition-colors">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="font-body font-bold mt-1">Share</span>
          </button>
          <button className="flex flex-col items-center group" onClick={copyToClipboard}>
            <div className="w-12 h-12 rounded-full border-2 border-ink-dark bg-white flex items-center justify-center group-hover:bg-marker-green-light transition-colors">
              <Copy className="w-6 h-6" />
            </div>
            <span className="font-body font-bold mt-1">Copy Link</span>
          </button>
        </div>
      </PaperCard>
    </div>
  );
}
