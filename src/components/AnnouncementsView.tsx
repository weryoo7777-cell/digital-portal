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
  RotateCcw,
  FileText,
  Sparkles,
  Plus,
  Trash2
} from 'lucide-react';
import { CorporateAnnouncement } from '../types';

interface AnnouncementsViewProps {
  announcements: CorporateAnnouncement[];
  language: 'TH' | 'EN';
  readAnnouncementIds?: string[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onAddWelcomeAnnouncement?: () => void;
  isAdmin?: boolean;
  onAddAnnouncement?: (announcement: CorporateAnnouncement) => void;
  onDeleteAnnouncement?: (id: string) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ 
  announcements, 
  language,
  readAnnouncementIds = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onAddWelcomeAnnouncement,
  isAdmin = false,
  onAddAnnouncement,
  onDeleteAnnouncement
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState<boolean>(false);
  const [activeAnn, setActiveAnn] = useState<CorporateAnnouncement | null>(null);
  const [annToDelete, setAnnToDelete] = useState<CorporateAnnouncement | null>(null);

  // Admin New Announcement Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newTag, setNewTag] = useState<'General' | 'Tax Deadline' | 'IT Maintenance' | 'Policy'>('General');
  const [newPriority, setNewPriority] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [newAuthor, setNewAuthor] = useState('ฝ่ายบริหารและสื่อสารองค์กร (Admin)');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!newTitle.trim() || !newSummary.trim()) return;

    const todayStr = new Date().toLocaleDateString(language === 'TH' ? 'th-TH' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const newAnnouncement: CorporateAnnouncement = {
      id: `ann-${Date.now()}`,
      title: newTitle.trim(),
      titleEn: newTitleEn.trim() || newTitle.trim(),
      summary: newSummary.trim(),
      date: todayStr,
      tag: newTag,
      priority: newPriority,
      author: newAuthor.trim() || 'Admin',
      updatedAt: Date.now()
    };

    onAddAnnouncement?.(newAnnouncement);
    setCreateModalOpen(false);
    setNewTitle('');
    setNewTitleEn('');
    setNewSummary('');
  };

  const unreadCount = announcements.filter(a => !readAnnouncementIds.includes(a.id)).length;

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
      {/* 1. Header Banner & Quick Overview with Add Announcement Button always visible for Admin */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-[#1E60D5] dark:text-blue-400 shrink-0 shadow-xs">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {language === 'TH' ? 'ประกาศและข่าวสารองค์กร (Corporate Announcements)' : 'Corporate Announcements & Notices'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'TH' 
                ? 'ติดตามประกาศ ข่าวสารสำคัญ กำหนดการ และการซ่อมบำรุงระบบงานองค์กร' 
                : 'Centralized company notices, IT maintenance schedules, and corporate updates'}
            </p>
          </div>
        </div>

        {/* Right Action Buttons: Admin Add Announcement Button is ALWAYS available */}
        <div className="flex items-center gap-2 shrink-0">
          {isAdmin && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCreateModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#1E60D5] hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              title={language === 'TH' ? 'เพิ่มประกาศข่าวสารใหม่' : 'Add New Announcement'}
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'TH' ? '+ เพิ่มประกาศข่าวสาร (Add Announcement)' : '+ Add Announcement'}</span>
            </button>
          )}

          {unreadCount > 0 && onMarkAllAsRead && announcements.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onMarkAllAsRead();
              }}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
              title={language === 'TH' ? 'ทำเครื่องหมายว่าอ่านแล้วทั้งหมด' : 'Mark all as read'}
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">{language === 'TH' ? 'อ่านทั้งหมดแล้ว' : 'Mark all read'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Empty State when announcements list is completely empty */}
      {announcements.length === 0 ? (
        <div className="py-16 sm:py-20 px-6 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto my-4 animate-in fade-in">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-[#1E60D5] dark:text-blue-400 shadow-xs">
              <Bell className="w-8 h-8 text-[#1E60D5] dark:text-blue-400" strokeWidth={1.75} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-center text-slate-500 dark:text-slate-400">
              <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            </div>
          </div>

          <div className="space-y-1.5 max-w-md">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {language === 'TH' ? 'ยังไม่มีประกาศใหม่ในขณะนี้' : 'No new announcements at this time'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {language === 'TH' 
                ? 'ติดตามข่าวสาร สารสนเทศ และประกาศสำคัญขององค์กรได้ที่นี่' 
                : 'Stay tuned for official company news, updates, and corporate notices.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            {isAdmin && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCreateModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E60D5] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'TH' ? '+ เพิ่มประกาศข่าวสาร (Add Announcement)' : '+ Add Announcement'}</span>
              </button>
            )}

            {onAddWelcomeAnnouncement && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddWelcomeAnnouncement();
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#1E60D5] dark:text-blue-300 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#1E60D5] dark:text-blue-400" />
                <span>{language === 'TH' ? 'โหลดประกาศต้อนรับเริ่มต้น' : 'Load Welcome Notice'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Filter and Search Bar: Only Filter Button and ทั้งหมด */}
          <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 relative ${filterDropdownOpen ? 'z-40' : 'z-20'}`}>
            {/* Left: Icon-Only Filter Button & ทั้งหมด only */}
            <div className="flex items-center gap-2">
              {/* ปุ่มกรองมีแค่รูป (Icon-only Filter Button) with high z-index and click-outside backdrop */}
              <div className="relative z-50">
                <button
                  type="button"
                  onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                  className={`w-9 h-9 rounded-xl border transition-all shadow-2xs flex items-center justify-center shrink-0 relative ${
                    selectedTag !== 'all'
                      ? 'bg-[#1E60D5] text-white border-[#1E60D5] shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
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

                {/* Filter Dropdown */}
                {filterDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 z-[100] w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl dark:shadow-slate-950/80 p-2.5 animate-in fade-in zoom-in-95">
                    <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {language === 'TH' ? 'เลือกหมวดหมู่ที่ต้องการกรอง' : 'Select Category to Filter'}
                    </div>
                    <div className="space-y-1 mt-1 max-h-80 overflow-y-auto">
                      {announcementCategories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setSelectedTag(cat.id);
                            setFilterDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
                            selectedTag === cat.id
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>{language === 'TH' ? cat.labelTh : cat.labelEn}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                            selectedTag === cat.id
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

              {/* ปุ่มแสดงชื่อหมวดหมู่ที่เลือก */}
              {(() => {
                const currentTagObj = announcementCategories.find(c => c.id === selectedTag) || announcementCategories[0];
                return (
                  <button
                    type="button"
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

            {/* Right: Search Input */}
            <div className="flex items-center gap-2">
              <div className="relative min-w-[200px] sm:w-64 shrink-0">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'TH' ? 'ค้นหาประกาศ, ข่าวสาร...' : 'Search notices...'}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#1E60D5] dark:focus:border-blue-500 transition-colors shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Announcements List */}
          {filtered.length > 0 ? (
            <div className="space-y-3.5">
              {filtered.map((ann) => {
                const isUnread = !readAnnouncementIds.includes(ann.id);
                return (
                  <div
                    key={ann.id}
                    onClick={() => {
                      setActiveAnn(ann);
                      onMarkAsRead?.(ann.id);
                    }}
                    className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all group cursor-pointer ${
                      isUnread 
                        ? 'border-blue-200 dark:border-blue-800/80 ring-1 ring-blue-500/20 shadow-xs' 
                        : 'border-slate-200/90 dark:border-slate-800'
                    } hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md dark:hover:shadow-slate-950/60`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {isUnread && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500 text-white shadow-2xs animate-pulse">
                              {language === 'TH' ? 'ยังไม่ได้อ่าน' : 'UNREAD'}
                            </span>
                          )}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${
                            ann.priority === 'urgent'
                              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
                              : ann.priority === 'high'
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                              : 'bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300 border-blue-200 dark:border-blue-800/60'
                          }`}>
                            {ann.tag}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {ann.date}
                          </span>
                        </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#1E60D5] dark:group-hover:text-blue-400 transition-colors">
                        {language === 'TH' ? ann.title : ann.titleEn}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {ann.summary}
                      </p>

                      <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5 pt-1">
                        <User className="w-3.5 h-3.5" />
                        <span>{ann.author}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 mt-2">
                      {isAdmin && onDeleteAnnouncement && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setAnnToDelete(ann);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                          title={language === 'TH' ? 'ลบประกาศ' : 'Delete announcement'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#1E60D5] dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2.5">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {language === 'TH' ? 'ไม่พบประกาศที่ตรงกับตัวกรองที่เลือก' : 'No announcements match the current filter.'}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedTag('all');
                  setSearchQuery('');
                }}
                className="text-xs text-[#1E60D5] dark:text-blue-400 font-bold hover:underline cursor-pointer"
              >
                {language === 'TH' ? 'ล้างตัวกรองเพื่อแสดงทั้งหมด' : 'Reset filter to show all'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Admin Create Announcement Modal */}
      {createModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setCreateModalOpen(false);
          }}
        >
          <div 
            className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-400 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {language === 'TH' ? 'เพิ่มประกาศข่าวสารองค์กร (Add Announcement)' : 'Create New Announcement'}
                  </h3>
                  <p className="text-xs text-slate-400">Admin Announcement Management</p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCreateModalOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'TH' ? 'หัวข้อข่าวสาร (ภาษาไทย) *' : 'Title (Thai) *'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={language === 'TH' ? 'เช่น แจ้งวันหยุดเทศกาลสงกรานต์, ซ่อมบำรุงระบบ IT...' : 'e.g. System upgrade notification...'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60D5]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'TH' ? 'หัวข้อข่าวสาร (ภาษาอังกฤษ)' : 'Title (English)'}
                </label>
                <input
                  type="text"
                  value={newTitleEn}
                  onChange={(e) => setNewTitleEn(e.target.value)}
                  placeholder="English title (optional)..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60D5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'หมวดหมู่ประกาศ' : 'Category / Tag'}
                  </label>
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60D5]"
                  >
                    <option value="General">General (ทั่วไป)</option>
                    <option value="IT Maintenance">IT Maintenance (ซ่อมบำรุง IT)</option>
                    <option value="Tax Deadline">Tax Deadline (กำหนดการภาษี)</option>
                    <option value="Policy">Policy (นโยบายองค์กร)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'ระดับความสำคัญ *' : 'Priority *'}
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60D5]"
                  >
                    <option value="normal">{language === 'TH' ? 'ปกติ (Normal)' : 'Normal'}</option>
                    <option value="urgent">{language === 'TH' ? 'ด่วน / ด่วนมาก (Urgent)' : 'Urgent'}</option>
                    <option value="high">{language === 'TH' ? 'สำคัญ (High)' : 'Important'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'TH' ? 'รายละเอียด / เนื้อหาข่าวสาร *' : 'Details / Content *'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder={language === 'TH' ? 'ระบุรายละเอียดข่าวสาร ข้อมูลสำคัญ ข้อปฏิบัติ...' : 'Provide notice content and instructions...'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60D5]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'TH' ? 'ผู้ออกประกาศ / แผนก' : 'Issuer / Department'}
                </label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60D5]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCreateModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1E60D5] hover:bg-blue-700 text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  {language === 'TH' ? 'บันทึกและเผยแพร่' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Announcement Detail Modal */}
      {activeAnn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                {activeAnn.tag}
              </span>
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">{activeAnn.date}</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {language === 'TH' ? activeAnn.title : activeAnn.titleEn}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {activeAnn.summary}
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <span>{language === 'TH' ? 'ผู้ออกประกาศ:' : 'Issued by:'} {activeAnn.author}</span>
              <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified Notice
              </span>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveAnn(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#1E60D5] hover:bg-[#0B4ABF] rounded-xl transition-colors shadow-2xs cursor-pointer"
              >
                {language === 'TH' ? 'ปิดประกาศ' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Announcement Confirmation Modal */}
      {annToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {language === 'TH' ? 'ยืนยันการลบประกาศ' : 'Confirm Delete Announcement'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'TH' 
                  ? `คุณต้องการลบประกาศ "${annToDelete.title}" ออกจากระบบใช่หรือไม่?` 
                  : `Are you sure you want to delete announcement "${annToDelete.title}"?`}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAnnToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (annToDelete?.id) {
                    onDeleteAnnouncement?.(annToDelete.id);
                  }
                  setAnnToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                {language === 'TH' ? 'ยืนยันลบ' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
