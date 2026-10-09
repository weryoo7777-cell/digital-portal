import React, { useState } from 'react';
import { 
  Menu, 
  Laptop, 
  Check, 
  Copy, 
  Globe,
  Shield,
  ShieldCheck,
  LogOut,
  KeyRound,
  Sun,
  Moon
} from 'lucide-react';
import { ClientMachineInfo } from '../types';
import { copyToClipboard } from '../utils/clipboard';

interface HeaderProps {
  machineInfo?: ClientMachineInfo | null;
  onOpenMobileSidebar: () => void;
  language: 'TH' | 'EN';
  onToggleLanguage?: () => void;
  currentTabName: string;
  isAdmin?: boolean;
  onOpenAdminPinModal?: () => void;
  onExitAdminMode?: () => void;
  darkMode?: boolean;
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  machineInfo,
  onOpenMobileSidebar,
  language,
  onToggleLanguage,
  currentTabName,
  isAdmin = false,
  onOpenAdminPinModal,
  onExitAdminMode,
  darkMode = false,
  onToggleTheme
}) => {
  const [copiedClientInfo, setCopiedClientInfo] = useState(false);

  // Client device name & IP (Defaults to QISHENG-122 | 192.168.7.122)
  const clientDeviceName = machineInfo?.deviceName || machineInfo?.hostname || 'QISHENG-122';
  const clientIpAddress = machineInfo?.localIp || '192.168.7.122';
  const clientCombinedInfo = `${clientDeviceName} | ${clientIpAddress}`;

  const handleCopyClientInfo = async () => {
    const success = await copyToClipboard(clientCombinedInfo);
    if (success) {
      setCopiedClientInfo(true);
      setTimeout(() => setCopiedClientInfo(false), 2000);
    }
  };

  return (
    <header className="h-16 sm:h-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Left: Mobile Sidebar Trigger & Current Tab Name */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors cursor-pointer"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
            {currentTabName}
          </span>
        </div>
      </div>

      {/* Right: Only [ชื่อเครื่อง | IP Address] Badge + Copy Button + Language Toggle (TH/EN) */}
      <div className="flex items-center gap-2.5">
        {/* Machine Info Badge: [ชื่อเครื่อง | IP Address] */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 shadow-2xs">
          <Laptop className="w-3.5 h-3.5 text-[#1E60D5] dark:text-blue-400 shrink-0" />
          <span className="font-mono font-semibold text-[11px] sm:text-xs">
            {clientDeviceName} <span className="text-slate-400 dark:text-slate-500">|</span> {clientIpAddress}
          </span>
          <button
            onClick={handleCopyClientInfo}
            className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors cursor-pointer ml-0.5"
            title={language === 'TH' ? 'คัดลอก [ชื่อเครื่อง | IP]' : 'Copy Machine Info'}
          >
            {copiedClientInfo ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Admin Mode Toggle Button (PIN 1111 Mode) */}
        {isAdmin ? (
          <button
            onClick={onExitAdminMode}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-700/80 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-xs font-bold text-amber-900 dark:text-amber-200 transition-all shadow-2xs cursor-pointer group"
            title={language === 'TH' ? 'คลิกเพื่อออกจากโหมด Admin' : 'Exit Admin Mode'}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="hidden sm:inline font-semibold">
              {language === 'TH' ? 'โหมด Admin' : 'Admin'}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 ml-0.5 group-hover:underline">
              <LogOut className="w-3 h-3" />
              <span>{language === 'TH' ? 'ออก' : 'Exit'}</span>
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenAdminPinModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 hover:border-amber-300 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-2xs cursor-pointer"
            title={language === 'TH' ? 'เข้าสู่โหมด Admin' : 'Unlock Admin Mode'}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="hidden sm:inline">
              {language === 'TH' ? 'เข้าสู่โหมด Admin' : 'Admin Mode'}
            </span>
            <span className="sm:hidden">
              Admin
            </span>
          </button>
        )}

        {/* Language Toggle Button (TH / EN) */}
        <button
          onClick={onToggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all shadow-2xs cursor-pointer"
          title={language === 'TH' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
        >
          <Globe className="w-3.5 h-3.5 text-[#1E60D5] dark:text-blue-400" />
          <span className="font-mono font-bold">{language === 'TH' ? 'TH' : 'EN'}</span>
        </button>

        {/* Theme Mode Toggle Button (โหมดสว่าง / โหมดมืด) */}
        <button
          onClick={onToggleTheme}
          className="flex items-center justify-center p-2 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 transition-all shadow-2xs cursor-pointer"
          title={
            language === 'TH'
              ? darkMode
                ? 'เปลี่ยนเป็นโหมดสว่าง (Light Mode)'
                : 'เปลี่ยนเป็นโหมดมืด (Dark Mode)'
              : darkMode
              ? 'Switch to Light Mode'
              : 'Switch to Dark Mode'
          }
          aria-label="Toggle Theme Mode"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400 hover:text-amber-300 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-[#1E60D5] hover:text-blue-600 transition-transform hover:-rotate-12" />
          )}
        </button>
      </div>
    </header>
  );
};
