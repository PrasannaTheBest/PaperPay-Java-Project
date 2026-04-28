'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Settings, Users, Activity, FileText, LogOut } from 'lucide-react';
import { ScribbleUnderline } from '@/components/sketch/SVGDecorations';
import { useAuthStore } from '@/lib/auth/store';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore(s => s.logout);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { label: 'Overview', icon: Activity, href: '/admin' },
    { label: 'Users', icon: Users, href: '/admin' },
    { label: 'Reports', icon: FileText, href: '/admin' },
    { label: 'Settings', icon: Settings, href: '/admin' },
  ];

  return (
    <div className="min-h-screen bg-[url('/textures/paper-grid.png')] bg-paper-white bg-paper-grid flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-[240px] border-b-2 md:border-b-0 md:border-r-2 border-ink-dark bg-paper-cream flex flex-col">
        <div className="p-6 border-b-2 border-ink-dark/20">
          <Link href="/admin" className="text-3xl font-display font-bold relative inline-block text-marker-red">
            PaperPay Admin
            <ScribbleUnderline className="text-ink-dark" />
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 flex md:flex-col overflow-x-auto md:overflow-visible">
          {navItems.map((item, i) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={i} 
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-md font-body text-xl cursor-pointer whitespace-nowrap transition-colors ${isActive ? 'bg-ink-dark text-paper-white' : 'text-ink-medium hover:bg-paper-tan hover:text-ink-dark'}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 mt-auto border-t-2 border-ink-dark/20 hidden md:block">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 font-body text-marker-red hover:underline decoration-wavy w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Exit Admin</span>
          </button>
        </div>
      </aside>
      
      {/* Admin Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
      
    </div>
  );
}
