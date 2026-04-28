'use client';
import React from 'react';
import { ScribbleUnderline, StarDoodle } from '@/components/sketch/SVGDecorations';
import { PaperCard } from '@/components/sketch/PaperCard';

const TESTIMONIALS = [
  { quote: "Finally, a finance app that doesn't make me feel like I'm looking at an Excel spreadsheet. It's actually fun to use!", author: "Priya S.", role: "Designer", rotate: -2 },
  { quote: "The expense tracker completely changed how I budget. The handwritten ledger style makes it so much more personal.", author: "Rahul M.", role: "Freelancer", rotate: 1 },
  { quote: "Sent money to my friend and the animated stamp made us both smile. PaperPay brings joy back to personal finance.", author: "Ananya K.", role: "Student", rotate: -1 },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-4 bg-paper-white relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-display font-bold inline-block relative">
            Wall of Love
            <ScribbleUnderline className="text-marker-yellow" />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((test, i) => (
            <PaperCard 
              key={i} 
              variant="sketch" 
              rotate={test.rotate} 
              hasTape={true}
              className="p-8 flex flex-col h-full bg-paper-cream border-t-0"
            >
              {/* Torn paper effect at top simulated with CSS border image or clip-path in real app, here we use a stylized approach */}
              <div className="absolute top-0 left-0 w-full h-3 bg-[url('/textures/paper-grid.png')] bg-repeat-x opacity-20"></div>
              
              <div className="flex space-x-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarDoodle key={star} className="w-5 h-5" />
                ))}
              </div>
              
              <p className="font-display text-2xl flex-grow mb-8 leading-snug">
                "{test.quote}"
              </p>
              
              <div className="flex items-center space-x-4 mt-auto">
                <div className="w-12 h-12 rounded-full border-2 border-ink-dark bg-paper-tan flex items-center justify-center font-display font-bold text-xl">
                  {test.author.charAt(0)}
                </div>
                <div>
                  <p className="font-display font-bold text-xl">{test.author}</p>
                  <p className="font-body text-ink-medium text-lg">{test.role}</p>
                </div>
              </div>
            </PaperCard>
          ))}
        </div>
      </div>
    </section>
  );
}
