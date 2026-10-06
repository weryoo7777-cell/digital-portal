import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  X,
  Clock, 
  CheckCircle2, 
  Building2, 
  FileText, 
  Printer, 
  Download, 
  Info, 
  Sparkles, 
  CalendarDays, 
  Grid3X3,
  Check
} from 'lucide-react';
import { RoomBooking } from '../types';
import { QISHENG_LOGO } from '../data/portalData';
import { 
  COMPANY_INFO, 
  CALENDAR_STATS, 
  OFFICIAL_HOLIDAYS_2026, 
  MONTHS_2026, 
  OfficialHoliday, 
  MonthMeta,
  getHolidayForDate 
} from '../data/calendar2026Data';

interface CalendarViewProps {
  roomBookings?: RoomBooking[];
  language: 'TH' | 'EN';
}

export const CalendarView: React.FC<CalendarViewProps> = ({ language }) => {
  // Real-time System Date calculation based on system date (e.g. Oct 6, 2026)
  const now = useMemo(() => new Date(), []);
  const currentMonthIndex = now.getMonth();
  const currentDay = now.getDate();

  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(currentMonthIndex);
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [monthPickerOpen, setMonthPickerOpen] = useState<boolean>(false);

  const selectedMonth: MonthMeta = MONTHS_2026[selectedMonthIndex];

  // Holidays in the selected month
  const selectedMonthHolidays = useMemo(() => {
    return OFFICIAL_HOLIDAYS_2026.filter(h => h.month === selectedMonth.monthNumber);
  }, [selectedMonth.monthNumber]);

  // Navigate month
  const handlePrevMonth = () => {
    setSelectedMonthIndex(prev => (prev > 0 ? prev - 1 : 11));
  };

  const handleNextMonth = () => {
    setSelectedMonthIndex(prev => (prev < 11 ? prev + 1 : 0));
  };

  const handleResetToCurrentMonth = () => {
    setSelectedMonthIndex(currentMonthIndex);
    setViewMode('monthly');
  };

  // Helper to render days grid for any given month
  const renderMonthDaysGrid = (month: MonthMeta, isCompact = false) => {
    const cells = [];

    // Blank cells before month start
    for (let i = 0; i < month.startDayOfWeek; i++) {
      cells.push(
        <div 
          key={`blank-${month.monthNumber}-${i}`} 
          className={`${isCompact ? 'h-6 text-[10px]' : 'h-16 sm:h-20 p-1.5'} border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40`}
        />
      );
    }

    // Days in the month
    for (let day = 1; day <= month.daysCount; day++) {
      const holiday = getHolidayForDate(month.monthNumber, day);
      const isToday = month.monthIndex === currentMonthIndex && day === currentDay;
      const dayOfWeek = (month.startDayOfWeek + day - 1) % 7;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      cells.push(
        <div
          key={`day-${month.monthNumber}-${day}`}
          className={`
            relative border transition-all flex flex-col justify-between
            ${isCompact 
              ? 'h-7 text-[11px] items-center justify-center font-mono' 
              : 'min-h-[70px] sm:min-h-[85px] p-2'}
            ${holiday 
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 font-bold' 
              : isToday 
              ? 'bg-blue-50/90 dark:bg-blue-950/50 border-[#1E60D5] dark:border-blue-500 text-[#1E60D5] dark:text-blue-300 font-bold ring-2 ring-blue-300 dark:ring-blue-700' 
              : isWeekend 
              ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40 text-amber-800 dark:text-amber-300' 
              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'}
          `}
        >
          <div className={`flex items-center justify-between w-full ${isCompact ? 'justify-center' : ''}`}>
            <span className={`
              ${isCompact ? '' : 'text-sm font-semibold'}
              ${holiday ? 'text-rose-700 dark:text-rose-300 font-extrabold' : ''}
              ${isToday ? 'px-1.5 py-0.2 rounded bg-[#1E60D5] dark:bg-blue-600 text-white text-xs font-bold' : ''}
            `}>
              {day}
            </span>

            {!isCompact && holiday && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.2 rounded bg-rose-600 dark:bg-rose-700 text-white">
                Holiday
              </span>
            )}
          </div>

          {!isCompact && holiday && (
            <div className="mt-1 text-[10px] text-rose-700 dark:text-rose-300 font-medium line-clamp-2 leading-tight">
              {language === 'TH' ? holiday.occasionTh : holiday.occasionEn}
            </div>
          )}

          {!isCompact && isToday && (
            <div className="mt-1 text-[10px] text-[#1E60D5] dark:text-blue-400 font-bold font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E60D5] dark:bg-blue-400 animate-ping"></span>
              <span>{language === 'TH' ? 'วันนี้' : 'Today'}</span>
            </div>
          )}
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto pb-12">
      {/* 1. Official Document Header Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-[#1E60D5] to-indigo-600"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Company Branding */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 p-1.5 flex items-center justify-center shrink-0 shadow-xs border border-blue-100 dark:border-blue-900/60 overflow-hidden">
              <img 
                src={QISHENG_LOGO} 
                alt="QI SHENG Logo" 
                className="w-full h-full object-cover rounded-xl" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <span className="font-extrabold text-[#1E60D5] dark:text-blue-400 text-xl tracking-wider">QS</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {COMPANY_INFO.nameTh}
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 uppercase font-bold">
                  Official
                </span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#1E60D5] dark:text-blue-400 tracking-wide mt-0.5">
                {COMPANY_INFO.nameEn}
              </div>
            </div>
          </div>

          {/* Calendar Title */}
          <div className="flex flex-col lg:items-end justify-center">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-wider text-slate-900 dark:text-white font-mono">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                CALENDAR
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Controls & View Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-3.5 rounded-2xl shadow-xs">
        {/* Month Navigation & Clickable Month Popover Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all shadow-2xs"
            title="เดือนก่อนหน้า (Previous Month)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Clickable Month Indicator button that pops up the month picker */}
          <button
            onClick={() => setMonthPickerOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 text-center min-w-[200px] transition-all flex items-center justify-between gap-3 group shadow-2xs"
            title={language === 'TH' ? 'คลิกเพื่อเลือกเดือน' : 'Click to select month'}
          >
            <div className="text-left">
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{language === 'TH' ? selectedMonth.nameTh : selectedMonth.nameEn}</span>
                <span className="text-[#1E60D5] dark:text-blue-400 font-mono">2026</span>
                {selectedMonthIndex === currentMonthIndex && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                    {language === 'TH' ? 'ปัจจุบัน' : 'Current'}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Month #{selectedMonth.monthNumber} &bull; {selectedMonth.daysCount} {language === 'TH' ? 'วัน' : 'days'}
              </div>
            </div>

            <div className="p-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 group-hover:text-[#1E60D5] dark:group-hover:text-blue-400 transition-colors">
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </button>

          <button
            onClick={handleNextMonth}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all shadow-2xs"
            title="เดือนถัดไป (Next Month)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Jump to current month button */}
          {selectedMonthIndex !== currentMonthIndex && (
            <button
              onClick={handleResetToCurrentMonth}
              className="text-xs px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-semibold transition-all"
            >
              {language === 'TH' ? 'กลับไปเดือนปัจจุบัน' : 'Back to Current Month'}
            </button>
          )}
        </div>

        {/* View Mode Toggle (Monthly Focus vs Full 12-Month Overview) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('monthly')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'monthly'
                  ? 'bg-white dark:bg-slate-900 text-[#1E60D5] dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{language === 'TH' ? 'มุมมองรายเดือน' : 'Month View'}</span>
            </button>

            <button
              onClick={() => setViewMode('yearly')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'yearly'
                  ? 'bg-white dark:bg-slate-900 text-[#1E60D5] dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>{language === 'TH' ? 'ทั้งปี 12 เดือน' : 'Full 12 Months'}</span>
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all shadow-2xs"
            title="พิมพ์ปฏิทิน (Print Calendar)"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Month Picker Pop-up Modal */}
      {monthPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 text-slate-800 dark:text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[#1E60D5] dark:text-blue-400" />
                  <span>{language === 'TH' ? 'เลือกเดือนที่ต้องการดู (ปี 2026 / 2569)' : 'Select Month to View (2026)'}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {language === 'TH' ? 'คลิกที่เดือนที่ต้องการเพื่อดูปฏิทินและวันหยุดประจำเดือน' : 'Choose a month to jump to its calendar schedule'}
                </p>
              </div>
              <button
                onClick={() => setMonthPickerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 12 Months Grid: 3 columns x 4 rows */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {MONTHS_2026.map((m) => {
                const isSelected = selectedMonthIndex === m.monthIndex;
                const isCurrent = currentMonthIndex === m.monthIndex;
                const holidaysInM = OFFICIAL_HOLIDAYS_2026.filter(h => h.month === m.monthNumber);

                return (
                  <button
                    key={m.monthNumber}
                    onClick={() => {
                      setSelectedMonthIndex(m.monthIndex);
                      setViewMode('monthly');
                      setMonthPickerOpen(false);
                    }}
                    className={`
                      p-3 rounded-xl border text-left transition-all flex flex-col justify-between group
                      ${isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-[#1E60D5] dark:border-blue-500 text-[#1E60D5] dark:text-blue-300 ring-2 ring-blue-200 dark:ring-blue-800 shadow-xs'
                        : isCurrent
                        ? 'bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-700 hover:border-[#1E60D5]'
                        : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100/70 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'}
                    `}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-mono text-xs font-bold text-[#1E60D5] dark:text-blue-400">
                        #{m.monthNumber}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-[#1E60D5] dark:text-blue-300">
                          {language === 'TH' ? 'ปัจจุบัน' : 'Current'}
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#1E60D5] dark:group-hover:text-blue-400">
                      {language === 'TH' ? m.nameTh : m.nameEn}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {language === 'TH' ? m.nameEn : m.nameTh}
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 dark:text-slate-400">{m.daysCount} วัน</span>
                      {holidaysInM.length > 0 ? (
                        <span className="px-1.5 py-0.2 rounded font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                          วันหยุด {holidaysInM.length} วัน
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">ไม่มีวันหยุด</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setSelectedMonthIndex(currentMonthIndex);
                  setViewMode('monthly');
                  setMonthPickerOpen(false);
                }}
                className="text-[#1E60D5] dark:text-blue-400 hover:underline font-semibold"
              >
                &larr; {language === 'TH' ? 'ไปยังเดือนปัจจุบัน (ตุลาคม)' : 'Jump to Current Month (October)'}
              </button>
              <button
                onClick={() => setMonthPickerOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
              >
                {language === 'TH' ? 'ปิด' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. VIEW A: MONTHLY FOCUS VIEW */}
      {viewMode === 'monthly' && (
        <div className="space-y-6">
          {/* Main Month Calendar Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs">
            {/* Table Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center font-bold font-mono text-[#1E60D5] dark:text-blue-400 text-lg">
                  {selectedMonth.monthNumber}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{language === 'TH' ? selectedMonth.nameTh : selectedMonth.nameEn}</span>
                    <span className="text-slate-400 dark:text-slate-500 font-mono">/ {language === 'TH' ? selectedMonth.nameEn : selectedMonth.nameTh}</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {language === 'TH' 
                      ? `มีทั้งหมด ${selectedMonth.daysCount} วัน • วันหยุดตามประเพณี ${selectedMonthHolidays.length} วัน`
                      : `${selectedMonth.daysCount} Days Total • ${selectedMonthHolidays.length} Public Holidays`}
                  </p>
                </div>
              </div>

              {/* Legend Badges */}
              <div className="hidden sm:flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-rose-600 inline-block"></span>
                  <span className="text-slate-600 dark:text-slate-300">{language === 'TH' ? 'วันหยุดตามประเพณี' : 'Public Holiday'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#1E60D5] inline-block"></span>
                  <span className="text-slate-600 dark:text-slate-300">{language === 'TH' ? 'วันนี้' : 'Today'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-400 inline-block"></span>
                  <span className="text-slate-600 dark:text-slate-300">{language === 'TH' ? 'เสาร์-อาทิตย์' : 'Weekend'}</span>
                </div>
              </div>
            </div>

            {/* Calendar Table Grid */}
            <div className="p-4 sm:p-6">
              {/* Day of week header row */}
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs uppercase mb-1">
                <div className="py-2.5 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 shadow-2xs">
                  Sun
                </div>
                <div className="py-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#1E60D5] dark:text-blue-300 shadow-2xs">
                  Mon
                </div>
                <div className="py-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#1E60D5] dark:text-blue-300 shadow-2xs">
                  Tue
                </div>
                <div className="py-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#1E60D5] dark:text-blue-300 shadow-2xs">
                  Wed
                </div>
                <div className="py-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#1E60D5] dark:text-blue-300 shadow-2xs">
                  Thu
                </div>
                <div className="py-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#1E60D5] dark:text-blue-300 shadow-2xs">
                  Fri
                </div>
                <div className="py-2.5 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 shadow-2xs">
                  Sat
                </div>
              </div>

              {/* Days cells */}
              <div className="grid grid-cols-7 gap-1">
                {renderMonthDaysGrid(selectedMonth, false)}
              </div>
            </div>

            {/* Footer with Holidays in This Month */}
            {selectedMonthHolidays.length > 0 ? (
              <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>{language === 'TH' ? `วันหยุดตามประเพณีในเดือน ${selectedMonth.nameTh}:` : `Public Holidays in ${selectedMonth.nameEn}:`}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {selectedMonthHolidays.map((holiday) => (
                    <div 
                      key={holiday.no}
                      className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/60 hover:border-rose-400 dark:hover:border-rose-500 flex items-center justify-between transition-colors shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-rose-600 dark:bg-rose-700 text-white font-mono font-bold flex flex-col items-center justify-center shrink-0 shadow-2xs">
                          <span className="text-[10px] uppercase">{holiday.monthNameEn}</span>
                          <span className="text-base leading-none">{holiday.date}</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {language === 'TH' ? holiday.occasionTh : holiday.occasionEn}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {language === 'TH' ? `วัน${holiday.dayOfWeekTh}` : holiday.dayOfWeek} &bull; {holiday.occasionEn}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                        #{holiday.no}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>{language === 'TH' ? `เดือน ${selectedMonth.nameTh} ไม่มีวันหยุดราชการหรือวันหยุดตามประเพณี` : `No public holidays in ${selectedMonth.nameEn}`}</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-semibold">Working Month</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. VIEW B: 12-MONTH FULL OVERVIEW */}
      {viewMode === 'yearly' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {language === 'TH' ? 'ปฏิทิน 12 เดือนประจำปี 2026 (Annual Overview Sheet)' : 'Annual 12-Month Calendar 2026'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'TH' ? 'คลิกที่เดือนใดก็ได้เพื่อเปิดดูแบบละเอียด' : 'Click on any month to view detailed breakdown'}
              </p>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              12 Months &bull; 14 Holidays
            </div>
          </div>

          {/* 12-month Grid: 4 columns x 3 rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MONTHS_2026.map((month) => {
              const isSelected = selectedMonthIndex === month.monthIndex;
              const isCurrent = currentMonthIndex === month.monthIndex;
              return (
                <div
                  key={month.monthNumber}
                  onClick={() => {
                    setSelectedMonthIndex(month.monthIndex);
                    setViewMode('monthly');
                  }}
                  className={`
                    rounded-xl border p-2.5 transition-all cursor-pointer bg-white dark:bg-slate-800/90 hover:shadow-md
                    ${isSelected ? 'border-[#1E60D5] dark:border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}
                  `}
                >
                  {/* Month header pill */}
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {month.monthNumber}.{month.nameEn}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">/{month.shortTh}</span>
                    </div>

                    {isCurrent && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                        Current
                      </span>
                    )}
                  </div>

                  {/* Days header row (Sun-Sat) */}
                  <div className="grid grid-cols-7 gap-0.5 text-center text-[9px] font-bold mb-1">
                    <span className="py-0.5 rounded-xs bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300">Sun</span>
                    <span className="py-0.5 rounded-xs bg-blue-50 dark:bg-blue-950/40 text-[#1E60D5] dark:text-blue-300">Mon</span>
                    <span className="py-0.5 rounded-xs bg-blue-50 dark:bg-blue-950/40 text-[#1E60D5] dark:text-blue-300">Tue</span>
                    <span className="py-0.5 rounded-xs bg-blue-50 dark:bg-blue-950/40 text-[#1E60D5] dark:text-blue-300">Wed</span>
                    <span className="py-0.5 rounded-xs bg-blue-50 dark:bg-blue-950/40 text-[#1E60D5] dark:text-blue-300">Thu</span>
                    <span className="py-0.5 rounded-xs bg-blue-50 dark:bg-blue-950/40 text-[#1E60D5] dark:text-blue-300">Fri</span>
                    <span className="py-0.5 rounded-xs bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300">Sat</span>
                  </div>

                  {/* Compact Days Grid */}
                  <div className="grid grid-cols-7 gap-0.5">
                    {renderMonthDaysGrid(month, true)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. OFFICIAL HOLIDAY TABLE */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{language === 'TH' ? 'ตารางวันหยุดตามประเพณีประจำปี 2026' : 'Official Public Holidays Schedule 2026'}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 font-bold">
                14 Days
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'TH' ? 'อ้างอิงตามประกาศบริษัท ฉี เซิง คอนซัลติ้ง จำกัด' : 'According to official QI SHENG CONSULTING CO.,LTD. calendar notice'}
            </p>
          </div>

          <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            {language === 'TH' ? 'คลิกที่แถวเพื่อไปยังเดือนนั้น' : 'Click any row to jump to that month'}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase text-[11px] font-mono">
              <tr>
                <th className="py-3 px-3 text-center">No.</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Day</th>
                <th className="py-3 px-3">Month</th>
                <th className="py-3 px-4">Occasion (ภาษาอังกฤษ)</th>
                <th className="py-3 px-4">วันหยุดเนื่องในโอกาส (ภาษาไทย)</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {OFFICIAL_HOLIDAYS_2026.map((holiday) => {
                return (
                  <tr
                    key={holiday.no}
                    onClick={() => {
                      setSelectedMonthIndex(holiday.month - 1);
                      setViewMode('monthly');
                    }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-400 dark:text-slate-500 group-hover:text-[#1E60D5] dark:group-hover:text-blue-400">
                      {holiday.no})
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-rose-700 dark:text-rose-400">
                      <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60">
                        {holiday.date}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-600 dark:text-slate-300">
                      {holiday.dayOfWeek}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#1E60D5] dark:text-blue-400">
                      {holiday.monthNameEn}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {holiday.occasionEn}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">
                      {holiday.occasionTh}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMonthIndex(holiday.month - 1);
                          setViewMode('monthly');
                        }}
                        className="text-[10px] text-[#1E60D5] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-semibold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 transition-colors"
                      >
                        {language === 'TH' ? 'ดูเดือนนี้' : 'View'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Official Working & Holiday Statistics Bar (ย้ายมาไว้ด้านล่างสุดของหน้าจอ) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {language === 'TH' ? 'วันทำงานทั้งหมด' : 'Total Working Days'}
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 font-mono mt-0.5">
              {CALENDAR_STATS.workingDays} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{language === 'TH' ? 'วัน' : 'days'}</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 text-xs font-bold font-mono">
            68%
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {language === 'TH' ? 'วันหยุดตามประเพณี' : 'Public Holidays'}
            </div>
            <div className="text-lg sm:text-xl font-bold text-rose-600 dark:text-rose-400 font-mono mt-0.5">
              {CALENDAR_STATS.publicHolidays} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{language === 'TH' ? 'วัน' : 'days'}</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-600 dark:bg-rose-700 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
            ★
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {language === 'TH' ? 'วันหยุดสุดสัปดาห์' : 'Weekly Holidays (Sat-Sun)'}
            </div>
            <div className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400 font-mono mt-0.5">
              {CALENDAR_STATS.weeklyHolidays} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{language === 'TH' ? 'วัน' : 'days'}</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-700 dark:text-amber-400 text-xs font-bold font-mono">
            52w
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {language === 'TH' ? 'รวมจำนวนวันในปี' : 'Total Days in Year'}
            </div>
            <div className="text-lg sm:text-xl font-bold text-[#1E60D5] dark:text-blue-400 font-mono mt-0.5">
              {CALENDAR_STATS.totalDays} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{language === 'TH' ? 'วัน' : 'days'}</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-[#1E60D5] dark:text-blue-400 text-xs font-bold font-mono">
            2026
          </div>
        </div>
      </div>
    </div>
  );
};
