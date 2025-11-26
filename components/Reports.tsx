import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storageService';
import { Customer } from '../types';
import { Printer } from 'lucide-react';

export const Reports: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const settings = StorageService.getSettings();

  useEffect(() => {
    setCustomers(StorageService.getCustomers());
  }, []);

  const totalDebt = customers.reduce((acc, c) => acc + (c.totalAmount - c.paidAmount), 0);
  const totalPaid = customers.reduce((acc, c) => acc + c.paidAmount, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:p-0">
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-2xl font-bold text-slate-800">التقارير المالية</h2>
        <button 
            onClick={handlePrint} 
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
            <Printer size={18} />
            طباعة التقرير
        </button>
      </div>

      {/* Print Header (Visible only when printing) */}
      <div className="hidden print:block text-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold">تقرير المدفوعات</h1>
        <p className="text-slate-500 mt-2">{new Date().toLocaleDateString('ar-AE')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-600 font-medium mb-1">إجمالي المدفوعات</p>
            <p className="text-3xl font-bold text-blue-800">{totalPaid} <span className="text-sm">{settings.currency}</span></p>
        </div>
        <div className="bg-red-50 p-6 rounded-xl border border-red-100">
            <p className="text-sm text-red-600 font-medium mb-1">إجمالي الديون (المتبقي)</p>
            <p className="text-3xl font-bold text-red-800">{totalDebt} <span className="text-sm">{settings.currency}</span></p>
        </div>
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-600 font-medium mb-1">عدد العملاء</p>
            <p className="text-3xl font-bold text-slate-800">{customers.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border">
        <div className="overflow-x-auto">
            <table className="w-full text-right">
                <thead className="bg-slate-50 text-slate-600 text-sm">
                    <tr>
                        <th className="p-4 font-bold">العميل</th>
                        <th className="p-4 font-bold">الهاتف</th>
                        <th className="p-4 font-bold">السيارة</th>
                        <th className="p-4 font-bold">الإجمالي</th>
                        <th className="p-4 font-bold">المدفوع</th>
                        <th className="p-4 font-bold">المتبقي</th>
                        <th className="p-4 font-bold print:hidden">الحالة</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {customers.map((c, idx) => {
                        const remaining = c.totalAmount - c.paidAmount;
                        const isAlert = remaining >= settings.alertThreshold;
                        return (
                            <tr key={c.id} className={`hover:bg-slate-50 ${isAlert ? 'bg-red-50/30' : ''}`}>
                                <td className="p-4 font-medium">{c.name}</td>
                                <td className="p-4 text-slate-500" dir="ltr">{c.phone}</td>
                                <td className="p-4 text-slate-500">{c.carModel}</td>
                                <td className="p-4 font-medium">{c.totalAmount}</td>
                                <td className="p-4 text-green-600 font-medium">{c.paidAmount}</td>
                                <td className={`p-4 font-bold ${remaining > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                                    {remaining}
                                </td>
                                <td className="p-4 print:hidden">
                                    {isAlert && <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">متأخر</span>}
                                    {remaining === 0 && <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">خالص</span>}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};