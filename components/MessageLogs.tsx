import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { MessageLog } from '../types';
import { MessageSquare, CheckCircle, Clock, Search, Zap } from 'lucide-react';

export const MessageLogs: React.FC = () => {
  const [logs, setLogs] = useState<MessageLog[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLogs(StorageService.getLogs());
  }, []);

  const filteredLogs = logs.filter(log => {
      if(filter === 'auto') return log.auto;
      if(filter === 'manual') return !log.auto;
      return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">سجل الرسائل</h2>
            <p className="text-sm text-slate-500">متابعة التنبيهات المرسلة للعملاء</p>
        </div>
        
        <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
            <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                الكل
            </button>
            <button 
                onClick={() => setFilter('auto')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filter === 'auto' ? 'bg-amber-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                تلقائي
            </button>
            <button 
                onClick={() => setFilter('manual')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filter === 'manual' ? 'bg-blue-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                يدوي
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {logs.length === 0 ? (
            <div className="p-12 text-center">
                <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-600">لا يوجد سجل رسائل بعد</h3>
                <p className="text-slate-400 mt-2">سيظهر هنا تاريخ الرسائل التلقائية واليدوية</p>
            </div>
        ) : (
            <div className="divide-y divide-slate-100">
                {filteredLogs.map(log => (
                    <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-4">
                        {/* Icon Status */}
                        <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${log.auto ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                {log.auto ? <Zap size={18} /> : <MessageSquare size={18} />}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-slate-800">{log.customerName}</h4>
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Clock size={12} />
                                    {new Date(log.timestamp).toLocaleDateString('ar-AE')} {new Date(log.timestamp).toLocaleTimeString('ar-AE')}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2 md:line-clamp-none bg-slate-50 p-2 rounded border border-slate-100">
                                {log.message}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                                    {log.phone}
                                </span>
                                <span className="text-xs font-bold text-green-600 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                                    <CheckCircle size={10} /> تم الإرسال
                                </span>
                                {log.auto && <span className="text-[10px] text-amber-600 border border-amber-200 px-1 rounded">نظام آلي</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};