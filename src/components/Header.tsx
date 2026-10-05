import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  Grid, 
  ChevronDown, 
  LogOut, 
  Shield, 
  X,
  ExternalLink,
  Laptop,
  Globe,
  ArrowUpRight,
  User,
  Settings,
  Sparkles,
  Camera,
  KeyRound,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';
import { UserProfile, CorporateAnnouncement } from '../types';
import { CORPORATE_USERS } from '../data/portalData';

interface HeaderProps {
  currentUser: UserProfile;
  onSwitchUser: (user: UserProfile) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenMobileSidebar: () => void;
  onOpenSystemStatus: () => void;
  onOpenGoogleSearch?: () => void;
  onOpenGoogleTranslate?: () => void;
  onOpenAvatarModal?: () => void;
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
  onSwitchUser,
  searchQuery,
  onSearchChange,
  onOpenMobileSidebar,
  onOpenSystemStatus,
  onOpenGoogleSearch,
  onOpenGoogleTranslate,
  onOpenAvatarModal,
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
  const [appsDropdownOpen, setAppsDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setProfileDropdownOpen(false);
        setNotifDropdownOpen(false);
        setAppsDropdownOpen(false);
        setSearchFocused(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery.trim())}`, '_blank', 'noopener,noreferrer');
    }
  };

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
          <h1 className="text-slate-800 font-bold truncate max-w-[150px] sm:max-w-none">
            {currentTabName}
          </h1>
        </div>
      </div>

      {/* Zone 2: Global search input field with shortcut hint (Ctrl + K) */}
      <div className="flex-1 max-w-lg mx-2 sm:mx-4 relative">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={language === 'TH' ? 'ค้นหาระบบงาน, บริการ, เอกสาร... (Ctrl + K)' : 'Search apps, services, docs... (Ctrl + K)'}
            className="w-full bg-[#F4F6F9] hover:bg-slate-100/90 focus:bg-white border border-slate-200 focus:border-[#1E60D5] rounded-xl pl-9 pr-14 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
              Ctrl + K
            </kbd>
          )}
        </div>

        {/* Real-time Search Dropdown when typing */}
        {searchFocused && searchQuery.trim() && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in">
            <button
              onMouseDown={() => {
                window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery.trim())}`, '_blank', 'noopener,noreferrer');
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-blue-50/60 text-left transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-2xs">
                  <span className="text-[#4285F4]">G</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-[#1E60D5]">
                    {language === 'TH' ? 'ค้นหาบน Google สำหรับ:' : 'Search Google for:'} "{searchQuery}"
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Google Enterprise Search &bull; Enter to open
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#1E60D5] shrink-0" />
            </button>
          </div>
        )}
      </div>

      {/* Zone 3: Health Status, Grid App Launcher, Notifications, User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Core System Status Health Pill */}
        <button
          onClick={onOpenSystemStatus}
          className="hidden xl:flex items-center gap-2 py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 transition-colors shadow-2xs"
          title="Network & Core Systems Status"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="font-medium text-[11px] text-slate-600">All Systems Operational</span>
        </button>

        {/* Grid Menu / App Launcher */}
        <div className="relative">
          <button
            onClick={() => setAppsDropdownOpen(!appsDropdownOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            title="App Launcher"
          >
            <Grid className="w-4 h-4" />
          </button>

          {appsDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 text-xs animate-in fade-in">
              <div className="font-bold text-slate-800 pb-2 border-b border-slate-100 mb-2">
                {language === 'TH' ? 'ระบบงานด่วน' : 'Quick Apps'}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <a 
                  href="https://drive.google.com" target="_blank" rel="noreferrer" 
                  className="p-2 rounded-xl hover:bg-blue-50/60 transition-colors flex flex-col items-center gap-1 text-slate-700"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[#1E60D5] font-bold">GD</div>
                  <span className="text-[10px] font-medium">Drive</span>
                </a>
                <a 
                  href="https://mail.google.com" target="_blank" rel="noreferrer" 
                  className="p-2 rounded-xl hover:bg-blue-50/60 transition-colors flex flex-col items-center gap-1 text-slate-700"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 font-bold">M</div>
                  <span className="text-[10px] font-medium">Gmail</span>
                </a>
                <button 
                  onClick={onOpenSystemStatus}
                  className="p-2 rounded-xl hover:bg-blue-50/60 transition-colors flex flex-col items-center gap-1 text-slate-700"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">RT</div>
                  <span className="text-[10px] font-medium">Router</span>
                </button>
              </div>
            </div>
          )}
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
              {/* User details header */}
              <div className="pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-blue-200 bg-blue-50 shrink-0 shadow-2xs">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">
                      {currentUser.name}
                    </div>
                    <div className="text-xs text-slate-500">{currentUser.email}</div>
                    <div className="text-[11px] text-[#1E60D5] font-semibold mt-0.5">{currentUser.position}</div>
                  </div>
                </div>

                <div className="mt-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{language === 'TH' ? 'แผนก:' : 'Department:'}</span>
                    <span className="font-medium text-slate-800 truncate max-w-[180px]">{currentUser.department}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-slate-400">Local IP:</span>
                    <span className="text-emerald-600 font-semibold">{currentUser.localIp}</span>
                  </div>
                </div>
              </div>

              {/* Profile Settings Section (User Request #3: เปลี่ยนรูปประจำตัว, เปลี่ยนโหมด, รีเซ็ตรหัสผ่าน) */}
              <div className="py-2.5 border-b border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center justify-between">
                  <span>{language === 'TH' ? 'ตั้งค่าโปรไฟล์ & การใช้งาน' : 'Profile Settings'}</span>
                  <Settings className="w-3 h-3 text-slate-400" />
                </div>

                <div className="space-y-1">
                  {/* 1. Change Avatar */}
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenAvatarModal?.();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left text-xs text-slate-700 hover:text-[#1E60D5] hover:bg-blue-50/60 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Camera className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1E60D5]" />
                      <span>{language === 'TH' ? 'เปลี่ยนรูปประจำตัว' : 'Change Avatar'}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#1E60D5]" />
                  </button>

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
