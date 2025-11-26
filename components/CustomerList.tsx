import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { Customer, AppSettings, MessageLog } from '../types';
import { Search, Edit, MessageCircle, Filter, Phone, Download, ArrowUpDown, Coins, Users, Calendar, CheckCircle, StopCircle, Car } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [settings, setSettings] = useState<AppSettings>(StorageService.getSettings());
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const filterType = searchParams.get('filter');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  // Quick Pay State
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [quickPayAmount, setQuickPayAmount] = useState<string>('');

  useEffect(() => {
    setCustomers(StorageService.getCustomers());
    setSettings(StorageService.getSettings());
  }, []);

  const getRemaining = (c: Customer) => c.totalAmount - c.paidAmount;

  // Logic to save message log when clicking WhatsApp
  const handleAlertClick = (customer: Customer) => {
    const remaining = getRemaining(customer);
    const message = settings.alertMessageTemplate
      .replace('{name}', customer.name)
      .replace('{amount}', remaining.toString())
      .replace('{car}', customer.carModel)
      .replace('{currency}', settings.currency);
    
    // Log it
    const log: MessageLog = {
        id: Date.now().toString(),
        customerId: customer.id,
        customerName: customer.name,
        phone: customer.phone,
        message: message,
        status: 'sent',
        type: 'whatsapp',
        timestamp: Date.now(),
        auto: false
    };
    StorageService.addLog(log);
  };

  const handleQuickPay = (id: string) => {
      if(!quickPayAmount) return;
      const amount = parseFloat(quickPayAmount);
      const customer = customers.find(c => c.id === id);
      if(customer) {
          customer.paidAmount = customer.paidAmount + amount;
          StorageService.saveCustomer(customer);
          setCustomers(StorageService.getCustomers()); // Refresh
          setEditingPaymentId(null);
          setQuickPayAmount('');
      }
  };

  const exportCSV = () => {
    const headers = ["الاسم", "الهاتف", "السيارة", "الحالة", "اليومي", "الإجمالي", "المدفوع", "المتبقي"];
    const rows = filteredCustomers.map(c => [
        c.name,
        c.phone,
        c.carModel,
        c.endDate ? "منتهي" : "نشط",
        c.dailyRate || 0,
        c.totalAmount,
        c.paidAmount,
        c.totalAmount - c.paidAmount
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "rentpay_bookings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Sort Logic
  let filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm);
    if (!matchesSearch) return false;
    if (filterType === 'overdue') return getRemaining(c) >= settings.alertThreshold;
    return true;
  });

  if (sortConfig) {
    filteredCustomers.sort((a, b) => {
      let aValue: any = sortConfig.key === 'remaining' ? getRemaining(a) : a[sortConfig.key as keyof Customer];
      let bValue: any = sortConfig.key === 'remaining' ? getRemaining(b) : b[sortConfig.key as keyof Customer];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const generateWhatsAppLink = (customer: Customer) => {
    const remaining = getRemaining(customer);
    let message = settings.alertMessageTemplate
      .replace('{name}', customer.name)
      .replace('{amount}', remaining.toString())
      .replace('{car}', customer.carModel)
      .replace('{currency}', settings.currency);
    return `https://wa.me/${customer.phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Car className="text-amber-500" />
                {filterType === 'overdue' ? 'الحجوزات المتأخرة' : 'سجل الحجوزات'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">إجمالي: {filteredCustomers.length} حجز</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute right-3 top-3 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="بحث سريع..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
            </div>
            <div className="flex gap-2">
                <Link 
                    to={filterType === 'overdue' ? '/customers' : '/customers?filter=overdue'}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 transition-colors ${filterType === 'overdue' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    <Filter size={16} />
                    <span>متأخرين</span>
                </Link>
                <button 
                    onClick={exportCSV}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 text-sm font-medium flex items-center gap-2"
                >
                    <Download size={16} />
                    <span>تصدير</span>
                </button>
            </div>
        </div>
      </div>

      {/* Modern Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-right">
                <thead className="bg-slate-900 text-slate-200 text-xs uppercase tracking-wider">
                    <tr>
                        <th className="p-4 cursor-pointer hover:bg-slate-800" onClick={() => handleSort('name')}>
                             <div className="flex items-center gap-1">المستأجر <ArrowUpDown size={12}/></div>
                        </th>
                        <th className="p-4">السيارة / الحالة</th>
                        <th className="p-4 cursor-pointer hover:bg-slate-800" onClick={() => handleSort('totalAmount')}>
                            <div className="flex items-center gap-1">الإجمالي <ArrowUpDown size={12}/></div>
                        </th>
                        <th className="p-4">المدفوع</th>
                        <th className="p-4 cursor-pointer hover:bg-slate-800" onClick={() => handleSort('remaining')}>
                            <div className="flex items-center gap-1">المتبقي <ArrowUpDown size={12}/></div>
                        </th>
                        <th className="p-4 text-center">إجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.length === 0 ? (
                         <tr>
                             <td colSpan={6} className="p-8 text-center text-slate-400">لا توجد حجوزات مطابقة</td>
                         </tr>
                    ) : (
                        filteredCustomers.map(customer => {
                            const remaining = getRemaining(customer);
                            const isOverdue = remaining >= settings.alertThreshold;
                            const isActive = !customer.endDate;
                            
                            return (
                                <tr key={customer.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{customer.name}</div>
                                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                            <Phone size={10} /> {customer.phone}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm font-medium text-slate-700">{customer.carModel}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            {isActive ? (
                                                <span className="flex items-center gap-1 text-[10px] bg-green-50 text-green-600 px-1.5 rounded border border-green-100">
                                                    <CheckCircle size={10} /> نشط
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[10px] bg-slate-100 text-slate-500 px-1.5 rounded border border-slate-200">
                                                    <StopCircle size={10} /> منتهي
                                                </span>
                                            )}
                                            {customer.dailyRate && customer.dailyRate > 0 && (
                                                <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                                     | {customer.dailyRate}/يوم
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium">{customer.totalAmount.toLocaleString()}</td>
                                    <td className="p-4">
                                        {editingPaymentId === customer.id ? (
                                            <div className="flex items-center gap-1">
                                                <input 
                                                    autoFocus
                                                    type="number" 
                                                    className="w-20 p-1 border rounded text-sm"
                                                    placeholder="المبلغ"
                                                    value={quickPayAmount}
                                                    onChange={e => setQuickPayAmount(e.target.value)}
                                                />
                                                <button onClick={() => handleQuickPay(customer.id)} className="text-green-600 bg-green-100 p-1 rounded hover:bg-green-200"><Coins size={14}/></button>
                                                <button onClick={() => setEditingPaymentId(null)} className="text-red-500 p-1 hover:text-red-700">x</button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-600 font-medium">{customer.paidAmount.toLocaleString()}</span>
                                                <button 
                                                    onClick={() => { setEditingPaymentId(customer.id); setQuickPayAmount(''); }}
                                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-green-600 transition-opacity"
                                                    title="إضافة دفعة سريعة"
                                                >
                                                    <Coins size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className={`font-bold ${remaining > 0 ? (isOverdue ? 'text-red-600' : 'text-amber-600') : 'text-slate-400'}`}>
                                            {remaining.toLocaleString()}
                                            {isOverdue && <span className="mr-2 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">متأخر</span>}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link 
                                                to={`/edit/${customer.id}`}
                                                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600 rounded-lg transition-colors"
                                                title="تعديل الحجز"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            
                                            {isOverdue && (
                                                <a 
                                                    href={generateWhatsAppLink(customer)}
                                                    onClick={() => handleAlertClick(customer)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-2 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-lg transition-colors shadow-sm"
                                                    title="إرسال واتساب"
                                                >
                                                    <MessageCircle size={18} />
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};