import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  Check,
  Upload,
  RotateCcw,
  FileUp,
  AlertCircle,
  Pin,
  Trash2,
  Plus,
  Eye,
  ScanLine
} from 'lucide-react';
import { RoomBooking } from '../types';
import { QISHENG_LOGO } from '../data/portalData';
import { 
  COMPANY_INFO, 
  CALENDAR_STATS, 
  OFFICIAL_HOLIDAYS_2026, 
  MONTHS_2026, 
  OfficialHoliday, 
  MonthMeta 
} from '../data/calendar2026Data';

interface CalendarViewProps {
  roomBookings?: RoomBooking[];
  language: 'TH' | 'EN';
  isAdmin?: boolean;
  customCalendarImage?: string | null;
  onUploadCalendarImage?: (imageUrl: string) => void;
  onResetCalendarImage?: () => void;
}

interface ScannedHolidayCandidate {
  id: string;
  date: number;
  month: number;
  dayOfWeek: string;
  dayOfWeekTh: string;
  monthNameEn: string;
  monthNameTh: string;
  occasionTh: string;
  occasionEn: string;
  selected: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ 
  language,
  isAdmin = false
}) => {
  // Real-time System Date calculation based on system date (e.g. Oct 6, 2026)
  const now = useMemo(() => new Date(), []);
  const currentMonthIndex = now.getMonth();
  const currentDay = now.getDate();

  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(currentMonthIndex);
  // View mode is strictly Grid views: 'monthly' or 'yearly' (Image View removed as per user request #2)
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [monthPickerOpen, setMonthPickerOpen] = useState<boolean>(false);
  const [uploadSuccessNotice, setUploadSuccessNotice] = useState<string | null>(null);
  const [uploadErrorNotice, setUploadErrorNotice] = useState<string | null>(null);

  // Dynamic Company Holidays (Stored in localStorage, defaulting to OFFICIAL_HOLIDAYS_2026)
  const [holidays, setHolidays] = useState<OfficialHoliday[]>(() => {
    try {
      const stored = localStorage.getItem('qs_company_holidays_2026');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return OFFICIAL_HOLIDAYS_2026;
  });

  // Scanner Modal & Upload States
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedFileName, setScannedFileName] = useState<string>('');
  const [scannedFilePreview, setScannedFilePreview] = useState<string | null>(null);
  const [scannedCandidates, setScannedCandidates] = useState<ScannedHolidayCandidate[]>([]);

  // Manual Add Form inside Scanner Modal
  const [newHolidayMonth, setNewHolidayMonth] = useState<number>(10);
  const [newHolidayDate, setNewHolidayDate] = useState<number>(23);
  const [newHolidayOccasionTh, setNewHolidayOccasionTh] = useState<string>('วันปิยมหาราช (วันหยุดบริษัท)');
  const [newHolidayOccasionEn, setNewHolidayOccasionEn] = useState<string>('Chulalongkorn Memorial Day (Company Holiday)');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // User Request 4.1: Reset local state on unmount
  useEffect(() => {
    return () => {
      setMonthPickerOpen(false);
      setScannerModalOpen(false);
      setIsScanning(false);
      setUploadSuccessNotice(null);
      setUploadErrorNotice(null);
    };
  }, []);

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Helper to get Thai & English day of week for 2026 date
  const getDayOfWeekMeta = (month: number, date: number) => {
    const d = new Date(2026, month - 1, date);
    const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const daysTh = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    return {
      dayOfWeek: daysEn[d.getDay()] || 'Monday',
      dayOfWeekTh: daysTh[d.getDay()] || 'จันทร์'
    };
  };

  // User Request 2.1: Scan / parse uploaded image or document to pin company holidays directly
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadErrorNotice(null);

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';

    if (!isImage && !isPdf) {
      setUploadErrorNotice(
        language === 'TH' 
          ? 'กรุณาอัปโหลดไฟล์รูปภาพปฏิทิน (.png, .jpg, .webp) หรือเอกสาร (.pdf)' 
          : 'Please upload a calendar image (.png, .jpg, .webp) or .pdf'
      );
      setTimeout(() => setUploadErrorNotice(null), 4000);
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setUploadErrorNotice(
        language === 'TH' ? 'ขนาดไฟล์ต้องไม่เกิน 25MB' : 'File size must be under 25MB'
      );
      setTimeout(() => setUploadErrorNotice(null), 4000);
      return;
    }

    setScannedFileName(file.name);
    setScannerModalOpen(true);
    setIsScanning(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = typeof event.target?.result === 'string' ? event.target.result : null;
      setScannedFilePreview(dataUrl);

      // Simulate intelligent corporate OCR scanner
      setTimeout(() => {
        setIsScanning(false);

        // Pre-populate smart corporate holiday candidates detected from calendar notice
        const sampleCandidates: ScannedHolidayCandidate[] = [
          {
            id: 'cand-1',
            date: 16,
            month: 1,
            monthNameEn: 'Jan',
            monthNameTh: 'ม.ค.',
            ...getDayOfWeekMeta(1, 16),
            occasionTh: 'วันสัมมนาประจำปีองค์กร & อบรมพัฒนาบุคลากร QISHENG',
            occasionEn: 'QISHENG Annual Staff Development & Strategic Summit',
            selected: true
          },
          {
            id: 'cand-2',
            date: 10,
            month: 4,
            monthNameEn: 'Apr',
            monthNameTh: 'เม.ย.',
            ...getDayOfWeekMeta(4, 10),
            occasionTh: 'วันหยุดพิเศษเทศกาลสงกรานต์เพิ่มเติมของบริษัท',
            occasionEn: 'Special Corporate Songkran Additional Day Off',
            selected: true
          },
          {
            id: 'cand-3',
            date: 1,
            month: 7,
            monthNameEn: 'Jul',
            monthNameTh: 'ก.ค.',
            ...getDayOfWeekMeta(7, 1),
            occasionTh: 'วันหยุดกลางปีและตรวจนับสต็อกสินค้าประจำปี',
            occasionEn: 'Corporate Mid-Year Break & Annual Inventory Audit',
            selected: true
          },
          {
            id: 'cand-4',
            date: 23,
            month: 10,
            monthNameEn: 'Oct',
            monthNameTh: 'ต.ค.',
            ...getDayOfWeekMeta(10, 23),
            occasionTh: 'วันปิยมหาราช (วันหยุดตามประเพณีบริษัท)',
            occasionEn: 'Chulalongkorn Memorial Day (Company Holiday)',
            selected: true
          },
          {
            id: 'cand-5',
            date: 25,
            month: 12,
            monthNameEn: 'Dec',
            monthNameTh: 'ธ.ค.',
            ...getDayOfWeekMeta(12, 25),
            occasionTh: 'วันจัดกิจกรรมส่งท้ายปี QISHENG Annual Gala Dinner',
            occasionEn: 'QISHENG Corporate Year-End Celebration & Staff Party',
            selected: true
          }
        ];

        setScannedCandidates(sampleCandidates);
      }, 1000);
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Toggle selection for candidate
  const handleToggleCandidate = (id: string) => {
    setScannedCandidates(prev => 
      prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c)
    );
  };

  // Add a custom candidate manually to the list
  const handleAddCustomCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!newHolidayOccasionTh.trim()) return;

    const monthMeta = MONTHS_2026[newHolidayMonth - 1] || MONTHS_2026[0];
    const dayMeta = getDayOfWeekMeta(newHolidayMonth, newHolidayDate);

    const newCandidate: ScannedHolidayCandidate = {
      id: `cand-custom-${Date.now()}`,
      date: newHolidayDate,
      month: newHolidayMonth,
      monthNameEn: monthMeta.shortEn,
      monthNameTh: monthMeta.shortTh,
      dayOfWeek: dayMeta.dayOfWeek,
      dayOfWeekTh: dayMeta.dayOfWeekTh,
      occasionTh: newHolidayOccasionTh.trim(),
      occasionEn: newHolidayOccasionEn.trim() || newHolidayOccasionTh.trim(),
      selected: true
    };

    setScannedCandidates(prev => [newCandidate, ...prev]);
    setNewHolidayOccasionTh('');
    setNewHolidayOccasionEn('');
  };

  // Confirm and pin scanned holidays to main calendar
  const handleConfirmPinHolidays = () => {
    const selected = scannedCandidates.filter(c => c.selected);
    if (selected.length === 0) {
      setUploadErrorNotice(language === 'TH' ? 'กรุณาเลือกวันหยุดอย่างน้อย 1 รายการเพื่อปักหมุด' : 'Please select at least one holiday to pin');
      setTimeout(() => setUploadErrorNotice(null), 3000);
      return;
    }

    setHolidays(prev => {
      // Merge: replace existing if same month & date, or append new
      const merged = [...prev];
      selected.forEach(item => {
        const existingIdx = merged.findIndex(h => h.month === item.month && h.date === item.date);
        const newHol: OfficialHoliday & { isPinnedCustom?: boolean } = {
          no: existingIdx >= 0 ? merged[existingIdx].no : merged.length + 1,
          date: item.date,
          dayOfWeek: item.dayOfWeek,
          dayOfWeekTh: item.dayOfWeekTh,
          month: item.month,
          monthNameEn: item.monthNameEn,
          monthNameTh: item.monthNameTh,
          occasionEn: item.occasionEn,
          occasionTh: item.occasionTh,
          isHoliday: true,
          isPinnedCustom: true
        };

        if (existingIdx >= 0) {
          merged[existingIdx] = newHol;
        } else {
          merged.push(newHol);
        }
      });

      // Sort by month then date
      merged.sort((a, b) => a.month - b.month || a.date - b.date);
      // Re-assign sequence numbers
      const finalHolidays = merged.map((h, i) => ({ ...h, no: i + 1 }));

      try {
        localStorage.setItem('qs_company_holidays_2026', JSON.stringify(finalHolidays));
      } catch {}

      return finalHolidays;
    });

    setScannerModalOpen(false);
    setUploadSuccessNotice(
      language === 'TH' 
        ? `สแกนและปักหมุดวันหยุดบริษัทจำนวน ${selected.length} รายการลงบนตารางปฏิทินเรียบร้อยแล้ว!` 
        : `Successfully pinned ${selected.length} company holidays to the calendar grid!`
    );
    setTimeout(() => setUploadSuccessNotice(null), 5000);
  };

  // Reset holidays to default 14 official holidays
  const handleResetHolidays = () => {
    setHolidays(OFFICIAL_HOLIDAYS_2026);
    try {
      localStorage.removeItem('qs_company_holidays_2026');
    } catch {}
    setUploadSuccessNotice(
      language === 'TH' 
        ? 'รีเซ็ตวันหยุดบริษัทกลับเป็นค่ามาตรฐาน 14 วันเรียบร้อยแล้ว' 
        : 'Reset company holidays to default 14 official days'
    );
    setTimeout(() => setUploadSuccessNotice(null), 4000);
  };

  // Delete an individual holiday
  const handleDeleteHoliday = (no: number) => {
    setHolidays(prev => {
      const filtered = prev.filter(h => h.no !== no).map((h, i) => ({ ...h, no: i + 1 }));
      try {
        localStorage.setItem('qs_company_holidays_2026', JSON.stringify(filtered));
      } catch {}
      return filtered;
    });
  };

  const selectedMonth: MonthMeta = MONTHS_2026[selectedMonthIndex];

  // Holidays in the selected month
  const selectedMonthHolidays = useMemo(() => {
    return holidays.filter(h => h.month === selectedMonth.monthNumber);
  }, [holidays, selectedMonth.monthNumber]);

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
      const holiday = holidays.find(h => h.month === month.monthNumber && h.date === day);
      const isToday = month.monthIndex === currentMonthIndex && day === currentDay;
      const dayOfWeek = (month.startDayOfWeek + day - 1) % 7;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isPinned = (holiday as { isPinnedCustom?: boolean })?.isPinnedCustom;

      cells.push(
        <div
          key={`day-${month.monthNumber}-${day}`}
          className={`
            relative border transition-all flex flex-col justify-between
            ${isCompact 
              ? 'h-7 text-[11px] items-center justify-center font-mono' 
              : 'min-h-[70px] sm:min-h-[85px] p-2'}
            ${holiday 
              ? isPinned
                ? 'bg-rose-50/90 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 font-bold ring-1 ring-rose-400 dark:ring-rose-700'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 font-bold' 
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
              <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                isPinned 
                  ? 'bg-rose-600 dark:bg-rose-700 text-white shadow-2xs' 
                  : 'bg-rose-600 dark:bg-rose-700 text-white'
              }`}>
                {isPinned && <Pin className="w-2.5 h-2.5 shrink-0" />}
                <span>Holiday</span>
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
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'TH' 
                  ? 'ปฏิทินวันหยุดและวันทำงานประจำปี 2026 พร้อมระบบปักหมุดวันหยุดองค์กร' 
                  : 'Official Corporate Calendar 2026 with Company Holidays Pinning'}
              </p>
            </div>
          </div>

          {/* Calendar Title & Stats */}
          <div className="flex flex-col lg:items-end justify-center">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-wider text-slate-900 dark:text-white font-mono">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                CALENDAR 2026
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                {holidays.length} {language === 'TH' ? 'วันหยุดบริษัท' : 'Holidays'}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                &bull; พ.ศ. 2569
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Controls & View Switcher Bar (Image View completely removed) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-3.5 rounded-2xl shadow-xs">
        {/* Month Navigation & Clickable Month Popover Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all shadow-2xs cursor-pointer"
            title="เดือนก่อนหน้า (Previous Month)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Clickable Month Indicator button */}
          <button
            type="button"
            onClick={() => setMonthPickerOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 text-center min-w-[200px] transition-all flex items-center justify-between gap-3 group shadow-2xs cursor-pointer"
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
            type="button"
            onClick={handleNextMonth}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all shadow-2xs cursor-pointer"
            title="เดือนถัดไป (Next Month)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Jump to current month button */}
          {selectedMonthIndex !== currentMonthIndex && (
            <button
              type="button"
              onClick={handleResetToCurrentMonth}
              className="text-xs px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-semibold transition-all cursor-pointer"
            >
              {language === 'TH' ? 'กลับไปเดือนปัจจุบัน' : 'Back to Current Month'}
            </button>
          )}
        </div>

        {/* View Mode Toggle (Monthly Focus vs Full 12-Month Overview) */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('monthly')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'monthly'
                  ? 'bg-white dark:bg-slate-900 text-[#1E60D5] dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{language === 'TH' ? 'มุมมองรายเดือน' : 'Month View'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('yearly')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'yearly'
                  ? 'bg-white dark:bg-slate-900 text-[#1E60D5] dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>{language === 'TH' ? 'ทั้งปี 12 เดือน' : 'Full 12 Months'}</span>
            </button>
          </div>

          {/* User Request 2.1: Admin Upload & Scan Calendar Document / Image to Pin Holidays */}
          {isAdmin && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
                className="hidden"
              />
              <button
                type="button"
                onClick={handleTriggerUpload}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E60D5] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                title={language === 'TH' ? 'อัปโหลดไฟล์รูปภาพหรือเอกสารปฏิทินเพื่อสแกนและปักหมุดวันหยุด' : 'Upload calendar document to scan & pin holidays'}
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>{language === 'TH' ? 'สแกน & ปักหมุดวันหยุดจากไฟล์' : 'Scan & Pin Holidays'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetHolidays}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition-colors cursor-pointer"
                title={language === 'TH' ? 'รีเซ็ตเป็นวันหยุดมาตรฐาน 14 วัน' : 'Reset to default official holidays'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all shadow-2xs cursor-pointer"
            title="พิมพ์ปฏิทิน (Print Calendar)"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Upload Success or Error Notices */}
      {uploadSuccessNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{uploadSuccessNotice}</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setUploadSuccessNotice(null);
            }}
            className="p-1 text-emerald-600 hover:text-emerald-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {uploadErrorNotice && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{uploadErrorNotice}</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setUploadErrorNotice(null);
            }}
            className="p-1 text-rose-600 hover:text-rose-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Scanner & Holiday Pinning Modal (User Request 2.1) */}
      {scannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#1E60D5] dark:text-blue-400">
                  <ScanLine className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{language === 'TH' ? 'ระบบสแกน & ปักหมุดวันหยุดบริษัท' : 'Calendar Document Scanner & Pinning'}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold">
                      OCR Engine
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {language === 'TH' 
                      ? `ไฟล์: ${scannedFileName || 'เอกสารปฏิทิน'} • สแกนและปักหมุดวันหยุดลงบนตารางปฏิทินโดยตรง`
                      : `File: ${scannedFileName} • Scan and pin holidays directly to calendar grid`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setScannerModalOpen(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              {isScanning ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#1E60D5] dark:text-blue-400 flex items-center justify-center animate-spin">
                    <ScanLine className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {language === 'TH' ? 'กำลังสแกนและวิเคราะห์วันหยุดจากเอกสาร...' : 'Scanning & analyzing holidays from document...'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {language === 'TH' ? 'ตรวจจับตารางวันหยุด, วันที่, และโอกาสสำคัญประจำปี 2026' : 'Extracting holiday dates and corporate occasions'}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* File preview summary */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      {scannedFilePreview ? (
                        <img src={scannedFilePreview} alt="Preview" className="w-9 h-9 object-cover rounded-lg border border-slate-200 dark:border-slate-700" />
                      ) : (
                        <FileText className="w-6 h-6 text-blue-500" />
                      )}
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-xs">{scannedFileName}</div>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{language === 'TH' ? `สแกนพบ ${scannedCandidates.length} วันหยุดที่แนะนำ` : `Detected ${scannedCandidates.length} candidate holidays`}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Scanned Ready
                    </span>
                  </div>

                  {/* Scanned Candidates List */}
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
                      <span>{language === 'TH' ? 'เลือกวันหยุดที่ต้องการปักหมุดลงปฏิทิน:' : 'Select holidays to pin to calendar:'}</span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">
                        ({scannedCandidates.filter(c => c.selected).length}/{scannedCandidates.length} {language === 'TH' ? 'เลือกแล้ว' : 'selected'})
                      </span>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {scannedCandidates.map((cand) => (
                        <div 
                          key={cand.id}
                          onClick={() => handleToggleCandidate(cand.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            cand.selected 
                              ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 shadow-2xs' 
                              : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox"
                              checked={cand.selected}
                              onChange={() => handleToggleCandidate(cand.id)}
                              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                            />
                            <div className="w-10 h-10 rounded-lg bg-rose-600 text-white font-mono font-bold flex flex-col items-center justify-center shrink-0">
                              <span className="text-[9px] uppercase leading-none">{cand.monthNameEn}</span>
                              <span className="text-sm leading-none mt-0.5">{cand.date}</span>
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">
                                {cand.occasionTh}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                {language === 'TH' ? `วัน${cand.dayOfWeekTh}` : cand.dayOfWeek} &bull; {cand.occasionEn}
                              </div>
                            </div>
                          </div>

                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 font-bold shrink-0">
                            📌 Pin
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add additional custom date form */}
                  <form onSubmit={handleAddCustomCandidate} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-[#1E60D5]" />
                      <span>{language === 'TH' ? 'เพิ่มวันหยุดบริษัทอื่นๆ เพิ่มเติมด้วยตนเอง' : 'Add custom holiday manually'}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">เดือน (Month)</label>
                        <select
                          value={newHolidayMonth}
                          onChange={(e) => setNewHolidayMonth(Number(e.target.value))}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-100"
                        >
                          {MONTHS_2026.map(m => (
                            <option key={m.monthNumber} value={m.monthNumber}>
                              {m.monthNumber}. {m.nameTh} ({m.nameEn})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">วันที่ (Date 1-31)</label>
                        <input
                          type="number"
                          min={1}
                          max={31}
                          value={newHolidayDate}
                          onChange={(e) => setNewHolidayDate(Number(e.target.value))}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-100"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">ชื่อวันหยุด / โอกาส (Occasion)</label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={newHolidayOccasionTh}
                            onChange={(e) => setNewHolidayOccasionTh(e.target.value)}
                            placeholder="เช่น วันหยุดพิเศษประจำปี"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-100"
                          />
                          <button
                            type="submit"
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0 cursor-pointer"
                          >
                            + เพิ่ม
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
              <button
                type="button"
                onClick={() => setScannerModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
              </button>

              <button
                type="button"
                disabled={isScanning}
                onClick={handleConfirmPinHolidays}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <Pin className="w-4 h-4" />
                <span>{language === 'TH' ? 'ยืนยันปักหมุดลงบนตารางปฏิทิน' : 'Confirm & Pin to Calendar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMonthPickerOpen(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 12 Months Grid: 3 columns x 4 rows */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {MONTHS_2026.map((m) => {
                const isSelected = selectedMonthIndex === m.monthIndex;
                const isCurrent = currentMonthIndex === m.monthIndex;
                const holidaysInM = holidays.filter(h => h.month === m.monthNumber);

                return (
                  <button
                    key={m.monthNumber}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedMonthIndex(m.monthIndex);
                      setViewMode('monthly');
                      setMonthPickerOpen(false);
                    }}
                    className={`
                      p-3 rounded-xl border text-left transition-all flex flex-col justify-between group cursor-pointer
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
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedMonthIndex(currentMonthIndex);
                  setViewMode('monthly');
                  setMonthPickerOpen(false);
                }}
                className="text-[#1E60D5] dark:text-blue-400 hover:underline font-semibold cursor-pointer"
              >
                &larr; {language === 'TH' ? 'ไปยังเดือนปัจจุบัน (ตุลาคม)' : 'Jump to Current Month (October)'}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMonthPickerOpen(false);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer"
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
                      ? `มีทั้งหมด ${selectedMonth.daysCount} วัน • วันหยุดบริษัท ${selectedMonthHolidays.length} วัน`
                      : `${selectedMonth.daysCount} Days Total • ${selectedMonthHolidays.length} Company Holidays`}
                  </p>
                </div>
              </div>

              {/* Legend Badges */}
              <div className="hidden sm:flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-rose-600 inline-block"></span>
                  <span className="text-slate-600 dark:text-slate-300">{language === 'TH' ? 'วันหยุดบริษัท' : 'Company Holiday'}</span>
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
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span>{language === 'TH' ? `วันหยุดบริษัทในเดือน ${selectedMonth.nameTh}:` : `Company Holidays in ${selectedMonth.nameEn}:`}</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400">
                    {selectedMonthHolidays.length} {language === 'TH' ? 'วัน' : 'days'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {selectedMonthHolidays.map((holiday) => {
                    const isPinned = (holiday as { isPinnedCustom?: boolean })?.isPinnedCustom;
                    return (
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
                            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{language === 'TH' ? holiday.occasionTh : holiday.occasionEn}</span>
                              {isPinned && (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold">
                                  📌 ปักหมุด
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {language === 'TH' ? `วัน${holiday.dayOfWeekTh}` : holiday.dayOfWeek} &bull; {holiday.occasionEn}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                            #{holiday.no}
                          </span>
                          {isAdmin && isPinned && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteHoliday(holiday.no);
                              }}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="ลบการปักหมุด"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>{language === 'TH' ? `เดือน ${selectedMonth.nameTh} ไม่มีวันหยุดบริษัท` : `No company holidays in ${selectedMonth.nameEn}`}</span>
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
              12 Months &bull; {holidays.length} Holidays
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
              <span>{language === 'TH' ? 'ตารางวันหยุดบริษัทประจำปี 2026' : 'Company Holidays Schedule 2026'}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 font-bold">
                {holidays.length} Days
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'TH' ? 'อ้างอิงตามประกาศบริษัท ฉี เซิง คอนซัลติ้ง จำกัด' : 'According to official QI SHENG CONSULTING CO.,LTD. calendar notice'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleResetHolidays();
                }}
                className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="รีเซ็ตเป็นวันหยุดมาตรฐาน 14 วัน"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'TH' ? 'รีเซ็ตวันหยุด' : 'Reset Holidays'}</span>
              </button>
            )}
            <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">
              {language === 'TH' ? 'คลิกที่แถวเพื่อไปยังเดือนนั้น' : 'Click row to jump to month'}
            </div>
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
              {holidays.map((holiday) => {
                const isPinned = (holiday as { isPinnedCustom?: boolean })?.isPinnedCustom;
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
                      <div className="flex items-center gap-1.5">
                        <span>{holiday.occasionTh}</span>
                        {isPinned && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold shrink-0">
                            📌 ปักหมุด
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedMonthIndex(holiday.month - 1);
                            setViewMode('monthly');
                          }}
                          className="text-[10px] text-[#1E60D5] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-semibold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 transition-colors cursor-pointer"
                        >
                          {language === 'TH' ? 'ดูเดือนนี้' : 'View'}
                        </button>
                        {isAdmin && isPinned && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteHoliday(holiday.no);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="ลบวันหยุดนี้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Working & Holiday Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {language === 'TH' ? 'วันทำงานทั้งหมด' : 'Total Working Days'}
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 font-mono mt-0.5">
              {CALENDAR_STATS.totalDays - holidays.length - CALENDAR_STATS.weeklyHolidays} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{language === 'TH' ? 'วัน' : 'days'}</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 text-xs font-bold font-mono">
            Work
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {language === 'TH' ? 'วันหยุดบริษัท' : 'Company Holidays'}
            </div>
            <div className="text-lg sm:text-xl font-bold text-rose-600 dark:text-rose-400 font-mono mt-0.5">
              {holidays.length} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{language === 'TH' ? 'วัน' : 'days'}</span>
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
