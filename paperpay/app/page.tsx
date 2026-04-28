import React from 'react';
import { NavBar } from '@/components/landing/NavBar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { ProductShowcase } from '@/components/landing/ProductShowcase';
import { Testimonials } from '@/components/landing/Testimonials';
import { CTASection } from '@/components/landing/CTASection';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-paper-white">
      <NavBar />
      <HeroSection />
      <FeaturesGrid />
      <ProductShowcase />
      <Testimonials />
      <CTASection />
      
      {/* Footer */}
      <footer className="py-12 text-center bg-paper-white border-t-2 border-ink-dark border-dashed">
        <p className="font-display text-2xl font-bold mb-4">PaperPay</p>
        <p className="font-body text-ink-medium text-lg">© {new Date().getFullYear()} PaperPay App. Handcrafted with care.</p>
      </footer>
    </main>
  );
}
