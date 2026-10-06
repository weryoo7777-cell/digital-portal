import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Download, 
  Search, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Tag
} from 'lucide-react';
import { KNOWLEDGE_BASE_DOCS } from '../data/portalData';

interface KnowledgeBaseViewProps {
  language: 'TH' | 'EN';
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({ language }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const categories = ['all', 'IT Guide', 'Policy', 'Accounting & Tax'];

  const filteredDocs = KNOWLEDGE_BASE_DOCS.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) || 
                          doc.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (docTitle: string) => {
    setDownloadNotice(language === 'TH' ? `ดาวน์โหลด "${docTitle}" สำเร็จ` : `Downloaded "${docTitle}"`);
    setTimeout(() => setDownloadNotice(null), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {language === 'TH' ? 'เอกสาร นโยบาย และคู่มือการทำงาน (Knowledge Base)' : 'Documents & Knowledge Base'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'TH' 
              ? 'ดาวน์โหลดคู่มือการตั้งค่าระบบ นโยบายความปลอดภัย และขั้นตอนการส่งภาษี' 
              : 'Access operational manuals, IT setup guides, and compliance policies.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'TH' ? 'ค้นหาเอกสาร...' : 'Search docs...'}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#1E60D5] dark:focus:border-blue-500 shadow-2xs"
          />
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold">{downloadNotice}</span>
        </div>
      )}

      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[#1E60D5] text-white shadow-2xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat === 'all' ? (language === 'TH' ? 'ทุกหมวดหมู่' : 'All Categories') : cat}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md dark:hover:shadow-slate-950/60 transition-all flex flex-col justify-between group shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span className="font-bold text-[#1E60D5] dark:text-blue-300 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-[10px]">
                  {doc.category}
                </span>
                <span className="font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {doc.readTime}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-[#1E60D5] dark:group-hover:text-blue-400 transition-colors">
                {doc.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
                {doc.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                {language === 'TH' ? 'อัปเดต:' : 'Updated:'} {doc.updatedAt}
              </span>

              <button
                onClick={() => handleDownload(doc.title)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-[#1E60D5] dark:hover:bg-[#1E60D5] text-[#1E60D5] dark:text-blue-300 hover:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{language === 'TH' ? 'ดาวน์โหลด PDF' : 'Download'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
