import React, { useState } from 'react';
import { 
  Laptop, 
  Check, 
  Copy, 
  CalendarDays 
} from 'lucide-react';
import { ClientMachineInfo, UserProfile } from '../types';
import { CORPORATE_BUILDING_BANNER } from '../data/portalData';

interface HeroClientInfoProps {
  currentUser: UserProfile;
  machineInfo: ClientMachineInfo | null;
  isLoading?: boolean;
  onRefreshInfo?: () => void;
  language: 'TH' | 'EN';
  onUpdateLocalIp?: (ip: string) => void;
  onUpdateDeviceName?: (deviceName: string) => void;
}

export const HeroClientInfo: React.FC<HeroClientInfoProps> = ({
  currentUser,
  machineInfo,
  language
}) => {
  const [copied, setCopied] = useState<boolean>(false);

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

  // Client device name & IP detected dynamically from user's browser/session
  const clientDeviceName = machineInfo?.deviceName || machineInfo?.hostname || 'CLIENT-PC';
  const clientIpAddress = machineInfo?.localIp || '127.0.0.1';
  const combinedInfoText = `${clientDeviceName} (${clientIpAddress})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(combinedInfoText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            {/* Date-only Chip (Clean and minimal) */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-white/90 text-xs font-medium mb-3 backdrop-blur-xs">
              <CalendarDays className="w-3.5 h-3.5 text-blue-100" />
              <span>{formattedDate}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex flex-wrap items-center gap-2">
              <span>{language === 'TH' ? 'สวัสดี,' : getGreeting() + ','}</span>
              <span className="text-blue-100 underline decoration-blue-300/60 underline-offset-4">
                {language === 'TH' ? `คุณ ${currentUser.name.split(' ')[0]}` : currentUser.name}
              </span>
            </h1>

            <p className="text-blue-100 text-xs sm:text-sm mt-1.5 max-w-xl font-normal opacity-95">
              {language === 'TH'
                ? `ยินดีต้อนรับสู่ระบบอินทราเน็ตกลาง บริษัท ฉีเชิ่ง จำกัด • สิทธิ์ใช้งาน: ${currentUser.position || currentUser.role}`
                : `Welcome to Qisheng Group Employee Digital Portal • Role: ${currentUser.position || currentUser.role}`}
            </p>
          </div>
        </div>
      </div>

      {/* Unified Compact Client Machine & Network Info Card */}
      <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-100">
        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors flex items-center justify-between gap-3 group">
          <div className="min-w-0 flex items-center gap-3 sm:gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1E60D5] shrink-0">
              <Laptop className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-2">
                <span>{language === 'TH' ? 'ข้อมูลเครื่องผู้ใช้งาน (Client Device & IP)' : 'Client Device & Network IP'}</span>
                {machineInfo?.osName && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium font-sans">
                    {machineInfo.osName}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-0.5 font-mono text-xs sm:text-sm font-bold text-slate-800">
                <span className="text-slate-900">{clientDeviceName}</span>
                <span className="text-slate-300 font-normal">|</span>
                <span className="text-emerald-600 flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {clientIpAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Only Single Copy Button */}
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
              copied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title={language === 'TH' ? 'คัดลอกชื่อเครื่องและไอพี' : 'Copy Device Name & IP'}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] font-sans text-emerald-700 font-semibold">{language === 'TH' ? 'คัดลอกแล้ว' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                <span className="text-[11px] font-sans">{language === 'TH' ? 'คัดลอก' : 'Copy'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
