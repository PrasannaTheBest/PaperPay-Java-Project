'use client';

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PaperCard } from '@/components/sketch/PaperCard';
import { ScribbleUnderline } from '@/components/sketch/SVGDecorations';
import { api } from '@/lib/api/client';

const COLORS = {
  yellow: '#CA8A04',
  blue: '#2563EB',
  pink: '#FBCFE8',
  green: '#16A34A',
  purple: '#7C3AED'
};

export function SpendingSummary() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    api.analytics.categories().then((categories: any) => {
      const formatted = categories.map((c: any) => ({
        name: c.name,
        value: c.spent,
        color: COLORS[c.color as keyof typeof COLORS] || COLORS.yellow
      }));
      setData(formatted);
      setTotal(formatted.reduce((acc: any, curr: any) => acc + curr.value, 0));
    });
  }, []);

  if (!isMounted) return null;

  return (
    <PaperCard variant="sketch" className="p-6 h-full flex flex-col bg-paper-cream">
      <h3 className="font-display font-bold text-3xl mb-6 relative inline-block">
        Where it went
        <ScribbleUnderline className="text-marker-pink w-3/4" />
      </h3>

      <div className="flex-1 relative min-h-[250px]">
        {data.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="#1A1611"
                  strokeWidth={2}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    fontFamily: '"Patrick Hand", cursive', 
                    backgroundColor: '#FEF08A',
                    border: '2px solid #1A1611',
                    borderRadius: '2px 8px 2px 6px / 8px 2px 6px 2px',
                    boxShadow: '3px 3px 0px #1A1611'
                  }}
                  itemStyle={{ color: '#1A1611' }}
                  formatter={(value: any) => [`₹${value}`, 'Spent']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="font-body text-ink-medium text-sm">Total</p>
                <p className="font-display font-bold text-2xl">₹{total}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center animate-pulse">
            <div className="w-40 h-40 rounded-full border-4 border-dashed border-ink-dark/20"></div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {data.map((item, i) => (
          <div key={i} className="flex items-center space-x-1.5 bg-paper-white border border-ink-dark/20 px-2 py-1 rounded-sm">
            <div className="w-3 h-3 rounded-full border border-ink-dark" style={{ backgroundColor: item.color }} />
            <span className="font-body text-sm text-ink-dark">{item.name}</span>
          </div>
        ))}
      </div>
    </PaperCard>
  );
}
