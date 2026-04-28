'use client';

import React, { useState, useEffect } from 'react';
import { PaperCard } from '@/components/sketch/PaperCard';
import { StickyNote } from '@/components/sketch/StickyNote';
import { SketchButton } from '@/components/sketch/SketchButton';
import { ScribbleUnderline, ArrowSketch } from '@/components/sketch/SVGDecorations';
import { ShieldAlert, MapPin, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api/client';

const MOCK_ALERTS = [
  {
    id: 'alt-1',
    merchant: 'Apple Store, Singapore',
    amount: 145000,
    time: '2 mins ago',
    level: 'CRITICAL',
    color: 'marker-orange',
    reasons: ['Unusual location (Singapore)', 'Amount 5x higher than average', 'Card not present transaction'],
    status: 'pending'
  },
  {
    id: 'alt-2',
    merchant: 'Unknown Online Merchant',
    amount: 899,
    time: '1 hour ago',
    level: 'HIGH',
    color: 'marker-red',
    reasons: ['New merchant', 'Multiple small charges attempted'],
    status: 'pending'
  },
  {
    id: 'alt-3',
    merchant: 'Netflix Subscription',
    amount: 649,
    time: '5 hours ago',
    level: 'MEDIUM',
    color: 'marker-yellow',
    reasons: ['Duplicate charge within 24 hours'],
    status: 'resolved'
  }
];

export default function FraudCenterPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [riskScore, setRiskScore] = useState(0);

  useEffect(() => {
    api.fraud.alerts().then((data: any) => {
      setAlerts(data || []);
      setLoading(false);
    }).catch(() => setLoading(false));

    api.fraud.riskScore().then((data: any) => {
      setRiskScore(data.score || 0);
    }).catch(() => {});
  }, []);

  const handleAction = async (id: string, action: 'safe' | 'block') => {
    const apiAction = action === 'safe' ? 'SAFE' : 'BLOCKED';
    try {
      await api.fraud.updateAlert(Number(id), apiAction as 'SAFE' | 'BLOCKED');
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: action } : a));
    } catch (e) {
      // Optimistic update fallback
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: action } : a));
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold inline-block relative text-marker-red">
            Fraud Shield
            <ScribbleUnderline className="text-ink-dark" />
          </h1>
          <p className="text-xl font-body text-ink-medium mt-2">AI powered detective mode.</p>
        </div>
        <div className="flex items-center space-x-2 bg-marker-green-light border-2 border-ink-dark px-4 py-2 rounded-[2px_8px_2px_6px_/_8px_2px_6px_2px] shadow-sketch-sm">
          <CheckCircle className="w-5 h-5 text-marker-green" />
          <span className="font-display font-bold text-lg">System Secure</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Alerts Feed & Timeline */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Alerts */}
          <section>
            <h2 className="text-3xl font-display font-bold mb-6 flex items-center">
              <ShieldAlert className="w-8 h-8 mr-3 text-marker-red" /> Active Alerts
            </h2>
            <div className="space-y-6">
              <AnimatePresence>
                {alerts.filter(a => a.status === 'pending').length === 0 ? (
                  <PaperCard variant="sketch" className="p-8 text-center bg-marker-green-light/30">
                    <CheckCircle className="w-16 h-16 text-marker-green mx-auto mb-4" />
                    <h3 className="font-display font-bold text-2xl">All Clear!</h3>
                    <p className="font-body text-ink-medium">No suspicious activity detected.</p>
                  </PaperCard>
                ) : (
                  alerts.filter(a => a.status === 'pending').map((alert, i) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: 50, rotate: 2 }}
                      animate={{ opacity: 1, x: 0, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.9, rotate: -2 }}
                      className={cn(
                        "p-6 border-2 border-ink-dark rounded-[12px_4px_10px_6px_/_4px_12px_6px_10px] shadow-sketch-sm bg-paper-white relative overflow-hidden",
                        `bg-${alert.color}-light/20`
                      )}
                    >
                      {/* Rubber Stamp Badge */}
                      <div className="absolute top-4 right-4 rotate-[15deg]">
                        <div className={cn(
                          "border-4 border-double px-4 py-1 font-display font-bold text-2xl tracking-widest",
                          `text-${alert.color} border-${alert.color}`
                        )} style={{ borderRadius: '4px', textShadow: '1px 1px 0px rgba(0,0,0,0.1)' }}>
                          {alert.level}
                        </div>
                      </div>

                      <div className="mb-4 pr-32">
                        <h3 className="font-display font-bold text-3xl mb-1">{alert.merchant}</h3>
                        <div className="flex items-center space-x-4 font-body text-ink-medium">
                          <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {alert.time}</span>
                          <span className="font-mono font-bold text-ink-dark text-lg">₹{alert.amount.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="bg-white/50 border border-ink-dark/20 p-4 rounded-md mb-6">
                        <p className="font-body font-bold mb-2 flex items-center text-marker-red">
                          <AlertTriangle className="w-4 h-4 mr-2" /> Why was this flagged?
                        </p>
                        <ul className="list-disc pl-5 font-body space-y-1 text-ink-dark">
                          {alert.reasons.map((r, idx) => <li key={idx}>{r}</li>)}
                        </ul>
                      </div>

                      <div className="flex space-x-4">
                        <SketchButton variant="primary" className="flex-1 bg-marker-green border-marker-green shadow-sketch-green" onClick={() => handleAction(alert.id, 'safe')}>
                          <CheckCircle className="w-5 h-5 mr-2" /> Mark Safe
                        </SketchButton>
                        <SketchButton variant="danger" className="flex-1" onClick={() => handleAction(alert.id, 'block')}>
                          <XCircle className="w-5 h-5 mr-2" /> Block Card
                        </SketchButton>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Activity Timeline (Evidence Board) */}
          <section>
            <h2 className="text-3xl font-display font-bold mb-6">Evidence Board</h2>
            <PaperCard variant="sketch" className="p-8 bg-paper-tan relative min-h-[300px]">
              <div className="absolute inset-0 opacity-20 bg-[url('/textures/paper-grid.png')] bg-repeat"></div>
              
              <div className="relative z-10 pl-8 space-y-8">
                {/* Wobbly Timeline Line */}
                <svg className="absolute top-0 left-3 bottom-0 w-2 h-full text-ink-dark/30 z-0" preserveAspectRatio="none">
                  <path d="M4,0 Q0,50 4,100 T4,200 T4,300 T4,400" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                </svg>

                {[
                  { time: '10:45 AM', event: 'Login from new device (iPhone 14)', loc: 'Mumbai', type: 'warn' },
                  { time: '11:20 AM', event: 'Changed daily transfer limit', loc: 'Mumbai', type: 'warn' },
                  { time: '02:15 PM', event: 'Failed PIN attempt', loc: 'Delhi (IP)', type: 'danger' },
                  { time: '02:18 PM', event: 'Transaction blocked: Apple Store', loc: 'Singapore', type: 'critical' }
                ].map((ev, i) => (
                  <div key={i} className="relative flex items-start group">
                    <div className={cn(
                      "absolute -left-[2.1rem] w-6 h-6 rounded-full border-2 border-ink-dark flex items-center justify-center z-10 bg-paper-white transition-transform group-hover:scale-125",
                      ev.type === 'critical' ? 'bg-marker-orange shadow-[0_0_10px_rgba(234,88,12,0.5)]' :
                      ev.type === 'danger' ? 'bg-marker-red' : 'bg-marker-yellow'
                    )}>
                      {ev.type === 'critical' && <motion.div className="w-2 h-2 bg-white rounded-full" animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }} />}
                    </div>
                    
                    <StickyNote color={i % 2 === 0 ? 'yellow' : 'pink'} size="sm" rotate={i % 2 === 0 ? 1 : -1} className="flex-1 max-w-sm">
                      <div className="flex justify-between items-start mb-2 border-b border-ink-dark/10 pb-1">
                        <span className="font-body font-bold text-ink-medium">{ev.time}</span>
                        <span className="font-body text-xs flex items-center"><MapPin className="w-3 h-3 mr-1" />{ev.loc}</span>
                      </div>
                      <p className="font-display text-xl">{ev.event}</p>
                    </StickyNote>
                    
                    {/* Connecting strings (like string on an evidence board) */}
                    {i < 3 && (
                      <svg className="absolute -left-6 top-6 w-12 h-16 pointer-events-none z-0 overflow-visible">
                        <path d={`M10,0 Q30,30 10,60`} fill="none" stroke="#DC2626" strokeWidth="1" strokeOpacity="0.5" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </PaperCard>
          </section>

        </div>

        {/* Right Column: Risk Meter & History */}
        <div className="space-y-8">
          
          {/* Risk Meter */}
          <PaperCard variant="sketch" className="p-6 bg-paper-cream flex flex-col items-center">
            <h3 className="font-display font-bold text-2xl mb-8">Account Risk Score</h3>
            
            <div className="relative w-48 h-24 overflow-hidden mb-4">
              {/* Semi-circle Gauge background */}
              <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round" />
                {/* Colored segments */}
                <path d="M 10 50 A 40 40 0 0 1 30 20" fill="none" stroke="#16A34A" strokeWidth="12" strokeLinecap="round" />
                <path d="M 30 20 A 40 40 0 0 1 70 20" fill="none" stroke="#CA8A04" strokeWidth="12" />
                <path d="M 70 20 A 40 40 0 0 1 90 50" fill="none" stroke="#DC2626" strokeWidth="12" strokeLinecap="round" />
                
                {/* Dial numbers */}
                <text x="15" y="45" fontFamily='"Patrick Hand", cursive' fontSize="6" fill="#1A1611">Safe</text>
                <text x="45" y="15" fontFamily='"Patrick Hand", cursive' fontSize="6" fill="#1A1611">Caution</text>
                <text x="75" y="45" fontFamily='"Patrick Hand", cursive' fontSize="6" fill="#1A1611">Danger</text>
                
                {/* Needle */}
                <motion.g 
                  initial={{ rotate: -90 }}
                  animate={{ rotate: 30 }} // Danger zone
                  transition={{ type: "spring", stiffness: 50, damping: 10, delay: 0.5 }}
                  style={{ transformOrigin: '50px 50px' }}
                >
                  <path d="M 48 50 L 50 10 L 52 50 Z" fill="#1A1611" />
                  <circle cx="50" cy="50" r="4" fill="#1A1611" />
                </motion.g>
              </svg>
            </div>
            
            <motion.div 
              className="text-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span className="font-display text-5xl font-bold text-marker-red">82</span>
              <span className="font-display text-xl text-ink-medium">/100</span>
            </motion.div>
            <p className="font-body text-marker-red font-bold mt-2">Elevated Risk Detected</p>
          </PaperCard>

          {/* Folder Tab Table for Resolved */}
          <div className="pt-4">
            <h3 className="font-display font-bold text-2xl mb-4">Resolved Cases</h3>
            <PaperCard variant="folder" shadow="md" className="border-t-marker-blue bg-paper-white p-0 overflow-hidden">
              <div className="divide-y divide-ink-dark/10">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-4 hover:bg-paper-tan/20 transition-colors flex items-center justify-between">
                    <div>
                      <p className="font-display font-bold line-through text-ink-medium decoration-ink-dark/50">Suspicious Transfer</p>
                      <p className="font-body text-sm text-ink-faint">Oct {12 - item}, 2023</p>
                    </div>
                    <div className="border-2 border-marker-green text-marker-green px-2 py-0.5 rounded-sm font-display text-xs font-bold rotate-[-5deg]">
                      CLEARED
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-paper-cream/50 text-center border-t border-ink-dark/10">
                <button className="font-body text-marker-blue hover:underline decoration-wavy">View Archive</button>
              </div>
            </PaperCard>
          </div>

        </div>
      </div>
    </div>
  );
}
