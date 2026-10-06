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
  ChevronDown,
  Edit3,
  HardDrive,
  Monitor,
  X,
  Sparkles,
  Layers
} from 'lucide-react';
import { ClientMachineInfo, UserProfile, NetworkAdapterInfo, DeviceHardwareSpecs } from '../types';
import { CORPORATE_BUILDING_BANNER } from '../data/portalData';
import { DEFAULT_DEVICE_SPECS, saveCustomDeviceName, saveDeviceHardwareSpecs } from '../utils/clientMachineDetector';

interface HeroClientInfoProps {
  currentUser: UserProfile;
  machineInfo: ClientMachineInfo | null;
  isLoading: boolean;
  onRefreshInfo: () => void;
  language: 'TH' | 'EN';
  onUpdateLocalIp?: (ip: string) => void;
  onUpdateDeviceName?: (deviceName: string) => void;
}

export const HeroClientInfo: React.FC<HeroClientInfoProps> = ({
  currentUser,
  machineInfo,
  isLoading,
  onRefreshInfo,
  language,
  onUpdateLocalIp,
  onUpdateDeviceName
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showAdaptersModal, setShowAdaptersModal] = useState(false);
  const [selectedAdapterIp, setSelectedAdapterIp] = useState<string | null>(null);

  // Device Name & Specifications Modals
  const [showEditDeviceModal, setShowEditDeviceModal] = useState(false);
  const [showSpecsModal, setShowSpecsModal] = useState(false);
  const [isEditingSpecsInline, setIsEditingSpecsInline] = useState(false);
  const [copySpecsSuccess, setCopySpecsSuccess] = useState(false);

  const deviceSpecs: DeviceHardwareSpecs = machineInfo?.deviceSpecs || DEFAULT_DEVICE_SPECS;
  const currentShortName = machineInfo?.deviceName || deviceSpecs.deviceName || 'QISHENG-022';

  const [inputDeviceName, setInputDeviceName] = useState(currentShortName);
  const [inputShowFqdn, setInputShowFqdn] = useState(!!machineInfo?.showFqdn);
  const [customSpecs, setCustomSpecs] = useState<DeviceHardwareSpecs>(deviceSpecs);

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

  // The active hostname shown on screen: accurately mirrors the user's Device Name
  const activeHostname = machineInfo?.hostname || (
    currentUser.workstationHostname.includes('QS-BKK-IT-PARAMED')
      ? 'QISHENG-022'
      : currentUser.workstationHostname
  );

  const activeLocalIp = selectedAdapterIp || (
    currentMode === 'real' && machineInfo?.realLocalIp
      ? machineInfo.realLocalIp
      : (machineInfo?.localIp || currentUser.localIp)
  );

  const handleSaveDeviceName = (name: string, fqdn: boolean) => {
    const trimmed = name.trim() || 'QISHENG-022';
    saveCustomDeviceName(trimmed, fqdn);
    saveDeviceHardwareSpecs({ deviceName: trimmed });
    if (onUpdateDeviceName) {
      onUpdateDeviceName(fqdn ? `${trimmed}.qisheng.local` : trimmed);
    }
    onRefreshInfo();
    setShowEditDeviceModal(false);
  };

  const handleSaveAllSpecs = () => {
    saveDeviceHardwareSpecs(customSpecs);
    saveCustomDeviceName(customSpecs.deviceName, inputShowFqdn);
    if (onUpdateDeviceName) {
      onUpdateDeviceName(inputShowFqdn ? `${customSpecs.deviceName}.qisheng.local` : customSpecs.deviceName);
    }
    onRefreshInfo();
    setIsEditingSpecsInline(false);
  };

  const handleCopyAllSpecs = () => {
    const specsText = `=== Windows Device Specifications (${deviceSpecs.deviceName}) ===
Device name: ${deviceSpecs.deviceName}
Processor: ${deviceSpecs.processor}
Installed RAM: ${deviceSpecs.installedRam}
Graphics card: ${deviceSpecs.graphicsCard}
Storage: ${deviceSpecs.storage}
Device ID: ${deviceSpecs.deviceId}
Product ID: ${deviceSpecs.productId}
System type: ${deviceSpecs.systemType}
Pen and touch: ${deviceSpecs.penAndTouch}
Active Local IP: ${activeLocalIp}
Network Segment: ${machineInfo?.vlan || currentUser.assignedVlan}`;

    navigator.clipboard.writeText(specsText);
    setCopySpecsSuccess(true);
    setTimeout(() => setCopySpecsSuccess(false), 2000);
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
          {/* 1) Computer Name (Hostname / Device Name) + Click-to-Copy & Edit */}
          <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors flex items-center justify-between gap-3 group">
            <div className="min-w-0 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1E60D5] shrink-0">
                <Laptop className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 flex-wrap">
                  <span>{language === 'TH' ? 'ชื่อเครื่อง (Device Name)' : 'Device Name'}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-semibold">
                    {machineInfo?.showFqdn ? 'FQDN' : 'Windows PC'}
                  </span>
                </div>
                <div 
                  className="font-mono text-xs sm:text-sm font-bold text-slate-800 truncate"
                  title={activeHostname}
                >
                  {activeHostname}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* Device Specs Modal Button */}
              <button
                onClick={() => {
                  setCustomSpecs(deviceSpecs);
                  setShowSpecsModal(true);
                }}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-[#1E60D5] hover:bg-blue-50 text-xs transition-colors shrink-0"
                title={language === 'TH' ? 'ดูข้อมูลสเปกเครื่อง (Device Specs)' : 'View Device Specifications'}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>

              {/* Edit Device Name Button */}
              <button
                onClick={() => {
                  setInputDeviceName(currentShortName);
                  setInputShowFqdn(!!machineInfo?.showFqdn);
                  setShowEditDeviceModal(true);
                }}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-[#1E60D5] hover:bg-blue-50 text-xs transition-colors shrink-0"
                title={language === 'TH' ? 'แก้ไขชื่อเครื่องให้ตรงกับ Windows Settings' : 'Edit Device Name'}
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              {/* Copy Hostname Button */}
              <button
                onClick={() => copyToClipboard(activeHostname, 'hostname')}
                className={`p-1.5 rounded-lg border text-xs transition-colors shrink-0 flex items-center gap-1 ${
                  copiedField === 'hostname'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title={language === 'TH' ? 'คลิกเพื่อคัดลอกชื่อเครื่อง' : 'Click to copy Hostname'}
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

      {/* Edit Device Name Modal */}
      {showEditDeviceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 text-slate-800">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1E60D5] flex items-center justify-center">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'TH' ? 'ตั้งค่าชื่อเครื่อง (Device Name)' : 'Set Device Name / Hostname'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'TH' ? 'กำหนดให้ตรงกับชื่อเครื่องใน Windows Settings' : 'Align with your Windows Device specifications'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditDeviceModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'TH' ? 'ชื่อเครื่องคอมพิวเตอร์ (Device Name):' : 'Computer Device Name:'}
                </label>
                <input
                  type="text"
                  value={inputDeviceName}
                  onChange={(e) => setInputDeviceName(e.target.value.toUpperCase())}
                  placeholder="เช่น QISHENG-022"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <div className="text-[11px] font-medium text-slate-500 mb-1.5">
                  {language === 'TH' ? 'ปุ่มลัดเลือกชื่อเครื่อง:' : 'Quick Presets:'}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setInputDeviceName('QISHENG-022')}
                    className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all flex items-center gap-1.5 ${
                      inputDeviceName === 'QISHENG-022'
                        ? 'bg-blue-50 border-[#1E60D5] text-[#1E60D5] font-bold ring-2 ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>⭐ QISHENG-022</span>
                    <span className="text-[10px] text-emerald-600 font-sans font-semibold">(เครื่องคุณ)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputDeviceName('QS-BKK-IT-PARAMED')}
                    className={`px-2.5 py-1.5 text-xs font-mono rounded-lg border transition-all ${
                      inputDeviceName === 'QS-BKK-IT-PARAMED'
                        ? 'bg-blue-50 border-[#1E60D5] text-[#1E60D5] font-bold ring-2 ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    QS-BKK-IT-PARAMED
                  </button>
                </div>
              </div>

              {/* FQDN Domain Toggle */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inputShowFqdn}
                    onChange={(e) => setInputShowFqdn(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800">
                      {language === 'TH' ? 'แสดงต่อท้ายด้วย Domain องค์กร' : 'Append Corporate Domain'}
                    </span>
                    <span className="font-mono text-slate-500 ml-1">(.qisheng.local)</span>
                  </div>
                </label>
              </div>

              {/* Live Preview Box */}
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200">
                <div className="text-[11px] font-semibold text-blue-800 mb-1">
                  {language === 'TH' ? 'ตัวอย่างชื่อเครื่องที่จะแสดงในระบบ:' : 'Preview in Portal:'}
                </div>
                <div className="font-mono text-sm font-bold text-[#1E60D5] flex items-center gap-1.5">
                  <Laptop className="w-4 h-4" />
                  <span>
                    {inputShowFqdn 
                      ? `${inputDeviceName.trim() || 'QISHENG-022'}.qisheng.local` 
                      : (inputDeviceName.trim() || 'QISHENG-022')}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 leading-relaxed bg-amber-50/80 p-3 rounded-xl border border-amber-200/80">
                📌 <strong>คำแนะนำ:</strong> เนื่องจากระบบความปลอดภัยของ Web Browser จะไม่อนุญาตให้หน้าเว็บอ่านชื่อเครื่อง Windows โดยตรง การตั้งชื่อเครื่องตรงนี้จะถูกจำไว้ใน Browser ของคุณตลอดไป และซิงก์ไปยังบัตรคำร้อง IT Helpdesk และประวัติเข้าใช้งานโดยอัตโนมัติ
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowEditDeviceModal(false)}
                className="w-1/3 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => handleSaveDeviceName(inputDeviceName, inputShowFqdn)}
                className="w-2/3 py-2.5 text-xs font-bold text-white bg-[#1E60D5] hover:bg-blue-700 rounded-xl transition-all shadow-xs"
              >
                {language === 'TH' ? 'บันทึกชื่อเครื่อง' : 'Save Device Name'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Device Hardware Specifications Modal (Exact match to Windows 11 Settings) */}
      {showSpecsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 text-slate-800 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1E60D5] flex items-center justify-center">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'TH' ? 'ข้อมูลจำเพาะของอุปกรณ์ (Device specifications)' : 'Device specifications'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Windows System Settings &bull; QISHENG Hardware Asset
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowSpecsModal(false);
                  setIsEditingSpecsInline(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Quick Status Header Card */}
            <div className="p-4 rounded-xl bg-slate-900 text-white mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
              <div>
                <div className="text-[11px] text-blue-300 font-medium">Device Name</div>
                <div className="text-lg font-bold font-mono text-white flex items-center gap-2">
                  <span>{deviceSpecs.deviceName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-sans">
                    Active
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  IP: <span className="font-mono text-emerald-400">{activeLocalIp}</span> &bull; {machineInfo?.vlan || currentUser.assignedVlan}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setInputDeviceName(deviceSpecs.deviceName);
                    setShowEditDeviceModal(true);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{language === 'TH' ? 'เปลี่ยนชื่อ' : 'Rename'}</span>
                </button>
              </div>
            </div>

            {/* Specifications List (matching user's Windows specifications screenshot) */}
            <div className="space-y-2 mb-5">
              {/* 1. Device name */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-slate-500">Device name</div>
                  <div className="font-mono text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {deviceSpecs.deviceName}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(deviceSpecs.deviceName, 'spec_name')}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-500 hover:text-slate-800 transition-colors shrink-0"
                  title="Copy Device name"
                >
                  {copiedField === 'spec_name' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* 2. Processor */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-slate-500">Processor</div>
                  <div className="font-mono text-xs sm:text-sm font-bold text-slate-900 truncate" title={deviceSpecs.processor}>
                    {deviceSpecs.processor}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(deviceSpecs.processor, 'spec_cpu')}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-500 hover:text-slate-800 transition-colors shrink-0"
                  title="Copy Processor info"
                >
                  {copiedField === 'spec_cpu' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* 3. Installed RAM */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-slate-500">Installed RAM</div>
                  <div className="font-mono text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {deviceSpecs.installedRam}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(deviceSpecs.installedRam, 'spec_ram')}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-500 hover:text-slate-800 transition-colors shrink-0"
                  title="Copy RAM info"
                >
                  {copiedField === 'spec_ram' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* 4. Graphics card */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-slate-500">Graphics card</div>
                  <div className="font-mono text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {deviceSpecs.graphicsCard}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(deviceSpecs.graphicsCard, 'spec_gpu')}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-500 hover:text-slate-800 transition-colors shrink-0"
                  title="Copy GPU info"
                >
                  {copiedField === 'spec_gpu' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* 5. Storage */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-slate-500">Storage</div>
                  <div className="font-mono text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {deviceSpecs.storage}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(deviceSpecs.storage, 'spec_storage')}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-500 hover:text-slate-800 transition-colors shrink-0"
                  title="Copy Storage info"
                >
                  {copiedField === 'spec_storage' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* 6. Device ID */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-slate-500">Device ID</div>
                  <div className="font-mono text-[11px] sm:text-xs font-semibold text-slate-700 truncate" title={deviceSpecs.deviceId}>
                    {deviceSpecs.deviceId}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(deviceSpecs.deviceId, 'spec_dev_id')}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-500 hover:text-slate-800 transition-colors shrink-0"
                  title="Copy Device ID"
                >
                  {copiedField === 'spec_dev_id' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* 7. Product ID */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-slate-500">Product ID</div>
                  <div className="font-mono text-xs sm:text-sm font-semibold text-slate-700 truncate">
                    {deviceSpecs.productId}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(deviceSpecs.productId, 'spec_prod_id')}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-500 hover:text-slate-800 transition-colors shrink-0"
                  title="Copy Product ID"
                >
                  {copiedField === 'spec_prod_id' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* 8. System type */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-slate-500">System type</div>
                  <div className="text-xs sm:text-sm text-slate-800">
                    {deviceSpecs.systemType}
                  </div>
                </div>
              </div>

              {/* 9. Pen and touch */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-slate-500">Pen and touch</div>
                  <div className="text-xs text-slate-600">
                    {deviceSpecs.penAndTouch}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleCopyAllSpecs}
                className={`w-full sm:w-1/2 py-2.5 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 ${
                  copySpecsSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#1E60D5] hover:bg-blue-700 text-white'
                }`}
              >
                {copySpecsSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{language === 'TH' ? 'คัดลอกสเปกทั้งหมดแล้ว!' : 'Copied All Specs!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{language === 'TH' ? 'คัดลอกสเปกทั้งหมด (แจ้งช่าง IT)' : 'Copy All Specs for IT'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setShowSpecsModal(false);
                  setShowEditDeviceModal(true);
                }}
                className="w-full sm:w-1/4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{language === 'TH' ? 'แก้ไขชื่อเครื่อง' : 'Rename'}</span>
              </button>

              <button
                onClick={() => setShowSpecsModal(false)}
                className="w-full sm:w-1/4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all"
              >
                {language === 'TH' ? 'ปิด' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
