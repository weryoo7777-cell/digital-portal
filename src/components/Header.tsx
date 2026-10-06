import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Menu, 
  ChevronDown, 
  LogOut, 
  Shield, 
  ExternalLink,
  Laptop,
  Check,
  Copy,
  Globe,
  User,
  Settings,
  Sparkles,
  Camera,
  Upload,
  KeyRound,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';
import { UserProfile, CorporateAnnouncement, ClientMachineInfo } from '../types';
import { CORPORATE_USERS } from '../data/portalData';

interface HeaderProps {
  currentUser: UserProfile;
  machineInfo?: ClientMachineInfo | null;
  onSwitchUser: (user: UserProfile) => void;
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
  onOpenAnnouncements: () => void;
  onLogout: () => void;
  language: 'TH' | 'EN';
  currentTabName: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  machineInfo,
  onSwitchUser,
  searchQuery,
  onSearchChange,
  onOpenMobileSidebar,
  onOpenSystemStatus,
  onOpenGoogleSearch,
  onOpenGoogleTranslate,
  onOpenAvatarModal,
  onSaveAvatar,
  onOpenPasswordResetModal,
  darkMode = false,
  onToggleDarkMode,
  announcements,
  onOpenAnnouncements,
  onLogout,
  language,
  currentTabName
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [copiedClientInfo, setCopiedClientInfo] = useState(false);

  // Client device name & IP
  const clientDeviceName = machineInfo?.deviceName || machineInfo?.hostname || 'CLIENT-PC';
  const clientIpAddress = machineInfo?.localIp || '127.0.0.1';
  const clientCombinedInfo = `${clientDeviceName} (${clientIpAddress})`;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarSuccess, setAvatarSuccess] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const handleDirectAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError(language === 'TH' ? 'กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, WebP)' : 'Please select an image file (JPG, PNG, WebP)');
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

  // Close dropdowns on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProfileDropdownOpen(false);
        setNotifDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'IT':
        return 'bg-blue-50 text-[#1E60D5] border-blue-200';
      case 'ACCOUNTING':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'HR':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-18 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 shadow-2xs">
      {/* Zone 1: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Open navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
          <span className="text-slate-400 hidden sm:inline font-semibold">QISHENG</span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <h1 className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-none">
            {currentTabName}
          </h1>
        </div>
      </div>

      {/* Zone 2: Client Device Info, Notifications, User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Compact Client Machine & IP Info Pill on Top Header Bar */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-700 shadow-2xs hover:border-blue-300 transition-colors">
          <div className="w-5 h-5 rounded-md bg-blue-50 text-[#1E60D5] flex items-center justify-center shrink-0">
            <Laptop className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="font-bold text-slate-800">{clientDeviceName}</span>
            <span className="text-slate-300 font-normal">|</span>
            <span className="text-emerald-600 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {clientIpAddress}
            </span>
          </div>
          <button
            onClick={handleCopyClientInfo}
            className={`p-1 rounded-md text-xs transition-colors shrink-0 ml-0.5 ${
              copiedClientInfo
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
            }`}
            title={copiedClientInfo ? (language === 'TH' ? 'คัดลอกแล้ว' : 'Copied!') : (language === 'TH' ? 'คัดลอกชื่อเครื่องและไอพี' : 'Copy Device Name & IP')}
            aria-label="Copy Client Info"
          >
            {copiedClientInfo ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            aria-label="Announcements & Alerts"
          >
            <Bell className="w-4 h-4" />
            {announcements.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 text-xs animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-slate-800">
                  {language === 'TH' ? 'การแจ้งเตือนองค์กร' : 'Corporate Notifications'}
                </span>
                <button
                  onClick={() => {
                    setNotifDropdownOpen(false);
                    onOpenAnnouncements();
                  }}
                  className="text-[#1E60D5] hover:underline text-[11px] font-semibold"
                >
                  {language === 'TH' ? 'ดูทั้งหมด' : 'View All'}
                </button>
              </div>

              <div className="divide-y divide-slate-100 my-2 max-h-72 overflow-y-auto">
                {announcements.map((ann) => (
                  <div key={ann.id} className="py-2.5 hover:bg-slate-50 px-2 rounded-xl transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        ann.priority === 'urgent' 
                          ? 'bg-rose-50 text-rose-700 border-rose-200' 
                          : 'bg-blue-50 text-[#1E60D5] border-blue-200'
                      }`}>
                        {ann.tag}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{ann.date}</span>
                    </div>
                    <div className="font-bold text-slate-800 line-clamp-1">
                      {language === 'TH' ? ann.title : ann.titleEn}
                    </div>
                    <p className="text-slate-500 text-[11px] line-clamp-2 mt-0.5">{ann.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all text-left"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-blue-200 bg-blue-50 shrink-0 shadow-2xs">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#1E60D5]">
                {currentUser.name.charAt(0)}
              </div>
            </div>

            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold text-slate-800 truncate max-w-[130px]">
                {currentUser.name}
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider ${getRoleBadgeStyle(currentUser.role)}`}>
                  {currentUser.position || 'IT Support'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {currentUser.employeeId}
                </span>
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in">
              {/* User details header: แสดงเฉพาะ Avatar, Name, Department เท่านั้น */}
              <div className="pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-200 bg-blue-50 shrink-0 shadow-2xs group cursor-pointer"
                    title={language === 'TH' ? 'คลิกเพื่อเปลี่ยนรูปประจำตัวจากเครื่อง' : 'Click to upload profile photo'}
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover transition-opacity group-hover:opacity-75"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm text-slate-900 truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                      {currentUser.department}
                    </div>
                  </div>
                </div>

                {avatarSuccess && (
                  <div className="mt-2.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-in fade-in">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>{language === 'TH' ? 'อัปเดตรูปประจำตัวเรียบร้อยแล้ว' : 'Profile photo updated successfully'}</span>
                  </div>
                )}

                {avatarError && (
                  <div className="mt-2.5 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                    <span>{avatarError}</span>
                  </div>
                )}
              </div>

              {/* Profile Settings Section (User Request #3: เปลี่ยนรูปประจำตัว, เปลี่ยนโหมด, รีเซ็ตรหัสผ่าน) */}
              <div className="py-2.5 border-b border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center justify-between">
                  <span>{language === 'TH' ? 'ตั้งค่าโปรไฟล์ & การใช้งาน' : 'Profile Settings'}</span>
                  <Settings className="w-3 h-3 text-slate-400" />
                </div>

                <div className="space-y-1">
                  {/* Hidden file input for uploading photo from device */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleDirectAvatarUpload}
                    className="hidden"
                  />

                  {/* 1. Change Avatar Button (รองรับการอัปโหลดไฟล์ภาพจากเครื่องผู้ใช้) */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left text-xs text-slate-700 hover:text-[#1E60D5] hover:bg-blue-50/60 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Camera className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1E60D5]" />
                      <span className="font-medium">{language === 'TH' ? 'เปลี่ยนรูปประจำตัว' : 'Change Avatar'}</span>
                    </div>
                    <span className="text-[10px] text-[#1E60D5] font-semibold bg-blue-50 group-hover:bg-blue-100 px-2 py-0.5 rounded-md transition-colors flex items-center gap-1">
                      <Upload className="w-2.5 h-2.5" />
                      <span>{language === 'TH' ? 'อัปโหลดภาพ' : 'Upload'}</span>
                    </span>
                  </button>

                  {/* Preset Avatars Link */}
                  {onOpenAvatarModal && (
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenAvatarModal();
                      }}
                      className="w-full flex items-center justify-between px-2 py-1 rounded-lg text-left text-[11px] text-slate-500 hover:text-[#1E60D5] hover:bg-slate-50 transition-colors group pl-8"
                    >
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{language === 'TH' ? 'เลือกจากรูปตัวอย่างของระบบ' : 'Choose from Presets'}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#1E60D5]" />
                    </button>
                  )}

                  {/* 2. Change Mode */}
                  <button
                    onClick={() => {
                      onToggleDarkMode?.();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left text-xs text-slate-700 hover:text-[#1E60D5] hover:bg-blue-50/60 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      {darkMode ? (
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                      ) : (
                        <Moon className="w-3.5 h-3.5 text-indigo-500" />
                      )}
                      <span>
                        {language === 'TH' 
                          ? (darkMode ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด')
                          : (darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode')}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {darkMode ? 'Dark' : 'Light'}
                    </span>
                  </button>

                  {/* 3. Reset Password */}
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenPasswordResetModal?.();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left text-xs text-slate-700 hover:text-[#1E60D5] hover:bg-blue-50/60 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <KeyRound className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1E60D5]" />
                      <span>{language === 'TH' ? 'รีเซ็ตรหัสผ่าน (SSPR)' : 'Reset Password'}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#1E60D5]" />
                  </button>
                </div>
              </div>

              {/* Role Switcher */}
              <div className="py-2.5 border-b border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                  {language === 'TH' ? 'สลับบัญชีเพื่อทดสอบสิทธิ์ (Role Switcher)' : 'Switch User Profile (Testing)'}
                </div>
                <div className="space-y-1">
                  {CORPORATE_USERS.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        onSwitchUser(user);
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-1.5 rounded-lg text-left text-xs transition-colors ${
                        currentUser.id === user.id
                          ? 'bg-blue-50 text-[#1E60D5] font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <span className="font-semibold">{user.name}</span>
                        <span className="text-[10px] text-slate-400 ml-1.5 font-mono">({user.role})</span>
                      </div>
                      {currentUser.id === user.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1E60D5]"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logout button */}
              <div className="pt-2">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{language === 'TH' ? 'ออกจากระบบ Intranet' : 'Sign Out of Intranet'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
