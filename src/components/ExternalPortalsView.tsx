import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  ExternalLink, 
  Search, 
  ShieldCheck, 
  Landmark, 
  Receipt, 
  CreditCard, 
  Ship, 
  Copy, 
  Check, 
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

interface ExternalPortalsViewProps {
  language: 'TH' | 'EN';
  onOpenGoogleSearchWithQuery?: (q: string) => void;
}

export const ExternalPortalsView: React.FC<ExternalPortalsViewProps> = ({
  language,
  onOpenGoogleSearchWithQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const copyUrl = (id: string, url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
                  : 'bg-white text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
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
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white" />
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
              <div className="absolute left-0 top-full mt-2 z-[100] w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-2.5 animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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
                          ? 'bg-blue-50 text-[#1E60D5]'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{language === 'TH' ? cat.labelTh : cat.labelEn}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        selectedCategory === cat.id
                          ? 'bg-[#1E60D5] text-white'
                          : 'bg-slate-100 text-slate-600'
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
            className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1E60D5] transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* Corporate Guidance Banner */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 text-xs text-slate-600 shadow-2xs">
        <Info className="w-4 h-4 text-[#1E60D5] shrink-0 mt-0.5" />
        <div className="flex-1 leading-relaxed">
          <span className="font-bold text-slate-900">
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
                className="rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 p-4 flex flex-col justify-between transition-all hover:shadow-md group shadow-2xs"
              >
                <div>
                  {/* Top Row: Category badge & Actions */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      {/* Real Authentic Agency / Bank Logo */}
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-1.5 shrink-0 overflow-hidden group-hover:border-blue-400 group-hover:shadow-xs transition-all">
                        <img 
                          src={portal.logoUrl || `https://www.google.com/s2/favicons?domain=${new URL(portal.url).hostname}&sz=128`}
                          alt={portal.agencyTh}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div style={{ display: 'none' }} className="w-full h-full items-center justify-center text-[#1E60D5]">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${portal.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                          {portal.badge || portal.agency}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => copyUrl(portal.id, portal.url, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title={language === 'TH' ? 'คัดลอกลิงก์ URL' : 'Copy URL'}
                      >
                        {copiedId === portal.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <a
                        href={portal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#1E60D5] hover:bg-blue-50 transition-colors"
                        title={language === 'TH' ? 'เปิดระบบในแท็บใหม่' : 'Open in new tab'}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Title & Agency */}
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1E60D5] transition-colors line-clamp-1">
                    {language === 'TH' ? portal.nameTh : portal.name}
                  </h3>
                  <div className="text-[11px] text-[#1E60D5] font-semibold mt-0.5 truncate">
                    {language === 'TH' ? portal.agencyTh : portal.agency}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                    {language === 'TH' ? portal.descriptionTh : portal.descriptionEn}
                  </p>

                  {/* Security Requirement note */}
                  {portal.securityNote && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-slate-600 font-mono bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                      <Lock className="w-3 h-3 text-amber-600 shrink-0" />
                      <span className="truncate">{portal.securityNote}</span>
                    </div>
                  )}
                </div>

                {/* Bottom: URL Link & Launch Button */}
                <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono truncate max-w-[140px] sm:max-w-[170px]">
                    {portal.url.replace(/^https?:\/\//, '')}
                  </span>

                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-[#1E60D5] text-[#1E60D5] hover:text-white text-xs font-bold transition-all shadow-2xs"
                  >
                    <span>{language === 'TH' ? 'เข้าสู่ระบบ' : 'Launch'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
          <p className="text-sm font-semibold text-slate-700">
            {language === 'TH' ? 'ไม่พบลิงก์ระบบราชการหรือธนาคารที่ตรงกับตัวกรอง' : 'No corporate portals match the current filter.'}
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="text-xs text-[#1E60D5] font-bold hover:underline"
          >
            {language === 'TH' ? 'ล้างตัวกรองเพื่อแสดงทั้งหมด' : 'Reset filter to show all'}
          </button>
        </div>
      )}
    </div>
  );
};
