'use client';

import React, { useState, useEffect } from 'react';
import { PaperCard } from '@/components/sketch/PaperCard';
import { SketchButton } from '@/components/sketch/SketchButton';
import { Users, Activity, AlertTriangle, Database, Search, Edit2, XCircle, Eye, Printer, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api/client';

export default function AdminDashboardPage() {
  const [time, setTime] = useState(new Date());
  const [stats, setStats] = useState<any>({
    activeUsers: 0,
    dailyTransactions: 0,
    systemLoad: '0%',
    fraudAlerts: 0
  });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Initial fetch
    fetchData();

    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, usersData]: any = await Promise.all([
        api.admin.stats(),
        api.admin.users()
      ]);
      setStats(statsData);
      setUsers(usersData.content || usersData || []);
    } catch (err: any) {
      console.error('Failed to fetch admin data', err);
      setError(err.apiMessage || 'Failed to load admin dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id: number) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return;
    try {
      await api.admin.deactivateUser(id);
      fetchData();
    } catch (err) {
      alert('Failed to deactivate user');
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-display font-bold">System Command</h1>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: (stats.totalUsers || 0).toLocaleString(), icon: Users, color: 'blue' },
          { label: 'Transactions', value: (stats.totalTransactions || 0).toLocaleString(), icon: Activity, color: 'green' },
          { label: 'System Load', value: 'Low', icon: Database, color: 'yellow' },
          { label: 'Fraud Alerts', value: (stats.activeAlerts || 0).toLocaleString(), icon: AlertTriangle, color: 'red' },
        ].map((metric, i) => (
          <PaperCard key={i} variant="sketch" className="p-6 bg-paper-white flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-full border-2 border-ink-dark flex items-center justify-center bg-marker-${metric.color}-light`}>
              <metric.icon className={`w-7 h-7 text-marker-${metric.color}`} />
            </div>
            <div>
              <p className="font-body text-ink-medium">{metric.label}</p>
              <h3 className="font-display font-bold text-3xl">{metric.value}</h3>
            </div>
          </PaperCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* User Table */}
        <div className="lg:col-span-2">
          <PaperCard variant="sketch" className="p-0 overflow-hidden bg-paper-white min-h-[500px] flex flex-col">
            <div className="p-6 border-b-2 border-ink-dark bg-paper-cream flex justify-between items-center">
              <h2 className="text-3xl font-display font-bold">User Directory</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-ink-medium" />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-paper-white border border-ink-dark py-2 pl-10 pr-4 font-body rounded-sm outline-none focus:border-marker-blue"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-ink-dark font-display text-xl bg-paper-tan/30">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-body text-lg divide-y divide-ink-dark/10">
                  {loading ? (
                    <tr><td colSpan={5} className="p-12 text-center text-ink-medium italic">Loading users...</td></tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr><td colSpan={5} className="p-12 text-center text-ink-medium italic">No users found.</td></tr>
                  ) : filteredUsers.map((user, i) => (
                    <tr key={user.id} className="group hover:bg-sticky-yellow transition-colors relative">
                      <td className="p-4 font-bold relative z-10">{user.fullName}</td>
                      <td className="p-4 text-ink-medium relative z-10">{user.email}</td>
                      <td className="p-4 relative z-10">{user.role}</td>
                      <td className="p-4 relative z-10">
                        <span className={`inline-block border-2 px-2 py-0.5 font-display text-sm font-bold uppercase tracking-wider transform rotate-[${i%2===0?'-2deg':'2deg'}] ${
                          user.isActive ? 'border-marker-green text-marker-green' : 
                          'border-marker-red text-marker-red'
                        }`} style={{ borderRadius: '4px' }}>
                          {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="p-4 relative z-10 flex space-x-2">
                        <button onClick={() => alert(`Viewing details for ${user.fullName}`)} className="p-1.5 hover:bg-white rounded-sm border border-transparent hover:border-ink-dark"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => alert('Edit feature coming soon!')} className="p-1.5 hover:bg-white rounded-sm border border-transparent hover:border-ink-dark"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeactivate(user.id)} className="p-1.5 hover:bg-white rounded-sm border border-transparent hover:border-ink-dark text-marker-red"><XCircle className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t-2 border-ink-dark bg-paper-cream flex justify-between items-center font-body">
              <span>Total Records: {filteredUsers.length}</span>
              <div className="flex space-x-2">
                <button className="px-3 border border-ink-dark rounded-sm bg-ink-dark text-white">1</button>
              </div>
            </div>
          </PaperCard>
        </div>

        {/* System Monitoring & Reports */}
        <div className="space-y-8">
          
          <PaperCard variant="sketch" className="p-6 bg-paper-warm border-2 border-ink-dark">
            <h3 className="font-display font-bold text-2xl mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-marker-blue" />
              Live Telemetry
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between font-body mb-1">
                  <span>API Latency</span>
                  <span className="font-bold">12ms</span>
                </div>
                <div className="w-full h-3 bg-white border-2 border-ink-dark rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-marker-green"
                    animate={{ width: ['30%', '45%', '25%', '50%', '40%'] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-body mb-1">
                  <span>Server Clock</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-full border-4 border-ink-dark bg-paper-cream flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-ink-dark z-10"></div>
                    <motion.div 
                      className="absolute w-0.5 h-6 bg-ink-dark origin-bottom bottom-1/2 left-[calc(50%-1px)]"
                      style={{ rotate: time.getSeconds() * 6 }}
                    />
                  </div>
                  <span className="font-mono text-2xl font-bold">{time.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </PaperCard>

          <div>
            <h3 className="font-display font-bold text-2xl mb-4 pl-2">Export Reports</h3>
            <div className="space-y-2">
              {[
                { name: 'End of Day Settlement', color: 'bg-sticky-yellow' },
                { name: 'Monthly Tax Summary', color: 'bg-sticky-pink' },
                { name: 'Fraud Incident Log', color: 'bg-sticky-green' },
              ].map((report, i) => (
                <div key={i} className={`${report.color} border-2 border-ink-dark rounded-r-lg rounded-l-sm p-4 flex justify-between items-center hover:-translate-y-1 transition-transform cursor-pointer shadow-sm`}>
                  <span className="font-display font-bold text-lg">{report.name}</span>
                  <button onClick={() => window.print()} className="p-2 border-2 border-ink-dark rounded-md bg-white hover:bg-marker-blue hover:text-white transition-colors">
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

