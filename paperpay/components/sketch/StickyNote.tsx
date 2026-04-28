'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface StickyNoteProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: 'yellow' | 'pink' | 'blue' | 'green' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  rotate?: number;
  pinned?: boolean;
}

export function StickyNote({
  children,
  className,
  color = 'yellow',
  size = 'md',
  rotate = -2,
  pinned = false,
  ...props
}: StickyNoteProps) {
  
  const colorClasses = {
    yellow: "bg-sticky-yellow",
    pink: "bg-sticky-pink",
    blue: "bg-sticky-blue",
    green: "bg-sticky-green",
    purple: "bg-sticky-purple",
  };

  const sizeClasses = {
    sm: "p-3 text-sm",
    md: "p-5 text-base",
    lg: "p-8 text-lg",
  };

  return (
    <motion.div
      className={cn(
        "relative sticky-note-shape shadow-sketch-sm border border-ink-dark/10 font-body text-ink-dark",
        colorClasses[color],
        sizeClasses[size],
        className
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props as any}
    >
      {pinned && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-marker-red shadow-sm border border-ink-dark z-10 flex items-center justify-center">
           <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
        </div>
      )}
      {children}
      {/* Folded corner effect */}
      <div className={cn(
        "absolute bottom-0 right-0 w-0 h-0 border-solid border-t-[12px] border-r-[12px] border-r-transparent rounded-bl-sm",
        "border-t-black/10"
      )} />
    </motion.div>
  );
}
