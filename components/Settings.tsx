import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { AppSettings } from '../types';
import { Save, RefreshCw, Smartphone, Clock, BellRing } from 'lucide-react';
import { DEFAULT_SETTINGS } from '../constants';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(StorageService.getSettings());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetDefault = () => {
    if(confirm('هل تريد استعادة الإعدادات الافتراضية؟')) {
        setSettings(DEFAULT_SETTINGS);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-800">إعدادات النظام</h2>
         {saved && <span className="text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full animate-pulse">تم الحفظ بنجاح</span>}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Card 1: Alerts Logic */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-amber-500">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BellRing size={20} className="text-amber-500"/>
                حدود التنبيهات
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">حد التنبيه (المبلغ)</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={settings.alertThreshold}
                            onChange={(e) => setSettings({...settings, alertThreshold: Number(e.target.value)})}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                        <span className="text-slate-500 font-bold bg-slate-100 p-3 rounded-lg">{settings.currency}</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">عملة النظام</label>
                    <input
                        type="text"
                        value={settings.currency}
                        onChange={(e) => setSettings({...settings, currency: e.target.value})}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                </div>
            </div>
        </div>

        {/* Card 2: Automation */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-slate-800">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Clock size={20} className="text-slate-800"/>
                الأتمتة والإرسال التلقائي
            </h3>
            
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
                <div>
                    <span className="block font-bold text-slate-800">تفعيل الإرسال التلقائي</span>
                    <span className="text-xs text-slate-500">سيقوم النظام بإرسال رسائل للمتأخرين يومياً</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={settings.autoAlertsEnabled} 
                        onChange={e => setSettings({...settings, autoAlertsEnabled: e.target.checked})}
                        className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
            </div>

            <div className="space-y-2 opacity-100 transition-opacity">
                <label className="block text-sm font-medium text-slate-700">وقت الإرسال اليومي</label>
                <input
                    type="time"
                    disabled={!settings.autoAlertsEnabled}
                    value={settings.autoAlertTime}
                    onChange={(e) => setSettings({...settings, autoAlertTime: e.target.value})}
                    className="w-full md:w-48 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-400"
                />
                <p className="text-xs text-slate-400 mt-2">
                    * ملاحظة: يتطلب تشغيل الأتمتة فتح لوحة التحكم مرة واحدة على الأقل يومياً لتشغيل المهمة الخلفية.
                </p>
            </div>
        </div>

        {/* Card 3: Message Template */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-green-500">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Smartphone size={20} className="text-green-500"/>
                قالب الرسالة (WhatsApp / SMS)
            </h3>
            <div className="space-y-3">
                <p className="text-xs text-slate-500 mb-2">
                    المتغيرات المتاحة: <code className="bg-slate-100 px-1 rounded text-amber-600">{'{name}'}</code>
                    <code className="bg-slate-100 px-1 rounded mx-1 text-amber-600">{'{amount}'}</code>
                    <code className="bg-slate-100 px-1 rounded mx-1 text-amber-600">{'{car}'}</code>
                </p>
                <textarea
                    rows={4}
                    value={settings.alertMessageTemplate}
                    onChange={(e) => setSettings({...settings, alertMessageTemplate: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none leading-relaxed text-sm"
                ></textarea>
                <div className="text-right">
                    <span className="text-xs text-slate-400">{settings.alertMessageTemplate.length} حرف</span>
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-4 sticky bottom-4 bg-slate-50/90 backdrop-blur p-4 border-t border-slate-200 rounded-lg z-10">
            <button
                type="submit"
                className="flex-1 py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
                <Save size={20} className="text-amber-500" />
                حفظ التغييرات
            </button>
            <button
                type="button"
                onClick={resetDefault}
                className="py-3 px-4 rounded-xl border border-slate-300 text-slate-600 hover:bg-white transition-colors"
                title="استعادة الافتراضي"
            >
                <RefreshCw size={20} />
            </button>
        </div>
      </form>
    </div>
  );
};