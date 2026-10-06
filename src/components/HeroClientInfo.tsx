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
  ShieldCheck,
  SlidersHorizontal,
  Info,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { ClientMachineInfo, UserProfile, NetworkAdapterInfo } from '../types';
import { CORPORATE_BUILDING_BANNER } from '../data/portalData';

interface HeroClientInfoProps {
  currentUser: UserProfile;
  machineInfo: ClientMachineInfo | null;
  isLoading: boolean;
  onRefreshInfo: () => void;
  language: 'TH' | 'EN';
  onUpdateLocalIp?: (ip: string) => void;
}

export const HeroClientInfo: React.FC<HeroClientInfoProps> = ({
  currentUser,
  machineInfo,
  isLoading,
  onRefreshInfo,
  language,
  onUpdateLocalIp
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showAdaptersModal, setShowAdaptersModal] = useState(false);
  const [selectedAdapterIp, setSelectedAdapterIp] = useState<string | null>(null);

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

  const isLocalhost = machineInfo?.isRealLocalhost;
  const currentMode = machineInfo?.displayMode || (isLocalhost ? 'real' : 'corporate');

  const toggleDisplayMode = () => {
    const nextMode = currentMode === 'real' ? 'corporate' : 'real';
    try {
      localStorage.setItem('qs_machine_display_mode', nextMode);
    } catch {}
    onRefreshInfo();
  };

  const activeHostname = currentMode === 'real' && machineInfo?.realHostname
    ? machineInfo.realHostname
    : (machineInfo?.hostname || currentUser.workstationHostname);

  const activeLocalIp = selectedAdapterIp || (
    currentMode === 'real' && machineInfo?.realLocalIp
      ? machineInfo.realLocalIp
      : (machineInfo?.localIp || currentUser.localIp)
  );

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
              {isLocalhost && (
                <>
                  <span className="opacity-60">&bull;</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-200 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Local Host Mode
                  </span>
                </>
              )}
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

          <div className="flex items-center flex-wrap gap-2 self-start md:self-center shrink-0">
            {/* Mode Switcher Button: Real Host vs Corporate Domain */}
            <button
              onClick={toggleDisplayMode}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl transition-all shadow-xs backdrop-blur-xs"
              title="Toggle between Real Host Machine Detection and Corporate AD Domain Profile"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-200" />
              <span>
                {currentMode === 'real'
                  ? (language === 'TH' ? 'โหมด: เครื่องจริง (Host OS)' : 'Mode: Host OS')
                  : (language === 'TH' ? 'โหมด: โดเมนองค์กร (AD Demo)' : 'Mode: Corporate AD')}
              </span>
            </button>

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
                <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                  <span>{language === 'TH' ? 'ชื่อเครื่อง (Hostname)' : 'Computer Hostname'}</span>
                  {currentMode === 'real' && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-semibold">
                      Live
                    </span>
                  )}
                </div>
                <div 
                  className="font-mono text-xs sm:text-sm font-bold text-slate-800 truncate"
                  title={activeHostname}
                >
                  {activeHostname}
                </div>
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(activeHostname, 'hostname')}
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

          {/* 2) Local IP + Click-to-Copy & Adapters List Toggle */}
          <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-colors flex items-center justify-between gap-3 group">
            <div className="min-w-0 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Network className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                  <span>{language === 'TH' ? 'ไอพีภายใน (Local IP)' : 'Local LAN IP'}</span>
                  {machineInfo?.networkAdapters && machineInfo.networkAdapters.length > 1 && (
                    <button
                      onClick={() => setShowAdaptersModal(true)}
                      className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold hover:bg-emerald-200 transition-colors flex items-center gap-0.5"
                      title="View all detected network adapters"
                    >
                      <span>{machineInfo.networkAdapters.length} การ์ด</span>
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
                <div 
                  className="font-mono text-xs sm:text-sm font-bold text-emerald-700 truncate"
                  title={activeLocalIp}
                >
                  {activeLocalIp}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {machineInfo?.networkAdapters && machineInfo.networkAdapters.length > 0 && (
                <button
                  onClick={() => setShowAdaptersModal(true)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-[#1E60D5] hover:bg-blue-50 text-xs transition-colors shrink-0"
                  title="ดูรายละเอียดการ์ดแลน / Wi-Fi"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => copyToClipboard(activeLocalIp, 'localIp')}
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
          </div>

          {/* 3) Assigned VLAN & Subnet Segment */}
          <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-purple-300 transition-colors flex items-center justify-between gap-3 group">
            <div className="min-w-0 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-slate-400 font-medium">
                  {language === 'TH' ? 'เครือข่าย & ซับเน็ต' : 'Network Segment'}
                </div>
                <div 
                  className="font-mono text-xs sm:text-sm font-bold text-purple-700 truncate"
                  title={currentMode === 'real' ? (machineInfo?.vlan || 'Local Network') : currentUser.assignedVlan}
                >
                  {currentMode === 'real' ? (machineInfo?.vlan || 'Local Network') : currentUser.assignedVlan}
                </div>
              </div>
            </div>

            <div className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700 shrink-0 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {currentMode === 'real' ? 'Host' : 'Domain'}
            </div>
          </div>
        </div>
      </div>

      {/* Network Adapters Modal */}
      {showAdaptersModal && machineInfo?.networkAdapters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 text-slate-800">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'TH' ? 'การ์ดเครือข่ายที่ตรวจพบบนเครื่อง' : 'Detected Network Adapters'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'TH' ? `ตรวจพบ ${machineInfo.networkAdapters.length} การ์ดเชื่อมต่อ` : `Found ${machineInfo.networkAdapters.length} active interfaces`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAdaptersModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 mb-5 max-h-60 overflow-y-auto pr-1">
              {machineInfo.networkAdapters.map((adapter, idx) => {
                const isSelected = (selectedAdapterIp || machineInfo.localIp) === adapter.ip;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedAdapterIp(adapter.ip);
                      if (onUpdateLocalIp) onUpdateLocalIp(adapter.ip);
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-400/20' 
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{adapter.name}</span>
                        {adapter.isPhysical ? (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-medium">Physical</span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-600 font-medium">Virtual/WSL</span>
                        )}
                      </div>
                      <div className="font-mono text-sm font-semibold text-emerald-700 mt-0.5">
                        {adapter.ip}
                      </div>
                      {adapter.mac && (
                        <div className="text-[10px] text-slate-400 font-mono">
                          MAC: {adapter.mac}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-slate-500 mb-4 border border-slate-200">
              💡 <strong>คำแนะนำ:</strong> ในสภาพแวดล้อม Localhost ข้อมูลนี้ถูกอ่านโดยตรงจากฟังก์ชัน <code>os.networkInterfaces()</code> ของ Node.js บนเครื่องคอมพิวเตอร์ของคุณ ทำให้ได้ไอพีของ Wi-Fi หรือการ์ด LAN จริง
            </div>

            <button
              onClick={() => setShowAdaptersModal(false)}
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#1E60D5] hover:bg-blue-700 rounded-xl transition-all shadow-xs"
            >
              {language === 'TH' ? 'ตกลง' : 'Done'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
