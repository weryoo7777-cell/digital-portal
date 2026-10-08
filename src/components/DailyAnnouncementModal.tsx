import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Info, 
  Tag, 
  Sparkles,
  ExternalLink,
  Check
} from 'lucide-react';
import { CorporateAnnouncement } from '../types';

interface DailyAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDismissToday: () => void;
  announcements: CorporateAnnouncement[];
  language: 'TH' | 'EN';
}

export const DailyAnnouncementModal: React.FC<DailyAnnouncementModalProps> = ({
  isOpen,
  onClose,
  onDismissToday,
  announcements,
  language
}) => {
  const [dontShowAgainToday, setDontShowAgainToday] = useState(true);
  const [selectedAnnouncementIndex, setSelectedAnnouncementIndex] = useState(0);

  if (!isOpen || announcements.length === 0) return null;

  const currentAnnouncement = announcements[selectedAnnouncementIndex] || announcements[0];

  const handleDismiss = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (dontShowAgainToday) {
      onDismissToday();
    } else {
      onClose();
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            {language === 'TH' ? 'ด่วนที่สุด (Urgent)' : 'Urgent'}
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3" />
            {language === 'TH' ? 'สำคัญ (High)' : 'Important'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#1E60D5] dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Info className="w-3 h-3" />
            {language === 'TH' ? 'ทั่วไป (General)' : 'Notice'}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-r from-blue-900 via-[#1E60D5] to-indigo-900 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xs">
                <Bell className="w-5 h-5 text-amber-300 animate-[bounce_2s_infinite]" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                  {language === 'TH' ? 'ประกาศประจำวัน' : 'Daily Corporate Notice'}
                </span>
                <h3 className="text-lg font-extrabold tracking-tight text-white leading-tight">
                  {language === 'TH' ? 'ข่าวสาร & ประกาศสำคัญขององค์กร' : 'Official Corporate Announcements'}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              title={language === 'TH' ? 'ปิด' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Announcement Tabs if multiple */}
          {announcements.length > 1 && (
            <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-1 scrollbar-none">
              {announcements.map((ann, idx) => (
                <button
                  key={ann.id || idx}
                  onClick={() => setSelectedAnnouncementIndex(idx)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedAnnouncementIndex === idx
                      ? 'bg-white text-[#1E60D5] shadow-xs'
                      : 'bg-white/15 text-white/80 hover:bg-white/25'
                  }`}
                >
                  {language === 'TH' ? `ประกาศที่ ${idx + 1}` : `Notice #${idx + 1}`}
                  {ann.priority === 'urgent' && ' 🔴'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              {getPriorityBadge(currentAnnouncement.priority)}
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {currentAnnouncement.tag}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentAnnouncement.date}</span>
            </div>
          </div>

          {/* Title */}
          <div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {language === 'TH' ? currentAnnouncement.title : currentAnnouncement.titleEn || currentAnnouncement.title}
            </h4>
          </div>

          {/* Detailed Content Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {currentAnnouncement.summary}
          </div>

          {/* Author info */}
          {currentAnnouncement.author && (
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>{language === 'TH' ? 'ออกประกาศโดย:' : 'Issued by:'}</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {currentAnnouncement.author}
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Don't show again today checkbox */}
          <label className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgainToday}
              onChange={(e) => setDontShowAgainToday(e.target.checked)}
              className="w-4 h-4 rounded text-[#1E60D5] border-slate-300 dark:border-slate-600 focus:ring-[#1E60D5] cursor-pointer"
            />
            <span>
              {language === 'TH' 
                ? 'ไม่ต้องแสดงอีกในวันนี้ (บันทึกไว้ในเบราว์เซอร์)' 
                : "Don't show again today"}
            </span>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1E60D5] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'TH' ? 'รับทราบและปิด' : 'Acknowledge & Close'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
