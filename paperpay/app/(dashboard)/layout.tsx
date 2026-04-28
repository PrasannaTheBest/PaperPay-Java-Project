import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Wallet } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper-white flex">
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Header (visible only on small screens) */}
        <header className="md:hidden border-b-2 border-ink-dark bg-paper-warm p-4 flex items-center justify-between z-20">
          <span className="text-2xl font-display font-bold">PaperPay</span>
          <button className="p-2 border-2 border-ink-dark rounded-md bg-paper-white shadow-sketch-sm">
            <Wallet className="w-6 h-6" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="absolute inset-0 paper-texture pointer-events-none opacity-30 z-0"></div>
          <div className="max-w-5xl mx-auto relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
