'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  Wallet, Send, Download, PieChart, 
  Target, ShieldAlert, LogOut, Settings
} from 'lucide-react';
import { ScribbleUnderline } from '@/components/sketch/SVGDecorations';
import { PaperCard } from '@/components/sketch/PaperCard';

import { useAuthStore } from '@/lib/auth/store';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: Wallet },
  { label: 'Send Money', href: '/send-money', icon: Send },
  { label: 'Receive', href: '/receive-money', icon: Download },
  { label: 'Expenses', href: '/expense-tracker', icon: PieChart },
  { label: 'Analytics', href: '/analytics', icon: PieChart },
  { label: 'Fraud Center', href: '/fraud-center', icon: ShieldAlert },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [balance, setBalance] = React.useState('0.00');

  React.useEffect(() => {
    api.wallet.get().then((w: any) => setBalance(w.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 }))).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-[260px] h-screen sticky top-0 bg-paper-warm bg-[url('/textures/paper-lines.png')] bg-paper-lines border-r-2 border-ink-dark flex flex-col hidden md:flex overflow-hidden">
      
      {/* Logo */}
      <div className="p-8 pb-4">
        <Link href="/dashboard" className="text-4xl font-display font-bold relative inline-block">
          PaperPay
          <ScribbleUnderline className="text-marker-blue -bottom-2 h-4 w-[110%] -left-[5%]" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  "flex items-center space-x-4 px-4 py-3 rounded-md font-body text-xl transition-colors cursor-pointer relative",
                  isActive ? "text-ink-dark font-bold" : "text-ink-medium hover:text-ink-dark"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="highlighter"
                    className="absolute inset-0 bg-sticky-yellow rounded-sm border border-ink-dark/10"
                    style={{ transform: 'rotate(-1deg)' }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="w-6 h-6 relative z-10" strokeWidth={isActive ? 2 : 1.5} />
                <span className="relative z-10">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Card */}
      <div className="p-4 mt-auto">
        <PaperCard variant="sketch" shadow="sm" animateHover={false} className="p-4 bg-paper-white flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full border-2 border-ink-dark bg-marker-purple-light flex items-center justify-center">
            <span className="font-display font-bold text-ink-dark">{user?.fullName?.[0] || 'U'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold truncate">{user?.fullName || 'User'}</p>
            <p className="font-body text-sm text-ink-medium truncate">₹ {balance}</p>
          </div>
          <button onClick={handleLogout} className="text-ink-faint hover:text-marker-red transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </PaperCard>
      </div>
    </aside>
  );
}
