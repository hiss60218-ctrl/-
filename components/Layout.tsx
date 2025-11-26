import React, { useState } from 'react';
import { LayoutDashboard, Users, PlusCircle, Settings, FileText, MessageSquare, ExternalLink, Car, Grid, Wallet, Bell, Search, ChevronDown, Menu, LogOut } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const NavItem = ({ to, icon: Icon, label, active, collapsed }: { to: string; icon: any; label: string; active: boolean; collapsed?: boolean }) => (
  <Link
    to={to}
    className={`group flex items-center gap-3 px-4 py-3.5 mx-3 rounded-xl transition-all duration-300 ${
      active 
        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20' 
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
    }`}
  >
    <Icon size={22} className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors`} />
    {!collapsed && <span className="font-medium text-sm tracking-wide">{label}</span>}
  </Link>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-cairo flex overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[100px]"></div>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 h-screen z-30 bg-slate-900/50 backdrop-blur-xl border-l border-white/5 shadow-2xl">
        <div className="p-6 mb-2">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold shadow-lg shadow-amber-500/20">
              IR
            </div>
            <div>
               <h1 className="text-lg font-bold text-white leading-tight">Istibyan</h1>
               <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Collections Pro</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-1 py-2 custom-scrollbar">
          <div className="px-6 mb-2 mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">لوحة القيادة</div>
          <NavItem to="/" icon={LayoutDashboard} label="نظرة عامة" active={path === '/'} />
          <NavItem to="/collections" icon={Wallet} label="إدارة التحصيل" active={path === '/collections'} />
          <NavItem to="/fleet" icon={Grid} label="الأسطول" active={path === '/fleet'} />
          
          <div className="px-6 mb-2 mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">العمليات</div>
          <NavItem to="/customers" icon={Users} label="العقود والعملاء" active={path === '/customers'} />
          <NavItem to="/add" icon={PlusCircle} label="حجز جديد" active={path === '/add'} />
          <NavItem to="/logs" icon={MessageSquare} label="سجل التواصل" active={path === '/logs'} />
          
          <div className="px-6 mb-2 mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">النظام</div>
          <NavItem to="/reports" icon={FileText} label="التقارير" active={path === '/reports'} />
          <NavItem to="/settings" icon={Settings} label="الإعدادات" active={path === '/settings'} />
        </div>
        
        <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 relative overflow-hidden group cursor-pointer">
           <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
           <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-xs font-bold text-emerald-400">النظام متصل</span>
              </div>
              <ExternalLink size={14} className="text-slate-500" />
           </div>
           <p className="text-[10px] text-slate-400 mt-2">آخر تحديث: منذ 5 دقائق</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-8 bg-slate-900/30 backdrop-blur-md border-b border-white/5">
           
           {/* Mobile Menu Button */}
           <button 
              className="md:hidden p-2 text-slate-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
           >
              <Menu size={24} />
           </button>

           <div className="hidden md:flex items-center gap-4 flex-1 max-w-lg">
              <div className="relative w-full group">
                 <Search className="absolute right-4 top-3 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                 <input 
                    type="text" 
                    placeholder="بحث في العقود، العملاء، أو السيارات..."
                    className="w-full bg-slate-900/50 border border-white/5 rounded-full py-2.5 pr-12 pl-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                 />
              </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="relative cursor-pointer group">
                 <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold ring-2 ring-slate-900">3</div>
                 <div className="p-2.5 rounded-full bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-white/10 transition-all">
                    <Bell size={20} />
                 </div>
              </div>
              
              <div className="h-8 w-px bg-white/10 mx-2"></div>

              <div className="flex items-center gap-3 cursor-pointer p-1.5 pr-3 pl-1.5 rounded-full hover:bg-white/5 transition-all">
                 <div className="text-left hidden md:block">
                    <p className="text-sm font-bold text-white">Admin User</p>
                    <p className="text-[10px] text-slate-400">مدير التحصيل</p>
                 </div>
                 <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-white/10 overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="Admin" />
                 </div>
                 <ChevronDown size={14} className="text-slate-500" />
              </div>
           </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
           <div className="max-w-7xl mx-auto">
             {children}
           </div>
        </div>

      </main>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
         <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="relative bg-slate-900 w-64 h-full shadow-2xl p-4 flex flex-col">
               <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-white text-xl">Istibyan</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400"><LogOut size={20} /></button>
               </div>
               <nav className="space-y-1">
                  <NavItem to="/" icon={LayoutDashboard} label="لوحة القيادة" active={path === '/'} collapsed={false} />
                  <NavItem to="/collections" icon={Wallet} label="التحصيل" active={path === '/collections'} collapsed={false} />
                  <NavItem to="/customers" icon={Users} label="العملاء" active={path === '/customers'} collapsed={false} />
                  <NavItem to="/add" icon={PlusCircle} label="حجز جديد" active={path === '/add'} collapsed={false} />
                  <NavItem to="/settings" icon={Settings} label="الإعدادات" active={path === '/settings'} collapsed={false} />
               </nav>
            </div>
         </div>
      )}
    </div>
  );
};