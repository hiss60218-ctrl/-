import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { Customer, AppSettings } from '../types';
import { Search, Phone, MessageCircle, Calendar, Filter, MoreHorizontal, CheckCircle, Clock, AlertTriangle, XCircle, ChevronDown, DollarSign } from 'lucide-react';

export const Collections: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [settings] = useState<AppSettings>(StorageService.getSettings());
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'late' | 'promise'>('late');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    setCustomers(StorageService.getCustomers());
  }, []);

  const getRemaining = (c: Customer) => c.totalAmount - c.paidAmount;

  const filtered = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const remaining = getRemaining(c);
    
    if (!matchesSearch) return false;
    
    if (filter === 'late') return remaining >= settings.alertThreshold;
    if (filter === 'promise') return c.collectionStatus === 'promise_to_pay';
    return true;
  });

  const updateStatus = (customer: Customer, status: any) => {
    const updated = { ...customer, collectionStatus: status, lastContactDate: Date.now() };
    StorageService.saveCustomer(updated);
    setCustomers(StorageService.getCustomers()); // Refresh
    setSelectedCustomer(null);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 animate-fade-in">
      
      {/* Left Column: List */}
      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        
        {/* Toolbar */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row justify-between gap-4">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-3 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="ابحث عن متعثر..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-sm text-slate-200 focus:ring-2 focus:ring-amber-500/50 outline-none"
              />
           </div>
           <div className="flex bg-slate-900 rounded-xl p-1 border border-white/10">
              <button onClick={() => setFilter('late')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'late' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>متأخرات</button>
              <button onClick={() => setFilter('promise')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'promise' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>وعود دفع</button>
              <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}>الكل</button>
           </div>
        </div>

        {/* Table/List */}
        <div className="flex-1 bg-slate-800/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden flex flex-col">
            <div className="overflow-y-auto custom-scrollbar flex-1">
               <table className="w-full text-right">
                  <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase sticky top-0 backdrop-blur-md z-10">
                     <tr>
                        <th className="p-4 font-medium">العميل</th>
                        <th className="p-4 font-medium">السيارة</th>
                        <th className="p-4 font-medium">المبلغ المستحق</th>
                        <th className="p-4 font-medium">حالة المتابعة</th>
                        <th className="p-4 font-medium">إجراء</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {filtered.map(c => {
                        const remaining = getRemaining(c);
                        return (
                           <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                              <td className="p-4">
                                 <div className="font-bold text-slate-200">{c.name}</div>
                                 <div className="text-xs text-slate-500 mt-1">{c.phone}</div>
                              </td>
                              <td className="p-4 text-slate-400 text-sm">{c.carModel}</td>
                              <td className="p-4">
                                 <div className="font-bold text-white">{remaining.toLocaleString()}</div>
                                 {remaining > settings.alertThreshold && <span className="text-[10px] text-red-400 flex items-center gap-1"><AlertTriangle size={10} /> تجاوز الحد</span>}
                              </td>
                              <td className="p-4">
                                 {c.collectionStatus === 'promise_to_pay' ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                                       <Clock size={12} /> وعد بالسداد
                                    </span>
                                 ) : remaining > 0 ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">
                                       <AlertTriangle size={12} /> قيد المتابعة
                                    </span>
                                 ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
                                       <CheckCircle size={12} /> خالص
                                    </span>
                                 )}
                              </td>
                              <td className="p-4">
                                 <button 
                                    onClick={() => setSelectedCustomer(c)}
                                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-lg transition-colors"
                                 >
                                    متابعة
                                 </button>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
            <div className="p-3 bg-slate-900/50 border-t border-white/5 text-xs text-slate-500 text-center">
               عرض {filtered.length} من أصل {customers.length} عقد
            </div>
        </div>
      </div>

      {/* Right Column: Detail / Action Panel */}
      <div className="w-full lg:w-1/3 bg-slate-800/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col shadow-2xl">
         {selectedCustomer ? (
            <>
               <div className="flex justify-between items-start mb-6">
                  <div>
                     <h3 className="text-xl font-bold text-white">{selectedCustomer.name}</h3>
                     <p className="text-slate-400 text-sm">{selectedCustomer.carModel}</p>
                  </div>
                  <button onClick={() => setSelectedCustomer(null)} className="text-slate-500 hover:text-white"><XCircle size={20}/></button>
               </div>

               <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-xl p-5 mb-6 text-center">
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">المبلغ المطلوب سداده</p>
                  <h2 className="text-4xl font-bold text-white mb-2">{getRemaining(selectedCustomer).toLocaleString()} <span className="text-sm text-red-400">{settings.currency}</span></h2>
                  <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                     <div className="h-full bg-red-500" style={{ width: '100%' }}></div>
                  </div>
               </div>

               <div className="space-y-4 mb-auto">
                  <h4 className="text-sm font-bold text-slate-300 border-b border-white/5 pb-2">إجراءات سريعة</h4>
                  <div className="grid grid-cols-2 gap-3">
                     <a href={`tel:${selectedCustomer.phone}`} className="flex items-center justify-center gap-2 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all">
                        <Phone size={18} /> اتصال
                     </a>
                     <a href={`https://wa.me/${selectedCustomer.phone}`} target="_blank" className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all">
                        <MessageCircle size={18} /> واتساب
                     </a>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                     <button 
                        onClick={() => updateStatus(selectedCustomer, 'promise_to_pay')}
                        className="flex flex-col items-center justify-center gap-2 py-4 bg-slate-900 border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/10 text-slate-300 hover:text-blue-400 rounded-xl transition-all"
                     >
                        <Clock size={24} />
                        <span className="text-xs">وعد بالسداد</span>
                     </button>
                     <button className="flex flex-col items-center justify-center gap-2 py-4 bg-slate-900 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 rounded-xl transition-all">
                        <DollarSign size={24} />
                        <span className="text-xs">تسجيل دفعة</span>
                     </button>
                  </div>
               </div>
               
               <div className="mt-6 bg-slate-900/50 rounded-xl p-4 border border-white/5">
                  <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase">سجل الملاحظات</h4>
                  <div className="text-center text-slate-600 text-sm py-4">
                     لا توجد ملاحظات مسجلة
                  </div>
                  <button className="w-full py-2 bg-slate-800 text-xs text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                     + إضافة ملاحظة
                  </button>
               </div>
            </>
         ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
               <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                  <Filter size={32} className="text-slate-400" />
               </div>
               <h3 className="text-lg font-bold text-white">تفاصيل المتابعة</h3>
               <p className="text-sm text-slate-400 mt-2">اختر عميلاً من القائمة لعرض التفاصيل وتسجيل عمليات المتابعة</p>
            </div>
         )}
      </div>
    </div>
  );
};