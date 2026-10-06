import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Camera, 
  Upload, 
  Check, 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';

export interface AvatarPreviewModalProps {
  isOpen: boolean;
  currentUser?: UserProfile;
  avatarUrl?: string;
  userName?: string;
  position?: string;
  department?: string;
  onClose: () => void;
  language?: 'TH' | 'EN';
  onSaveAvatar?: (newAvatarUrl: string) => void;
}

export const AvatarPreviewModal: React.FC<AvatarPreviewModalProps> = ({
  isOpen,
  currentUser,
  avatarUrl,
  userName,
  position,
  department,
  onClose,
  language = 'TH'
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and listen for Escape key to dismiss
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const effectiveAvatar = avatarUrl || currentUser?.avatar || '';
  const effectiveName = userName || currentUser?.name || 'User Profile';
  const effectivePosition = position || currentUser?.position;
  const effectiveDept = department || currentUser?.department;

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="relative w-full max-w-sm sm:max-w-md my-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl p-6 sm:p-7 text-slate-800 dark:text-slate-100 flex flex-col items-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label={language === 'TH' ? 'ปิด' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Information */}
        <div className="w-full text-center mb-5 px-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/70 text-[#1E60D5] dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/50 font-mono">
            {language === 'TH' ? 'รูปภาพประจำตัวพนักงาน' : 'Employee Profile Picture'}
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
            {effectiveName}
          </h3>
          {(effectivePosition || effectiveDept) && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              {[effectivePosition, effectiveDept].filter(Boolean).join(' • ')}
            </p>
          )}
        </div>

        {/* Large Avatar Display: ได้สัดส่วนเต็มรูป ไม่ตัดหรือแหว่งส่วนหัว */}
        <div className="relative w-60 h-60 sm:w-68 sm:h-68 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 ring-4 ring-blue-500/30 shadow-2xl bg-slate-100 dark:bg-slate-800 my-2 shrink-0 aspect-square">
          <img
            src={effectiveAvatar}
            alt={effectiveName}
            className="w-full h-full object-cover object-top select-none transition-all duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
            }}
          />
        </div>

        {/* Modal Footer with Verification Badge and Close Button */}
        <div className="mt-6 w-full flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-800/50">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="font-semibold">Verified Employee</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            {language === 'TH' ? 'ปิด' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// System Preset Avatars for corporate users
export const SYSTEM_PRESET_AVATARS = [
  {
    id: 'preset-paramed',
    titleTh: 'พนักงานสนับสนุนไอที (IT Support Specialist)',
    titleEn: 'IT Support Specialist',
    url: '/src/assets/images/avatar_somchai_user_1790322510012.jpg',
    tag: 'IT Support'
  },
  {
    id: 'preset-management',
    titleTh: 'ผู้บริหารองค์กร (Executive Director)',
    titleEn: 'Executive Director',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    tag: 'Executive'
  },
  {
    id: 'preset-finance',
    titleTh: 'ผู้จัดการบัญชีและการเงิน (Finance Manager)',
    titleEn: 'Accounting & Finance Lead',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    tag: 'Finance'
  },
  {
    id: 'preset-hr',
    titleTh: 'ฝ่ายบุคคลและบริหารทั่วไป (HR Director)',
    titleEn: 'People & Culture Director',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    tag: 'HR'
  },
  {
    id: 'preset-solutions',
    titleTh: 'วิศวกรระบบและคลาวด์ (Solutions Engineer)',
    titleEn: 'Cloud & Systems Architect',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    tag: 'Engineering'
  },
  {
    id: 'preset-logistics',
    titleTh: 'ฝ่ายคลังสินค้าและการจัดส่ง (Logistics Coordinator)',
    titleEn: 'Logistics Coordinator',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    tag: 'Logistics'
  },
  {
    id: 'preset-tech-senior',
    titleTh: 'ที่ปรึกษาอาวุโสด้านเทคโนโลยี (Tech Advisor)',
    titleEn: 'Senior Technical Lead',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    tag: 'Architecture'
  },
  {
    id: 'preset-analyst',
    titleTh: 'นักวิเคราะห์ระบบดิจิทัล (Workplace Analyst)',
    titleEn: 'Digital Workplace Analyst',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    tag: 'Analyst'
  }
];

export interface SystemAvatarModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onSaveAvatar: (newAvatarUrl: string) => void;
  language?: 'TH' | 'EN';
}

export const SystemAvatarModal: React.FC<SystemAvatarModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onSaveAvatar,
  language = 'TH'
}) => {
  const [mounted, setMounted] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentUser.avatar);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedAvatar(currentUser.avatar);
      setSaveSuccess(false);
    }
  }, [isOpen, currentUser.avatar]);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  const handleConfirm = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onSaveAvatar(selectedAvatar);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 300);
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="relative w-full max-w-xl my-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl p-6 sm:p-7 text-slate-800 dark:text-slate-100 flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 p-2.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label={language === 'TH' ? 'ปิด' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200/60 dark:border-amber-800/60">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {language === 'TH' ? 'เลือกจากรูปตัวอย่างของระบบ' : 'Choose System Preset Avatar'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'TH' 
                ? 'เลือกรูปภาพประจำตัวมาตรฐานขององค์กรเพื่อแสดงผลในระบบ'
                : 'Select an official corporate avatar preset to use across QISHENG Digital Portal'}
            </p>
          </div>
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 max-h-[50vh] overflow-y-auto pr-1">
          {SYSTEM_PRESET_AVATARS.map((preset) => {
            const isSelected = selectedAvatar === preset.url;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAvatar(preset.url);
                }}
                className={`relative group rounded-2xl p-2.5 border text-center transition-all cursor-pointer flex flex-col items-center ${
                  isSelected
                    ? 'border-[#1E60D5] bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-[#1E60D5]/40 shadow-sm'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/70'
                }`}
              >
                {/* Active checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#1E60D5] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                <div className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 mb-2 transition-transform duration-200 group-hover:scale-105 aspect-square ${
                  isSelected ? 'border-[#1E60D5] ring-2 ring-blue-300/60' : 'border-slate-200 dark:border-slate-700'
                }`}>
                  <img
                    src={preset.url}
                    alt={preset.titleEn}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {language === 'TH' ? preset.titleTh.split(' (')[0] : preset.titleEn}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-400 mt-1">
                  {preset.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>{language === 'TH' ? 'คลิกที่รูปเพื่อเลือก แล้วกดบันทึก' : 'Click a photo to select, then click save'}</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-[#1E60D5] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{saveSuccess ? (language === 'TH' ? 'บันทึกสำเร็จ!' : 'Saved!') : (language === 'TH' ? 'บันทึกรูปโปรไฟล์' : 'Apply Avatar')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// Aliased for seamless compatibility
export const AvatarModal = SystemAvatarModal;

interface PasswordResetModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  language: 'TH' | 'EN';
}

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  language
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setError(language === 'TH' ? 'กรุณากรอกรหัสผ่านปัจจุบัน' : 'Please enter your current password');
      return;
    }
    if (newPassword.length < 8) {
      setError(language === 'TH' ? 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร' : 'New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(language === 'TH' ? 'รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน' : 'Passwords do not match');
      return;
    }

    setError(null);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-400 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {language === 'TH' ? 'รีเซ็ตรหัสผ่านพนักงาน (SSPR)' : 'Self-Service Password Reset'}
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {language === 'TH' ? 'อัปเดตรหัสผ่านสำหรับเข้าใช้งานระบบ Intranet & SSO' : 'Update your SSO & Intranet credentials'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              {language === 'TH' ? 'เปลี่ยนรหัสผ่านสำเร็จแล้ว!' : 'Password Reset Successful!'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              {language === 'TH' 
                ? 'ระบบได้อัปเดตรหัสผ่านใหม่เข้าสู่ Entra ID และ Google Workspace SSO เรียบร้อยแล้ว' 
                : 'Your credentials have been securely updated across all enterprise systems.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <span>{language === 'TH' ? 'บัญชีผู้ใช้งาน:' : 'Account ID:'}</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{currentUser.email}</span>
            </div>

            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'TH' ? 'รหัสผ่านปัจจุบัน' : 'Current Password'}
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#1E60D5] dark:focus:border-blue-500 pr-9"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'TH' ? 'รหัสผ่านใหม่' : 'New Password'}
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#1E60D5] dark:focus:border-blue-500 pr-9"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'TH' ? 'ยืนยันรหัสผ่านใหม่' : 'Confirm New Password'}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#1E60D5] dark:focus:border-blue-500"
                required
              />
            </div>

            {/* Security Policy Reminder */}
            <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
              <div className="font-bold text-[#1E60D5] dark:text-blue-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{language === 'TH' ? 'นโยบายรหัสผ่านความปลอดภัยสูง:' : 'Password Security Requirements:'}</span>
              </div>
              <ul className="list-disc list-inside text-slate-500 dark:text-slate-400 space-y-0.5 pl-1">
                <li>{language === 'TH' ? 'ความยาวขั้นต่ำ 8 ตัวอักษร' : 'Minimum 8 characters length'}</li>
                <li>{language === 'TH' ? 'ประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก และตัวเลข' : 'Includes uppercase, lowercase, and numbers'}</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#1E60D5] hover:bg-[#0B4ABF] transition-colors shadow-xs"
              >
                {language === 'TH' ? 'ยืนยันเปลี่ยนรหัสผ่าน' : 'Confirm Reset'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
