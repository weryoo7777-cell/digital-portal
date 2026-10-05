import React from 'react';
import { 
  LayoutDashboard, 
  Grid, 
  BookOpen, 
  Bell,
  Calendar,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Globe2,
  Landmark,
  Search,
  Languages,
  Star,
  Clock,
  Settings,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { QISHENG_LOGO, CORPORATE_MOUNTAIN_BRAND } from '../data/portalData';

export type NavTab = 
  | 'dashboard' 
  | 'all-apps' 
  | 'external-portals'
  | 'announcements' 
  | 'calendar' 
  | 'documents';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreadAnnouncementsCount: number;
  onOpenQuickAction: (action: 'helpdesk' | 'sspr' | 'access') => void;
  onOpenSystemStatus: () => void;
  onOpenGoogleSearch?: () => void;
  onOpenGoogleTranslate?: () => void;
  language: 'TH' | 'EN';
  onToggleLanguage: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  unreadAnnouncementsCount,
  onOpenQuickAction,
  onOpenSystemStatus,
  onOpenGoogleSearch,
  onOpenGoogleTranslate,
  language,
  onToggleLanguage,
  mobileOpen,
  onCloseMobile
}) => {
  // Primary Navigation
  const primaryNavItems = [
    {
      id: 'dashboard' as NavTab,
      labelTh: 'หน้าหลัก',
      labelEn: 'Home',
      icon: LayoutDashboard,
    },
    {
      id: 'all-apps' as NavTab,
      labelTh: 'แอปพลิเคชันทั้งหมด',
      labelEn: 'All Applications',
      icon: Grid,
    },
    {
      id: 'external-portals' as NavTab,
      labelTh: 'ระบบราชการ & ธนาคาร',
      labelEn: 'External Portals',
      icon: Landmark,
      badge: '16',
      badgeColor: 'bg-blue-50 text-[#1E60D5] border-blue-200'
    },
  ];

  // Secondary Navigation
  const secondaryNavItems = [
    {
      id: 'announcements' as NavTab,
      labelTh: 'ข่าวสาร & ประกาศ',
      labelEn: 'Announcements',
      icon: Bell,
      badge: unreadAnnouncementsCount > 0 ? unreadAnnouncementsCount : null,
      badgeColor: 'bg-rose-50 text-rose-600 border-rose-200'
    },
    {
      id: 'calendar' as NavTab,
      labelTh: 'ปฏิทินบริษัท 2026',
      labelEn: 'Corporate Calendar',
      icon: Calendar,
    },
    {
      id: 'documents' as NavTab,
      labelTh: 'เอกสาร & คู่มือระบบ',
      labelEn: 'Documents & Manuals',
      icon: BookOpen,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile} 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between
        shadow-sm transition-transform duration-300 ease-in-out lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top: Logo & Corporate Identity */}
        <div className="flex-1 overflow-y-auto">
          <div className="h-20 px-6 flex items-center border-b border-slate-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-blue-100 bg-blue-50/50 shadow-xs flex items-center justify-center shrink-0">
                <img 
                  src={QISHENG_LOGO} 
                  alt="QISHENG Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="font-extrabold text-[#1E60D5] text-lg tracking-wider">QS</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-slate-900">QISHENG</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E60D5] bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-md">
                    Digital Portal
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium tracking-tight">Enterprise Intranet Hub</span>
              </div>
            </div>
          </div>

          {/* Service Uptime Quick Pill */}
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60">
            <button 
              onClick={onOpenSystemStatus}
              className="w-full flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 text-slate-700 transition-all text-left shadow-xs group"
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-medium text-slate-700 text-[11px]">Intranet Core: Online</span>
              </div>
              <span className="text-[11px] text-[#1E60D5] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                Status <ExternalLink className="w-3 h-3" />
              </span>
            </button>
          </div>

          {/* Primary Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {language === 'TH' ? 'เมนูหลัก' : 'Primary Navigation'}
            </div>
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all text-left
                    ${isActive 
                      ? 'bg-blue-50 text-[#1E60D5] font-bold border-l-4 border-[#1E60D5] shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#1E60D5]' : 'text-slate-400'}`} />
                    <span className="truncate">
                      {language === 'TH' ? item.labelTh : item.labelEn}
                    </span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Secondary Navigation Section */}
            <div className="pt-4 pb-1 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {language === 'TH' ? 'ข้อมูล & ปฏิทินองค์กร' : 'Organization & Docs'}
            </div>
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all text-left
                    ${isActive 
                      ? 'bg-blue-50 text-[#1E60D5] font-bold border-l-4 border-[#1E60D5] shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#1E60D5]' : 'text-slate-400'}`} />
                    <span className="truncate">
                      {language === 'TH' ? item.labelTh : item.labelEn}
                    </span>
                  </div>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Mountain branding, Admin Settings & Copyright */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          {/* Subtle Corporate Mountain Branding Graphic */}
          <div className="relative rounded-xl overflow-hidden border border-slate-200/80 shadow-xs h-18 group">
            <img 
              src={CORPORATE_MOUNTAIN_BRAND} 
              alt="Qisheng Mountain Corporate Heritage" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent p-2.5 flex flex-col justify-end">
              <span className="text-white text-[11px] font-bold tracking-wide">Qisheng Group Heritage</span>
              <span className="text-slate-300 text-[9px]">Solid • Reliable • Forward-Thinking</span>
            </div>
          </div>

          {/* Google Search & Translate Quick Tools (Replacing Report Issue) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenGoogleSearch}
              className="flex items-center justify-center gap-2 py-2.5 px-2.5 text-xs font-semibold text-slate-700 hover:text-[#1E60D5] bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-xl transition-all shadow-2xs group"
              title="Google Search Hub"
            >
              <div className="w-4 h-4 rounded bg-white border border-slate-200 flex items-center justify-center font-bold text-[10px] text-[#4285F4] shrink-0">
                G
              </div>
              <span className="truncate">{language === 'TH' ? 'ค้นหา' : 'Search'}</span>
            </button>

            <button
              onClick={onOpenGoogleTranslate}
              className="flex items-center justify-center gap-2 py-2.5 px-2.5 text-xs font-semibold text-slate-700 hover:text-[#1E60D5] bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-xl transition-all shadow-2xs group"
              title="Google Translate"
            >
              <Languages className="w-4 h-4 text-[#1E60D5] shrink-0" />
              <span className="truncate">{language === 'TH' ? 'แปลภาษา' : 'Translate'}</span>
            </button>
          </div>

          {/* Footer Metadata & Language switcher */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] font-mono text-slate-500">Zero-Trust v3</span>
            </div>

            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold transition-colors shadow-2xs"
              title="Toggle Language"
            >
              <Globe2 className="w-3 h-3 text-[#1E60D5]" />
              <span>{language === 'TH' ? 'TH / EN' : 'EN / TH'}</span>
            </button>
          </div>

          <div className="text-[10px] text-slate-400 text-center">
            &copy; 2026 Qisheng Digital Portal. All rights reserved.
          </div>
        </div>
      </aside>
    </>
  );
};
