import React from 'react';
import { Sun, Calendar as CalendarIcon } from 'lucide-react';
import { UserProfile } from '../types';
import { QISHENG_LOGO, CORPORATE_OFFICE_FACADE } from '../data/portalData';

interface HeroGreetingBannerProps {
  currentUser: UserProfile;
  language: 'TH' | 'EN';
}

export const HeroGreetingBanner: React.FC<HeroGreetingBannerProps> = ({ currentUser, language }) => {
  // Format Thai date or English date
  const today = new Date();
  const thaiDays = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  
  // Format: "วันพฤหัสบดีที่ 18 กันยายน 2025" or custom
  const formattedDateTh = `${thaiDays[today.getDay()]}ที่ ${today.getDate()} ${thaiMonths[today.getMonth()]} ${today.getFullYear()}`;
  const formattedDateEn = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Extract first name
  const firstName = (language === 'TH' && currentUser.nameTh)
    ? currentUser.nameTh.split(' ')[0]
    : currentUser.name.split(' ')[0];

  return (
    <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch justify-between">
      {/* Left Greeting Content */}
      <div className="p-6 sm:p-7 md:pr-4 flex-1 flex flex-col justify-between z-10">
        <div>
          {/* Sun icon + Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-500 shrink-0">
              <Sun className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {language === 'TH' ? `สวัสดี, คุณ ${firstName}` : `Welcome back, ${firstName}`}
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-normal">
            {language === 'TH' 
              ? 'ขอให้วันนี้เป็นวันที่ดี และมีประสิทธิภาพในการทำงานนะครับ' 
              : 'Wishing you a productive and successful working day.'}
          </p>
        </div>

        {/* Date Row / Chip */}
        <div className="mt-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600 font-medium">
            <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'TH' ? formattedDateTh : formattedDateEn}</span>
          </div>
        </div>
      </div>

      {/* Right Modern Glass Corporate Architecture with QISHENG AI Platform Badge */}
      <div className="relative w-full md:w-[320px] lg:w-[380px] h-48 md:h-auto min-h-[160px] overflow-hidden shrink-0">
        {/* Modern Corporate Office Building Photo */}
        <img 
          src={CORPORATE_OFFICE_FACADE} 
          alt="QISHENG Corporate Headquarters" 
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />

        {/* Soft edge fade into white on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent hidden md:block w-24"></div>

        {/* Brand Badge on Top Right */}
        <div className="absolute top-4 right-4 flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-white/80 shadow-md">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm overflow-hidden p-0.5">
            <img 
              src={QISHENG_LOGO} 
              alt="Logo" 
              className="w-full h-full object-cover rounded-md"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="font-extrabold text-[13px] tracking-tight text-slate-900">QISHENG</span>
            <span className="text-[9px] font-semibold text-blue-600 tracking-wider uppercase">AI Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
};
