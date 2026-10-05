import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Tag,
  Clock,
  ChevronRight,
  X,
  Filter,
  Search,
  RotateCcw
} from 'lucide-react';
import { CorporateAnnouncement } from '../types';

interface AnnouncementsViewProps {
  announcements: CorporateAnnouncement[];
  language: 'TH' | 'EN';
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ announcements, language }) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState<boolean>(false);
  const [activeAnn, setActiveAnn] = useState<CorporateAnnouncement | null>(null);

  const announcementCategories = [
    { id: 'all', labelTh: 'ทั้งหมด', labelEn: 'All Notices', count: announcements.length },
    { 
      id: 'IT Maintenance', 
      labelTh: 'การซ่อมบำรุงระบบ IT', 
      labelEn: 'IT Maintenance', 
      count: announcements.filter(a => a.tag === 'IT Maintenance').length 
    },
    { 
      id: 'Tax Deadline', 
      labelTh: 'กำหนดการภาษี', 
      labelEn: 'Tax Deadline', 
      count: announcements.filter(a => a.tag === 'Tax Deadline').length 
    },
    { 
      id: 'General', 
      labelTh: 'ประกาศทั่วไป', 
      labelEn: 'General', 
      count: announcements.filter(a => a.tag === 'General').length 
    },
  ];

  const filtered = announcements.filter((ann) => {
    const matchesTag = selectedTag === 'all' || ann.tag === selectedTag;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      ann.title.toLowerCase().includes(q) ||
      ann.titleEn.toLowerCase().includes(q) ||
      ann.summary.toLowerCase().includes(q) ||
      ann.author.toLowerCase().includes(q);

    return matchesTag && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in pb-12">
      {/* Filter and Search Bar: Only Filter Button and ทั้งหมด */}
      <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 relative ${filterDropdownOpen ? 'z-40' : 'z-20'}`}>
        {/* Left: Icon-Only Filter Button & ทั้งหมด only (ไม่มีหัวข้ออื่น) */}
        <div className="flex items-center gap-2">
          {/* ปุ่มกรองมีแค่รูป (Icon-only Filter Button) with high z-index and click-outside backdrop */}
          <div className="relative z-50">
            <button
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className={`w-9 h-9 rounded-xl border transition-all shadow-2xs flex items-center justify-center shrink-0 relative ${
                selectedTag !== 'all'
                  ? 'bg-[#1E60D5] text-white border-[#1E60D5] shadow-xs'
                  : 'bg-white text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
              }`}
              title={
                selectedTag !== 'all'
                  ? `${language === 'TH' ? 'ตัวกรอง:' : 'Filter:'} ${announcementCategories.find(c => c.id === selectedTag)?.labelTh}`
                  : (language === 'TH' ? 'ตัวกรอง' : 'Filter')
              }
              aria-label="Filter"
            >
              <Filter className="w-4 h-4" />
              {selectedTag !== 'all' && (
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

            {/* Filter Dropdown - rendered in front with high z-index */}
            {filterDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 z-[100] w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-2.5 animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'TH' ? 'เลือกหมวดหมู่ที่ต้องการกรอง' : 'Select Category to Filter'}
                </div>
                <div className="space-y-1 mt-1 max-h-80 overflow-y-auto">
                  {announcementCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedTag(cat.id);
                        setFilterDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
                        selectedTag === cat.id
                          ? 'bg-blue-50 text-[#1E60D5]'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{language === 'TH' ? cat.labelTh : cat.labelEn}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        selectedTag === cat.id
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
            const currentTagObj = announcementCategories.find(c => c.id === selectedTag) || announcementCategories[0];
            return (
              <button
                onClick={() => {
                  if (selectedTag !== 'all') {
                    setSelectedTag('all');
                  }
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 bg-[#1E60D5] text-white shadow-2xs"
                title={selectedTag !== 'all' ? (language === 'TH' ? 'คลิกเพื่อกลับไปแสดงทั้งหมด' : 'Click to reset to all') : undefined}
              >
                <span>{language === 'TH' ? currentTagObj.labelTh : currentTagObj.labelEn}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-blue-800 text-white">
                  {currentTagObj.count}
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
            placeholder={language === 'TH' ? 'ค้นหาประกาศ, ข่าวสาร...' : 'Search notices...'}
            className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1E60D5] transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* Announcements List */}
      {filtered.length > 0 ? (
        <div className="space-y-3.5">
          {filtered.map((ann) => (
            <div
              key={ann.id}
              onClick={() => setActiveAnn(ann)}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${
                      ann.priority === 'urgent'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : ann.priority === 'high'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-[#1E60D5] border-blue-200'
                    }`}>
                      {ann.tag}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {ann.date}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1E60D5] transition-colors">
                    {language === 'TH' ? ann.title : ann.titleEn}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {ann.summary}
                  </p>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{ann.author}</span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#1E60D5] group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
          <p className="text-sm font-semibold text-slate-700">
            {language === 'TH' ? 'ไม่พบประกาศที่ตรงกับตัวกรองที่เลือก' : 'No announcements match the current filter.'}
          </p>
          <button
            onClick={() => { setSelectedTag('all'); setSearchQuery(''); }}
            className="text-xs text-[#1E60D5] font-bold hover:underline"
          >
            {language === 'TH' ? 'ล้างตัวกรองเพื่อแสดงทั้งหมด' : 'Reset filter to show all'}
          </button>
        </div>
      )}

      {/* Announcement Detail Modal */}
      {activeAnn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 text-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-[#1E60D5] border border-blue-200">
                {activeAnn.tag}
              </span>
              <span className="text-xs font-mono text-slate-400">{activeAnn.date}</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {language === 'TH' ? activeAnn.title : activeAnn.titleEn}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              {activeAnn.summary}
            </p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
              <span>{language === 'TH' ? 'ผู้ออกประกาศ:' : 'Issued by:'} {activeAnn.author}</span>
              <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified Notice
              </span>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setActiveAnn(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#1E60D5] hover:bg-[#0B4ABF] rounded-xl transition-colors shadow-2xs"
              >
                {language === 'TH' ? 'ปิดประกาศ' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
