'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SketchButton } from '@/components/sketch/SketchButton';
import { ScribbleUnderline, CircleHighlight, ArrowSketch, StarDoodle } from '@/components/sketch/SVGDecorations';
import { StickyNote } from '@/components/sketch/StickyNote';
import { Wallet } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-20 bg-[url('/textures/paper-grid.png')] bg-paper-grid overflow-hidden">
      
      {/* Floating Elements Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute top-1/4 left-1/4" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
          <StarDoodle className="w-10 h-10 text-marker-yellow opacity-60" />
        </motion.div>
        <motion.div className="absolute bottom-1/3 right-1/4" animate={{ y: [0, 15, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5 }}>
          <StarDoodle className="w-8 h-8 text-marker-blue opacity-40" />
        </motion.div>
        
        {/* Floating Sticky Notes */}
        <motion.div className="absolute top-32 left-[15%] hidden lg:block" animate={{ y: [0, -15, 0], rotate: [-5, -2, -5] }} transition={{ repeat: Infinity, duration: 6 }}>
          <StickyNote color="pink" size="sm" rotate={-5} pinned>
            <p className="font-bold text-lg">₹12,430 saved!</p>
          </StickyNote>
        </motion.div>
        
        <motion.div className="absolute bottom-40 right-[15%] hidden lg:block" animate={{ y: [0, 10, 0], rotate: [4, 6, 4] }} transition={{ repeat: Infinity, duration: 5, delay: 1 }}>
          <StickyNote color="green" size="sm" rotate={6}>
            <p className="font-bold text-lg text-center">Zero fees.<br/>Forever.</p>
          </StickyNote>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative inline-block mb-8"
        >
          <motion.div 
            className="w-32 h-32 mx-auto mb-6 bg-paper-warm rounded-3xl border-4 border-ink-dark shadow-sketch-lg flex items-center justify-center"
            animate={{ rotate: [-2, 2, -2], y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <Wallet className="w-16 h-16 text-ink-dark" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-6xl md:text-8xl font-display font-bold leading-tight mb-8"
        >
          Your Money,<br />
          <span className="relative inline-block mt-2">
            Sketched Simple.
            <ScribbleUnderline className="text-marker-blue -bottom-4 h-6 w-[110%] -left-[5%]" />
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-2xl md:text-3xl font-body text-ink-medium mb-12 max-w-2xl mx-auto"
        >
          The fintech app that feels like a <span className="relative inline-block font-bold">notebook<CircleHighlight /></span>.
          Track expenses, send money, and hit goals without the corporate clutter.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <div className="relative">
            <Link href="/register">
              <SketchButton size="lg" variant="primary" className="text-2xl py-4 px-10">
                Start for Free
              </SketchButton>
            </Link>
            <div className="absolute -right-16 top-1/2 -translate-y-1/2 hidden md:block">
              <ArrowSketch direction="left" className="w-10 h-10 text-marker-red" />
              <p className="font-body text-marker-red font-bold rotate-12 -mt-2 ml-4">2min setup!</p>
            </div>
          </div>
          <Link href="#how-it-works">
            <SketchButton size="lg" variant="outline" className="text-2xl py-4 px-10">
              See How It Works
            </SketchButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
