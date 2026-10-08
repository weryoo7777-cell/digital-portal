import React from 'react';
import { 
  LayoutDashboard, 
  Grid, 
  Calendar, 
  Languages, 
  Bell, 
  BookUser 
} from 'lucide-react';
import { NavTab } from '../types';

export type { NavTab };

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenGoogleSearch?: () => void;
  onOpenGoogleTranslate?: () => void;
  language: 'TH' | 'EN';
  mobileOpen: boolean;
  onCloseMobile: () => void;
  isAdmin?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenGoogleSearch,
  onOpenGoogleTranslate,
  language,
  mobileOpen,
  onCloseMobile,
  isAdmin = false
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
      id: 'vendor-contact' as NavTab,
      labelTh: 'จัดการผู้ให้บริการ (Vendor Contact)',
      labelEn: 'Vendor Contacts',
      icon: BookUser,
    },
  ];

  // Calendar Navigation
  const calendarNavItem = {
    id: 'calendar' as NavTab,
    labelTh: 'ปฏิทินองค์กร',
    labelEn: 'Organization Calendar',
    icon: Calendar,
  };

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
        {/* 1. Top Header: Clean "QISHENG" typography only (No Q logo emblem icon, No "DIGITAL PORTAL" subtitle) */}
        <div className="h-20 px-6 flex items-center border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <span className="font-black text-2xl tracking-wider text-slate-900 dark:text-white leading-none">
            QISHENG
          </span>
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
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
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

          {/* Calendar Navigation Section */}
          <div className="pt-4 pb-1 px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {language === 'TH' ? 'ปฏิทินองค์กร' : 'Organization Calendar'}
          </div>
          {(() => {
            const Icon = calendarNavItem.icon;
            const isActive = currentTab === calendarNavItem.id;
            return (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelectTab(calendarNavItem.id);
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
                    {language === 'TH' ? calendarNavItem.labelTh : calendarNavItem.labelEn}
                  </span>
                </div>
              </button>
            );
          })()}

          {/* Admin Section: Manage Announcements (Requirement #4: Removed User Management, replaced with Manage Announcements) */}
          {isAdmin && (
            <>
              <div className="pt-4 pb-1 px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>{language === 'TH' ? 'ผู้ดูแลระบบ (Admin)' : 'Administration'}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                  {language === 'TH' ? 'เปิดใช้งานแล้ว' : 'Active'}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelectTab('announcements');
                  onCloseMobile();
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all text-left cursor-pointer
                  ${currentTab === 'announcements'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300 font-bold border-l-4 border-[#1E60D5] dark:border-blue-400 shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Bell className={`w-4 h-4 ${currentTab === 'announcements' ? 'text-[#1E60D5] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span className="truncate">
                    {language === 'TH' ? 'จัดการประกาศข่าวสาร' : 'Manage Announcements'}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-mono">
                  Admin
                </span>
              </button>
            </>
          )}
        </div>

        {/* 3. Bottom Utility Actions: Google Search & Google Translate */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
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
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
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
