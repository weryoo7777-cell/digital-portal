import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Search, 
  ArrowUpRight, 
  Clock, 
  Globe, 
  Image as ImageIcon, 
  Newspaper, 
  MapPin, 
  GraduationCap, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Landmark
} from 'lucide-react';

interface GoogleSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'TH' | 'EN';
  initialQuery?: string;
}

type SearchCategory = 'web' | 'images' | 'news' | 'maps' | 'scholar' | 'gov';

export const GoogleSearchModal: React.FC<GoogleSearchModalProps> = ({
  isOpen,
  onClose,
  language,
  initialQuery = ''
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('web');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('qs_google_recent_searches');
      return saved ? JSON.parse(saved) : [
        'อัตราแลกเปลี่ยนเงินบาทวันนี้ ธนาคารแห่งประเทศไทย',
        'ตรวจสอบรายชื่อนิติบุคคล DBD DataWarehouse',
        'กำหนดเวลายื่นภาษี ภ.พ.30 กรมสรรพากร',
        'ราคาน้ำมันขายปลีกวันนี้'
      ];
    } catch {
      return [];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialQuery) setQuery(initialQuery);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  const saveRecentSearch = (text: string) => {
    if (!text.trim()) return;
    const clean = text.trim();
    setRecentSearches(prev => {
      const next = [clean, ...prev.filter(item => item.toLowerCase() !== clean.toLowerCase())].slice(0, 8);
      try {
        localStorage.setItem('qs_google_recent_searches', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const executeSearch = (searchQueryToUse?: string, categoryToUse?: SearchCategory) => {
    const q = (searchQueryToUse !== undefined ? searchQueryToUse : query).trim();
    if (!q) return;

    saveRecentSearch(q);
    const cat = categoryToUse || activeCategory;
    let url = 'https://www.google.com/search?q=' + encodeURIComponent(q);

    switch (cat) {
      case 'images':
        url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}`;
        break;
      case 'news':
        url = `https://www.google.com/search?tbm=nws&q=${encodeURIComponent(q)}`;
        break;
      case 'maps':
        url = `https://www.google.com/maps/search/${encodeURIComponent(q)}`;
        break;
      case 'scholar':
        url = `https://scholar.google.com/scholar?q=${encodeURIComponent(q)}`;
        break;
      case 'gov':
        // Restrict to Thai gov websites
        url = `https://www.google.com/search?q=${encodeURIComponent(q + ' site:.go.th OR site:.or.th')}`;
        break;
      default:
        url = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
        break;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  const corporateSuggestedQueries = [
    { label: 'อัตราแลกเปลี่ยน ธปท. วันนี้', q: 'อัตราแลกเปลี่ยน ธนาคารแห่งประเทศไทย วันนี้' },
    { label: 'ตรวจสอบเลขนิติบุคคล DBD', q: 'ตรวจสอบรายชื่อบริษัท DBD DataWarehouse' },
    { label: 'ปฏิทินยื่นภาษี กรมสรรพากร', q: 'ปฏิทินภาษี ภ.ง.ด. ภ.พ.30 กรมสรรพากร 2569' },
    { label: 'เช็คสิทธิประกันสังคม ม.33', q: 'ตรวจสอบสิทธิประกันสังคม ผู้ประกันตน มาตรา 33' },
    { label: 'ราคาน้ำมันขายปลีกวันนี้', q: 'ราคาน้ำมันวันนี้ ปตท.' },
    { label: 'ระเบียบจัดซื้อจัดจ้าง e-GP', q: 'ระบบจัดซื้อจัดจ้างภาครัฐ e-GP' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 text-slate-800 shadow-2xl overflow-hidden">
        {/* Header with Google Brand Bar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Google Logo styled emblem */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white shadow-xs border border-slate-200">
              <span className="font-extrabold text-[#4285F4] text-lg font-sans">G</span>
              <span className="font-extrabold text-[#EA4335] text-lg font-sans">o</span>
              <span className="font-extrabold text-[#FBBC05] text-lg font-sans">o</span>
              <span className="font-extrabold text-[#4285F4] text-lg font-sans">g</span>
              <span className="font-extrabold text-[#34A853] text-lg font-sans">l</span>
              <span className="font-extrabold text-[#EA4335] text-lg font-sans">e</span>
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>{language === 'TH' ? 'ระบบค้นหา Google Search' : 'Google Search Hub'}</span>
                <span className="text-[10px] text-[#1E60D5] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold">
                  google.com
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'TH' ? 'ค้นหาข้อมูลออนไลน์ ข่าวธุรกิจ เอกสาร และกฎหมาย' : 'Search the web, news, maps, and corporate sources'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Categories Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-100 overflow-x-auto text-xs bg-white">
          <button
            onClick={() => setActiveCategory('web')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-all ${
              activeCategory === 'web'
                ? 'border-[#1E60D5] text-[#1E60D5] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'TH' ? 'ทั้งหมด (All)' : 'All Web'}</span>
          </button>
          <button
            onClick={() => setActiveCategory('news')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-all ${
              activeCategory === 'news'
                ? 'border-[#1E60D5] text-[#1E60D5] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>{language === 'TH' ? 'ข่าวสาร (News)' : 'News'}</span>
          </button>
          <button
            onClick={() => setActiveCategory('gov')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-all ${
              activeCategory === 'gov'
                ? 'border-[#1E60D5] text-[#1E60D5] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>{language === 'TH' ? 'เว็บราชการ (.go.th)' : 'Gov Sources'}</span>
          </button>
          <button
            onClick={() => setActiveCategory('maps')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-all ${
              activeCategory === 'maps'
                ? 'border-[#1E60D5] text-[#1E60D5] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{language === 'TH' ? 'แผนที่ (Maps)' : 'Maps'}</span>
          </button>
          <button
            onClick={() => setActiveCategory('images')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-all ${
              activeCategory === 'images'
                ? 'border-[#1E60D5] text-[#1E60D5] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{language === 'TH' ? 'รูปภาพ (Images)' : 'Images'}</span>
          </button>
          <button
            onClick={() => setActiveCategory('scholar')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-all ${
              activeCategory === 'scholar'
                ? 'border-[#1E60D5] text-[#1E60D5] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{language === 'TH' ? 'วิชาการ (Scholar)' : 'Scholar'}</span>
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-5 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                activeCategory === 'gov'
                  ? language === 'TH' ? 'ค้นหาข้อมูลในเว็บไซต์หน่วยงานราชการไทย...' : 'Search within Thai government portals (.go.th)...'
                  : language === 'TH' ? 'พิมพ์คำค้นหาที่ต้องการบน Google...' : 'Enter your search query for Google...'
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-28 py-3.5 text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#1E60D5] shadow-xs"
            />
            
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={() => executeSearch(query)}
                disabled={!query.trim()}
                className="px-4 py-1.5 rounded-lg bg-[#1E60D5] hover:bg-[#0B4ABF] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-40 flex items-center gap-1.5"
              >
                <span>{language === 'TH' ? 'ค้นหา' : 'Search'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Direct Link indicator */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-mono text-[11px] text-slate-400 truncate max-w-[400px]">
              https://www.google.com/search?q={encodeURIComponent(query || '...')}
            </span>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <span>กด <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[10px]">Enter</kbd> เพื่อเปิดบน Google</span>
            </span>
          </div>

          {/* Suggested Corporate Queries */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <TrendingUp className="w-3.5 h-3.5 text-[#1E60D5]" />
              <span>{language === 'TH' ? 'คำค้นหาทางธุรกิจยอดนิยม' : 'Trending Business Queries'}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {corporateSuggestedQueries.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(item.q);
                    executeSearch(item.q);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 text-xs text-slate-700 hover:text-[#1E60D5] border border-slate-200 hover:border-blue-200 transition-all text-left flex items-center gap-1.5 shadow-2xs"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{language === 'TH' ? 'ประวัติการค้นหาล่าสุด' : 'Recent Searches'}</span>
                </div>
                <button
                  onClick={() => {
                    setRecentSearches([]);
                    localStorage.removeItem('qs_google_recent_searches');
                  }}
                  className="text-[11px] text-slate-400 hover:text-slate-600 font-medium"
                >
                  {language === 'TH' ? 'ล้างประวัติ' : 'Clear'}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(item);
                      executeSearch(item);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 border border-slate-200 flex items-center gap-1 transition-colors"
                  >
                    <span className="truncate max-w-[240px]">{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Google Search Services (Global)</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1E60D5] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>google.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
