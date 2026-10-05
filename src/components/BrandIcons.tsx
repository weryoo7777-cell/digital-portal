import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const ExpressIcon: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`${className} rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-extrabold shadow-sm select-none`}>
    <span className="text-sm tracking-tighter italic font-sans font-black">ex</span>
  </div>
);

export const DataForgeOcrIcon: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`${className} rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-sm`}>
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <circle cx="12" cy="12" r="7" strokeDasharray="3 3" />
    </svg>
  </div>
);

export const RdEfilingIcon: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`${className} rounded-xl bg-gradient-to-br from-sky-600 to-blue-800 flex items-center justify-center text-white shadow-sm`}>
    <div className="flex flex-col items-center justify-center leading-none">
      <svg className="w-4 h-4 mb-0.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7v2h20V7L12 2zm-8 8v9h3v-9H4zm5 0v9h3v-9H9zm5 0v9h3v-9h-3zm5 0v9h3v-9h-3zM2 20v2h20v-2H2z" />
      </svg>
      <span className="text-[8px] font-black tracking-tighter">RD</span>
    </div>
  </div>
);

export const GoogleDriveIcon: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`${className} rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shadow-sm p-1.5`}>
    <svg className="w-full h-full" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
      <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
      <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
      <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
      <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
      <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
    </svg>
  </div>
);

export const GmailIcon: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`${className} rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shadow-sm p-1.5`}>
    <svg className="w-full h-full" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22 6.5l-10 7L2 6.5V19c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6.5z" />
      <path fill="#EA4335" d="M2 5v1.5l10 7 10-7V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2z" />
      <path fill="#FBBC05" d="M2 5l10 7V3H4C2.9 3 2 3.9 2 5z" />
      <path fill="#34A853" d="M22 5c0-1.1-.9-2-2-2h-8v9l10-7z" />
    </svg>
  </div>
);

export const RouterIcon: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`${className} rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-sm`}>
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <path d="M6 18h.01" />
      <path d="M10 18h.01" />
      <path d="M14 18h.01" />
      <path d="M18 18h.01" />
      <path d="M6 14V6" />
      <path d="M18 14V6" />
      <circle cx="6" cy="5" r="1" fill="currentColor" />
      <circle cx="18" cy="5" r="1" fill="currentColor" />
    </svg>
  </div>
);
