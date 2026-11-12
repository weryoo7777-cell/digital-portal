import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  Plus,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  FileText,
  Copy,
  Check,
  Edit,
  Trash2,
  X,
  AlertCircle,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { AffiliateCompany } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { INITIAL_AFFILIATES } from '../data/affiliatesData';

interface AffiliatesViewProps {
  language: 'TH' | 'EN';
  isAdmin?: boolean;
  onOpenAdminPinModal?: () => void;
}

const STORAGE_KEY = 'qs_affiliate_companies_v1';
const PERSISTED_FLAG_KEY = 'qs_affiliate_companies_persisted';

export const AffiliatesView: React.FC<AffiliatesViewProps> = ({
  language,
  isAdmin = false,
  onOpenAdminPinModal
}) => {
  const [affiliates, setAffiliates] = useState<AffiliateCompany[]>(() => {
    try {
      if (localStorage.getItem(PERSISTED_FLAG_KEY) === 'true') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      }
    } catch {}
    return INITIAL_AFFILIATES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<AffiliateCompany | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<AffiliateCompany | null>(null);

  // Form States
  const [formNameTh, setFormNameTh] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formShortCode, setFormShortCode] = useState('');
  const [formBusinessTypeTh, setFormBusinessTypeTh] = useState('');
  const [formBusinessTypeEn, setFormBusinessTypeEn] = useState('');
  const [formTaxId, setFormTaxId] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formWebsite, setFormWebsite] = useState('');
  const [formAddressTh, setFormAddressTh] = useState('');
  const [formAddressEn, setFormAddressEn] = useState('');
  const [formOperatingHours, setFormOperatingHours] = useState('');
  const [formIsHq, setFormIsHq] = useState(false);
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState('');

  const persistAffiliates = (next: AffiliateCompany[]) => {
    setAffiliates(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      localStorage.setItem(PERSISTED_FLAG_KEY, 'true');
    } catch {}
  };

  const handleCopy = async (text: string, key: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const openCreateModal = () => {
    setEditingCompany(null);
    setFormNameTh('');
    setFormNameEn('');
    setFormShortCode('');
    setFormBusinessTypeTh('');
    setFormBusinessTypeEn('');
    setFormTaxId('');
    setFormPhone('');
    setFormEmail('');
    setFormWebsite('');
    setFormAddressTh('888/11 หมู่ 4 ต.มาบยางพร อ.ปลวกแดง จ.ระยอง 21140');
    setFormAddressEn('888/11 Moo 4, Mabyangporn, Pluakdaeng, Rayong 21140');
    setFormOperatingHours('วันจันทร์ - ศุกร์ 08:00 - 17:00 น.');
    setFormIsHq(false);
    setFormNotes('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (company: AffiliateCompany) => {
    setEditingCompany(company);
    setFormNameTh(company.nameTh);
    setFormNameEn(company.nameEn);
    setFormShortCode(company.shortCode || '');
    setFormBusinessTypeTh(company.businessTypeTh);
    setFormBusinessTypeEn(company.businessTypeEn);
    setFormTaxId(company.taxId);
    setFormPhone(company.phone);
    setFormEmail(company.email || '');
    setFormWebsite(company.website || '');
    setFormAddressTh(company.addressTh);
    setFormAddressEn(company.addressEn || '');
    setFormOperatingHours(company.operatingHours || '');
    setFormIsHq(!!company.isHeadquarters);
    setFormNotes(company.notes || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!formNameTh.trim() || !formTaxId.trim() || !formPhone.trim()) {
      setFormError(
        language === 'TH'
          ? 'กรุณากรอกชื่อบริษัท (ภาษาไทย), เลขประจำตัวผู้เสียภาษี และเบอร์โทรศัพท์'
          : 'Please fill in company Thai name, Tax ID, and phone number'
      );
      return;
    }

    const payload: AffiliateCompany = {
      id: editingCompany ? editingCompany.id : `aff-${Date.now()}`,
      nameTh: formNameTh.trim(),
      nameEn: formNameEn.trim() || formNameTh.trim(),
      shortCode: formShortCode.trim() || undefined,
      businessTypeTh: formBusinessTypeTh.trim() || '-',
      businessTypeEn: formBusinessTypeEn.trim() || formBusinessTypeTh.trim() || '-',
      taxId: formTaxId.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim() || undefined,
      website: formWebsite.trim() || undefined,
      addressTh: formAddressTh.trim() || '-',
      addressEn: formAddressEn.trim() || undefined,
      operatingHours: formOperatingHours.trim() || undefined,
      isHeadquarters: formIsHq,
      notes: formNotes.trim() || undefined,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (editingCompany) {
      persistAffiliates(affiliates.map(item => (item.id === editingCompany.id ? payload : item)));
    } else {
      persistAffiliates([payload, ...affiliates]);
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!companyToDelete) return;
    persistAffiliates(affiliates.filter(item => item.id !== companyToDelete.id));
    setCompanyToDelete(null);
  };

  const handleResetDefaults = () => {
    setAffiliates(INITIAL_AFFILIATES);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PERSISTED_FLAG_KEY);
    } catch {}
  };

  const filteredAffiliates = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return affiliates;
    return affiliates.filter(c =>
      c.nameTh.toLowerCase().includes(q) ||
      c.nameEn.toLowerCase().includes(q) ||
      (c.shortCode && c.shortCode.toLowerCase().includes(q)) ||
      c.businessTypeTh.toLowerCase().includes(q) ||
      c.businessTypeEn.toLowerCase().includes(q) ||
      c.taxId.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.addressTh.toLowerCase().includes(q)
    );
  }, [affiliates, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 text-[#1E60D5] dark:text-blue-400 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {language === 'TH' ? 'บริษัทในเครือ qisheng' : 'Qisheng Group Affiliates'}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60">
                {affiliates.length} {language === 'TH' ? 'บริษัท' : 'Companies'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'TH'
                ? 'ทำเนียบข้อมูลนิติบุคคล เลขประจำตัวผู้เสียภาษี ที่อยู่ และช่องทางติดต่อของบริษัทในเครือกลุ่ม ฉี เซิง'
                : 'Corporate directory, tax registration IDs, addresses, and contact details for Qisheng Group affiliates.'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative min-w-[200px] sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'TH' ? 'ค้นหาชื่อบริษัท, เลขภาษี...' : 'Search company, Tax ID...'}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#1E60D5] dark:focus:border-blue-500 transition-colors"
            />
          </div>

          {isAdmin ? (
            <>
              <button
                type="button"
                onClick={openCreateModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E60D5] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'TH' ? 'เพิ่มบริษัทในเครือ' : 'Add Affiliate'}</span>
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title={language === 'TH' ? 'รีเซ็ตข้อมูลเริ่มต้น' : 'Reset to defaults'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            onOpenAdminPinModal && (
              <button
                type="button"
                onClick={onOpenAdminPinModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#1E60D5] dark:text-blue-400" />
                <span>{language === 'TH' ? 'จัดการ (Admin)' : 'Manage (Admin)'}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Affiliates Grid */}
      {filteredAffiliates.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAffiliates.map((company) => (
            <div
              key={company.id}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-4">
                {/* Card Top Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 text-[#1E60D5] dark:text-blue-400 flex items-center justify-center shrink-0 font-bold text-xs">
                      {company.shortCode ? (
                        <span>{company.shortCode}</span>
                      ) : (
                        <Building2 className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {language === 'TH' ? company.nameTh : company.nameEn}
                        </h3>
                        {company.isHeadquarters && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[#1E60D5] dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60">
                            {language === 'TH' ? 'สำนักงานใหญ่' : 'Headquarters'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                        {language === 'TH' ? company.nameEn : company.nameTh}
                      </p>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditModal(company)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#1E60D5] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
                        title={language === 'TH' ? 'แก้ไข' : 'Edit'}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setCompanyToDelete(company)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                        title={language === 'TH' ? 'ลบ' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Business Scope */}
                <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {language === 'TH' ? 'ขอบเขตการดำเนินธุรกิจ' : 'Business Scope'}
                  </div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {language === 'TH' ? company.businessTypeTh : company.businessTypeEn}
                  </div>
                </div>

                {/* Details List */}
                <div className="space-y-2.5 text-xs">
                  {/* Tax ID */}
                  <div className="flex items-center justify-between gap-2 py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <FileText className="w-3.5 h-3.5 text-[#1E60D5] dark:text-blue-400 shrink-0" />
                      <span>{language === 'TH' ? 'เลขประจำตัวผู้เสียภาษี' : 'Tax ID'}:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        {company.taxId}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(company.taxId, `tax-${company.id}`)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:text-[#1E60D5] dark:hover:text-blue-400 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      {copiedKey === `tax-${company.id}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {language === 'TH' ? 'คัดลอกแล้ว' : 'Copied'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{language === 'TH' ? 'คัดลอก' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center justify-between gap-2 py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 min-w-0">
                      <Phone className="w-3.5 h-3.5 text-[#1E60D5] dark:text-blue-400 shrink-0" />
                      <span className="shrink-0">{language === 'TH' ? 'โทรศัพท์' : 'Phone'}:</span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {company.phone}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(company.phone, `phone-${company.id}`)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:text-[#1E60D5] dark:hover:text-blue-400 text-[11px] font-semibold transition-colors shrink-0 cursor-pointer"
                    >
                      {copiedKey === `phone-${company.id}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {language === 'TH' ? 'คัดลอกแล้ว' : 'Copied'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{language === 'TH' ? 'คัดลอก' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Email */}
                  {company.email && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 py-0.5">
                      <Mail className="w-3.5 h-3.5 text-[#1E60D5] dark:text-blue-400 shrink-0" />
                      <span>{language === 'TH' ? 'อีเมล' : 'Email'}:</span>
                      <a
                        href={`mailto:${company.email}`}
                        className="font-medium text-[#1E60D5] dark:text-blue-400 hover:underline truncate"
                      >
                        {company.email}
                      </a>
                    </div>
                  )}

                  {/* Website */}
                  {company.website && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 py-0.5">
                      <Globe className="w-3.5 h-3.5 text-[#1E60D5] dark:text-blue-400 shrink-0" />
                      <span>{language === 'TH' ? 'เว็บไซต์' : 'Website'}:</span>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#1E60D5] dark:text-blue-400 hover:underline truncate"
                      >
                        {company.website}
                      </a>
                    </div>
                  )}

                  {/* Address */}
                  <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400 py-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#1E60D5] dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {language === 'TH' ? company.addressTh : (company.addressEn || company.addressTh)}
                      </span>
                    </div>
                  </div>

                  {/* Operating Hours */}
                  {company.operatingHours && (
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 py-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{company.operatingHours}</span>
                    </div>
                  )}
                </div>
              </div>

              {company.notes && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                  {company.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 px-6 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3 max-w-xl mx-auto">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-[#1E60D5] dark:text-blue-400">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {language === 'TH' ? 'ไม่พบข้อมูลบริษัทในเครือ' : 'No affiliate companies found'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'TH'
              ? 'ลองค้นหาด้วยคำค้นอื่น หรือเพิ่มข้อมูลบริษัทในเครือใหม่'
              : 'Try another search keyword or add a new affiliate company.'}
          </p>
        </div>
      )}

      {/* Create / Edit Affiliate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-400 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {editingCompany
                    ? (language === 'TH' ? 'แก้ไขข้อมูลบริษัทในเครือ' : 'Edit Affiliate Company')
                    : (language === 'TH' ? 'เพิ่มบริษัทในเครือ qisheng' : 'Add Qisheng Group Affiliate')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'ชื่อบริษัท (ภาษาไทย) *' : 'Company Name (TH) *'}
                  </label>
                  <input
                    type="text"
                    value={formNameTh}
                    onChange={(e) => setFormNameTh(e.target.value)}
                    placeholder="เช่น บริษัท ฉี เซิง คอนซัลติ้ง จำกัด"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'ชื่อบริษัท (ภาษาอังกฤษ)' : 'Company Name (EN)'}
                  </label>
                  <input
                    type="text"
                    value={formNameEn}
                    onChange={(e) => setFormNameEn(e.target.value)}
                    placeholder="QI SHENG CONSULTING CO., LTD."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'รหัสย่อ (Short Code)' : 'Short Code'}
                  </label>
                  <input
                    type="text"
                    value={formShortCode}
                    onChange={(e) => setFormShortCode(e.target.value)}
                    placeholder="QSC / QS BOI"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'เลขประจำตัวผู้เสียภาษี *' : 'Tax ID *'}
                  </label>
                  <input
                    type="text"
                    value={formTaxId}
                    onChange={(e) => setFormTaxId(e.target.value)}
                    placeholder="0215560005884"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'เบอร์โทรศัพท์ *' : 'Phone *'}
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="083-830-0888"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'ลักษณะธุรกิจ (ภาษาไทย)' : 'Business Scope (TH)'}
                  </label>
                  <input
                    type="text"
                    value={formBusinessTypeTh}
                    onChange={(e) => setFormBusinessTypeTh(e.target.value)}
                    placeholder="เช่น ที่ปรึกษาธุรกิจ บัญชี ภาษี และ BOI"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'อีเมล' : 'Email'}
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="contact@qisheng.co.th"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'เวลาทำการ' : 'Operating Hours'}
                  </label>
                  <input
                    type="text"
                    value={formOperatingHours}
                    onChange={(e) => setFormOperatingHours(e.target.value)}
                    placeholder="วันจันทร์ - ศุกร์ 08:00 - 17:00 น."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'ที่อยู่บริษัท' : 'Address'}
                  </label>
                  <input
                    type="text"
                    value={formAddressTh}
                    onChange={(e) => setFormAddressTh(e.target.value)}
                    placeholder="888/11 หมู่ 4 ต.มาบยางพร อ.ปลวกแดง จ.ระยอง 21140"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'หมายเหตุเพิ่มเติม' : 'Notes'}
                  </label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60D5]"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2">
                  <input
                    id="aff-is-hq"
                    type="checkbox"
                    checked={formIsHq}
                    onChange={(e) => setFormIsHq(e.target.checked)}
                    className="rounded border-slate-300 text-[#1E60D5] focus:ring-[#1E60D5]"
                  />
                  <label htmlFor="aff-is-hq" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    {language === 'TH' ? 'กำหนดเป็นสำนักงานใหญ่ (Headquarters)' : 'Mark as Headquarters'}
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1E60D5] hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  {language === 'TH' ? 'บันทึกข้อมูล' : 'Save Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {companyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {language === 'TH' ? 'ยืนยันการลบข้อมูลบริษัท' : 'Confirm Company Removal'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'TH'
                  ? `คุณต้องการลบ "${companyToDelete.nameTh}" ออกจากรายชื่อบริษัทในเครือใช่หรือไม่?`
                  : `Are you sure you want to remove "${companyToDelete.nameEn}" from Qisheng Group Affiliates?`}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCompanyToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer"
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
