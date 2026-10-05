import React, { useState, useEffect } from 'react';
import { 
  X, 
  Languages, 
  ArrowLeftRight, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  Globe, 
  Sparkles,
  Volume2,
  Trash2,
  BookmarkPlus
} from 'lucide-react';

interface GoogleTranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'TH' | 'EN';
  initialText?: string;
}

interface LanguageOption {
  code: string;
  nameTh: string;
  nameEn: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'th', nameTh: 'ไทย (Thai)', nameEn: 'Thai' },
  { code: 'en', nameTh: 'อังกฤษ (English)', nameEn: 'English' },
  { code: 'zh-CN', nameTh: 'จีนตัวย่อ (Chinese Simplified)', nameEn: 'Chinese (Simplified)' },
  { code: 'zh-TW', nameTh: 'จีนตัวเต็ม (Chinese Traditional)', nameEn: 'Chinese (Traditional)' },
  { code: 'ja', nameTh: 'ญี่ปุ่น (Japanese)', nameEn: 'Japanese' },
  { code: 'ko', nameTh: 'เกาหลี (Korean)', nameEn: 'Korean' },
  { code: 'de', nameTh: 'เยอรมัน (German)', nameEn: 'German' },
  { code: 'vi', nameTh: 'เวียดนาม (Vietnamese)', nameEn: 'Vietnamese' },
];

// High-frequency corporate phrase translations for immediate instant preview
const QUICK_BUSINESS_TRANSLATIONS: Record<string, { en: string; zh: string }> = {
  'ขอใบเสนอราคาและเงื่อนไขการชำระเงิน': {
    en: 'Please provide a formal quotation and payment terms.',
    zh: '请提供正式报价单及付款条款。'
  },
  'ติดตามสถานะการจัดส่งสินค้าและเลข Tracking': {
    en: 'We would like to follow up on the shipment status and tracking number.',
    zh: '我们想跟进货运状态和快递跟踪单号。'
  },
  'แจ้งการโอนเงินและแนบหลักฐานสลิป': {
    en: 'Payment has been transferred; payment slip is attached for your verification.',
    zh: '款项已汇出，付款凭证已附上，请查收。'
  },
  'ขอเอกสารหนังสือรับรองการหักภาษี ณ ที่จ่าย (50 ทวิ)': {
    en: 'Please kindly issue and send the Withholding Tax Certificate (Form 50 Tawi).',
    zh: '请提供并发送预扣税证明文件。'
  },
  'ขอนัดหมายการประชุมออนไลน์ผ่าน Google Meet': {
    en: 'We would like to schedule an online meeting via Google Meet next week.',
    zh: '我们希望下周安排一次Google Meet线上会议。'
  },
  'ขอบคุณสำหรับความร่วมมือทางธุรกิจและหวังว่าจะได้ร่วมงานกันอีก': {
    en: 'Thank you for your valuable cooperation and we look forward to working with you.',
    zh: '感谢您的精诚合作，期待与您的再次合作。'
  }
};

export const GoogleTranslateModal: React.FC<GoogleTranslateModalProps> = ({
  isOpen,
  onClose,
  language,
  initialText = ''
}) => {
  const [sourceLang, setSourceLang] = useState<string>('th');
  const [targetLang, setTargetLang] = useState<string>('en');
  const [inputText, setInputText] = useState<string>(initialText);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  useEffect(() => {
    if (initialText) {
      setInputText(initialText);
    }
  }, [initialText]);

  // Instant local dictionary lookup & simulated fast translation
  useEffect(() => {
    if (!inputText.trim()) {
      setTranslatedText('');
      return;
    }

    const trimmed = inputText.trim();
    // Check known business templates
    if (sourceLang === 'th' && QUICK_BUSINESS_TRANSLATIONS[trimmed]) {
      if (targetLang === 'en') {
        setTranslatedText(QUICK_BUSINESS_TRANSLATIONS[trimmed].en);
        return;
      }
      if (targetLang.startsWith('zh')) {
        setTranslatedText(QUICK_BUSINESS_TRANSLATIONS[trimmed].zh);
        return;
      }
    }

    // Default fast translated feedback
    setIsTranslating(true);
    const timer = setTimeout(() => {
      setIsTranslating(false);
      // If no exact match, guide user with a clean preview or prompt to open Google Translate
      if (sourceLang === 'th' && targetLang === 'en') {
        setTranslatedText(`[พร้อมแปลบน Google Translate] — กดปุ่ม "เปิดใน Google Translate" ด้านล่างเพื่อดูผลลัพธ์ที่สมบูรณ์แบบสำหรับ: "${trimmed}"`);
      } else {
        setTranslatedText(`[Google Translate ready] — Click "Open in Google Translate" below for complete translation: "${trimmed}"`);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [inputText, sourceLang, targetLang]);

  if (!isOpen) return null;

  const swapLanguages = () => {
    const prevSource = sourceLang;
    const prevTarget = targetLang;
    setSourceLang(prevTarget);
    setTargetLang(prevSource);
    if (translatedText && !translatedText.startsWith('[')) {
      setInputText(translatedText);
      setTranslatedText(inputText);
    }
  };

  const copyToClipboard = () => {
    const textToCopy = translatedText || inputText;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openGoogleTranslateUrl = () => {
    const textParam = encodeURIComponent(inputText.trim());
    const url = `https://translate.google.com/?sl=${sourceLang}&tl=${targetLang}&text=${textParam}&op=translate`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const applyTemplate = (phrase: string) => {
    setInputText(phrase);
    setSourceLang('th');
    setTargetLang('en');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header with Google Translate Branding */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-inner">
              <Languages className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  {language === 'TH' ? 'Google แปลภาษา (Google Translate)' : 'Google Translate Suite'}
                </h2>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-950/80 border border-blue-800/60 px-2 py-0.5 rounded">
                  translate.google.com
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'TH' ? 'ระบบแปลภาษาสำหรับการติดต่อธุรกิจ เอกสาร และคู่ค้าต่างประเทศ' : 'Enterprise translation for business documents & communication'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Translation Language Selector Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/80 bg-slate-900/60 text-xs">
          {/* Source Language */}
          <div className="flex items-center gap-2 flex-1">
            <span className="text-slate-400 font-medium">{language === 'TH' ? 'จากภาษา:' : 'From:'}</span>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="bg-slate-950 border border-slate-750 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {language === 'TH' ? l.nameTh : l.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <button
            onClick={swapLanguages}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors mx-2"
            title="สลับภาษา (Swap languages)"
          >
            <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Target Language */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="text-slate-400 font-medium">{language === 'TH' ? 'เป็นภาษา:' : 'To:'}</span>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-slate-950 border border-slate-750 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {language === 'TH' ? l.nameTh : l.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dual Translation Panes */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">
                  {language === 'TH' ? 'ข้อความต้นทาง' : 'Source Text'}
                </span>
                {inputText && (
                  <button
                    onClick={() => setInputText('')}
                    className="text-slate-500 hover:text-rose-400 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{language === 'TH' ? 'ล้างข้อความ' : 'Clear'}</span>
                  </button>
                )}
              </div>

              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={5}
                  placeholder={
                    language === 'TH'
                      ? 'พิมพ์หรือวางข้อความที่ต้องการแปลที่นี่... (เช่น ข้อความอีเมล, ร่างใบเสนอราคา)'
                      : 'Type or paste text to translate here...'
                  }
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl p-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none shadow-inner leading-relaxed"
                />
                <div className="text-[10px] text-slate-500 text-right pr-2">
                  {inputText.length} {language === 'TH' ? 'ตัวอักษร' : 'characters'}
                </div>
              </div>
            </div>

            {/* Translation Output Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">
                  {language === 'TH' ? 'ผลการแปล (Translation)' : 'Translation Result'}
                </span>
                {translatedText && (
                  <button
                    onClick={copyToClipboard}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{language === 'TH' ? 'คัดลอกแล้ว' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{language === 'TH' ? 'คัดลอก' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="relative h-[125px] sm:h-[135px] rounded-xl bg-slate-950/70 border border-slate-800 p-3.5 text-xs sm:text-sm text-slate-200 overflow-y-auto leading-relaxed">
                {isTranslating ? (
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <span className="animate-spin w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full"></span>
                    <span>{language === 'TH' ? 'กำลังประมวลผลคำแปล...' : 'Processing translation...'}</span>
                  </div>
                ) : translatedText ? (
                  <div className="whitespace-pre-wrap">{translatedText}</div>
                ) : (
                  <div className="text-slate-600 text-xs italic">
                    {language === 'TH' ? 'ผลลัพธ์คำแปลจะปรากฏที่นี่...' : 'Translation preview will appear here...'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Business Phrase Templates */}
          <div className="space-y-2 pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'TH' ? 'ข้อความสำเร็จรูปสำหรับการติดต่อธุรกิจ' : 'Corporate Phrase Templates'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.keys(QUICK_BUSINESS_TRANSLATIONS).map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => applyTemplate(phrase)}
                  className="p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-all group"
                >
                  <div className="text-xs text-slate-200 group-hover:text-blue-300 font-medium truncate">
                    {phrase}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                    {QUICK_BUSINESS_TRANSLATIONS[phrase].en}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Special Google Translate Features (Docs & Websites) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            <a
              href="https://translate.google.com/?op=docs"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-300">
                    {language === 'TH' ? 'แปลไฟล์เอกสารทั้งฉบับ' : 'Translate Full Documents'}
                  </div>
                  <div className="text-[10px] text-slate-500">.pdf, .docx, .xlsx, .pptx</div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
            </a>

            <a
              href="https://translate.google.com/?op=websites"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">
                    {language === 'TH' ? 'แปลเว็บไซต์ทั้งหน้า' : 'Translate Full Websites'}
                  </div>
                  <div className="text-[10px] text-slate-500">กรอก URL เพื่อแปลภาษาทั้งหน้าเว็บ</div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
            </a>
          </div>
        </div>

        {/* Modal Footer with Direct Link button */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 text-center sm:text-left">
            <span className="font-mono text-[11px] text-slate-500">
              https://translate.google.com/?sl={sourceLang}&tl={targetLang}&op=translate
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              {language === 'TH' ? 'ปิด' : 'Close'}
            </button>

            <button
              onClick={openGoogleTranslateUrl}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md transition-all"
            >
              <span>{language === 'TH' ? 'เปิดใน Google Translate' : 'Open in Google Translate'}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
