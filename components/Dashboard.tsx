import React, { useEffect, useState } from 'react';
import { Customer, DashboardStats, AppSettings } from '../types';
import { StorageService } from '../services/storageService';
import { Wallet, Users, AlertCircle, TrendingUp, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [settings] = useState<AppSettings>(StorageService.getSettings());
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    // Check automation
    StorageService.runAutomationCheck();
    
    const data = StorageService.getCustomers();
    setCustomers(data);
    
    const totalDebt = data.reduce((acc, curr) => acc + (curr.totalAmount - curr.paidAmount), 0);
    const paidTotal = data.reduce((acc, curr) => acc + curr.paidAmount, 0);
    const totalPotential = data.reduce((acc, curr) => acc + curr.totalAmount, 0);
    
    // Simulate "Collected Today" (Randomized for demo UI feeling)
    const todayCollected = Math.floor(Math.random() * 2000) + 500;

    setStats({
      totalCustomers: data.length,
      totalDebt,
      overThresholdCount: data.filter(c => (c.totalAmount - c.paidAmount) >= settings.alertThreshold).length,
      collectionRate: totalPotential > 0 ? (paidTotal / totalPotential) * 100 : 0,
      todayCollected
    });
  }, [settings.alertThreshold]);

  if (!stats) return <div className="p-8 text-center text-slate-500">جاري تحميل البيانات...</div>;

  const chartData = [
    { name: '1', amount: 4000 },
    { name: '5', amount: 3000 },
    { name: '10', amount: 2000 },
    { name: '15', amount: 2780 },
    { name: '20', amount: 1890 },
    { name: '25', amount: 2390 },
    { name: '30', amount: 3490 },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">لوحة القيادة</h2>
            <p className="text-slate-400 mt-1">نظرة عامة على الأداء المالي وحالة التحصيل</p>
         </div>
         <div className="flex gap-3">
            <Link to="/add" className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2">
                <Zap size={18} />
                <span>حجز سريع</span>
            </Link>
         </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Debt (Warning) */}
        <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 group hover:bg-slate-800/70 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                <AlertCircle size={24} />
             </div>
             <span className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} /> +12%
             </span>
          </div>
          <div className="relative z-10">
             <p className="text-slate-400 text-sm font-medium mb-1">إجمالي المتأخرات</p>
             <h3 className="text-3xl font-bold text-white">{stats.totalDebt.toLocaleString()} <span className="text-base text-slate-500 font-normal">{settings.currency}</span></h3>
          </div>
        </div>

        {/* Card 2: Today Collected (Success) */}
        <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 group hover:bg-slate-800/70 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                <Wallet size={24} />
             </div>
             <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} /> اليوم
             </span>
          </div>
          <div className="relative z-10">
             <p className="text-slate-400 text-sm font-medium mb-1">المدفوع اليوم</p>
             <h3 className="text-3xl font-bold text-white">{stats.todayCollected.toLocaleString()} <span className="text-base text-slate-500 font-normal">{settings.currency}</span></h3>
          </div>
        </div>

        {/* Card 3: Collection Rate */}
        <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 group hover:bg-slate-800/70 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                <TrendingUp size={24} />
             </div>
             <span className="flex items-center gap-1 text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} /> +2.4%
             </span>
          </div>
          <div className="relative z-10">
             <p className="text-slate-400 text-sm font-medium mb-1">نسبة التحصيل</p>
             <h3 className="text-3xl font-bold text-white">{stats.collectionRate.toFixed(1)}%</h3>
             <div className="w-full h-1.5 bg-slate-700 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.collectionRate}%` }}></div>
             </div>
          </div>
        </div>

        {/* Card 4: Active Customers */}
        <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 group hover:bg-slate-800/70 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                <Users size={24} />
             </div>
             <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full">
                نشط
             </span>
          </div>
          <div className="relative z-10">
             <p className="text-slate-400 text-sm font-medium mb-1">عدد العملاء</p>
             <h3 className="text-3xl font-bold text-white">{stats.totalCustomers}</h3>
             <p className="text-xs text-slate-500 mt-1">منهم <span className="text-red-400 font-bold">{stats.overThresholdCount}</span> متأخرين</p>
          </div>
        </div>

      </div>

      {/* Main Chart Section */}
      <div className="grid lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-md border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-white">تحليل التدفقات النقدية</h3>
               <select className="bg-slate-900 border border-white/10 text-slate-300 text-sm rounded-lg px-3 py-1 outline-none">
                  <option>آخر 30 يوم</option>
                  <option>آخر 6 أشهر</option>
               </select>
            </div>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                     <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                     <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                     <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '12px' }}
                     />
                     <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Mini Lists / Notifications */}
         <div className="bg-slate-800/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">أحدث المتأخرين</h3>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
               {customers.filter(c => (c.totalAmount - c.paidAmount) >= settings.alertThreshold).slice(0, 5).map(c => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl border border-white/5 hover:bg-slate-700/50 transition-colors">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-white/10">
                           {c.name.charAt(0)}
                        </div>
                        <div>
                           <p className="text-sm font-bold text-slate-200">{c.name}</p>
                           <p className="text-xs text-slate-500">{c.carModel}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-bold text-red-400">{(c.totalAmount - c.paidAmount).toLocaleString()}</p>
                     </div>
                  </div>
               ))}
            </div>
            <Link to="/collections" className="mt-4 w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-center rounded-xl text-sm font-bold transition-all">
               عرض الكل
            </Link>
         </div>
      </div>
    </div>
  );
};