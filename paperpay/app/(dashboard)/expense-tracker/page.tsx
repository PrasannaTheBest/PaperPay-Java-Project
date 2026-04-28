'use client';

import React, { useState, useEffect } from 'react';
import { PaperCard } from '@/components/sketch/PaperCard';
import { StickyNote } from '@/components/sketch/StickyNote';
import { ScribbleUnderline, ArrowSketch } from '@/components/sketch/SVGDecorations';
import { SketchButton } from '@/components/sketch/SketchButton';
import { SketchInput } from '@/components/sketch/SketchInput';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Coffee, ShoppingBag, Car, Zap, FileText, Trash2, Edit2 } from 'lucide-react';
import { MOCK_CATEGORIES, MOCK_TRANSACTIONS } from '@/lib/mock-data/transactions';
import { api } from '@/lib/api/client';

export default function ExpenseTrackerPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expenses, setExpenses] = useState<any[]>(MOCK_TRANSACTIONS.filter(t => t.type === 'expense'));
  const [categories, setCategories] = useState<any[]>(MOCK_CATEGORIES);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: '', notes: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const expenseData = await api.expenses.list().catch(() => null);
        if (expenseData && expenseData.length > 0) {
          setExpenses(expenseData.map((e: any) => ({
            id: e.id, merchant: e.title, amount: e.amount,
            date: e.expenseDate, type: 'expense', category: e.category, status: 'completed'
          })));
        }

        const catData = await api.analytics.categories().catch(() => null);
        if (catData && catData.length > 0) {
          setCategories(catData);
        }
      } catch (err: any) {
        console.error('Failed to load expenses', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!newExpense.title.trim()) {
      setError('Please enter an expense title');
      return;
    }
    if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (parseFloat(newExpense.amount) > 1000000) {
      setError('Amount cannot exceed ₹10,00,000');
      return;
    }
    if (!newExpense.category) {
      setError('Please select a category');
      return;
    }

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      await api.expenses.add({
        title: newExpense.title,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category || 'Other',
        notes: newExpense.notes,
        expenseDate: today,
      });
      setIsAddModalOpen(false);
      setNewExpense({ title: '', amount: '', category: '', notes: '' });
      
      // Refresh
      const data: any = await api.expenses.list();
      if (data && data.length > 0) {
        setExpenses(data.map((ex: any) => ({
          id: ex.id, merchant: ex.title, amount: ex.amount,
          date: ex.expenseDate, type: 'expense', category: ex.category, status: 'completed'
        })));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add expense');
    }
  };
  
  const getIcon = (name: string) => {
    switch(name.toLowerCase()) {
      case 'food': return <Coffee className="w-8 h-8 text-ink-dark" />;
      case 'transport': return <Car className="w-8 h-8 text-ink-dark" />;
      case 'shopping': return <ShoppingBag className="w-8 h-8 text-ink-dark" />;
      case 'bills': return <Zap className="w-8 h-8 text-ink-dark" />;
      default: return <FileText className="w-8 h-8 text-ink-dark" />;
    }
  };

  const getMarkerDot = (cat: string) => {
    switch(cat.toLowerCase()) {
      case 'food': return 'bg-marker-yellow';
      case 'transport': return 'bg-marker-blue';
      case 'shopping': return 'bg-marker-pink';
      case 'bills': return 'bg-marker-green';
      default: return 'bg-marker-purple';
    }
  };

  return (
    <div className="space-y-12 pb-12 relative overflow-hidden">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold inline-block relative">
            Expense Tracker
            <ScribbleUnderline className="text-marker-pink" />
          </h1>
          <p className="text-xl font-body text-ink-medium mt-2">Where did it all go?</p>
        </div>
        <SketchButton onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2 inline" /> Add Expense
        </SketchButton>
      </header>

      {/* Category Corkboard */}
      <section>
        <h2 className="text-3xl font-display font-bold mb-6">Budget Envelopes</h2>
        <div className="p-8 bg-paper-tan rounded-[10px_20px_5px_15px] border-4 border-ink-dark shadow-sketch-lg relative">
          <div className="absolute inset-0 opacity-20 bg-[url('/textures/paper-grid.png')] bg-repeat"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 relative z-10">
            {MOCK_CATEGORIES.map((cat, i) => (
              <StickyNote 
                key={cat.id} 
                color={cat.color as any} 
                size="sm"
                rotate={i % 2 === 0 ? 2 : -2}
                className="cursor-pointer"
                pinned
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    {getIcon(cat.name)}
                    <span className="font-body font-bold text-lg">{cat.name}</span>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="w-full h-2 bg-ink-dark/10 rounded-full mb-1 overflow-hidden border border-ink-dark/20">
                      <div 
                        className={`h-full bg-marker-${cat.color} border-r border-ink-dark/20`}
                        style={{ width: `${Math.min((cat.spent / cat.limit) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="font-mono text-sm text-right">
                      <span className="font-bold">₹{cat.spent}</span> / ₹{cat.limit}
                    </p>
                  </div>
                </div>
              </StickyNote>
            ))}
            
            <StickyNote color="yellow" size="sm" rotate={1} className="border-2 border-dashed border-ink-dark/30 bg-transparent shadow-none hover:shadow-sketch-sm flex flex-col items-center justify-center cursor-pointer opacity-70 hover:opacity-100">
              <Plus className="w-8 h-8 mb-2" />
              <span className="font-display font-bold text-xl">New Envelope</span>
            </StickyNote>
          </div>
        </div>
      </section>

      {/* Expense Log (Ledger Style) */}
      <section>
        <div className="flex items-center space-x-4 mb-6 border-b-2 border-ink-dark">
          <h2 className="text-3xl font-display font-bold pb-2 border-b-4 border-ink-dark inline-block mb-[-2px]">Ledger</h2>
          <div className="px-4 py-2 font-display text-xl text-ink-medium hover:text-ink-dark cursor-pointer">October</div>
          <div className="px-4 py-2 font-display text-xl text-ink-medium hover:text-ink-dark cursor-pointer">September</div>
        </div>

        <PaperCard variant="sketch" className="p-0 bg-paper-white overflow-hidden">
          {/* Notebook side margin */}
          <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-marker-red/50 z-0"></div>
          <div className="absolute left-17 top-0 bottom-0 w-0.5 bg-marker-red/50 z-0 ml-1"></div>

          <div className="relative z-10">
            {/* Header row */}
            <div className="flex px-4 py-4 border-b-2 border-ink-dark/20 bg-paper-cream/50">
              <div className="w-16 flex-shrink-0"></div>
              <div className="w-32 font-display font-bold text-xl px-4">Date</div>
              <div className="flex-1 font-display font-bold text-xl px-4">Description</div>
              <div className="w-32 text-right font-display font-bold text-xl px-8">Amount</div>
            </div>

            {/* Entry rows */}
            {expenses.map((tx, i) => (
              <motion.div 
                key={tx.id}
                className="flex px-4 py-4 border-b border-ink-dark/10 group relative"
                whileHover={{ backgroundColor: 'rgba(232, 223, 196, 0.2)' }}
                style={{ 
                  backgroundImage: 'linear-gradient(transparent 95%, rgba(26, 22, 17, 0.05) 100%)',
                  backgroundSize: '100% 100%' 
                }}
              >
                {/* Delete/Edit actions appear on hover */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                  <button className="p-1 text-ink-medium hover:text-marker-blue"><Edit2 className="w-4 h-4" /></button>
                  <button className="p-1 text-ink-medium hover:text-marker-red"><Trash2 className="w-4 h-4" /></button>
                </div>

                <div className="w-16 flex-shrink-0 flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full border border-ink-dark ${getMarkerDot(tx.category)}`}></div>
                </div>
                <div className="w-32 font-body text-ink-medium px-4 flex items-center">
                  {new Date(tx.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 font-display text-2xl px-4 flex items-center">
                  {tx.merchant} <span className="ml-2 text-sm font-body text-ink-faint">({tx.category})</span>
                </div>
                <div className="w-32 text-right font-mono font-bold text-xl px-8 flex items-center justify-end text-ink-dark">
                  ₹{tx.amount.toLocaleString()}
                </div>
              </motion.div>
            ))}

            {/* Footer sum */}
            <div className="flex px-4 py-6 bg-paper-cream/50 mt-4 border-t-2 border-ink-dark border-dashed">
              <div className="w-16 flex-shrink-0"></div>
              <div className="w-32 px-4"></div>
              <div className="flex-1 font-display font-bold text-2xl px-4 text-right">
                Monthly Total:
                <ArrowSketch direction="right" className="inline-block w-8 h-8 ml-2 text-ink-dark" />
              </div>
              <div className="w-40 text-right font-display font-bold text-3xl px-8 border-b-4 border-ink-dark border-double relative">
                ₹{expenses.filter(t => t.type === 'expense').reduce((acc, t) => acc + parseFloat(t.amount), 0).toLocaleString()}
              </div>
            </div>
          </div>
        </PaperCard>
      </section>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center bg-ink-dark/20 backdrop-blur-sm p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0, y: 100, rotate: 10 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              exit={{ opacity: 0, y: 100, rotate: 10 }}
              className="w-full max-w-md relative"
            >
              <div className="absolute -top-4 -right-4 z-10" onClick={() => setIsAddModalOpen(false)}>
                 <button className="w-10 h-10 rounded-full bg-paper-white border-2 border-ink-dark shadow-sketch-sm flex items-center justify-center hover:bg-paper-tan">
                   <Plus className="w-6 h-6 rotate-45" />
                 </button>
              </div>
              <StickyNote color="yellow" size="lg" rotate={-2} className="w-full max-h-[90vh] overflow-y-auto">
                <h3 className="font-display font-bold text-3xl mb-6 text-center border-b-2 border-ink-dark/20 pb-2">Record Expense</h3>
                
                <form className="space-y-6" onSubmit={handleAddExpense}>
                  <div className="flex items-center text-4xl font-display font-bold border-b-2 border-ink-dark/30 pb-2">
                    <span className="mr-2">₹</span>
                    <input type="number" placeholder="0" className="w-full bg-transparent outline-none" autoFocus
                      value={newExpense.amount} onChange={(e) => setNewExpense(p => ({...p, amount: e.target.value}))} />
                  </div>
                  
                  <SketchInput label="What was it for?" placeholder="Coffee at Starbucks"
                    onChange={(e: any) => setNewExpense(p => ({...p, title: e.target.value}))} />
                  
                  <div>
                    <label className="font-body text-ink-faint text-lg block mb-2">Category Envelope</label>
                    <div className="flex flex-wrap gap-2">
                      {MOCK_CATEGORIES.map(c => (
                        <div key={c.id} className={`px-3 py-1 border border-ink-dark/50 rounded-sm font-body cursor-pointer hover:bg-marker-${c.color}-light transition-colors`}>
                          {c.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <SketchButton type="submit" className="w-full py-4 text-xl mt-8">Stamp It!</SketchButton>
                </form>
              </StickyNote>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
