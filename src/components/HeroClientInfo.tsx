import React from 'react';
import { CalendarDays } from 'lucide-react';
import { UserProfile } from '../types';
import { CORPORATE_BUILDING_BANNER } from '../data/portalData';

interface HeroClientInfoProps {
  currentUser: UserProfile;
  language: 'TH' | 'EN';
  machineInfo?: any;
  isLoading?: boolean;
  onRefreshInfo?: () => void;
  onUpdateLocalIp?: (ip: string) => void;
  onUpdateDeviceName?: (deviceName: string) => void;
}

export const HeroClientInfo: React.FC<HeroClientInfoProps> = ({
  currentUser,
  language
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === 'TH') {
      if (hour < 12) return 'สวัสดีตอนเช้า';
      if (hour < 18) return 'สวัสดีตอนบ่าย';
      return 'สวัสดีตอนเย็น';
    }
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = new Date().toLocaleDateString(language === 'TH' ? 'th-TH' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden mb-6">
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

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex flex-wrap items-center gap-2">
              <span>{language === 'TH' ? 'สวัสดี,' : getGreeting() + ','}</span>
              <span className="text-blue-100 underline decoration-blue-300/60 underline-offset-4">
                {language === 'TH' ? `คุณ ${currentUser.name.split(' ')[0]}` : currentUser.name}
              </span>
            </h1>

            {/* Clean Welcome text without user role/permission info */}
            <p className="text-blue-100 text-xs sm:text-sm mt-1.5 max-w-xl font-normal opacity-95">
              {language === 'TH'
                ? 'ยินดีต้อนรับสู่ระบบอินทราเน็ตกลาง บริษัท ฉีเชิ่ง จำกัด'
                : 'Welcome to Qisheng Group Employee Digital Portal'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
