'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { PaperClip, TapeStrip } from './SVGDecorations';
import { motion } from 'framer-motion';

export interface PaperCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'sketch' | 'sticky' | 'receipt' | 'folder';
  stickyColor?: 'yellow' | 'pink' | 'blue' | 'green' | 'purple';
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  rotate?: number;
  hasTape?: boolean;
  hasClip?: boolean;
  animateHover?: boolean;
}

export function PaperCard({
  children,
  className,
  variant = 'sketch',
  stickyColor = 'yellow',
  shadow = 'md',
  rotate = 0,
  hasTape = false,
  hasClip = false,
  animateHover = true,
  ...props
}: PaperCardProps) {
  
  const baseClasses = "relative bg-paper-white border-2 border-ink-dark paper-texture";
  
  const shadowClasses = {
    sm: "shadow-sketch-sm",
    md: "shadow-sketch",
    lg: "shadow-sketch-lg",
    xl: "shadow-sketch-xl",
  };

  const variantClasses = {
    sketch: "card-sketch",
    sticky: `bg-sticky-${stickyColor} sticky-note-shape border-ink-dark/50`,
    receipt: "border-x-2 border-t-2 border-b-0 border-dashed pb-8",
    folder: "rounded-t-lg rounded-b-sm border-t-4",
  };

  const animationProps = animateHover ? {
    whileHover: { y: -4, x: -2, rotate: rotate },
    transition: { type: "spring", stiffness: 300 }
  } : {};

  return (
    <motion.div
      className={cn(
        baseClasses,
        shadowClasses[shadow],
        variantClasses[variant],
        animateHover && "transition-all duration-200",
        className
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
      {...animationProps}
      {...props as any}
    >
      {hasTape && <TapeStrip />}
      {hasClip && <PaperClip />}
      {children}
    </motion.div>
  );
}
