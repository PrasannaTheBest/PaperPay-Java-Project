'use client';
import React from 'react';
import { ScribbleUnderline } from '@/components/sketch/SVGDecorations';
import { SketchButton } from '@/components/sketch/SketchButton';
import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-24 px-4 bg-paper-warm border-t-2 border-ink-dark relative overflow-hidden">
      
      {/* Background doodles confetti */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full border-2 border-ink-dark"
            style={{
              width: Math.random() * 20 + 5 + 'px',
              height: Math.random() * 20 + 5 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              backgroundColor: ['#2563EB', '#16A34A', '#DC2626', '#CA8A04', '#7C3AED'][Math.floor(Math.random() * 5)],
              transform: `rotate(${Math.random() * 360}deg)`,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px 8px 2px 6px / 8px 2px 6px 2px'
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 bg-paper-warm/80 backdrop-blur-sm p-12 rounded-[255px_15px_225px_15px_/_15px_225px_15px_255px] border-4 border-ink-dark shadow-sketch-xl">
        <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 inline-block relative">
          Ready to Ditch the Clutter?
          <ScribbleUnderline className="text-marker-purple -bottom-4 h-6 w-[105%] -left-[2%]" />
        </h2>
        <p className="text-2xl font-body text-ink-medium mb-12 max-w-2xl mx-auto">
          Join thousands of users who have already switched to the most beautifully simple finance app.
        </p>
        <Link href="/register">
          <SketchButton size="lg" variant="primary" className="text-3xl py-6 px-12">
            Create Your Account
          </SketchButton>
        </Link>
      </div>
    </section>
  );
}
