import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Check, 
  Layers, 
  Calculator, 
  ScanText, 
  ReceiptText, 
  FileCheck, 
  Network, 
  ShieldCheck, 
  Headphones, 
  Users, 
  Package, 
  HardDrive, 
  Mail, 
  CalendarCheck, 
  BarChart3, 
  Building2, 
  Landmark, 
  Globe, 
  CreditCard, 
  Banknote,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { EnterpriseApp, AppCategory, AppLaunchType, AppStatus, UserRole } from '../types';

interface AppManageModalProps {
  isOpen: boolean;
  editingApp: EnterpriseApp | null;
  onClose: () => void;
  onSaveApp: (app: EnterpriseApp) => void;
  language: 'TH' | 'EN';
  defaultCategory?: AppCategory;
}

export const AVAILABLE_APP_ICONS: Array<{ name: string; label: string; icon: React.ElementType }> = [
  { name: 'Calculator', label: 'เครื่องคิดเลข / บัญชี', icon: Calculator },
  { name: 'ScanText', label: 'OCR สแกนข้อความ', icon: ScanText },
  { name: 'ReceiptText', label: 'ใบเสร็จ / ภาษี', icon: ReceiptText },
  { name: 'FileCheck', label: 'ตรวจสอบเอกสาร', icon: FileCheck },
  { name: 'Layers', label: 'ระบบจัดการหลายชั้น', icon: Layers },
  { name: 'Network', label: 'เน็ตเวิร์ก / เราเตอร์', icon: Network },
  { name: 'ShieldCheck', label: 'ความปลอดภัย / ไฟร์วอลล์', icon: ShieldCheck },
  { name: 'Headphones', label: 'Helpdesk บริการผู้ใช้', icon: Headphones },
  { name: 'Users', label: 'HR / บุคลากร', icon: Users },
  { name: 'Package', label: 'คลังสินค้า / สต็อก', icon: Package },
  { name: 'HardDrive', label: 'คลาวด์ไดรฟ์ / Storage', icon: HardDrive },
  { name: 'Mail', label: 'อีเมลองค์กร', icon: Mail },
  { name: 'CalendarCheck', label: 'ปฏิทิน / นัดหมาย', icon: CalendarCheck },
  { name: 'BarChart3', label: 'รายงานวิเคราะห์กราฟ', icon: BarChart3 },
  { name: 'Building2', label: 'สำนักงาน / องค์กร', icon: Building2 },
  { name: 'Landmark', label: 'ธนาคาร / ภาครัฐ', icon: Landmark },
  { name: 'Globe', label: 'เว็บไซต์ / พอร์ทัล', icon: Globe },
  { name: 'CreditCard', label: 'การเงิน / บัตรเครดิต', icon: CreditCard },
  { name: 'Banknote', label: 'เงินสด / ภาษีรายได้', icon: Banknote },
];

export const extractDomain = (rawUrl: string): string => {
  try {
    const trimmed = rawUrl.trim();
    if (!trimmed || trimmed === 'https://' || trimmed === 'http://') return '';
    const withProto = trimmed.startsWith('http://') || trimmed.startsWith('https://') 
      ? trimmed 
      : `https://${trimmed}`;
    const parsed = new URL(withProto);
    return parsed.hostname;
  } catch {
    return '';
  }
};

export const getFaviconUrl = (rawUrl: string): string => {
  const domain = extractDomain(rawUrl);
  if (!domain || domain.length < 3 || !domain.includes('.')) return '';
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
};

export const AppManageModal: React.FC<AppManageModalProps> = ({
  isOpen,
  editingApp,
  onClose,
  onSaveApp,
  language,
  defaultCategory = 'accounting'
}) => {
  const resolvedDefaultCat: Exclude<AppCategory, 'all'> = 
    defaultCategory === 'boi' ? 'boi' : defaultCategory === 'it' ? 'it' : 'accounting';

  const [name, setName] = useState('');
  const [nameTh, setNameTh] = useState('');
  const [category, setCategory] = useState<Exclude<AppCategory, 'all'>>(resolvedDefaultCat);
  const [description, setDescription] = useState('');
  const [descriptionTh, setDescriptionTh] = useState('');
  const [url, setUrl] = useState('');
  
  // 3-Mode Icon System: 'auto' (domain favicon) | 'upload' (computer image) | 'preset' (lucide icons)
  const [iconMode, setIconMode] = useState<'auto' | 'upload' | 'preset'>('auto');
  const [iconName, setIconName] = useState('Layers');
  const [uploadedIconData, setUploadedIconData] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [launchType, setLaunchType] = useState<AppLaunchType>('web');
  const [status, setStatus] = useState<AppStatus>('online');
  const [badge, setBadge] = useState('');
  const [accessLevel, setAccessLevel] = useState<'all' | 'admin'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingApp) {
      setName(editingApp.name);
      setNameTh(editingApp.nameTh || '');
      setCategory(editingApp.category);
      setDescription(editingApp.description || '');
      setDescriptionTh(editingApp.descriptionTh || '');
      setUrl(editingApp.url || '');
      setLaunchType(editingApp.launchType);
      setStatus(editingApp.status);
      setBadge(editingApp.badge || '');
      setAccessLevel(editingApp.allowedRoles.length === 1 && editingApp.allowedRoles[0].toLowerCase() === 'admin' ? 'admin' : 'all');

      const custom = editingApp.customIconUrl || '';
      if (custom.startsWith('data:') || editingApp.iconName?.startsWith('data:')) {
        setIconMode('upload');
        setUploadedIconData(custom || editingApp.iconName);
        setUploadedFileName('Custom Uploaded Icon');
        setIconName('Layers');
      } else if (custom.includes('google.com/s2/favicons') || (editingApp.iconName?.startsWith('http') && editingApp.iconName.includes('favicon'))) {
        setIconMode('auto');
        setUploadedIconData('');
        setUploadedFileName('');
        setIconName('Globe');
      } else if (custom.startsWith('http') || editingApp.iconName?.startsWith('http')) {
        setIconMode('auto');
        setUploadedIconData('');
        setUploadedFileName('');
        setIconName('Globe');
      } else {
        setIconMode('preset');
        setIconName(editingApp.iconName || 'Layers');
        setUploadedIconData('');
        setUploadedFileName('');
      }
    } else {
      setName('');
      setNameTh('');
      setCategory(resolvedDefaultCat);
      setDescription('');
      setDescriptionTh('');
      setUrl('https://');
      setIconMode('auto');
      setIconName('Layers');
      setUploadedIconData('');
      setUploadedFileName('');
      setLaunchType('web');
      setStatus('online');
      setBadge('');
      setAccessLevel('all');
    }
    setError(null);
  }, [editingApp, isOpen, resolvedDefaultCat]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(language === 'TH' ? 'กรุณาเลือกไฟล์รูปภาพ (PNG, JPG, SVG, WebP)' : 'Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError(language === 'TH' ? 'ขนาดไฟล์รูปภาพต้องไม่เกิน 2MB' : 'Image size must not exceed 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUploadedIconData(result);
      setUploadedFileName(file.name);
      setIconMode('upload');
      setError(null);
    };
    reader.onerror = () => {
      setError(language === 'TH' ? 'เกิดข้อผิดพลาดในการอ่านไฟล์รูปภาพ' : 'Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);

    const cleanName = name.trim();
    const cleanUrl = url.trim();

    if (!cleanName) {
      setError(language === 'TH' ? 'กรุณาระบุชื่อแอปพลิเคชัน (App Name)' : 'Please enter App Name');
      return;
    }
    if (!cleanUrl || cleanUrl === 'https://') {
      setError(language === 'TH' ? 'กรุณาระบุ URL สำหรับเปิดใช้งานแอป' : 'Please enter a valid launch URL');
      return;
    }

    const allowedRoles: UserRole[] = accessLevel === 'admin' 
      ? ['ADMIN', 'admin'] 
      : ['ADMIN', 'ACCOUNTING', 'IT', 'HR', 'SALES_OPERATIONS', 'admin', 'user'];

    let finalIconName = iconName;
    let finalCustomIconUrl: string | undefined = undefined;

    if (iconMode === 'auto') {
      const autoFavicon = getFaviconUrl(cleanUrl);
      if (autoFavicon) {
        finalCustomIconUrl = autoFavicon;
        finalIconName = autoFavicon;
      }
    } else if (iconMode === 'upload') {
      if (uploadedIconData) {
        finalCustomIconUrl = uploadedIconData;
        finalIconName = uploadedIconData;
      }
    } else {
      finalCustomIconUrl = undefined;
      finalIconName = iconName;
    }

    const targetApp: EnterpriseApp = {
      id: editingApp ? editingApp.id : `app-${Date.now()}`,
      name: cleanName,
      nameTh: nameTh.trim() || cleanName,
      category,
      description: description.trim() || `${cleanName} enterprise application for corporate workflow.`,
      descriptionTh: descriptionTh.trim() || `${nameTh.trim() || cleanName} ระบบงานดิจิทัลสำหรับพนักงานองค์กร`,
      url: cleanUrl,
      iconName: finalIconName,
      customIconUrl: finalCustomIconUrl,
      launchType,
      status,
      badge: badge.trim() || undefined,
      allowedRoles,
      isFrequent: editingApp ? editingApp.isFrequent : false
    };

    onSaveApp(targetApp);
    onClose();
  };

  const renderCurrentIconPreview = () => {
    if (iconMode === 'upload' && uploadedIconData) {
      return (
        <img 
          src={uploadedIconData} 
          alt="Uploaded icon" 
          className="w-7 h-7 object-contain rounded-md" 
        />
      );
    }
    if (iconMode === 'auto') {
      const favUrl = getFaviconUrl(url);
      if (favUrl) {
        return (
          <img 
            src={favUrl} 
            alt="Favicon" 
            className="w-7 h-7 object-contain rounded-md bg-white/90 p-0.5" 
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        );
      }
    }
    const IconComp = AVAILABLE_APP_ICONS.find(i => i.name === iconName)?.icon || Layers;
    return <IconComp className="w-6 h-6" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl text-slate-900 dark:text-white my-8 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-[#1E60D5] dark:text-blue-400 shrink-0 overflow-hidden shadow-2xs">
              {renderCurrentIconPreview()}
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {editingApp 
                  ? (language === 'TH' ? 'แก้ไขข้อมูลแอปพลิเคชัน (Edit App)' : 'Edit Enterprise Application')
                  : (language === 'TH' ? 'เพิ่มแอปพลิเคชันใหม่ (Add New App)' : 'Add New Enterprise Application')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'TH' ? 'กำหนด URL ลิงก์จริง หมวดหมู่ และไอคอนที่แสดงบนพอร์ทัล' : 'Set launch URL, category, icon, and role permissions'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          {/* Row 1: Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'TH' ? 'ชื่อแอป (English Name) *' : 'App Name (English) *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Express Accounting"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E60D5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'TH' ? 'ชื่อภาษาไทย (Thai Name)' : 'App Name (Thai)'}
              </label>
              <input
                type="text"
                value={nameTh}
                onChange={(e) => setNameTh(e.target.value)}
                placeholder="e.g. ระบบบัญชี Express"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E60D5]"
              />
            </div>
          </div>

          {/* Row 2: Category & URL */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'TH' ? 'หมวดหมู่ (Category) *' : 'Category *'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E60D5]"
              >
                <option value="accounting">บัญชี (Accounting)</option>
                <option value="boi">BOI</option>
                <option value="it">IT</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'TH' ? 'URL ลิงก์จริงสำหรับเปิดใช้งาน *' : 'Real Launch URL *'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://app.qisheng.co.th or https://drive.google.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#1E60D5]"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'TH' ? 'คำอธิบาย (ภาษาไทย)' : 'Description (Thai)'}
              </label>
              <textarea
                rows={2}
                value={descriptionTh}
                onChange={(e) => setDescriptionTh(e.target.value)}
                placeholder="คำอธิบายฟังก์ชันการทำงานของระบบงาน..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E60D5] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'TH' ? 'คำอธิบาย (English Description)' : 'Description (English)'}
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of application features..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E60D5] resize-none"
              />
            </div>
          </div>

          {/* Row 4: Launch Type, Status & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'TH' ? 'ประเภทการเปิด (Launch Type)' : 'Launch Type'}
              </label>
              <select
                value={launchType}
                onChange={(e) => setLaunchType(e.target.value as AppLaunchType)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E60D5]"
              >
                <option value="web">Web Browser (แท็บใหม่)</option>
                <option value="intranet">Intranet Portal (เครือข่ายภายใน)</option>
                <option value="remote_rdp">Remote Desktop / RDP</option>
                <option value="cloud">Cloud SaaS Service</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'TH' ? 'สถานะระบบ (Status)' : 'Status'}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AppStatus)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E60D5]"
              >
                <option value="online">Online (พร้อมใช้งาน)</option>
                <option value="maintenance">Maintenance (ปิดปรับปรุง)</option>
                <option value="restricted">Restricted (จำกัดเฉพาะสิทธิ์)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'TH' ? 'ป้ายกำกับ (Badge / Tag)' : 'Badge Tag'}
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="เช่น Core, AI, Gov"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E60D5]"
              />
            </div>
          </div>

          {/* Row 5: 3-Mode Application Icon System */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                {language === 'TH' ? 'ระบบไอคอนแอปพลิเคชัน (App Icon)' : 'App Icon System'}
              </label>
              <span className="text-[11px] font-mono font-medium text-slate-500">
                {iconMode === 'auto' ? (language === 'TH' ? 'ดึง Favicon อัตโนมัติ' : 'Auto Domain Favicon') :
                 iconMode === 'upload' ? (language === 'TH' ? 'รูปภาพที่อัปโหลด' : 'Uploaded Image') :
                 (language === 'TH' ? `ไอคอนสำเร็จรูป: ${iconName}` : `Preset: ${iconName}`)}
              </span>
            </div>

            {/* 3 Mode Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIconMode('auto');
                }}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  iconMode === 'auto'
                    ? 'bg-[#1E60D5] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="truncate">{language === 'TH' ? '[ดึงไอคอนอัตโนมัติ]' : '[Auto Favicon]'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIconMode('upload');
                }}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  iconMode === 'upload'
                    ? 'bg-[#1E60D5] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="truncate">{language === 'TH' ? '[อัปโหลดรูปจากเครื่อง]' : '[Upload Image]'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIconMode('preset');
                }}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  iconMode === 'preset'
                    ? 'bg-[#1E60D5] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="truncate">{language === 'TH' ? '[เลือกจากไอคอนสำเร็จรูป]' : '[Preset Icons]'}</span>
              </button>
            </div>

            {/* Mode 1 Content: Auto Favicon */}
            {iconMode === 'auto' && (
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs p-1">
                    {getFaviconUrl(url) ? (
                      <img 
                        src={getFaviconUrl(url)} 
                        alt="Favicon Preview" 
                        className="w-8 h-8 object-contain rounded"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }} 
                      />
                    ) : (
                      <Globe className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {extractDomain(url) ? `Favicon จาก Domain: ${extractDomain(url)}` : (language === 'TH' ? 'ยังไม่ได้ระบุ Domain' : 'No Domain Detected')}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {getFaviconUrl(url) 
                        ? (language === 'TH' ? 'ดึง Favicon อัตโนมัติจาก URL ที่ระบุ' : 'Automatically fetched favicon from URL domain')
                        : (language === 'TH' ? 'กรุณากรอก URL ลิงก์ด้านบน ระบบจะดึง Favicon ให้ทันที' : 'Enter URL above to auto-fetch domain logo')}
                    </div>
                  </div>
                </div>
                {getFaviconUrl(url) && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                    {language === 'TH' ? 'พร้อมใช้งาน' : 'Ready'}
                  </span>
                )}
              </div>
            )}

            {/* Mode 2 Content: Upload from Computer */}
            {iconMode === 'upload' && (
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-3">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden p-1">
                      {uploadedIconData ? (
                        <img 
                          src={uploadedIconData} 
                          alt="Uploaded icon" 
                          className="w-10 h-10 object-contain rounded" 
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {uploadedFileName || (uploadedIconData ? (language === 'TH' ? 'มีรูปภาพกำหนดไว้แล้ว' : 'Custom Image Active') : (language === 'TH' ? 'ยังไม่ได้เลือกรูปภาพ' : 'No image selected'))}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {language === 'TH' ? 'รองรับ PNG, JPG, WebP, SVG (แปลงเป็น Base64 อัตโนมัติ)' : 'Supports PNG, JPG, WebP, SVG (converted to Base64)'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#1E60D5] hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{language === 'TH' ? 'เลือกรูปภาพจากคอมพิวเตอร์' : 'Choose File from PC'}</span>
                    </button>
                    {uploadedIconData && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setUploadedIconData('');
                          setUploadedFileName('');
                        }}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors cursor-pointer"
                        title={language === 'TH' ? 'ลบรูปภาพ' : 'Remove Image'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Mode 3 Content: Preset Icons Grid */}
            {iconMode === 'preset' && (
              <div className="space-y-2">
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-2 max-h-36 overflow-y-auto p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  {AVAILABLE_APP_ICONS.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = iconName === item.name;

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIconName(item.name);
                        }}
                        className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/80 border-2 border-[#1E60D5] text-[#1E60D5] dark:text-blue-300 shadow-xs'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-transparent'
                        }`}
                        title={item.label}
                      >
                        <IconComp className="w-4 h-4" />
                        <span className="text-[9px] truncate max-w-full text-center">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Row 6: Role Access Control */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'TH' ? 'กำหนดสิทธิ์การเข้าใช้งาน (Role Access)' : 'Access Permission'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAccessLevel('all');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  accessLevel === 'all'
                    ? 'bg-blue-50 dark:bg-blue-950/70 border-[#1E60D5] text-[#1E60D5] dark:text-blue-300 ring-2 ring-blue-200'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{language === 'TH' ? 'ทุกคนเข้าถึงได้ (All Users)' : 'All Users & Admins'}</div>
                  <div className="text-[10px] text-slate-500">พนักงานทุกคนเปิดแอปนี้ได้</div>
                </div>
                {accessLevel === 'all' && <Check className="w-4 h-4 text-[#1E60D5]" />}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAccessLevel('admin');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  accessLevel === 'admin'
                    ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-500 text-amber-800 dark:text-amber-300 ring-2 ring-amber-200'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{language === 'TH' ? 'เฉพาะ Admin (Admin Only)' : 'Admin Only'}</div>
                  <div className="text-[10px] text-slate-500">จำกัดเฉพาะผู้ดูแลระบบ</div>
                </div>
                {accessLevel === 'admin' && <Check className="w-4 h-4 text-amber-600" />}
              </button>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1E60D5] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{editingApp ? (language === 'TH' ? 'บันทึกการแก้ไข' : 'Save App') : (language === 'TH' ? 'เพิ่มแอปใหม่' : 'Add App')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
