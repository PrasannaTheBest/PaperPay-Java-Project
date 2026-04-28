'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SketchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function SketchButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  ...props
}: SketchButtonProps) {
  
  const baseClasses = "relative font-display font-bold inline-flex items-center justify-center transition-all btn-wobbly paper-texture outline-none focus-visible:ring-2 focus-visible:ring-marker-blue focus-visible:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-marker-blue text-paper-white border-2 border-ink-dark shadow-sketch-sm hover:shadow-sketch-md hover:-translate-y-0.5 active:translate-y-1 active:translate-x-1 active:shadow-none",
    outline: "bg-transparent text-ink-dark border-2 border-ink-dark shadow-sketch-sm hover:bg-paper-tan/20 hover:-translate-y-0.5 active:translate-y-1 active:translate-x-1 active:shadow-none",
    danger: "bg-marker-red text-paper-white border-2 border-ink-dark shadow-sketch-sm hover:shadow-sketch-md hover:-translate-y-0.5 active:translate-y-1 active:translate-x-1 active:shadow-none",
    ghost: "bg-transparent text-ink-dark hover:bg-paper-tan/20",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-8 py-4 text-xl",
  };

  return (
    <motion.button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      whileTap={{ scale: 0.98 }}
      disabled={isLoading || props.disabled}
      {...props as any}
    >
      {isLoading ? (
        <div className="flex space-x-1">
          <motion.div className="w-2 h-2 bg-current rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0 }} />
          <motion.div className="w-2 h-2 bg-current rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0.2 }} />
          <motion.div className="w-2 h-2 bg-current rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0.4 }} />
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
}
