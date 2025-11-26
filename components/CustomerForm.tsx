import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { StorageService } from '../services/storageService';
import { Customer } from '../types';
import { AVAILABLE_CARS } from '../constants';
import { Save, ArrowLeft, Trash2, Calendar, DollarSign, UserCheck, CarFront } from 'lucide-react';

export const CustomerForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    carModel: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    dailyRate: 0,
    totalAmount: 0,
    paidAmount: 0,
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      const customers = StorageService.getCustomers();
      const customer = customers.find(c => c.id === id);
      if (customer) {
        setFormData(customer);
        setIsEditing(true);
      }
    } else {
        // Handle URL Params for quick booking from Fleet page
        const carParam = searchParams.get('car');
        const rateParam = searchParams.get('rate');
        if (carParam) {
            setFormData(prev => ({
                ...prev,
                carModel: carParam,
                dailyRate: rateParam ? Number(rateParam) : prev.dailyRate
            }));
        }
    }
  }, [id, searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) return;

    const newCustomer: Customer = {
      id: isEditing ? formData.id! : Date.now().toString(),
      name: formData.name!,
      phone: formData.phone!,
      carModel: formData.carModel || '',
      startDate: formData.startDate!,
      endDate: formData.endDate || undefined,
      dailyRate: Number(formData.dailyRate) || 0,
      totalAmount: Number(formData.totalAmount) || 0,
      paidAmount: Number(formData.paidAmount) || 0,
      createdAt: formData.createdAt || Date.now(),
      lastRentUpdate: formData.lastRentUpdate || Date.now()
    };

    StorageService.saveCustomer(newCustomer);
    navigate('/customers');
  };

  const handleDelete = () => {
    if (confirm('هل أنت متأكد من حذف هذا الحجز؟')) {
       if (formData.id) StorageService.deleteCustomer(formData.id);
       navigate('/customers');
    }
  };

  const remaining = (Number(formData.totalAmount) || 0) - (Number(formData.paidAmount) || 0);

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full">
             <ArrowLeft size={20} className="text-slate-600" />
           </button>
           <h2 className="text-2xl font-bold text-slate-800">
             {isEditing ? 'تعديل بيانات الحجز' : 'تسجيل حجز جديد'}
           </h2>
        </div>
        {isEditing && (
            <button onClick={handleDelete} className="text-red-500 hover:bg-red-50 p-2 rounded-lg flex items-center gap-1">
                <Trash2 size={18} />
                <span className="hidden sm:inline">حذف</span>
            </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
        
        {/* Personal Info */}
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <UserCheck size={16} />
                بيانات المستأجر
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">اسم المستأجر <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="الاسم الكامل"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">رقم الهاتف <span className="text-red-500">*</span></label>
                    <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-left"
                        placeholder="97150xxxxxxx"
                        dir="ltr"
                    />
                </div>
            </div>
        </div>

        <div className="border-t border-slate-100"></div>

        {/* Rental Contract Info */}
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                 <Calendar size={16} />
                 تفاصيل العقد والسيارة
            </h3>
            
            {/* Quick Car Selection */}
            {!isEditing && (
                <div className="mb-4">
                    <label className="text-xs font-bold text-slate-400 mb-2 block">اختر سيارة (اختياري)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {AVAILABLE_CARS.map((car) => (
                            <button
                                key={car.model}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, carModel: car.model, dailyRate: car.defaultRate }))}
                                className={`p-3 rounded-xl border text-right transition-all flex flex-col items-start gap-1 group ${formData.carModel === car.model ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500' : 'bg-slate-50 border-slate-200 hover:border-amber-300'}`}
                            >
                                <div className="flex items-center gap-2 w-full">
                                    <CarFront size={14} className={formData.carModel === car.model ? 'text-amber-600' : 'text-slate-400 group-hover:text-amber-500'} />
                                    <span className={`font-bold text-sm w-full truncate ${formData.carModel === car.model ? 'text-amber-900' : 'text-slate-700'}`}>{car.model}</span>
                                </div>
                                <span className="text-[10px] text-slate-500 pr-6">{car.category} • {car.defaultRate} درهم</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">السيارة المؤجرة</label>
                    <input
                        type="text"
                        value={formData.carModel}
                        onChange={e => setFormData({...formData, carModel: e.target.value})}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="مثال: نيسان باترول 2023"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">سعر الإيجار اليومي</label>
                    <div className="relative">
                        <input
                            type="number"
                            min="0"
                            value={formData.dailyRate}
                            onChange={e => setFormData({...formData, dailyRate: Number(e.target.value)})}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pl-10"
                        />
                         <DollarSign size={16} className="absolute left-3 top-4 text-slate-400" />
                    </div>
                    <p className="text-[10px] text-slate-400">سيتم إضافة هذا المبلغ تلقائياً كل 24 ساعة.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">تاريخ الاستلام (البدء)</label>
                    <div className="relative">
                        <input
                            type="date"
                            required
                            value={formData.startDate}
                            onChange={e => setFormData({...formData, startDate: e.target.value})}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pl-10"
                        />
                        <Calendar size={16} className="absolute left-3 top-4 text-slate-400" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">تاريخ الإرجاع (الانتهاء)</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={formData.endDate || ''}
                            onChange={e => setFormData({...formData, endDate: e.target.value})}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pl-10"
                        />
                        <Calendar size={16} className="absolute left-3 top-4 text-slate-400" />
                    </div>
                    <p className="text-[10px] text-slate-400">عند تحديد تاريخ، سيتوقف احتساب الإيجار اليومي.</p>
                </div>
            </div>
        </div>

        <div className="border-t border-slate-100"></div>

        {/* Financial Info */}
        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
             <h3 className="text-sm font-bold text-slate-700 mb-4">الحسابات المالية</h3>
             <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">إجمالي المبلغ (تراكمي)</label>
                    <input
                        type="number"
                        min="0"
                        value={formData.totalAmount}
                        onChange={e => setFormData({...formData, totalAmount: Number(e.target.value)})}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold bg-white"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">المدفوع (مقدم/دفعات)</label>
                    <input
                        type="number"
                        min="0"
                        value={formData.paidAmount}
                        onChange={e => setFormData({...formData, paidAmount: Number(e.target.value)})}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-bold text-green-700 bg-white"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">المتبقي (تلقائي)</label>
                    <div className={`w-full p-3 border rounded-lg font-bold flex items-center bg-white ${remaining > 0 ? 'text-red-600 border-red-200' : 'text-green-600 border-green-200'}`}>
                        {remaining.toLocaleString()}
                    </div>
                </div>
            </div>
        </div>

        <button
            type="submit"
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-transform active:scale-[0.99] flex items-center justify-center gap-2"
        >
            <Save size={20} className="text-amber-500" />
            {isEditing ? 'حفظ التغييرات' : 'تأكيد الحجز'}
        </button>
      </form>
    </div>
  );
};