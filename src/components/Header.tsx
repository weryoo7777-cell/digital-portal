import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Menu, 
  ChevronDown, 
  LogOut, 
  Laptop, 
  Check, 
  Copy, 
  Settings, 
  Upload, 
  KeyRound, 
  Sun, 
  Moon, 
  ChevronRight,
  Eye,
  Camera,
  Sparkles,
  Globe
} from 'lucide-react';
import { UserProfile, CorporateAnnouncement, ClientMachineInfo } from '../types';
import { AvatarPreviewModal, SystemAvatarModal } from './ProfileModals';

interface HeaderProps {
  currentUser: UserProfile;
  machineInfo?: ClientMachineInfo | null;
  onSwitchUser?: (user: UserProfile) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onOpenMobileSidebar: () => void;
  onOpenSystemStatus: () => void;
  onOpenGoogleSearch?: () => void;
  onOpenGoogleTranslate?: () => void;
  onOpenAvatarModal?: () => void;
  onSaveAvatar?: (newAvatarUrl: string) => void;
  onOpenPasswordResetModal?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  announcements: CorporateAnnouncement[];
  unreadAnnouncementsCount?: number;
  onOpenAnnouncements: () => void;
  onLogout: () => void;
  language: 'TH' | 'EN';
  onToggleLanguage?: () => void;
  currentTabName: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  machineInfo,
  onOpenMobileSidebar,
  onOpenSystemStatus,
  onOpenAvatarModal,
  onSaveAvatar,
  onOpenPasswordResetModal,
  darkMode = false,
  onToggleDarkMode,
  announcements,
  unreadAnnouncementsCount,
  onOpenAnnouncements,
  onLogout,
  language,
  onToggleLanguage,
  currentTabName
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [copiedClientInfo, setCopiedClientInfo] = useState(false);
  const [avatarPreviewOpen, setAvatarPreviewOpen] = useState(false);
  const [avatarSubmenuOpen, setAvatarSubmenuOpen] = useState(false);
  const [systemAvatarModalOpen, setSystemAvatarModalOpen] = useState(false);

  // Client device name & IP
  const clientDeviceName = machineInfo?.deviceName || machineInfo?.hostname || 'CLIENT-PC';
  const clientIpAddress = machineInfo?.localIp || '127.0.0.1';
  const clientCombinedInfo = `${clientDeviceName} (${clientIpAddress})`;

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarSuccess, setAvatarSuccess] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const handleDirectAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setAvatarError(language === 'TH' ? 'กรุณาเลือกไฟล์รูปภาพที่รองรับ (.jpg, .png, .webp)' : 'Please select a supported image (.jpg, .png, .webp)');
      setTimeout(() => setAvatarError(null), 4000);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setAvatarError(language === 'TH' ? 'ขนาดไฟล์รูปภาพต้องไม่เกิน 10MB' : 'Image size must be under 10MB');
      setTimeout(() => setAvatarError(null), 4000);
      return;
    }

    setAvatarError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        const newUrl = event.target.result;
        onSaveAvatar?.(newUrl);
        setAvatarSuccess(true);
        setTimeout(() => setAvatarSuccess(false), 3000);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCopyClientInfo = () => {
    navigator.clipboard.writeText(clientCombinedInfo);
    setCopiedClientInfo(true);
    setTimeout(() => setCopiedClientInfo(false), 2000);
  };

  // Close dropdowns on Click Outside and Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setProfileDropdownOpen(false);
        setAvatarSubmenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(target)) {
        setNotifDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProfileDropdownOpen(false);
        setAvatarSubmenuOpen(false);
        setNotifDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60';
      case 'IT':
        return 'bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300 border-blue-200 dark:border-blue-800/60';
      case 'ACCOUNTING':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
      case 'HR':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-18 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 shadow-2xs transition-colors duration-200">
      {/* Zone 1: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
          <span className="text-slate-400 dark:text-slate-500 hidden sm:inline font-semibold">QISHENG</span>
          <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">/</span>
          <h1 className="text-slate-800 dark:text-slate-100 font-bold truncate max-w-[200px] sm:max-w-none">
            {currentTabName}
          </h1>
        </div>
      </div>

      {/* Zone 2: Client Device Info, Notifications, User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Compact Client Machine & IP Info Pill on Top Header Bar */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-2xs hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
          <div className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-400 flex items-center justify-center shrink-0">
            <Laptop className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-100">{clientDeviceName}</span>
            <span className="text-slate-300 dark:text-slate-600 font-normal">|</span>
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {clientIpAddress}
            </span>
          </div>
          <button
            onClick={handleCopyClientInfo}
            className={`p-1 rounded-md text-xs transition-colors shrink-0 ml-0.5 ${
              copiedClientInfo
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700'
            }`}
            title={copiedClientInfo ? (language === 'TH' ? 'คัดลอกแล้ว' : 'Copied!') : (language === 'TH' ? 'คัดลอกชื่อเครื่องและไอพี' : 'Copy Device Name & IP')}
            aria-label="Copy Client Info"
          >
            {copiedClientInfo ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Notifications Popover with Click Outside Ref */}
        <div ref={notifMenuRef} className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            aria-label="Announcements & Alerts"
          >
            <Bell className="w-4 h-4" />
            {(unreadAnnouncementsCount !== undefined ? unreadAnnouncementsCount > 0 : announcements.length > 0) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/70 p-4 z-50 text-xs animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {language === 'TH' ? 'การแจ้งเตือนองค์กร' : 'Corporate Notifications'}
                </span>
                <button
                  onClick={() => {
                    setNotifDropdownOpen(false);
                    onOpenAnnouncements();
                  }}
                  className="text-[#1E60D5] dark:text-blue-400 hover:underline text-[11px] font-semibold"
                >
                  {language === 'TH' ? 'ดูทั้งหมด' : 'View All'}
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 my-2 max-h-72 overflow-y-auto">
                {announcements.map((ann) => (
                  <div 
                    key={ann.id} 
                    onClick={() => {
                      setNotifDropdownOpen(false);
                      onOpenAnnouncements();
                    }}
                    className="py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 px-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        ann.priority === 'urgent' 
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60' 
                          : 'bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300 border-blue-200 dark:border-blue-800/60'
                      }`}>
                        {ann.tag}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{ann.date}</span>
                    </div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {language === 'TH' ? ann.title : ann.titleEn}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-2 mt-0.5">{ann.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Minimalist Elegant Language Switcher Capsule Button */}
        {onToggleLanguage && (
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50/90 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-slate-700/80 border border-slate-200/90 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer group"
            title={language === 'TH' ? 'คลิกเพื่อสลับภาษา (Switch to English)' : 'Click to switch language (เปลี่ยนเป็นภาษาไทย)'}
            aria-label="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#1E60D5] dark:text-blue-400 group-hover:rotate-45 transition-transform duration-300" strokeWidth={1.8} />
            <span className="font-mono text-[11px] font-bold tracking-wider text-slate-800 dark:text-slate-100">
              {language}
            </span>
          </button>
        )}

        {/* User Profile Dropdown with Click Outside Ref (Role Switcher Removed) */}
        <div ref={profileMenuRef} className="relative">
          <div className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all text-left">
            {/* จุดที่ 1: รูปภาพโปรไฟล์บน Top Header Bar — คลิกเพื่อเปิดดูรูปภาพขนาดใหญ่ (View Image Modal/Preview) เพียงอย่างเดียวเท่านั้น */}
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                setAvatarPreviewOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  setAvatarPreviewOpen(true);
                }
              }}
              className="relative w-8 h-8 rounded-full overflow-hidden border border-blue-200 dark:border-blue-800/80 bg-blue-50 dark:bg-blue-950/60 shrink-0 shadow-2xs cursor-pointer hover:ring-2 hover:ring-blue-500/60 hover:opacity-90 transition-all group"
              title={language === 'TH' ? 'คลิกเพื่อดูรูปภาพขนาดใหญ่' : 'Click to preview full photo'}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#1E60D5] dark:text-blue-400">
                {currentUser.name.charAt(0)}
              </div>
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Eye className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            {/* ส่วนชื่อ-นามสกุล, ป้ายตำแหน่ง และ ปุ่มเปิดดรอปดาวน์ (นำรหัสพนักงาน QS-01092 ออกแล้ว) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setProfileDropdownOpen((prev) => !prev);
              }}
              className="flex items-center gap-2 text-left focus:outline-none cursor-pointer"
            >
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[140px]">
                  {currentUser.name}
                </span>
                <div className="flex items-center">
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider ${getRoleBadgeStyle(currentUser.role)}`}>
                    {currentUser.position || 'IT Support'}
                  </span>
                </div>
              </div>

              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-400 hidden sm:block transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {profileDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/80 p-4 z-50 animate-in fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* User details header: แสดงเฉพาะ Avatar, Name, Department เท่านั้น */}
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  {/* จุดที่ 2: รูปภาพโปรไฟล์ในเมนูดรอปดาวน์ — คลิกเพื่อเปิดดูรูปภาพขนาดใหญ่ (View Image Modal/Preview) เพียงอย่างเดียวเท่านั้น */}
                  <div 
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      setAvatarPreviewOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        setAvatarPreviewOpen(true);
                      }
                    }}
                    className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/60 shrink-0 shadow-2xs group cursor-pointer hover:ring-2 hover:ring-blue-500/60 transition-all"
                    title={language === 'TH' ? 'คลิกเพื่อดูรูปภาพขนาดใหญ่' : 'Click to preview full photo'}
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover transition-opacity group-hover:opacity-85"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                      {currentUser.department}
                    </div>
                  </div>
                </div>

                {avatarSuccess && (
                  <div className="mt-2.5 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>{language === 'TH' ? 'อัปเดตรูปประจำตัวเรียบร้อยแล้ว' : 'Profile photo updated successfully'}</span>
                  </div>
                )}

                {avatarError && (
                  <div className="mt-2.5 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                    <span>{avatarError}</span>
                  </div>
                )}
              </div>

              {/* Profile Settings Section (อัปโหลดภาพ, เปลี่ยนโหมด, รีเซ็ตรหัสผ่าน) */}
              <div className="py-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-2 flex items-center justify-between">
                  <span>{language === 'TH' ? 'ตั้งค่าโปรไฟล์ & การใช้งาน' : 'Profile Settings'}</span>
                  <Settings className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                </div>

                <div className="space-y-1">
                  {/* Hidden file input for uploading photo from device (.jpg, .png, .webp) */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                    onChange={handleDirectAvatarUpload}
                    className="hidden"
                  />

                  {/* 1. Main Item: "📷 เปลี่ยนรูปประจำตัว" (Change Avatar) -> Expandable Submenu */}
                  <div className="rounded-xl overflow-hidden transition-all">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAvatarSubmenuOpen((prev) => !prev);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors group cursor-pointer ${
                        avatarSubmenuOpen
                          ? 'bg-blue-50/90 dark:bg-blue-950/70 text-[#1E60D5] dark:text-blue-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-200 hover:text-[#1E60D5] dark:hover:text-blue-400 hover:bg-blue-50/60 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Camera className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 group-hover:text-[#1E60D5] dark:group-hover:text-blue-400" />
                        <span className="font-medium">{language === 'TH' ? 'เปลี่ยนรูปประจำตัว' : 'Change Avatar'}</span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          avatarSubmenuOpen
                            ? 'rotate-180 text-[#1E60D5] dark:text-blue-400'
                            : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                        }`}
                      />
                    </button>

                    {/* รายการย่อยภายใน Submenu (Submenu Items) */}
                    {avatarSubmenuOpen && (
                      <div className="mt-1 ml-2.5 pl-2.5 border-l-2 border-blue-200/90 dark:border-blue-800/80 space-y-1 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                        {/* รายการย่อยที่ 1: "อัปโหลดภาพ" (Upload Image) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-lg text-left text-[11px] text-slate-700 dark:text-slate-300 hover:text-[#1E60D5] dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-800/70 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Upload className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-[#1E60D5] dark:group-hover:text-blue-400" />
                            <span className="font-medium">{language === 'TH' ? 'อัปโหลดภาพ' : 'Upload Image'}</span>
                          </div>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">
                            .jpg, .png, .webp
                          </span>
                        </button>

                        {/* รายการย่อยที่ 2: "เลือกจากรูปตัวอย่างของระบบ" (Select System Avatar) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProfileDropdownOpen(false);
                            setAvatarSubmenuOpen(false);
                            if (onOpenAvatarModal) {
                              onOpenAvatarModal();
                            } else {
                              setSystemAvatarModalOpen(true);
                            }
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-lg text-left text-[11px] text-slate-700 dark:text-slate-300 hover:text-[#1E60D5] dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-800/70 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                            <span className="font-medium">{language === 'TH' ? 'เลือกจากรูปตัวอย่างของระบบ' : 'Select System Avatar'}</span>
                          </div>
                          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-500 group-hover:text-[#1E60D5] dark:group-hover:text-blue-400" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 2. Change Dark/Light Mode */}
                  <button
                    onClick={() => {
                      onToggleDarkMode?.();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left text-xs text-slate-700 dark:text-slate-200 hover:text-[#1E60D5] dark:hover:text-blue-400 hover:bg-blue-50/60 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      {darkMode ? (
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Moon className="w-3.5 h-3.5 text-indigo-500" />
                      )}
                      <span>
                        {language === 'TH' 
                          ? (darkMode ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด')
                          : (darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode')}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {darkMode ? 'Dark' : 'Light'}
                    </span>
                  </button>

                  {/* 3. Reset Password */}
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenPasswordResetModal?.();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left text-xs text-slate-700 dark:text-slate-200 hover:text-[#1E60D5] dark:hover:text-blue-400 hover:bg-blue-50/60 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <KeyRound className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 group-hover:text-[#1E60D5] dark:group-hover:text-blue-400" />
                      <span>{language === 'TH' ? 'รีเซ็ตรหัสผ่าน (SSPR)' : 'Reset Password'}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-500 group-hover:text-[#1E60D5] dark:group-hover:text-blue-400" />
                  </button>
                </div>
              </div>

              {/* Logout button */}
              <div className="pt-2">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{language === 'TH' ? 'ออกจากระบบ Intranet' : 'Sign Out of Intranet'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Image Modal/Preview (เปิดดูรูปภาพขนาดใหญ่) */}
      <AvatarPreviewModal
        isOpen={avatarPreviewOpen}
        currentUser={currentUser}
        onClose={() => setAvatarPreviewOpen(false)}
        language={language}
      />

      {/* System Preset Avatar Modal (เลือกจากรูปตัวอย่างของระบบ) */}
      {systemAvatarModalOpen && (
        <SystemAvatarModal
          isOpen={systemAvatarModalOpen}
          currentUser={currentUser}
          onClose={() => setSystemAvatarModalOpen(false)}
          onSaveAvatar={(url) => {
            onSaveAvatar?.(url);
            setSystemAvatarModalOpen(false);
          }}
          language={language}
        />
      )}
    </header>
  );
};
