import React, { useState, useMemo } from 'react';
import { 
  BookUser, 
  Search, 
  Plus, 
  Phone, 
  PhoneCall, 
  Mail, 
  Globe, 
  MessageSquare, 
  Clock, 
  FileText, 
  Building2, 
  Check, 
  Copy, 
  Edit, 
  Trash2, 
  X, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  Headphones, 
  Calculator, 
  ReceiptText, 
  Network, 
  Wifi, 
  Wrench,
  RotateCcw
} from 'lucide-react';
import { VendorContact, VendorCategory } from '../types';
import { copyToClipboard } from '../utils/clipboard';

interface VendorContactViewProps {
  vendors: VendorContact[];
  onAddVendor: (vendor: VendorContact) => void;
  onUpdateVendor: (vendor: VendorContact) => void;
  onDeleteVendor: (vendorId: string) => void;
  onResetDefaultVendors?: () => void;
  isAdmin?: boolean;
  language: 'TH' | 'EN';
  onOpenAdminPinModal?: () => void;
}

export const VendorContactView: React.FC<VendorContactViewProps> = ({
  vendors,
  onAddVendor,
  onUpdateVendor,
  onDeleteVendor,
  onResetDefaultVendors,
  isAdmin = false,
  language,
  onOpenAdminPinModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorContact | null>(null);
  const [vendorToDelete, setVendorToDelete] = useState<VendorContact | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formCategory, setFormCategory] = useState<VendorCategory>('accounting');
  const [formServiceDescription, setFormServiceDescription] = useState('');
  const [formContactPerson, setFormContactPerson] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPhoneSecondary, setFormPhoneSecondary] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formLineId, setFormLineId] = useState('');
  const [formWebsite, setFormWebsite] = useState('');
  const [formOperatingHours, setFormOperatingHours] = useState('');
  const [formContractNumber, setFormContractNumber] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formIsHotline24h, setFormIsHotline24h] = useState(false);
  const [formError, setFormError] = useState('');

  const categories = [
    { id: 'all', labelTh: 'ทั้งหมด', labelEn: 'All Vendors', icon: BookUser },
    { id: 'accounting', labelTh: 'บัญชี & ERP', labelEn: 'Accounting & ERP', icon: Calculator },
    { id: 'boi', labelTh: 'BOI & ที่ปรึกษา', labelEn: 'BOI & Advisory', icon: ReceiptText },
    { id: 'it', labelTh: 'IT & เครือข่าย', labelEn: 'IT & Hardware', icon: Network },
    { id: 'isp', labelTh: 'อินเทอร์เน็ต & ผู้ให้บริการ', labelEn: 'ISP & Telecom', icon: Wifi },
    { id: 'facility', labelTh: 'อาคารสถานที่ & ซ่อมบำรุง', labelEn: 'Facilities & Maint.', icon: Wrench },
  ];

  const handleCopy = async (text: string, key: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey(null);
      }, 2000);
    }
  };

  const openCreateModal = () => {
    setEditingVendor(null);
    setFormName('');
    setFormNameEn('');
    setFormCategory('accounting');
    setFormServiceDescription('');
    setFormContactPerson('');
    setFormPhone('');
    setFormPhoneSecondary('');
    setFormEmail('');
    setFormLineId('');
    setFormWebsite('');
    setFormOperatingHours('วันจันทร์ - ศุกร์ 08:30 - 17:30 น.');
    setFormContractNumber('');
    setFormNotes('');
    setFormIsHotline24h(false);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (vendor: VendorContact) => {
    setEditingVendor(vendor);
    setFormName(vendor.name);
    setFormNameEn(vendor.nameEn || '');
    setFormCategory(vendor.category);
    setFormServiceDescription(vendor.serviceDescription);
    setFormContactPerson(vendor.contactPerson || '');
    setFormPhone(vendor.phone);
    setFormPhoneSecondary(vendor.phoneSecondary || '');
    setFormEmail(vendor.email || '');
    setFormLineId(vendor.lineId || '');
    setFormWebsite(vendor.website || '');
    setFormOperatingHours(vendor.operatingHours || '');
    setFormContractNumber(vendor.contractNumber || '');
    setFormNotes(vendor.notes || '');
    setFormIsHotline24h(!!vendor.isHotline24h);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!formName.trim() || !formPhone.trim() || !formServiceDescription.trim()) {
      setFormError(language === 'TH' ? 'กรุณากรอกชื่อบริษัท, เบอร์โทร และรายละเอียดบริการ' : 'Please fill in vendor name, phone, and service description');
      return;
    }

    const vendorData: VendorContact = {
      id: editingVendor ? editingVendor.id : `ven-${Date.now()}`,
      name: formName.trim(),
      nameEn: formNameEn.trim() || undefined,
      category: formCategory,
      serviceDescription: formServiceDescription.trim(),
      contactPerson: formContactPerson.trim() || undefined,
      phone: formPhone.trim(),
      phoneSecondary: formPhoneSecondary.trim() || undefined,
      email: formEmail.trim() || undefined,
      lineId: formLineId.trim() || undefined,
      website: formWebsite.trim() || undefined,
      operatingHours: formOperatingHours.trim() || undefined,
      contractNumber: formContractNumber.trim() || undefined,
      notes: formNotes.trim() || undefined,
      isHotline24h: formIsHotline24h,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (editingVendor) {
      onUpdateVendor(vendorData);
    } else {
      onAddVendor(vendorData);
    }

    setIsModalOpen(false);
  };

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchCat = selectedCategory === 'all' || v.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCat;

      const matchSearch =
        v.name.toLowerCase().includes(q) ||
        (v.nameEn && v.nameEn.toLowerCase().includes(q)) ||
        v.serviceDescription.toLowerCase().includes(q) ||
        v.phone.toLowerCase().includes(q) ||
        (v.phoneSecondary && v.phoneSecondary.toLowerCase().includes(q)) ||
        (v.contactPerson && v.contactPerson.toLowerCase().includes(q)) ||
        (v.email && v.email.toLowerCase().includes(q)) ||
        (v.lineId && v.lineId.toLowerCase().includes(q)) ||
        (v.notes && v.notes.toLowerCase().includes(q)) ||
        (v.contractNumber && v.contractNumber.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [vendors, selectedCategory, searchQuery]);

  const getCategoryBadge = (category: VendorCategory) => {
    switch (category) {
      case 'accounting':
        return {
          label: language === 'TH' ? 'บัญชี & ERP' : 'Accounting & ERP',
          style: 'bg-blue-50 dark:bg-blue-950/70 text-[#1E60D5] dark:text-blue-300 border-blue-200 dark:border-blue-800'
        };
      case 'boi':
        return {
          label: language === 'TH' ? 'BOI & กรมศุลกากร' : 'BOI & Customs',
          style: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
        };
      case 'it':
        return {
          label: language === 'TH' ? 'IT & โครงสร้างระบบ' : 'IT & Infra',
          style: 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
        };
      case 'isp':
        return {
          label: language === 'TH' ? 'อินเทอร์เน็ต & โทรคมนาคม' : 'ISP & Telecom',
          style: 'bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
        };
      case 'facility':
        return {
          label: language === 'TH' ? 'อาคาร & ซ่อมบำรุง' : 'Facility & Maint',
          style: 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
        };
      default:
        return {
          label: language === 'TH' ? 'คู่ค้าทั่วไป' : 'General Vendor',
          style: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* 1. Header Banner & Quick Overview */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-[#1E60D5] dark:text-blue-400 shrink-0 shadow-xs">
            <BookUser className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {language === 'TH' ? 'จัดการผู้ให้บริการ (Vendor Contact)' : 'Vendor & Partner Directory'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'TH' 
                ? 'รวบรวมข้อมูลคู่ค้า ซัพพอร์ตโปรแกรมบัญชี อินเทอร์เน็ต ช่างเทคนิค และช่องทางติดต่อฉุกเฉิน' 
                : 'Centralized enterprise vendors directory, software support, ISP contacts, and hotline support'}
            </p>
          </div>
        </div>

        {/* Action Buttons: Add Vendor (if Admin) or Admin Mode prompt */}
        <div className="flex items-center gap-2 shrink-0">
          {isAdmin ? (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E60D5] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'TH' ? '+ เพิ่มผู้ให้บริการ' : '+ Add Vendor'}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminPinModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              title={language === 'TH' ? 'ปลดล็อกสิทธิ์ Admin เพื่อเพิ่มหรือแก้ไขคู่ค้า' : 'Unlock Admin to manage vendors'}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'TH' ? 'โหมด Admin (แก้ไขได้)' : 'Admin Mode'}</span>
            </button>
          )}

          {isAdmin && onResetDefaultVendors && (
            <button
              onClick={onResetDefaultVendors}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title={language === 'TH' ? 'รีเซ็ตข้อมูลคู่ค้าเป็นค่าเริ่มต้น' : 'Reset to default vendors'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Controls: Category Tabs & Real-time Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-x-auto scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#1E60D5] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{language === 'TH' ? cat.labelTh : cat.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px] sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'TH' ? 'ค้นหาชื่อคู่ค้า, เบอร์โทร, บริการ...' : 'Search vendor, phone, service...'}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#1E60D5] dark:focus:border-blue-500 transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* 3. Vendor Cards Grid */}
      {filteredVendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVendors.map((vendor) => {
            const catBadge = getCategoryBadge(vendor.category);
            return (
              <div 
                key={vendor.id}
                className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-600/60 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top: Category Tag + Hotline Badge + Admin Actions */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${catBadge.style}`}>
                        {catBadge.label}
                      </span>
                      {vendor.isHotline24h && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          24/7 Hotline
                        </span>
                      )}
                    </div>

                    {/* Admin Action Buttons (Edit / Delete) */}
                    {isAdmin && (
                      <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(vendor)}
                          className="p-1 rounded-lg text-slate-400 hover:text-[#1E60D5] hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title={language === 'TH' ? 'แก้ไขข้อมูล' : 'Edit'}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setVendorToDelete(vendor)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title={language === 'TH' ? 'ลบข้อมูล' : 'Delete'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Company Name */}
                  <div className="space-y-0.5">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug group-hover:text-[#1E60D5] transition-colors">
                      {vendor.name}
                    </h3>
                    {vendor.nameEn && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        {vendor.nameEn}
                      </p>
                    )}
                  </div>

                  {/* Service Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed bg-slate-50/60 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    {vendor.serviceDescription}
                  </p>

                  {/* Contact Person */}
                  {vendor.contactPerson && (
                    <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {language === 'TH' ? 'ผู้ประสานงาน:' : 'Contact:'}
                      </span>
                      <span>{vendor.contactPerson}</span>
                    </div>
                  )}

                  {/* Contact Details List */}
                  <div className="mt-3.5 space-y-2 text-xs">
                    {/* Primary Phone */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700">
                      <div className="flex items-center gap-2 min-w-0">
                        <PhoneCall className="w-3.5 h-3.5 text-[#1E60D5] dark:text-blue-400 shrink-0" />
                        <a 
                          href={`tel:${vendor.phone.replace(/[^0-9]/g, '')}`} 
                          className="font-mono font-bold text-slate-900 dark:text-white hover:underline truncate"
                        >
                          {vendor.phone}
                        </a>
                      </div>
                      <button
                        onClick={() => handleCopy(vendor.phone, `phone-${vendor.id}`)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        title={language === 'TH' ? 'คัดลอกเบอร์โทร' : 'Copy Phone'}
                      >
                        {copiedKey === `phone-${vendor.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Secondary Phone if available */}
                    {vendor.phoneSecondary && (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/60 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                        <div className="flex items-center gap-2 min-w-0">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <a 
                            href={`tel:${vendor.phoneSecondary.replace(/[^0-9]/g, '')}`} 
                            className="font-mono font-semibold text-slate-700 dark:text-slate-300 hover:underline truncate"
                          >
                            {vendor.phoneSecondary}
                          </a>
                        </div>
                        <button
                          onClick={() => handleCopy(vendor.phoneSecondary!, `phone2-${vendor.id}`)}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                          title="Copy Secondary Phone"
                        >
                          {copiedKey === `phone2-${vendor.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}

                    {/* Email */}
                    {vendor.email && (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700">
                        <div className="flex items-center gap-2 min-w-0">
                          <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <a 
                            href={`mailto:${vendor.email}`} 
                            className="text-slate-800 dark:text-slate-200 hover:underline truncate text-[11px] font-mono"
                          >
                            {vendor.email}
                          </a>
                        </div>
                        <button
                          onClick={() => handleCopy(vendor.email!, `email-${vendor.id}`)}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                          title="Copy Email"
                        >
                          {copiedKey === `email-${vendor.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}

                    {/* Line ID / Website */}
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                      {vendor.lineId && (
                        <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200/60 text-emerald-700 dark:text-emerald-300">
                          <MessageSquare className="w-3 h-3" />
                          <span>Line: {vendor.lineId}</span>
                        </div>
                      )}
                      {vendor.website && (
                        <a 
                          href={vendor.website} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-lg border border-blue-200/60 text-[#1E60D5] dark:text-blue-300 hover:underline"
                        >
                          <Globe className="w-3 h-3" />
                          <span>Website</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Footer: Operating Hours & Contract info */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 space-y-1">
                  {vendor.operatingHours && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span className="truncate">{vendor.operatingHours}</span>
                    </div>
                  )}
                  {vendor.contractNumber && (
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3 h-3 shrink-0" />
                      <span className="truncate">{language === 'TH' ? 'เลขที่สัญญา:' : 'Contract:'} {vendor.contractNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 px-6 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-4 max-w-md mx-auto my-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-[#1E60D5] dark:text-blue-400">
            <BookUser className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {language === 'TH' ? 'ไม่พบข้อมูลผู้ให้บริการตามที่ระบุ' : 'No matching vendors found'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'TH' 
                ? 'ลองปรับคำค้นหา หรือเลือกหมวดหมู่อื่นเพื่อดูรายชื่อคู่ค้า' 
                : 'Try adjusting your search criteria or select another category'}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E60D5] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'TH' ? '+ เพิ่มผู้ให้บริการใหม่' : '+ Add New Vendor'}</span>
            </button>
          )}
        </div>
      )}

      {/* 4. Admin Add / Edit Vendor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div 
            className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {editingVendor
                      ? (language === 'TH' ? 'แก้ไขข้อมูลผู้ให้บริการ' : 'Edit Vendor')
                      : (language === 'TH' ? 'เพิ่มผู้ให้บริการใหม่ (Add Vendor)' : 'Add New Vendor')}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {language === 'TH' ? 'บันทึกข้อมูลและช่องทางติดต่อคู่ค้า' : 'Configure vendor contact details'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Vendor Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === 'TH' ? 'ชื่อบริษัท / ผู้ให้บริการ *' : 'Vendor Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="เช่น บริษัท เอ็กซ์เพรสซอฟท์แวร์กรุ๊ป จำกัด"
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                {/* English Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {language === 'TH' ? 'ชื่อภาษาอังกฤษ' : 'English Name'}
                  </label>
                  <input
                    type="text"
                    value={formNameEn}
                    onChange={(e) => setFormNameEn(e.target.value)}
                    placeholder="e.g. Express Software Group Co., Ltd."
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === 'TH' ? 'หมวดหมู่บริการ' : 'Category'}
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as VendorCategory)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 focus:outline-none focus:border-[#1E60D5]"
                  >
                    <option value="accounting">บัญชี & ERP (Accounting & ERP)</option>
                    <option value="boi">BOI & กรมศุลกากร (BOI & Customs)</option>
                    <option value="it">IT & ระบบเครือข่าย (IT & Infra)</option>
                    <option value="isp">อินเทอร์เน็ต & โทรคมนาคม (ISP & Telecom)</option>
                    <option value="facility">อาคารสถานที่ & ซ่อมบำรุง (Facility & Maint)</option>
                    <option value="other">อื่นๆ (Other)</option>
                  </select>
                </div>

                {/* Contact Person */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {language === 'TH' ? 'ผู้ติดต่อ / ฝ่ายที่รับผิดชอบ' : 'Contact Person / Dept'}
                  </label>
                  <input
                    type="text"
                    value={formContactPerson}
                    onChange={(e) => setFormContactPerson(e.target.value)}
                    placeholder="เช่น คุณสมศักดิ์ (Customer Support)"
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                {/* Phone Primary */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === 'TH' ? 'เบอร์โทรหลัก *' : 'Primary Phone *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="เช่น 02-587-8000 หรือ 1239"
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                {/* Phone Secondary */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {language === 'TH' ? 'เบอร์โทรสำรอง / มือถือ' : 'Secondary Phone'}
                  </label>
                  <input
                    type="text"
                    value={formPhoneSecondary}
                    onChange={(e) => setFormPhoneSecondary(e.target.value)}
                    placeholder="เช่น 081-358-8888"
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {language === 'TH' ? 'อีเมล' : 'Email'}
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="support@company.com"
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                {/* Line ID */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {language === 'TH' ? 'Line ID' : 'Line ID'}
                  </label>
                  <input
                    type="text"
                    value={formLineId}
                    onChange={(e) => setFormLineId(e.target.value)}
                    placeholder="@company_line"
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                {/* Website */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {language === 'TH' ? 'เว็บไซต์' : 'Website'}
                  </label>
                  <input
                    type="text"
                    value={formWebsite}
                    onChange={(e) => setFormWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                {/* Operating Hours */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {language === 'TH' ? 'เวลาทำการ / SLA' : 'Operating Hours'}
                  </label>
                  <input
                    type="text"
                    value={formOperatingHours}
                    onChange={(e) => setFormOperatingHours(e.target.value)}
                    placeholder="วันจันทร์ - ศุกร์ 08:30 - 17:30 น."
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                {/* Contract Number */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {language === 'TH' ? 'เลขที่สัญญา / หมายเลขอ้างอิง' : 'Contract Number / Customer Ref'}
                  </label>
                  <input
                    type="text"
                    value={formContractNumber}
                    onChange={(e) => setFormContractNumber(e.target.value)}
                    placeholder="EXP-QS-2026-081"
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                {/* Service Description */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === 'TH' ? 'รายละเอียดบริการที่ให้ *' : 'Service Description *'}
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formServiceDescription}
                    onChange={(e) => setFormServiceDescription(e.target.value)}
                    placeholder="ระบุรายละเอียดงานที่คู่ค้ารายนี้ดูแล..."
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {language === 'TH' ? 'หมายเหตุเพิ่มเติม' : 'Notes'}
                  </label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="หมายเหตุหรือข้อมูลเฉพาะสำหรับการประสานงาน..."
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                {/* 24/7 Hotline Checkbox */}
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsHotline24h}
                      onChange={(e) => setFormIsHotline24h(e.target.checked)}
                      className="w-4 h-4 rounded text-[#1E60D5] border-slate-300 dark:border-slate-600 focus:ring-[#1E60D5]"
                    />
                    <span>{language === 'TH' ? 'เปิดบริการตลอด 24 ชั่วโมง (24/7 Emergency Hotline)' : '24/7 Emergency Hotline'}</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1E60D5] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  {language === 'TH' ? 'บันทึกข้อมูล' : 'Save Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      {vendorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {language === 'TH' ? 'ยืนยันการลบผู้ให้บริการ' : 'Confirm Vendor Deletion'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'TH' 
                  ? `คุณต้องการลบ "${vendorToDelete.name}" ออกจากรายชื่อผู้ให้บริการใช่หรือไม่?` 
                  : `Are you sure you want to delete "${vendorToDelete.name}"?`}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setVendorToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDeleteVendor(vendorToDelete.id);
                  setVendorToDelete(null);
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
