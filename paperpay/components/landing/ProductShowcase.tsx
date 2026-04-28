'use client';
import React from 'react';
import { ScribbleUnderline, ArrowSketch } from '@/components/sketch/SVGDecorations';
import { PaperCard } from '@/components/sketch/PaperCard';
import { motion } from 'framer-motion';

export function ProductShowcase() {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-paper-warm relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-5xl font-display font-bold inline-block relative">
            See It In Action
            <ScribbleUnderline className="text-marker-blue" />
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Annotations */}
          <div className="absolute -left-12 md:-left-32 top-20 z-20 hidden md:block">
            <p className="font-display font-bold text-2xl text-marker-red rotate-[-10deg] mb-2">Beautiful Dashboard!</p>
            <ArrowSketch direction="right" className="w-16 h-16 text-marker-red" />
          </div>
          
          <div className="absolute -right-12 md:-right-32 bottom-32 z-20 hidden md:block">
            <p className="font-display font-bold text-2xl text-marker-green rotate-[10deg] mb-2 text-right">Hand-drawn Charts</p>
            <ArrowSketch direction="left" className="w-16 h-16 text-marker-green ml-auto" />
          </div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <PaperCard variant="sketch" shadow="xl" className="p-2 md:p-4 bg-paper-cream overflow-hidden">
              {/* Browser mockup header */}
              <div className="flex items-center space-x-2 border-b-2 border-ink-dark pb-3 mb-4 px-2">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full border border-ink-dark bg-marker-red/80"></div>
                  <div className="w-3 h-3 rounded-full border border-ink-dark bg-marker-yellow/80"></div>
                  <div className="w-3 h-3 rounded-full border border-ink-dark bg-marker-green/80"></div>
                </div>
                <div className="mx-auto border-2 border-ink-dark rounded-md px-24 py-1 text-sm font-body text-ink-medium bg-paper-white hidden md:block">
                  app.paperpay.com/dashboard
                </div>
              </div>
              
              {/* Mockup content area */}
              <div className="aspect-[16/10] bg-paper-white border-2 border-ink-dark rounded-md relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 paper-texture opacity-50 pointer-events-none"></div>
                {/* Simplified wireframe of dashboard to serve as showcase */}
                <div className="w-full h-full p-4 md:p-8 flex">
                  {/* Sidebar */}
                  <div className="w-1/4 h-full border-r-2 border-ink-dark/20 pr-4 hidden sm:block">
                    <div className="h-6 w-24 bg-ink-dark/10 rounded-full mb-8"></div>
                    <div className="space-y-4">
                      <div className="h-4 w-32 bg-marker-yellow/30 rounded-md"></div>
                      <div className="h-4 w-28 bg-ink-dark/10 rounded-md"></div>
                      <div className="h-4 w-36 bg-ink-dark/10 rounded-md"></div>
                      <div className="h-4 w-24 bg-ink-dark/10 rounded-md"></div>
                    </div>
                  </div>
                  {/* Main content */}
                  <div className="flex-1 sm:pl-8 flex flex-col space-y-6">
                    <div className="h-32 w-full border-2 border-ink-dark rounded-[10px_20px_5px_15px] shadow-sketch-sm bg-paper-cream"></div>
                    <div className="flex space-x-6 flex-1">
                      <div className="w-2/3 h-full border-2 border-ink-dark rounded-[5px_10px_15px_5px] shadow-sketch-sm bg-paper-white relative">
                        <div className="absolute bottom-0 left-0 w-full h-1/2 border-t-2 border-ink-dark border-dashed"></div>
                      </div>
                      <div className="w-1/3 h-full border-2 border-ink-dark rounded-full shadow-sketch-sm bg-paper-cream flex items-center justify-center">
                        <div className="w-2/3 h-2/3 border-4 border-marker-blue rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Overlay Text */}
                <div className="absolute inset-0 flex items-center justify-center bg-paper-white/60 backdrop-blur-[2px]">
                  <div className="bg-paper-white border-2 border-ink-dark p-6 shadow-sketch-lg rotate-[-2deg] max-w-sm text-center">
                    <h3 className="font-display font-bold text-3xl mb-2">Interactive Dashboard</h3>
                    <p className="font-body text-xl">Sign up to see the real magic!</p>
                  </div>
                </div>
              </div>
            </PaperCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
