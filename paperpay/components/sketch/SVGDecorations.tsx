'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const inkDraw: any = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { 
    pathLength: 1, opacity: 1,
    transition: { duration: 1.2, ease: "easeInOut" }
  }
};

export function ScribbleUnderline({ className }: { className?: string }) {
  return (
    <svg className={cn("absolute -bottom-2 left-0 w-full h-3 text-ink-dark", className)} viewBox="0 0 100 10" preserveAspectRatio="none">
      <motion.path
        d="M2,8 Q25,2 50,5 T98,5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        variants={inkDraw}
        initial="hidden"
        animate="visible"
      />
    </svg>
  );
}

export function ArrowSketch({ direction = 'right', className }: { direction?: 'right'|'left'|'up'|'down', className?: string }) {
  const rotation = { right: 0, down: 90, left: 180, up: -90 }[direction];
  return (
    <svg className={cn("text-ink-dark w-8 h-8", className)} style={{ transform: `rotate(${rotation}deg)` }} viewBox="0 0 40 40">
      <motion.path
        d="M5,20 Q20,18 35,20 M25,10 Q32,15 35,20 Q32,25 25,30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={inkDraw}
        initial="hidden"
        animate="visible"
      />
    </svg>
  );
}

export function CircleHighlight({ className }: { className?: string }) {
  return (
    <svg className={cn("absolute inset-0 w-full h-full text-marker-yellow scale-110 -z-10", className)} viewBox="0 0 100 100" preserveAspectRatio="none">
      <motion.path
        d="M50,10 A40,40 0 1,1 48,10"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        variants={inkDraw}
        initial="hidden"
        animate="visible"
      />
    </svg>
  );
}

export function StarDoodle({ className }: { className?: string }) {
  return (
    <svg className={cn("text-marker-yellow w-6 h-6", className)} viewBox="0 0 24 24">
      <motion.path
        d="M12,2 L14,9 L21,9 L15,14 L17,21 L12,17 L7,21 L9,14 L3,9 L10,9 Z"
        fill="currentColor"
        stroke="var(--ink-dark)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        variants={inkDraw}
        initial="hidden"
        animate="visible"
      />
    </svg>
  );
}

export function CheckmarkSketch({ className }: { className?: string }) {
  return (
    <svg className={cn("text-marker-green w-6 h-6", className)} viewBox="0 0 24 24">
      <motion.path
        d="M4,12 L9,18 L20,6"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={inkDraw}
        initial="hidden"
        animate="visible"
      />
    </svg>
  );
}

export function PaperClip({ className }: { className?: string }) {
  return (
    <svg className={cn("absolute -top-4 right-4 w-8 h-10 text-ink-medium drop-shadow-md z-10", className)} viewBox="0 0 24 40">
      <path
        d="M12,2 L12,32 C12,36 6,36 6,32 L6,8 C6,5 18,5 18,8 L18,28 C18,29 16,30 15,28 L15,10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TapeStrip({ className }: { className?: string }) {
  return (
    <div className={cn(
      "absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-paper-tan/60 backdrop-blur-sm shadow-sm rotate-[-2deg] z-10",
      className
    )} style={{ clipPath: 'polygon(5% 0, 95% 2%, 100% 100%, 0 98%)' }} />
  );
}
