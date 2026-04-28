import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { HandwrittenLabel } from './HandwrittenLabel';
import { CheckmarkSketch } from './SVGDecorations';
import { motion, AnimatePresence } from 'framer-motion';

export interface SketchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isValid?: boolean;
}

export const SketchInput = React.forwardRef<HTMLInputElement, SketchInputProps>(
  ({ className, label, error, isValid, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="relative mb-6">
        <HandwrittenLabel isFocused={isFocused || !!props.value} animateFocus>
          {label}
        </HandwrittenLabel>
        
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              "w-full bg-transparent border-b-2 border-ink-dark/30 py-2 font-display text-xl outline-none transition-colors",
              "focus:border-marker-blue focus:border-b-[3px]",
              error && "border-marker-red focus:border-marker-red",
              className
            )}
            style={{
              backgroundImage: 'linear-gradient(transparent, transparent 28px, var(--ink-dark) 28px)',
              backgroundSize: '100% 30px',
              backgroundPosition: '0 10px',
              opacity: 0.9,
            }}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          
          <AnimatePresence>
            {isValid && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute right-2 top-2"
              >
                <CheckmarkSketch className="w-6 h-6 text-marker-green" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-marker-red font-body text-sm mt-1 absolute"
            >
              * {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
SketchInput.displayName = 'SketchInput';
