'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface HandwrittenLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  animateFocus?: boolean;
  isFocused?: boolean;
}

export function HandwrittenLabel({
  children,
  className,
  animateFocus = false,
  isFocused = false,
  ...props
}: HandwrittenLabelProps) {
  
  return (
    <motion.label
      className={cn(
        "font-body text-ink-faint text-lg block mb-1 transition-colors duration-200",
        isFocused && "text-marker-blue font-bold",
        className
      )}
      animate={animateFocus && isFocused ? { y: -2, scale: 1.05 } : { y: 0, scale: 1 }}
      {...props as any}
    >
      {children}
    </motion.label>
  );
}
