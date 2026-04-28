'use client';
import React from 'react';
import Link from 'next/link';
import { SketchButton } from '@/components/sketch/SketchButton';
import { ScribbleUnderline } from '@/components/sketch/SVGDecorations';

export function NavBar() {
  return (
    <nav className="w-full py-6 px-8 flex justify-between items-center relative z-50">
      <div className="relative inline-block">
        <Link href="/" className="text-4xl font-display font-bold text-ink-dark">
          PaperPay
        </Link>
        <ScribbleUnderline className="-bottom-1 text-marker-blue w-full h-4" />
      </div>
      
      <div className="hidden md:flex items-center space-x-8 font-body text-xl">
        <Link href="#features" className="hover:text-marker-blue transition-colors hover:-translate-y-0.5 inline-block">Features</Link>
        <Link href="#how-it-works" className="hover:text-marker-blue transition-colors hover:-translate-y-0.5 inline-block">How it Works</Link>
        <Link href="#testimonials" className="hover:text-marker-blue transition-colors hover:-translate-y-0.5 inline-block">Testimonials</Link>
      </div>

      <div className="flex space-x-4">
        <Link href="/login">
          <SketchButton variant="ghost">Log In</SketchButton>
        </Link>
        <Link href="/register">
          <SketchButton variant="primary">Sign Up Free</SketchButton>
        </Link>
      </div>
    </nav>
  );
}
