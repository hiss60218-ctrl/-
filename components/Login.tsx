import React, { useState } from 'react';
import { Car, Lock, Mail, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-hidden font-cairo" dir="rtl">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px]"></div>
      </div>

      <div className="w-full max-w-5xl h-[80vh] bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex overflow-hidden z-10 mx-4">
        
        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/90">
          <div className="mb-10 text-center md:text-right">
            <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-1 rounded-full text-sm font-bold mb-4">
              <Car size={16} className="text-amber-400" />
              <span>Istibyan Pay</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">مرحباً بك مجدداً</h1>
            <p className="text-slate-500">نظام إدارة التحصيل والمتابعة المالية المتطور</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">البريد الإلكتروني</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-slate-800 font-medium"
                  placeholder="admin@istibyan.ae"
                  dir="ltr"
                />
                <Mail className="absolute right-4 top-4 text-slate-400" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700">كلمة المرور</label>
                <a href="#" className="text-xs text-amber-600 hover:text-amber-700 font-bold">نسيت كلمة المرور؟</a>
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-slate-800 font-medium"
                  placeholder="••••••••"
                  dir="ltr"
                />
                <Lock className="absolute right-4 top-4 text-slate-400" size={20} />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform text-amber-500" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-400">
            &copy; 2024 Istibyan Rent A Car. جميع الحقوق محفوظة.
          </div>
        </div>

        {/* Left Side: Hero Image */}
        <div className="hidden md:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-90 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1000" 
            alt="Luxury Car" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="relative z-20 p-12 text-white">
             <h2 className="text-4xl font-bold mb-6 leading-tight">التميز في إدارة<br/><span className="text-amber-500">الأصول المالية</span></h2>
             <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                   <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">85%</div>
                   <div>
                      <p className="text-sm font-bold">نسبة التحصيل</p>
                      <p className="text-xs text-slate-400">ارتفاع ملحوظ هذا الشهر</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                   <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">24</div>
                   <div>
                      <p className="text-sm font-bold">متابعة نشطة</p>
                      <p className="text-xs text-slate-400">عملاء تحت المراجعة</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};