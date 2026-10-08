import React, { useState, useEffect, useRef } from 'react';
import { Shield, KeyRound, X, AlertCircle, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';
import { verifyAdminPin } from '../config/adminConfig';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language: 'TH' | 'EN';
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
      setShowPin(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (verifyAdminPin(pin)) {
      setError(false);
      onSuccess();
      onClose();
    } else {
      setError(true);
      setPin('');
      inputRef.current?.focus();
    }
  };

  const handleQuickKey = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Decorative Accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={language === 'TH' ? 'ปิด' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
            <Shield className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {language === 'TH' ? 'เข้าสู่โหมด Admin' : 'Admin Mode Authentication'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            {language === 'TH' 
              ? 'กรุณากรอกรหัส PIN เพื่อปลดล็อกสิทธิ์ผู้ดูแลระบบ (เพิ่ม/แก้ไข/ลบ ข้อมูล)'
              : 'Enter admin PIN to unlock administration management privileges'}
          </p>
        </div>

        {/* PIN Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">
              {language === 'TH' ? 'รหัส PIN (ค่าเริ่มต้น: 1111)' : 'Admin PIN (Default: 1111)'}
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="• • • •"
                className={`w-full text-center text-2xl font-mono tracking-widest py-3 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border ${
                  error 
                    ? 'border-rose-500 focus:border-rose-500 text-rose-600 bg-rose-50/30' 
                    : 'border-slate-200 dark:border-slate-700 focus:border-[#1E60D5] text-slate-900 dark:text-white'
                } focus:outline-none transition-all shadow-inner`}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title={showPin ? 'Hide PIN' : 'Show PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 animate-in shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {language === 'TH' 
                  ? 'รหัส PIN ไม่ถูกต้อง (กำหนดเป็น 1111)' 
                  : 'Invalid PIN. Please enter PIN: 1111'}
              </span>
            </div>
          )}

          {/* Quick Keypad */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleQuickKey(digit)}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-all active:scale-95 cursor-pointer"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => { setPin(''); setError(false); }}
              className="py-2.5 rounded-xl bg-slate-100/60 hover:bg-slate-200/60 dark:bg-slate-800/60 dark:hover:bg-slate-700/60 text-slate-500 dark:text-slate-400 font-semibold text-xs transition-all cursor-pointer"
            >
              C
            </button>
            <button
              type="button"
              onClick={() => handleQuickKey('0')}
              className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-all active:scale-95 cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="py-2.5 rounded-xl bg-slate-100/60 hover:bg-slate-200/60 dark:bg-slate-800/60 dark:hover:bg-slate-700/60 text-slate-500 dark:text-slate-400 font-semibold text-xs transition-all cursor-pointer"
            >
              ⌫
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={pin.length === 0}
              className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{language === 'TH' ? 'ปลดล็อก' : 'Unlock'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
