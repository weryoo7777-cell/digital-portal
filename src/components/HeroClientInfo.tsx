import React, { useState } from 'react';
import { 
  Laptop, 
  Network, 
  Cpu, 
  Check, 
  Copy, 
  RefreshCw,
  Building2,
  CalendarDays,
  ShieldCheck
} from 'lucide-react';
import { ClientMachineInfo, UserProfile } from '../types';
import { CORPORATE_BUILDING_BANNER } from '../data/portalData';

interface HeroClientInfoProps {
  currentUser: UserProfile;
  machineInfo: ClientMachineInfo | null;
  isLoading: boolean;
  onRefreshInfo: () => void;
  language: 'TH' | 'EN';
}

export const HeroClientInfo: React.FC<HeroClientInfoProps> = ({
  currentUser,
  machineInfo,
  isLoading,
  onRefreshInfo,
  language
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === 'TH') {
      if (hour < 12) return 'สวัสดีตอนเช้า';
      if (hour < 18) return 'สวัสดีตอนบ่าย';
      return 'สวัสดีตอนเย็น';
    }
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = new Date().toLocaleDateString(language === 'TH' ? 'th-TH' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden mb-6">
      {/* Top Banner with Glass Office Building Graphic */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-[#1E60D5] to-blue-800 p-6 sm:p-7 text-white">
        {/* Modern Corporate Glass Office Building Backdrop */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-2/5 opacity-20 pointer-events-none mix-blend-overlay">
          <img 
            src={CORPORATE_BUILDING_BANNER} 
            alt="Qisheng Corporate Glass Headquarters"
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-white/90 text-xs font-medium mb-3 backdrop-blur-xs">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
              <span className="opacity-60">&bull;</span>
              <span className="font-mono text-[11px]">Bangkok HQ</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex flex-wrap items-center gap-2">
              <span>{language === 'TH' ? 'สวัสดี,' : getGreeting() + ','}</span>
              <span className="text-blue-100 underline decoration-blue-300/60 underline-offset-4">
                {language === 'TH' ? `คุณ ${currentUser.name.split(' ')[0]}` : currentUser.name}
              </span>
            </h1>

            <p className="text-blue-100 text-xs sm:text-sm mt-1.5 max-w-xl font-normal opacity-95">
              {language === 'TH'
                ? `ยินดีต้อนรับสู่ระบบอินทราเน็ตกลาง บริษัท ฉีเชิ่ง จำกัด &bull; สิทธิ์ใช้งาน: ${currentUser.position || currentUser.role}`
                : `Welcome to Qisheng Group Employee Digital Portal &bull; Role: ${currentUser.position || currentUser.role}`}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
            <button
              onClick={onRefreshInfo}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-blue-50 rounded-xl transition-all shadow-xs"
              title="Refresh Client Machine Network Diagnostics"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#1E60D5] ${isLoading ? 'animate-spin' : ''}`} />
              <span>{language === 'TH' ? 'รีเฟรชเครือข่าย' : 'Refresh Machine'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3-Point Client Machine Info Sub-bar (Clean & Crisp Light Cards) */}
      <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 1) Computer Name (Hostname) + Click-to-Copy */}
          <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors flex items-center justify-between gap-3 group">
            <div className="min-w-0 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1E60D5] shrink-0">
                <Laptop className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-slate-400 font-medium">
                  {language === 'TH' ? 'ชื่อเครื่อง (Hostname)' : 'Computer Hostname'}
                </div>
                <div 
                  className="font-mono text-xs sm:text-sm font-bold text-slate-800 truncate"
                  title={machineInfo?.hostname || currentUser.workstationHostname}
                >
                  {machineInfo?.hostname || currentUser.workstationHostname}
                </div>
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(machineInfo?.hostname || currentUser.workstationHostname, 'hostname')}
              className={`p-1.5 rounded-lg border text-xs transition-colors shrink-0 flex items-center gap-1 ${
                copiedField === 'hostname'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title="Click to copy Hostname"
            >
              {copiedField === 'hostname' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px] font-sans text-emerald-700">{language === 'TH' ? 'คัดลอก' : 'Copied'}</span>
                </>
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* 2) Local IP + Click-to-Copy */}
          <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-colors flex items-center justify-between gap-3 group">
            <div className="min-w-0 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Network className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-slate-400 font-medium">
                  {language === 'TH' ? 'ไอพีภายใน (Local IP)' : 'Local LAN IP'}
                </div>
                <div 
                  className="font-mono text-xs sm:text-sm font-bold text-emerald-700 truncate"
                  title={machineInfo?.localIp || currentUser.localIp}
                >
                  {machineInfo?.localIp || currentUser.localIp}
                </div>
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(machineInfo?.localIp || currentUser.localIp, 'localIp')}
              className={`p-1.5 rounded-lg border text-xs transition-colors shrink-0 flex items-center gap-1 ${
                copiedField === 'localIp'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title="Click to copy IP"
            >
              {copiedField === 'localIp' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px] font-sans text-emerald-700">{language === 'TH' ? 'คัดลอก' : 'Copied'}</span>
                </>
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* 3) Assigned VLAN & Subnet Segment */}
          <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-purple-300 transition-colors flex items-center justify-between gap-3 group">
            <div className="min-w-0 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-slate-400 font-medium">
                  {language === 'TH' ? 'เครือข่าย & VLAN' : 'Assigned VLAN'}
                </div>
                <div 
                  className="font-mono text-xs sm:text-sm font-bold text-purple-700 truncate"
                  title={machineInfo?.vlan || currentUser.assignedVlan}
                >
                  {machineInfo?.vlan || currentUser.assignedVlan}
                </div>
              </div>
            </div>

            <div className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700 shrink-0 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Secure
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
