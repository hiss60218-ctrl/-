import React from 'react';
import { Link } from 'react-router-dom';
import { AVAILABLE_CARS } from '../constants';
import { CarFront, Gauge, DollarSign, ArrowRight, Star } from 'lucide-react';

export const Fleet: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">أسطول السيارات</h2>
          <p className="text-slate-500">اختر السيارة المناسبة للعميل لبدء الحجز</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AVAILABLE_CARS.map((car, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
            {/* Mock Image Area */}
            <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative">
               <CarFront size={80} className="text-slate-300 group-hover:text-amber-500 transition-colors duration-500" strokeWidth={1.5} />
               
               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm border border-slate-100">
                 {car.category}
               </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{car.model}</h3>
                    <div className="flex items-center gap-1 mt-1 text-slate-400">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs">موديل حديث</span>
                    </div>
                  </div>
                  <div className="text-right">
                      <p className="text-2xl font-bold text-slate-800">{car.defaultRate}</p>
                      <p className="text-xs text-slate-500">درهم / يوم</p>
                  </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5">
                   <Gauge size={16} className="text-blue-500" />
                   <span>عداد مفتوح</span>
                </div>
                <div className="w-px h-4 bg-slate-300"></div>
                <div className="flex items-center gap-1.5">
                   <DollarSign size={16} className="text-green-500" />
                   <span>تأمين شامل</span>
                </div>
              </div>
              
              <Link 
                to={`/add?car=${encodeURIComponent(car.model)}&rate=${car.defaultRate}`}
                className="block w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-center rounded-xl font-bold transition-all shadow-lg hover:shadow-slate-200 flex items-center justify-center gap-2 group-hover:gap-3"
              >
                <span>حجز السيارة</span>
                <ArrowRight size={18} className="text-amber-500" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};