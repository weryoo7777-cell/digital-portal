import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  Laptop,
  Cloud,
  Terminal,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { EnterpriseApp, AppCategory, AppLaunchType, AppStatus, UserRole } from '../types';

interface AppManageModalProps {
  isOpen: boolean;
  editingApp: EnterpriseApp | null;
  onClose: () => void;
  onSaveApp: (app: EnterpriseApp) => void;
  language: 'TH' | 'EN';
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

export const AppManageModal: React.FC<AppManageModalProps> = ({
  isOpen,
  editingApp,
  onClose,
  onSaveApp,
  language
}) => {
  const [name, setName] = useState('');
  const [nameTh, setNameTh] = useState('');
  const [category, setCategory] = useState<Exclude<AppCategory, 'all'>>('operations');
  const [description, setDescription] = useState('');
  const [descriptionTh, setDescriptionTh] = useState('');
  const [url, setUrl] = useState('');
  const [iconName, setIconName] = useState('Layers');
  const [launchType, setLaunchType] = useState<AppLaunchType>('web');
  const [status, setStatus] = useState<AppStatus>('online');
  const [badge, setBadge] = useState('');
  const [accessLevel, setAccessLevel] = useState<'all' | 'admin'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingApp) {
      setName(editingApp.name);
      setNameTh(editingApp.nameTh);
      setCategory(editingApp.category);
      setDescription(editingApp.description);
      setDescriptionTh(editingApp.descriptionTh);
      setUrl(editingApp.url);
      setIconName(editingApp.iconName || 'Layers');
      setLaunchType(editingApp.launchType);
      setStatus(editingApp.status);
      setBadge(editingApp.badge || '');
      setAccessLevel(editingApp.allowedRoles.length === 1 && editingApp.allowedRoles[0].toLowerCase() === 'admin' ? 'admin' : 'all');
    } else {
      setName('');
      setNameTh('');
      setCategory('operations');
      setDescription('');
      setDescriptionTh('');
      setUrl('https://');
      setIconName('Layers');
      setLaunchType('web');
      setStatus('online');
      setBadge('');
      setAccessLevel('all');
    }
    setError(null);
  }, [editingApp, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

    const targetApp: EnterpriseApp = {
      id: editingApp ? editingApp.id : `app-${Date.now()}`,
      name: cleanName,
      nameTh: nameTh.trim() || cleanName,
      category,
      description: description.trim() || `${cleanName} enterprise application for corporate workflow.`,
      descriptionTh: descriptionTh.trim() || `${nameTh.trim() || cleanName} ระบบงานดิจิทัลสำหรับพนักงานองค์กร`,
      url: cleanUrl,
      iconName,
      launchType,
      status,
      badge: badge.trim() || undefined,
      allowedRoles,
      isFrequent: editingApp ? editingApp.isFrequent : false
    };

    onSaveApp(targetApp);
    onClose();
  };

  const SelectedIconComp = AVAILABLE_APP_ICONS.find(i => i.name === iconName)?.icon || Layers;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl text-slate-900 dark:text-white my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-[#1E60D5] dark:text-blue-400">
              <SelectedIconComp className="w-6 h-6" />
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
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
                <option value="accounting">Accounting (การบัญชี)</option>
                <option value="tax">Tax / Gov (ภาษีและราชการ)</option>
                <option value="hr">HR & People (ทรัพยากรบุคคล)</option>
                <option value="it">IT Infra (ระบบไอที)</option>
                <option value="operations">Operations (ปฏิบัติการ & ERP)</option>
                <option value="productivity">Productivity (เครื่องมือทำงาน)</option>
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

          {/* Row 5: Icon Selection Grid */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {language === 'TH' ? 'เลือกไอคอนแอปพลิเคชัน (Select App Icon)' : 'Select Icon'}
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {iconName}
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-2 max-h-36 overflow-y-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              {AVAILABLE_APP_ICONS.map((item) => {
                const IconComp = item.icon;
                const isSelected = iconName === item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIconName(item.name)}
                    className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-[#1E60D5] text-white shadow-xs scale-105'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700'
                    }`}
                    title={item.label}
                  >
                    <IconComp className="w-5 h-5 shrink-0" />
                    <span className="text-[9px] truncate max-w-full font-mono">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 6: Role Access Control */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'TH' ? 'กำหนดสิทธิ์การเข้าใช้งาน (Role Access)' : 'Access Permission'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccessLevel('all')}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
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
                onClick={() => setAccessLevel('admin')}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
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
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1E60D5] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
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
