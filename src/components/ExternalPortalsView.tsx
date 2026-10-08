import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  ShieldCheck, 
  Landmark, 
  Receipt, 
  CreditCard, 
  Ship, 
  Sparkles,
  Info,
  ArrowUpRight,
  Lock,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  X
} from 'lucide-react';
import { EXTERNAL_PORTALS, ExternalPortalItem } from '../data/externalPortalsData';
import { centralSyncService } from '../services/centralSyncService';

interface ExternalPortalsViewProps {
  language: 'TH' | 'EN';
  onOpenGoogleSearchWithQuery?: (q: string) => void;
  onLaunchPortal?: (portal: ExternalPortalItem) => void;
}

// Dedicated component for displaying official agency/bank logo with Google Favicon service & high-res vector fallbacks
const PortalLogo: React.FC<{ 
  portal: ExternalPortalItem; 
  fallbackIcon: React.ComponentType<{ className?: string }>;
}> = ({ portal, fallbackIcon: FallbackIcon }) => {
  const [imageError, setImageError] = useState(false);

  // Extract cleanest domain/URL for Google Favicon service
  const faviconUrl = useMemo(() => {
    if (portal.logoUrl) return portal.logoUrl;
    try {
      const hostname = new URL(portal.url).hostname;
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
    } catch {
      return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(portal.url)}&sz=128`;
    }
  }, [portal.logoUrl, portal.url]);

  // Brand-specific fallback vector emblems for Thai agencies and banks
  const renderFallback = () => {
    switch (portal.id) {
      case 'bank-kbank':
        return (
          <div className="w-full h-full rounded-lg bg-[#00A950] flex items-center justify-center text-white font-black select-none shadow-2xs">
            <span className="text-base tracking-tighter font-sans font-extrabold">K</span>
          </div>
        );
      case 'bank-scb':
        return (
          <div className="w-full h-full rounded-lg bg-[#4E2A84] flex items-center justify-center text-white font-black select-none shadow-2xs">
            <span className="text-[11px] tracking-tight font-sans font-bold">SCB</span>
          </div>
        );
      case 'bank-bbl':
        return (
          <div className="w-full h-full rounded-lg bg-[#1E3A8A] flex items-center justify-center text-white font-black select-none shadow-2xs">
            <span className="text-[11px] tracking-tight font-sans font-bold text-amber-300">BBL</span>
          </div>
        );
      case 'bank-ktb':
        return (
          <div className="w-full h-full rounded-lg bg-[#00A3E0] flex items-center justify-center text-white font-black select-none shadow-2xs">
            <span className="text-[11px] tracking-tight font-sans font-bold">KTB</span>
          </div>
        );
      case 'bank-ttb':
        return (
          <div className="w-full h-full rounded-lg bg-[#002D62] flex items-center justify-center text-white font-black select-none shadow-2xs">
            <span className="text-xs tracking-tighter font-sans font-extrabold text-white">t<span className="text-[#F37021]">tb</span></span>
          </div>
        );
      case 'bank-bay':
        return (
          <div className="w-full h-full rounded-lg bg-[#FECB00] flex items-center justify-center text-[#333333] font-black select-none shadow-2xs">
            <span className="text-[11px] tracking-tight font-sans font-extrabold">BAY</span>
          </div>
        );
      case 'gov-rd-efiling':
      case 'gov-rd-etax':
        return (
          <div className="w-full h-full rounded-lg bg-gradient-to-br from-sky-600 to-blue-800 flex items-center justify-center text-white font-black select-none shadow-2xs">
            <span className="text-[11px] tracking-tight font-sans font-extrabold">RD</span>
          </div>
        );
      case 'gov-dbd-datawarehouse':
      case 'gov-dbd-ereg':
        return (
          <div className="w-full h-full rounded-lg bg-[#002D62] flex items-center justify-center text-amber-300 font-black select-none shadow-2xs">
            <span className="text-[11px] tracking-tight font-sans font-extrabold">DBD</span>
          </div>
        );
      case 'gov-sso-eservice':
        return (
          <div className="w-full h-full rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white font-black select-none shadow-2xs">
            <span className="text-[10px] tracking-tight font-sans font-extrabold">สปส</span>
          </div>
        );
      case 'gov-customs-nsw':
        return (
          <div className="w-full h-full rounded-lg bg-gradient-to-br from-teal-700 to-slate-900 flex items-center justify-center text-white font-black select-none shadow-2xs">
            <span className="text-[10px] tracking-tight font-sans font-extrabold">NSW</span>
          </div>
        );
      case 'gov-doe-workpermit':
        return (
          <div className="w-full h-full rounded-lg bg-gradient-to-br from-purple-700 to-indigo-900 flex items-center justify-center text-white font-black select-none shadow-2xs">
            <span className="text-[10px] tracking-tight font-sans font-extrabold">DOE</span>
          </div>
        );
      case 'gov-dft-eservice':
        return (
          <div className="w-full h-full rounded-lg bg-gradient-to-br from-sky-600 to-blue-800 flex items-center justify-center text-white font-black select-none shadow-2xs">
            <span className="text-[11px] tracking-tight font-sans font-extrabold">DFT</span>
          </div>
        );
      case 'fin-bot-fx':
        return (
          <div className="w-full h-full rounded-lg bg-[#0B2545] flex items-center justify-center text-amber-300 font-black select-none shadow-2xs">
            <span className="text-[10px] tracking-tight font-sans font-extrabold">BOT</span>
          </div>
        );
      case 'fin-setlink':
        return (
          <div className="w-full h-full rounded-lg bg-[#231F20] flex items-center justify-center text-[#FDB913] font-black select-none shadow-2xs">
            <span className="text-[11px] tracking-tight font-sans font-extrabold">SET</span>
          </div>
        );
      default:
        return (
          <div className="w-full h-full rounded-lg bg-blue-50 text-[#1E60D5] flex items-center justify-center">
            <FallbackIcon className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-center p-1.5 shrink-0 overflow-hidden group-hover:border-blue-400 dark:group-hover:border-blue-500 group-hover:shadow-xs transition-all">
      {!imageError ? (
        <img
          src={faviconUrl}
          alt={portal.agencyTh}
          className="w-full h-full object-contain"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : (
        renderFallback()
      )}
    </div>
  );
};

export const ExternalPortalsView: React.FC<ExternalPortalsViewProps> = ({
  language,
  onOpenGoogleSearchWithQuery,
  onLaunchPortal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', labelTh: 'ทั้งหมด', labelEn: 'All Portals', count: EXTERNAL_PORTALS.length },
    { 
      id: 'gov-tax', 
      labelTh: 'ภาษี & ราชการ', 
      labelEn: 'Tax & Government',
      count: EXTERNAL_PORTALS.filter(p => p.category === 'gov-tax').length 
    },
    { 
      id: 'banking', 
      labelTh: 'ธนาคาร & การเงินองค์กร', 
      labelEn: 'Corporate Banking',
      count: EXTERNAL_PORTALS.filter(p => p.category === 'banking').length 
    },
    { 
      id: 'corporate-dbd', 
      labelTh: 'ข้อมูลนิติบุคคล & DBD', 
      labelEn: 'Corporate & DBD Registry',
      count: EXTERNAL_PORTALS.filter(p => p.category === 'corporate-dbd').length 
    },
    { 
      id: 'customs-trade', 
      labelTh: 'ศุลกากร & การค้าต่างประเทศ', 
      labelEn: 'Customs & Trade',
      count: EXTERNAL_PORTALS.filter(p => p.category === 'customs-trade').length 
    },
  ];

  const filteredPortals = useMemo(() => {
    return EXTERNAL_PORTALS.filter((portal) => {
      const matchesCategory = selectedCategory === 'all' || portal.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        portal.name.toLowerCase().includes(q) ||
        portal.nameTh.toLowerCase().includes(q) ||
        portal.agency.toLowerCase().includes(q) ||
        portal.agencyTh.toLowerCase().includes(q) ||
        portal.descriptionTh.toLowerCase().includes(q) ||
        portal.descriptionEn.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const getCategoryIcon = (category: ExternalPortalItem['category']) => {
    switch (category) {
      case 'gov-tax': return Receipt;
      case 'banking': return CreditCard;
      case 'corporate-dbd': return Building2;
      case 'customs-trade': return Ship;
      default: return Landmark;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto pb-12">
      {/* Filter and Search Bar: Only Filter Button and ทั้งหมด */}
      <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 relative ${filterDropdownOpen ? 'z-40' : 'z-20'}`}>
        {/* Left: Icon-Only Filter Button & ทั้งหมด only (ไม่มีหัวข้ออื่น) */}
        <div className="flex items-center gap-2">
          {/* ปุ่มกรองมีแค่รูป (Icon-only Filter Button) with high z-index and click-outside backdrop */}
          <div className="relative z-50">
            <button
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className={`w-9 h-9 rounded-xl border transition-all shadow-2xs flex items-center justify-center shrink-0 relative ${
                selectedCategory !== 'all'
                  ? 'bg-[#1E60D5] text-white border-[#1E60D5] shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title={
                selectedCategory !== 'all'
                  ? `${language === 'TH' ? 'ตัวกรอง:' : 'Filter:'} ${categories.find(c => c.id === selectedCategory)?.labelTh}`
                  : (language === 'TH' ? 'ตัวกรอง' : 'Filter')
              }
              aria-label="Filter"
            >
              <Filter className="w-4 h-4" />
              {selectedCategory !== 'all' && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Click outside backdrop */}
            {filterDropdownOpen && (
              <div 
                className="fixed inset-0 z-[90]" 
                onClick={() => setFilterDropdownOpen(false)} 
              />
            )}

            {/* Filter Dropdown Menu - rendered in front with high z-index */}
            {filterDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 z-[100] w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl dark:shadow-slate-950/80 p-2.5 animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {language === 'TH' ? 'เลือกหมวดหมู่ที่ต้องการกรอง' : 'Select Category to Filter'}
                </div>
                <div className="space-y-1 mt-1 max-h-80 overflow-y-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setFilterDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
                        selectedCategory === cat.id
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{language === 'TH' ? cat.labelTh : cat.labelEn}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        selectedCategory === cat.id
                          ? 'bg-[#1E60D5] text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ปุ่มแสดงชื่อหมวดหมู่ที่เลือก (ถ้าเลือกทั้งหมดจะโชว์ทั้งหมด ถ้าเลือกเมนูอื่นจะเปลี่ยนชื่อเป็นเมนูนั้น) */}
          {(() => {
            const currentCat = categories.find(c => c.id === selectedCategory) || categories[0];
            return (
              <button
                onClick={() => {
                  if (selectedCategory !== 'all') {
                    setSelectedCategory('all');
                  }
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 bg-[#1E60D5] text-white shadow-2xs"
                title={selectedCategory !== 'all' ? (language === 'TH' ? 'คลิกเพื่อกลับไปแสดงทั้งหมด' : 'Click to reset to all') : undefined}
              >
                <span>{language === 'TH' ? currentCat.labelTh : currentCat.labelEn}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-blue-800 text-white">
                  {currentCat.count}
                </span>
              </button>
            );
          })()}
        </div>

        {/* Search input */}
        <div className="relative min-w-[200px] sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'TH' ? 'ค้นหาหน่วยงาน, ธนาคาร...' : 'Filter portals...'}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#1E60D5] dark:focus:border-blue-500 transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* Corporate Guidance Banner */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300 shadow-2xs">
        <Info className="w-4 h-4 text-[#1E60D5] dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="flex-1 leading-relaxed">
          <span className="font-bold text-slate-900 dark:text-white">
            {language === 'TH' ? 'คำแนะนำด้านความปลอดภัยสำหรับพนักงาน:' : 'Corporate Security Guidance:'}
          </span>{' '}
          {language === 'TH'
            ? 'การเข้าใช้งานระบบธนาคารองค์กรและยื่นภาษีออนไลน์ ให้ตรวจสอบสัญลักษณ์แม่กุญแจ (HTTPS) และใช้ Token / อุปกรณ์ 2FA ประจำตัวของแผนก ห้ามบันทึกรหัสผ่านในเบราว์เซอร์สาธารณะโดยเด็ดขาด'
            : 'Always verify TLS certificates (HTTPS) before entering credentials. Corporate banking accounts require 2-Factor Authentication tokens. Never share department credentials.'}
        </div>
      </div>

      {/* Grid of External Portals */}
      {filteredPortals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredPortals.map((portal) => {
            const Icon = getCategoryIcon(portal.category);
            return (
              <div
                key={portal.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500 p-4 flex flex-col justify-between transition-all hover:shadow-md dark:hover:shadow-slate-950/60 group shadow-2xs"
              >
                <div>
                  {/* Top Row: Official Favicon/Logo & Category badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <PortalLogo portal={portal} fallbackIcon={Icon} />

                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${portal.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'} dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700`}>
                          {portal.badge || portal.agency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Title & Agency */}
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#1E60D5] dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {language === 'TH' ? portal.nameTh : portal.name}
                  </h3>
                  <div className="text-[11px] text-[#1E60D5] dark:text-blue-400 font-semibold mt-0.5 truncate">
                    {language === 'TH' ? portal.agencyTh : portal.agency}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {language === 'TH' ? portal.descriptionTh : portal.descriptionEn}
                  </p>

                  {/* Security Requirement note */}
                  {portal.securityNote && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-300 font-mono bg-slate-50 dark:bg-slate-800/80 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                      <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                      <span className="truncate">{portal.securityNote}</span>
                    </div>
                  )}
                </div>

                {/* Bottom: URL Link & Launch Button (เข้าระบบ ↗) */}
                <div className="pt-3.5 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate max-w-[140px] sm:max-w-[170px]" title={portal.url}>
                    {portal.url.replace(/^https?:\/\//, '')}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      centralSyncService.recordActivityLog({
                        appId: portal.id,
                        appName: portal.name,
                        appNameTh: portal.nameTh,
                        appUrl: portal.url,
                        category: 'external',
                        status: 'redirected',
                        action: 'External Portal Redirect'
                      });
                      if (onLaunchPortal) {
                        onLaunchPortal(portal);
                      }
                      window.open(portal.url, '_blank', 'noopener,noreferrer');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-[#1E60D5] dark:hover:bg-[#1E60D5] text-[#1E60D5] dark:text-blue-300 hover:text-white text-xs font-bold transition-all shadow-2xs group/btn shrink-0 cursor-pointer"
                  >
                    <span>{language === 'TH' ? 'เข้าระบบ' : 'Launch'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2.5">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {language === 'TH' ? 'ไม่พบลิงก์ระบบราชการหรือธนาคารที่ตรงกับตัวกรอง' : 'No corporate portals match the current filter.'}
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="text-xs text-[#1E60D5] dark:text-blue-400 font-bold hover:underline"
          >
            {language === 'TH' ? 'ล้างตัวกรองเพื่อแสดงทั้งหมด' : 'Reset filter to show all'}
          </button>
        </div>
      )}
    </div>
  );
};
