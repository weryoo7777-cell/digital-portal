import React from 'react';
import { CalendarDays } from 'lucide-react';
import { UserProfile } from '../types';
import { CORPORATE_BUILDING_BANNER } from '../data/portalData';

interface HeroClientInfoProps {
  currentUser?: UserProfile | null;
  language: 'TH' | 'EN';
  machineInfo?: any;
  isLoading?: boolean;
  onRefreshInfo?: () => void;
  onUpdateLocalIp?: (ip: string) => void;
  onUpdateDeviceName?: (deviceName: string) => void;
  onOpenAnnouncements?: () => void;
  hasUnreadAnnouncements?: boolean;
}

export const HeroClientInfo: React.FC<HeroClientInfoProps> = ({
  language,
  onOpenAnnouncements,
  hasUnreadAnnouncements = false
}) => {
  const formattedDate = new Date().toLocaleDateString(language === 'TH' ? 'th-TH' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden mb-6">
      {/* Top Welcome Banner with Glass Office Building Graphic */}
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

            {/* Requirement #2.1: Main Banner Title displays "ยินดีต้อนรับสู่ Navigator Website" prominently as title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              {language === 'TH'
                ? 'ยินดีต้อนรับสู่ Navigator Website'
                : 'Welcome to Navigator Website'}
            </h1>
          </div>

          {/* Quick Action: Open Today's Announcement */}
          {onOpenAnnouncements && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenAnnouncements}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-bold transition-all shadow-xs cursor-pointer group"
                title={language === 'TH' ? 'ดูประกาศข่าวสารประจำวัน' : "View Today's Announcements"}
              >
                <span className="relative flex h-2 w-2">
                  {hasUnreadAnnouncements && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${hasUnreadAnnouncements ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                </span>
                <span>{language === 'TH' ? '📢 ประกาศข่าวสารประจำวัน' : '📢 Daily Announcements'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

