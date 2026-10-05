import React, { useState } from 'react';
import { 
  X, 
  Activity, 
  Server, 
  Wifi, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle,
  Clock,
  ArrowDownUp
} from 'lucide-react';
import { SystemServiceHealth } from '../types';
import { SYSTEM_SERVICES } from '../data/portalData';

interface SystemStatusDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'TH' | 'EN';
}

export const SystemStatusDrawer: React.FC<SystemStatusDrawerProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [services, setServices] = useState<SystemServiceHealth[]>(SYSTEM_SERVICES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastCheck, setLastCheck] = useState('เมื่อสักครู่');

  if (!isOpen) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/system-health');
      if (res.ok) {
        const data = await res.json();
        setServices(prev => prev.map(s => {
          const matched = data.services?.find((x: any) => x.id === s.id);
          const jitter = Math.floor(Math.random() * 5) - 2;
          return {
            ...s,
            latency: Math.max(1, (matched?.latency || s.latency) + jitter),
            uptime: matched?.uptime || s.uptime
          };
        }));
      }
    } catch {
      // offline simulation
    } finally {
      setIsRefreshing(false);
      setLastCheck(new Date().toLocaleTimeString('th-TH'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 text-slate-800 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start justify-between pr-8 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[#1E60D5] flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {language === 'TH' ? 'ตรวจสอบสถานะระบบและเครือข่ายองค์กร' : 'Infrastructure & Network Monitor'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'TH' 
                  ? 'ตรวจสอบความพร้อมของเซิร์ฟเวอร์ฐานข้อมูล เกตเวย์ และระบบคลาวด์ QISHENG' 
                  : 'Real-time uptime and latency status for core internal nodes.'}
              </p>
            </div>
          </div>
        </div>

        {/* Live Bandwidth & Gateway Summary */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] text-slate-500 mb-1 flex items-center gap-1.5 font-medium">
              <Wifi className="w-3.5 h-3.5 text-[#1E60D5]" />
              <span>{language === 'TH' ? 'ความเร็วอินเทอร์เน็ต' : 'Fiber Bandwidth'}</span>
            </div>
            <div className="font-mono text-sm sm:text-base font-bold text-slate-900">
              1,000 / 1,000
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Mbps Symmetrical</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] text-slate-500 mb-1 flex items-center gap-1.5 font-medium">
              <ArrowDownUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'TH' ? 'ทราฟฟิกเครือข่าย' : 'Intranet Traffic'}</span>
            </div>
            <div className="font-mono text-sm sm:text-base font-bold text-emerald-700">
              418 Mbps
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Core Trunk Load (42%)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] text-slate-500 mb-1 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>{language === 'TH' ? 'ความพร้อมโดยรวม' : 'Avg. Uptime'}</span>
            </div>
            <div className="font-mono text-sm sm:text-base font-bold text-purple-700">
              99.98%
            </div>
            <div className="text-[10px] text-slate-400 font-mono">30-day SLA Target Met</div>
          </div>
        </div>

        {/* Services List */}
        <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 bg-white overflow-hidden mb-5 max-h-72 overflow-y-auto">
          {services.map((svc) => (
            <div key={svc.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span>{svc.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({svc.category})</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                    {svc.host}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <div className="text-xs font-mono font-bold text-emerald-700">
                    {svc.latency} ms
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {svc.uptime}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer with Refresh button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{language === 'TH' ? `ตรวจสอบล่าสุด: ${lastCheck}` : `Last checked: ${lastCheck}`}</span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#1E60D5] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{language === 'TH' ? 'ยิง Ping ทดสอบใหม่' : 'Re-test Latency'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
