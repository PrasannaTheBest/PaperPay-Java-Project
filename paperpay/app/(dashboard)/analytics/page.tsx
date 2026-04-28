'use client';

import React, { useEffect, useState } from 'react';
import { PaperCard } from '@/components/sketch/PaperCard';
import { ScribbleUnderline, ArrowSketch } from '@/components/sketch/SVGDecorations';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { SpendingSummary } from '@/components/dashboard/SpendingSummary';
import { TrendingDown, TrendingUp, DollarSign, Wallet } from 'lucide-react';
import { api } from '@/lib/api/client';

const MONTHLY_DATA_FALLBACK = [
  { name: 'Jan', spend: 4000, income: 6000 },
  { name: 'Feb', spend: 3000, income: 5500 },
  { name: 'Mar', spend: 2000, income: 7000 },
  { name: 'Apr', spend: 2780, income: 6500 },
  { name: 'May', spend: 1890, income: 8000 },
  { name: 'Jun', spend: 2390, income: 7500 },
];

export default function AnalyticsPage() {
  const [monthlyData, setMonthlyData] = useState<any[]>(MONTHLY_DATA_FALLBACK);
  const [summary, setSummary] = useState<any>({
    totalIncome: '₹40,500', totalExpenses: '₹16,060',
    savingsRate: '60.3%', biggestCategory: 'Food',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const monthlyDataResult = await api.analytics.monthly().catch(() => null);
        if (monthlyDataResult && monthlyDataResult.length > 0) {
          setMonthlyData(monthlyDataResult);
        }

        const summaryData = await api.analytics.summary().catch(() => null);
        if (summaryData) {
          setSummary({
            totalIncome: '₹' + (parseFloat(summaryData.totalIncome) || 0).toLocaleString('en-IN'),
            totalExpenses: '₹' + (parseFloat(summaryData.totalExpenses) || 0).toLocaleString('en-IN'),
            savingsRate: summaryData.savingsRate || '0%',
            biggestCategory: summaryData.biggestCategory || '-',
          });
        }
      } catch (err: any) {
        console.error('Failed to load analytics', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-sticky-yellow border-2 border-ink-dark p-3 shadow-sketch-sm rounded-[3px_3px_3px_3px_/_3px_3px_15px_3px] rotate-[-2deg]">
          <p className="font-display font-bold text-lg mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="font-body text-ink-dark">
              {entry.name}: <span className="font-mono font-bold">₹{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-display font-bold inline-block relative">
          The Big Picture
          <ScribbleUnderline className="text-marker-purple" />
        </h1>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Income', value: summary.totalIncome, trend: 'up', icon: DollarSign, color: 'marker-green' },
          { label: 'Total Expenses', value: summary.totalExpenses, trend: 'down', icon: Wallet, color: 'marker-red' },
          { label: 'Savings Rate', value: summary.savingsRate, trend: 'up', icon: TrendingUp, color: 'marker-blue' },
          { label: 'Biggest Expense', value: summary.biggestCategory, sub: '(Category)', icon: TrendingDown, color: 'marker-yellow' },
        ].map((stat, i) => (
          <PaperCard key={i} variant="sketch" className="p-6 bg-paper-white relative overflow-hidden" animateHover>
            <div className={`absolute top-0 right-0 w-16 h-16 bg-${stat.color}-light rounded-bl-full border-b-2 border-l-2 border-ink-dark/20 z-0`}></div>
            <p className="font-body text-ink-medium text-lg relative z-10">{stat.label}</p>
            <h3 className="font-display font-bold text-3xl my-2 relative z-10">{stat.value}</h3>
            {stat.sub && <p className="font-body text-sm text-ink-medium relative z-10 -mt-2 mb-2">{stat.sub}</p>}
            
            <div className="flex items-center space-x-2 text-sm font-body font-bold relative z-10">
              {stat.trend === 'up' ? (
                <ArrowSketch direction="up" className="w-5 h-5 text-marker-green" />
              ) : (
                <ArrowSketch direction="down" className="w-5 h-5 text-marker-green" />
              )}
              <span>vs last month</span>
            </div>
          </PaperCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Area Chart */}
        <PaperCard variant="sketch" className="p-6 bg-paper-cream flex flex-col min-h-[400px]">
          <h3 className="font-display font-bold text-3xl mb-8 relative inline-block">
            Monthly Trends
            <ScribbleUnderline className="text-marker-blue w-2/3" />
          </h3>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={{ stroke: '#1A1611', strokeWidth: 2 }} tickLine={false} tick={{ fontFamily: '"Patrick Hand", cursive', fill: '#1A1611' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontFamily: '"Patrick Hand", cursive', fill: '#6B5B3E' }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="spend" name="Spend" stroke="#DC2626" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" activeDot={{ r: 6, stroke: '#1A1611', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PaperCard>

        {/* Chart 2: Category Breakdown */}
        <div className="min-h-[400px]">
          <SpendingSummary />
        </div>

        {/* Chart 3: Income vs Expense */}
        <PaperCard variant="sketch" className="p-6 bg-paper-white flex flex-col min-h-[400px]">
          <h3 className="font-display font-bold text-3xl mb-8 relative inline-block">
            Income vs Expense
            <ScribbleUnderline className="text-marker-green w-3/4" />
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={{ stroke: '#1A1611', strokeWidth: 2 }} tickLine={false} tick={{ fontFamily: '"Patrick Hand", cursive', fill: '#1A1611' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontFamily: '"Patrick Hand", cursive', fill: '#6B5B3E' }} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(26, 22, 17, 0.05)' }} />
                <Legend wrapperStyle={{ fontFamily: '"Patrick Hand", cursive' }} iconType="circle" />
                <Bar dataKey="income" name="Income" fill="#16A34A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spend" name="Expense" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PaperCard>

        {/* Chart 4: Savings Progress */}
        <PaperCard variant="sketch" className="p-6 bg-paper-warm flex flex-col min-h-[400px] relative">
          <div className="absolute top-6 right-6 z-10 hidden sm:block">
            <ArrowSketch direction="down" className="w-12 h-12 text-marker-yellow rotate-[-30deg]" />
            <p className="font-display font-bold text-xl text-marker-yellow absolute -bottom-6 -left-12 rotate-[-10deg] whitespace-nowrap">Goal: ₹10,000</p>
          </div>
          
          <h3 className="font-display font-bold text-3xl mb-8 relative inline-block">
            Savings Progress
            <ScribbleUnderline className="text-marker-yellow w-1/2" />
          </h3>
          <div className="flex-1 w-full flex items-end justify-around pb-8 relative">
            {/* Goal Line */}
            <div className="absolute left-0 right-0 top-1/4 border-b-2 border-dashed border-marker-red/50 z-0"></div>
            
            {monthlyData.slice(-4).map((data, i) => {
              const savings = data.income - data.spend;
              const height = Math.min((savings / 5000) * 100, 100); // 5000 is mock max
              
              return (
                <div key={i} className="flex flex-col items-center relative z-10 w-16">
                  <div className="font-mono font-bold text-sm mb-2 opacity-0 hover:opacity-100 absolute -top-8 transition-opacity bg-paper-white border border-ink-dark px-2 rounded-sm whitespace-nowrap z-20">
                    ₹{savings}
                  </div>
                  <div 
                    className={`w-full border-2 border-ink-dark rounded-t-sm shadow-sketch-sm ${i % 2 === 0 ? 'bg-marker-blue' : 'bg-marker-green'}`}
                    style={{ height: `${height}%`, transition: 'height 1s ease-out' }}
                  ></div>
                  <span className="font-body text-ink-medium mt-4">{data.name}</span>
                </div>
              );
            })}
          </div>
        </PaperCard>
      </div>
    </div>
  );
}
