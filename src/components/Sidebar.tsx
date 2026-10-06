import React from 'react';
import { 
  LayoutDashboard, 
  Grid, 
  BookOpen, 
  Bell,
  Calendar,
  Landmark,
  Languages
} from 'lucide-react';
import { QISHENG_LOGO } from '../data/portalData';

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
  unreadAnnouncementsCount?: number;
  onOpenQuickAction?: (action: 'helpdesk' | 'sspr' | 'access') => void;
  onOpenSystemStatus?: () => void;
  onOpenGoogleSearch?: () => void;
  onOpenGoogleTranslate?: () => void;
  language: 'TH' | 'EN';
  onToggleLanguage?: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  unreadAnnouncementsCount = 0,
  onOpenGoogleSearch,
  onOpenGoogleTranslate,
  language,
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
      badgeColor: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-900/60'
    },
    {
      id: 'calendar' as NavTab,
      labelTh: 'ปฏิทินบริษัท',
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
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col
        shadow-sm transition-transform duration-300 ease-in-out lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* 1. Top Header: Logo & "QISHENG" text only */}
        <div className="h-20 px-6 flex items-center border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-blue-100 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/50 shadow-xs flex items-center justify-center shrink-0">
              <img 
                src={QISHENG_LOGO} 
                alt="QISHENG Logo" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <span className="font-extrabold text-[#1E60D5] dark:text-blue-400 text-lg tracking-wider">QS</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              QISHENG
            </span>
          </div>
        </div>

        {/* 2. Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
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
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all text-left cursor-pointer
                  ${isActive 
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300 font-bold border-l-4 border-[#1E60D5] dark:border-blue-400 shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#1E60D5] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span className="truncate">
                    {language === 'TH' ? item.labelTh : item.labelEn}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Secondary Navigation Section */}
          <div className="pt-4 pb-1 px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {language === 'TH' ? 'ข้อมูล & ปฏิทินองค์กร' : 'Organization & Docs'}
          </div>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const hasUnread = typeof item.badge === 'number' && item.badge > 0;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all text-left cursor-pointer
                  ${isActive 
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300 font-bold border-l-4 border-[#1E60D5] dark:border-blue-400 shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#1E60D5] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span className="truncate">
                    {language === 'TH' ? item.labelTh : item.labelEn}
                  </span>
                </div>
                {hasUnread && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${item.badgeColor} shadow-2xs`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 3. Bottom Utility Actions: Google Search & Google Translate */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onOpenGoogleSearch?.();
                onCloseMobile();
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all cursor-pointer shadow-2xs group"
              title={language === 'TH' ? 'ค้นหา Google Search' : 'Google Search'}
            >
              <span className="font-extrabold text-[#4285F4] text-xs">G</span>
              <span>{language === 'TH' ? 'ค้นหา' : 'Search'}</span>
            </button>
            <button
              onClick={() => {
                onOpenGoogleTranslate?.();
                onCloseMobile();
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all cursor-pointer shadow-2xs group"
              title={language === 'TH' ? 'Google แปลภาษา' : 'Google Translate'}
            >
              <Languages className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              <span>{language === 'TH' ? 'แปลภาษา' : 'Translate'}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
