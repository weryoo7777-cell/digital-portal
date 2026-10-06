import React, { useState } from 'react';
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

interface AvatarModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onSaveAvatar: (newAvatarUrl: string) => void;
  language: 'TH' | 'EN';
}

const PRESET_AVATARS = [
  { id: 'av-1', label: 'Paramed (IT Specialist)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { id: 'av-2', label: 'Somchai (IT Lead)', url: '/src/assets/images/avatar_somchai_user_1790322510012.jpg' },
  { id: 'av-3', label: 'Executive Management', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { id: 'av-4', label: 'Finance Director', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
  { id: 'av-5', label: 'Logistics Lead', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
  { id: 'av-6', label: 'HR Director', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80' }
];

export const AvatarModal: React.FC<AvatarModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onSaveAvatar,
  language
}) => {
  const [selectedUrl, setSelectedUrl] = useState<string>(currentUser.avatar);
  const [customInputUrl, setCustomInputUrl] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError(language === 'TH' ? 'กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, WebP)' : 'Please select an image file (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError(language === 'TH' ? 'ขนาดไฟล์ต้องไม่เกิน 10MB' : 'Image file size must be under 10MB');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSelectedUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (customInputUrl.trim()) {
      setSelectedUrl(customInputUrl.trim());
      setCustomInputUrl('');
    }
  };

  const handleSave = () => {
    onSaveAvatar(selectedUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 text-slate-800 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1E60D5] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {language === 'TH' ? 'เปลี่ยนรูปประจำตัว (Change Avatar)' : 'Update Profile Avatar'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'TH' ? 'เลือกจากรูปตัวอย่าง หรืออัปโหลดรูปภาพใหม่' : 'Select a preset or upload your photo'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current & Preview Box */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-400 shadow-sm shrink-0 bg-blue-100">
            <img 
              src={selectedUrl} 
              alt="Avatar Preview" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
              }}
            />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
            <div className="text-[11px] text-slate-500">{currentUser.position || currentUser.role}</div>
            <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <Check className="w-3 h-3" />
              <span>{language === 'TH' ? 'ภาพตัวอย่างพร้อมใช้งาน' : 'Preview ready'}</span>
            </div>
          </div>
        </div>

        {uploadError && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Preset Avatars */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {language === 'TH' ? 'เลือกรูปโปรไฟล์ทางการ:' : 'Corporate Presets:'}
          </label>
          <div className="grid grid-cols-6 gap-2">
            {PRESET_AVATARS.map((av) => (
              <button
                key={av.id}
                type="button"
                onClick={() => setSelectedUrl(av.url)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all p-0.5 ${
                  selectedUrl === av.url 
                    ? 'border-[#1E60D5] ring-2 ring-blue-100 scale-105' 
                    : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                }`}
                title={av.label}
              >
                <img src={av.url} alt={av.label} className="w-full h-full object-cover rounded-lg" />
                {selectedUrl === av.url && (
                  <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Custom Photo Option */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700">
            {language === 'TH' ? 'หรืออัปโหลดรูปภาพจากอุปกรณ์:' : 'Or Upload From Device:'}
          </label>
          <div className="flex items-center gap-2">
            <label className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 text-xs font-semibold text-slate-700 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-[#1E60D5]" />
              <span>{language === 'TH' ? 'เลือกไฟล์รูปภาพ...' : 'Choose Image File...'}</span>
              <input 
                type="file" 
                accept="image/jpeg,image/png,image/webp,image/gif,image/*" 
                onChange={handleFileUpload}
                className="hidden" 
              />
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#1E60D5] hover:bg-[#0B4ABF] transition-colors shadow-xs"
          >
            {language === 'TH' ? 'บันทึกรูปประจำตัว' : 'Save Avatar'}
          </button>
        </div>
      </div>
    </div>
  );
};

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 text-slate-800 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1E60D5] flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {language === 'TH' ? 'รีเซ็ตรหัสผ่านพนักงาน (SSPR)' : 'Self-Service Password Reset'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'TH' ? 'อัปเดตรหัสผ่านสำหรับเข้าใช้งานระบบ Intranet & SSO' : 'Update your SSO & Intranet credentials'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-base text-slate-900">
              {language === 'TH' ? 'เปลี่ยนรหัสผ่านสำเร็จแล้ว!' : 'Password Reset Successful!'}
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {language === 'TH' 
                ? 'ระบบได้อัปเดตรหัสผ่านใหม่เข้าสู่ Entra ID และ Google Workspace SSO เรียบร้อยแล้ว' 
                : 'Your credentials have been securely updated across all enterprise systems.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
              <span>{language === 'TH' ? 'บัญชีผู้ใช้งาน:' : 'Account ID:'}</span>
              <span className="font-mono font-bold text-slate-800">{currentUser.email}</span>
            </div>

            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'TH' ? 'รหัสผ่านปัจจุบัน' : 'Current Password'}
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1E60D5] pr-9"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'TH' ? 'รหัสผ่านใหม่' : 'New Password'}
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1E60D5] pr-9"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'TH' ? 'ยืนยันรหัสผ่านใหม่' : 'Confirm New Password'}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1E60D5]"
                required
              />
            </div>

            {/* Security Policy Reminder */}
            <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-slate-600 space-y-1">
              <div className="font-bold text-[#1E60D5] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{language === 'TH' ? 'นโยบายรหัสผ่านความปลอดภัยสูง:' : 'Password Security Requirements:'}</span>
              </div>
              <ul className="list-disc list-inside text-slate-500 space-y-0.5 pl-1">
                <li>{language === 'TH' ? 'ความยาวขั้นต่ำ 8 ตัวอักษร' : 'Minimum 8 characters length'}</li>
                <li>{language === 'TH' ? 'ประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก และตัวเลข' : 'Includes uppercase, lowercase, and numbers'}</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
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
