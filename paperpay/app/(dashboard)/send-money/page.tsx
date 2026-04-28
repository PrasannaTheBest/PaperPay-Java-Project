'use client';

import React, { useState, useEffect } from 'react';
import { PaperCard } from '@/components/sketch/PaperCard';
import { SketchButton } from '@/components/sketch/SketchButton';
import { ScribbleUnderline, ArrowSketch, CheckmarkSketch } from '@/components/sketch/SVGDecorations';
import { SketchInput } from '@/components/sketch/SketchInput';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, QrCode, Building, Smartphone } from 'lucide-react';
import { StickyNote } from '@/components/sketch/StickyNote';
import { api } from '@/lib/api/client';

const CONTACTS = [
  { id: 1, name: 'Rahul Sharma', initials: 'RS', color: 'blue' },
  { id: 2, name: 'Priya Patel', initials: 'PP', color: 'pink' },
  { id: 3, name: 'Mom', initials: 'M', color: 'yellow' },
  { id: 4, name: 'Amit Kumar', initials: 'AK', color: 'green' },
];

export default function SendMoneyPage() {
  const [step, setStep] = useState(1);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [upiTarget, setUpiTarget] = useState('');
  const [note, setNote] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txRefId, setTxRefId] = useState('');
  const [sendError, setSendError] = useState('');

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleSend = async () => {
    // Validate inputs
    if (!upiTarget && !selectedContact?.upiId) {
      setSendError('Please enter a UPI ID or select a contact');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setSendError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > 1000000) {
      setSendError('Amount cannot exceed ₹10,00,000 per transaction');
      return;
    }

    if (!method) {
      setSendError('Please select a payment method');
      return;
    }

    setIsSending(true);
    setSendError('');
    try {
      const toUpiId = selectedContact?.upiId || upiTarget;
      const data: any = await api.transactions.send({
        toUpiId,
        amount: parseFloat(amount),
        method: method || 'UPI',
        note,
      });
      setTxRefId(data.refId || data.id || '');
      if (data.status === 'FAILED') {
        setSendError('Transaction failed. Please try again.');
      } else {
        setIsSuccess(true);
      }
    } catch (err: any) {
      setSendError(err.apiMessage || err.message || 'Transaction failed. Please try again.');
      console.error('Send error:', err);
    } finally {
      setIsSending(false);
    }
  };

  const renderStep1 = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-4 w-6 h-6 text-ink-medium" />
        <input 
          type="text" 
          placeholder="Enter UPI ID (e.g. friend@paperpay)..."
          value={upiTarget}
          onChange={(e) => setUpiTarget(e.target.value)}
          className="w-full bg-paper-white border-2 border-ink-dark rounded-[2px_8px_2px_6px_/_8px_2px_6px_2px] py-3 pl-12 pr-4 font-body text-xl shadow-sketch-sm outline-none focus:border-marker-blue transition-colors"
        />
      </div>

      <div>
        <h3 className="font-display font-bold text-2xl mb-4">Recent Contacts</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-2 border-ink-dark border-dashed rounded-[8px_2px_6px_2px] p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-paper-tan/20 transition-colors bg-paper-white">
            <div className="w-12 h-12 rounded-full border-2 border-ink-dark flex items-center justify-center mb-2">
              <Plus className="w-6 h-6 text-ink-dark" />
            </div>
            <span className="font-body font-bold">New</span>
          </div>
          
          {CONTACTS.map(contact => (
            <div 
              key={contact.id}
              onClick={() => { setSelectedContact(contact); handleNext(); }}
              className={`border-2 border-ink-dark rounded-[8px_2px_6px_2px] p-4 flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm hover:shadow-sketch-sm hover:-translate-y-1 ${selectedContact?.id === contact.id ? 'bg-paper-tan border-marker-blue border-4' : 'bg-paper-white'}`}
            >
              <div className={`w-12 h-12 rounded-full border-2 border-ink-dark flex items-center justify-center mb-2 bg-marker-${contact.color}-light`}>
                <span className="font-display font-bold text-lg">{contact.initials}</span>
              </div>
              <span className="font-body font-bold text-center leading-tight">{contact.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8 flex flex-col items-center">
      <div className="text-center">
        <p className="font-body text-ink-medium text-xl mb-2">Sending to</p>
        <div className="inline-flex items-center space-x-2 bg-paper-white border-2 border-ink-dark px-4 py-1 rounded-full shadow-sm">
          <div className={`w-6 h-6 rounded-full bg-marker-${selectedContact?.color}-light border border-ink-dark flex items-center justify-center text-xs font-bold`}>
            {selectedContact?.initials}
          </div>
          <span className="font-display font-bold text-xl">{selectedContact?.name}</span>
        </div>
      </div>

      <div className="w-full max-w-xs relative">
        <div className="flex items-center justify-center text-6xl md:text-8xl font-display font-bold border-b-4 border-ink-dark pb-2 relative">
          <span className="mr-2">₹</span>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent outline-none text-center"
            placeholder="0"
            autoFocus
          />
        </div>
        {amount && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-8 top-1/2">
            <ArrowSketch direction="left" className="w-12 h-12 text-marker-green" />
            <span className="font-body font-bold text-marker-green rotate-12 inline-block">Looks good!</span>
          </motion.div>
        )}
      </div>

      <div className="flex space-x-3 w-full justify-center">
        {['500', '1000', '2000', '5000'].map(val => (
          <div 
            key={val} 
            onClick={() => setAmount(val)}
            className="bg-sticky-yellow border border-ink-dark/20 px-3 py-1 font-body font-bold text-lg cursor-pointer hover:scale-105 transition-transform"
            style={{ borderRadius: '3px 3px 3px 3px / 3px 3px 15px 3px', transform: `rotate(${Math.random() * 4 - 2}deg)` }}
          >
            +₹{val}
          </div>
        ))}
      </div>

      <div className="w-full">
        <SketchInput label="Add a note (optional)" placeholder="For pizza last night..."
          onChange={(e: any) => setNote(e.target.value)} />
      </div>

      <StickyNote color="blue" size="sm" className="w-full text-center py-2" rotate={0}>
        <span className="font-bold">Platform Fee: ₹0.00</span> — We got your back!
      </StickyNote>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <h3 className="font-display font-bold text-3xl mb-6 text-center">How do you want to pay?</h3>
      
      <div className="space-y-4 max-w-md mx-auto">
        {[
          { id: 'upi', title: 'UPI Transfer', icon: Smartphone, desc: 'Instant transfer via UPI app' },
          { id: 'bank', title: 'Bank Transfer', icon: Building, desc: 'Direct to bank account' },
          { id: 'qr', title: 'Scan QR Code', icon: QrCode, desc: 'Show QR code to scan' }
        ].map(opt => (
          <div 
            key={opt.id}
            onClick={() => { setMethod(opt.id); handleNext(); }}
            className={`border-2 border-ink-dark p-4 flex items-center cursor-pointer transition-all ${method === opt.id ? 'shadow-sketch-sm translate-y-[-2px] bg-paper-cream' : 'bg-paper-white hover:bg-paper-tan/20'}`}
            style={{ borderRadius: '2px 8px 2px 6px / 8px 2px 6px 2px' }}
          >
            <div className="w-12 h-12 rounded-full bg-paper-tan flex items-center justify-center mr-4 border border-ink-dark">
              <opt.icon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-2xl">{opt.title}</h4>
              <p className="font-body text-ink-medium">{opt.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderStep4 = () => {
    if (isSuccess) {
      return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 flex flex-col items-center">
          <div className="w-32 h-32 relative mb-8">
            <div className="absolute inset-0 border-4 border-ink-dark rounded-full bg-marker-green-light"></div>
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <CheckmarkSketch className="w-16 h-16 text-marker-green" />
            </motion.div>
          </div>
          
          <h2 className="text-5xl font-display font-bold mb-4 relative inline-block">
            Sent Successfully!
            <ScribbleUnderline className="text-marker-green" />
          </h2>
          <p className="text-2xl font-body text-ink-medium mb-2">
            ₹{amount} is on its way to {selectedContact?.name || upiTarget}.
          </p>
          {txRefId && (
            <p className="font-mono text-lg text-ink-medium mb-8 bg-paper-tan px-4 py-2 border border-ink-dark/20 rounded-sm">
              Ref: <span className="font-bold text-ink-dark">{txRefId}</span>
            </p>
          )}
          {!txRefId && (
            <p className="text-2xl font-body text-ink-medium mb-8">
              ₹{amount} is on its way.
            </p>
          )}
          
          <SketchButton onClick={() => {
            setStep(1); setSelectedContact(null); setAmount(''); setMethod('');
            setIsSuccess(false); setTxRefId(''); setSendError(''); setUpiTarget('');
          }}>
            Send Another
          </SketchButton>
        </motion.div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
        
        {method === 'qr' ? (
          <div className="text-center space-y-6 w-full max-w-sm">
            <h3 className="font-display font-bold text-3xl">Scan to Pay</h3>
            <div className="border-4 border-ink-dark p-6 bg-white inline-block relative shadow-sketch-lg rotate-1">
              {/* QR Code Simulation */}
              <div className="w-48 h-48 bg-[url('/textures/paper-grid.png')] border-2 border-ink-dark/20 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIj48L3JlY3Q+Cjwvc3ZnPg==')] bg-repeat"></div>
                <QrCode className="w-32 h-32 text-ink-dark relative z-10" />
                
                {/* Scanning line animation */}
                <motion.div 
                  className="absolute left-0 right-0 h-1 bg-marker-green/50 shadow-[0_0_10px_rgba(22,163,74,0.8)] z-20"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
              </div>
              <div className="absolute -top-6 -right-6">
                 <ArrowSketch direction="down" className="w-12 h-12 text-marker-red" />
              </div>
            </div>
            <p className="font-body text-xl">Ask {selectedContact?.name} to scan this code.</p>
          </div>
        ) : (
          <div className="w-full max-w-sm">
            <PaperCard variant="receipt" className="p-6 mb-8 text-center bg-paper-white relative">
              <div className="absolute top-0 left-0 w-full h-4 bg-[url('/textures/paper-grid.png')] bg-repeat-x opacity-20"></div>
              
              <h3 className="font-display font-bold text-2xl border-b-2 border-ink-dark/20 pb-4 mb-4">Transfer Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-body text-ink-medium text-lg">To</span>
                  <span className="font-body font-bold text-xl">{selectedContact?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-ink-medium text-lg">Method</span>
                  <span className="font-body font-bold text-xl uppercase">{method}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-ink-medium text-lg">Fee</span>
                  <span className="font-body font-bold text-xl text-marker-green">₹0.00</span>
                </div>
              </div>
              
              <div className="border-t-2 border-ink-dark border-dashed pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-display font-bold text-2xl">Total</span>
                  <span className="font-display font-bold text-4xl">₹{amount}</span>
                </div>
              </div>
            </PaperCard>

            <SketchButton 
              size="lg" 
              className="w-full text-2xl py-4" 
              onClick={handleSend}
              isLoading={isSending}
            >
              Confirm & Pay
            </SketchButton>
            {sendError && (
              <p className="mt-4 text-center font-body text-marker-red font-bold animate-pulse">
                ⚠️ {sendError}
              </p>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-display font-bold inline-block relative">
          Send Money
          <ScribbleUnderline className="text-marker-blue" />
        </h1>
      </header>

      {!isSuccess && (
        <div className="flex pl-4 -mb-1 relative z-0">
          {['Recipient', 'Amount', 'Method', 'Confirm'].map((label, i) => (
            <div 
              key={i}
              className={`
                px-4 md:px-6 py-2 border-2 border-b-0 border-ink-dark rounded-t-lg mr-2 font-display text-lg md:text-xl transition-colors
                ${step === i + 1 ? 'bg-paper-cream border-b-paper-cream z-10' : 'bg-paper-tan/50 text-ink-medium hidden sm:block'}
              `}
            >
              <span className="hidden md:inline">{i + 1}. </span>{label}
            </div>
          ))}
        </div>
      )}

      <PaperCard className="p-6 md:p-10 w-full z-10 sm:rounded-tl-none bg-paper-cream min-h-[400px]" variant="sketch" shadow="xl" animateHover={false}>
        <AnimatePresence mode="wait">
          {step === 1 && <motion.div key="1">{renderStep1()}</motion.div>}
          {step === 2 && <motion.div key="2">{renderStep2()}</motion.div>}
          {step === 3 && <motion.div key="3">{renderStep3()}</motion.div>}
          {step === 4 && <motion.div key="4">{renderStep4()}</motion.div>}
        </AnimatePresence>

        {step > 1 && step < 4 && !isSuccess && (
          <div className="mt-12 pt-6 border-t-2 border-ink-dark border-dashed">
            <SketchButton variant="ghost" onClick={handlePrev}>
              Back
            </SketchButton>
            {step === 2 && amount && (
              <SketchButton variant="primary" className="float-right px-8" onClick={handleNext}>
                Next
              </SketchButton>
            )}
          </div>
        )}
      </PaperCard>
    </div>
  );
}
