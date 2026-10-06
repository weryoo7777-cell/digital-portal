import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  KeyRound, 
  CheckCircle2, 
  Laptop, 
  Send, 
  ShieldCheck, 
  Lock, 
  RefreshCw,
  Smartphone
} from 'lucide-react';
import { UserProfile, ClientMachineInfo, HelpdeskTicket } from '../types';
import { ENTERPRISE_APPS } from '../data/portalData';

interface QuickActionsModalProps {
  initialTab?: 'helpdesk' | 'sspr' | 'access';
  initialType?: 'helpdesk' | 'sspr' | 'access';
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  machineInfo?: ClientMachineInfo | null;
  onAddTicket?: (ticket: HelpdeskTicket) => void;
  onSubmitTicket?: (ticket: HelpdeskTicket) => void;
  language: 'TH' | 'EN';
}

export const QuickActionsModal: React.FC<QuickActionsModalProps> = ({
  initialTab,
  initialType,
  isOpen,
  onClose,
  currentUser,
  machineInfo,
  onAddTicket,
  onSubmitTicket,
  language
}) => {
  const effectiveInitial = initialTab || initialType || 'helpdesk';
  const [activeTab, setActiveTab] = useState<'helpdesk' | 'sspr' | 'access'>(effectiveInitial);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // Form states - Helpdesk
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Hardware & Peripheral');
  const [ticketPriority, setTicketPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [ticketDesc, setTicketDesc] = useState('');

  // Form states - SSPR (Self-Service Password Reset)
  const [ssprMethod, setSsprMethod] = useState<'mfa' | 'otp' | 'current'>('mfa');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [unlockOnly, setUnlockOnly] = useState(false);

  // Form states - Access Request
  const [selectedAppId, setSelectedAppId] = useState(ENTERPRISE_APPS[0].id);
  const [accessReason, setAccessReason] = useState('');
  const [accessPeriod, setAccessPeriod] = useState('Permanent (พนักงานประจำ)');

  if (!isOpen) return null;

  const handleSubmitHelpdesk = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: HelpdeskTicket = {
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: ticketSubject,
      category: ticketCategory,
      priority: ticketPriority,
      status: 'Pending',
      createdAt: 'Just now',
      description: ticketDesc,
      reportedBy: currentUser.name,
      workstation: `${machineInfo?.hostname || currentUser.workstationHostname} (${machineInfo?.localIp || currentUser.localIp})`
    };

    if (onAddTicket) onAddTicket(newTicket);
    if (onSubmitTicket) onSubmitTicket(newTicket);

    setSubmittedMessage(
      language === 'TH' 
        ? `สร้างตั๋วงาน ${newTicket.id} สำเร็จ! เจ้าหน้าที่ไอทีกำลังตรวจสอบ` 
        : `Ticket ${newTicket.id} submitted! Support team notified.`
    );
    setTimeout(() => {
      setSubmittedMessage(null);
      setTicketSubject('');
      setTicketDesc('');
      onClose();
    }, 2000);
  };

  const handleSubmitSspr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockOnly && newPassword !== confirmPassword) {
      alert(language === 'TH' ? 'รหัสผ่านใหม่และการยืนยันไม่ตรงกัน' : 'Passwords do not match');
      return;
    }
    setSubmittedMessage(
      language === 'TH' 
        ? (unlockOnly ? 'ปลดล็อกบัญชีพนักงานเรียบร้อยแล้ว' : 'รีเซ็ตรหัสผ่านและซิงค์เข้า Entra ID เรียบร้อยแล้ว')
        : (unlockOnly ? 'Account successfully unlocked.' : 'Password reset and synced to directory.')
    );
    setTimeout(() => {
      setSubmittedMessage(null);
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    }, 2000);
  };

  const handleSubmitAccess = (e: React.FormEvent) => {
    e.preventDefault();
    const app = ENTERPRISE_APPS.find(a => a.id === selectedAppId);
    setSubmittedMessage(
      language === 'TH' 
        ? `ส่งคำขอเปิดสิทธิ์ใช้งาน ${app?.name} ไปยังหัวหน้างานเรียบร้อยแล้ว` 
        : `Access request for ${app?.name} submitted to manager.`
    );
    setTimeout(() => {
      setSubmittedMessage(null);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-800 dark:text-slate-100 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {language === 'TH' ? 'ปุ่มลัดการทำงานด่วน (Quick Actions)' : 'Quick Actions'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'TH' 
              ? 'แจ้งซ่อมไอที รีเซ็ตรหัสผ่านพนักงาน หรือยื่นขอสิทธิ์เข้าระบบใหม่' 
              : 'Submit IT tickets, perform self-service password reset, or request system permissions.'}
          </p>
        </div>

        {/* Interactive Segmented Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-5">
          <button
            onClick={() => setActiveTab('helpdesk')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'helpdesk'
                ? 'bg-white dark:bg-slate-900 text-[#1E60D5] dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="truncate">{language === 'TH' ? 'แจ้งปัญหา IT' : 'IT Helpdesk'}</span>
          </button>

          <button
            onClick={() => setActiveTab('sspr')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'sspr'
                ? 'bg-white dark:bg-slate-900 text-[#1E60D5] dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="truncate">{language === 'TH' ? 'รีเซ็ตรหัสผ่าน' : 'SSPR Reset'}</span>
          </button>

          <button
            onClick={() => setActiveTab('access')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'access'
                ? 'bg-white dark:bg-slate-900 text-[#1E60D5] dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="truncate">{language === 'TH' ? 'ขอสิทธิ์ระบบ' : 'Access Request'}</span>
          </button>
        </div>

        {/* Success Alert */}
        {submittedMessage && (
          <div className="p-3.5 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5 text-xs font-medium animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{submittedMessage}</span>
          </div>
        )}

        {/* Tab 1: IT Helpdesk */}
        {activeTab === 'helpdesk' && (
          <form onSubmit={handleSubmitHelpdesk} className="space-y-3.5">
            {/* Auto-detected client machine badge */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Laptop className="w-3.5 h-3.5 text-[#1E60D5] dark:text-blue-400" />
                <span>{language === 'TH' ? 'แนบข้อมูลเครื่องอัตโนมัติ:' : 'Auto-attached Machine:'}</span>
              </div>
              <span className="font-mono text-[#1E60D5] dark:text-blue-400 font-bold text-[11px] truncate max-w-[200px]">
                {machineInfo?.hostname || currentUser.workstationHostname} ({machineInfo?.localIp || currentUser.localIp})
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'TH' ? 'หัวข้อปัญหาที่พบ *' : 'Subject *'}
              </label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder={language === 'TH' ? 'เช่น เชื่อมต่อ Express Accounting ไม่ได้, ปริ้นไม่ออก' : 'e.g. Cannot connect to Express'}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#1E60D5] dark:focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'TH' ? 'หมวดหมู่อุปกรณ์' : 'Category'}
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#1E60D5] dark:focus:border-blue-500"
                >
                  <option value="Hardware & Peripheral">Hardware / Printer / จอภาพ</option>
                  <option value="Network & VPN">Network / Wi-Fi / VPN Intranet</option>
                  <option value="Software & OS">Software / Windows / Express</option>
                  <option value="Account & Password">รหัสผ่าน / SSO / สิทธิ์ใช้งาน</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'TH' ? 'ระดับความเร่งด่วน' : 'Priority'}
                </label>
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#1E60D5] dark:focus:border-blue-500"
                >
                  <option value="Low">Low - ต่ำ (ภายใน 24 ชม.)</option>
                  <option value="Medium">Medium - ปานกลาง (ภายใน 4 ชม.)</option>
                  <option value="High">High - สูง (ภายใน 2 ชม.)</option>
                  <option value="Critical">Critical - ด่วนมาก</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'TH' ? 'รายละเอียดเพิ่มเติม' : 'Description'}
              </label>
              <textarea
                rows={2}
                value={ticketDesc}
                onChange={(e) => setTicketDesc(e.target.value)}
                placeholder={language === 'TH' ? 'ระบุรหัสข้อผิดพลาด หรืออาการผิดปกติ...' : 'Provide details...'}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#1E60D5] dark:focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1E60D5] hover:bg-[#0B4ABF] rounded-xl shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'TH' ? 'ส่งคำร้อง Helpdesk' : 'Submit Ticket'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: SSPR - Self-Service Password Reset */}
        {activeTab === 'sspr' && (
          <form onSubmit={handleSubmitSspr} className="space-y-3.5">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>{language === 'TH' ? 'บัญชีพนักงาน:' : 'Employee Account:'}</span>
                <span className="font-mono text-[#1E60D5] dark:text-blue-400 font-bold">{currentUser.email}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>{language === 'TH' ? 'รหัสพนักงาน:' : 'Employee ID:'}</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{currentUser.employeeId}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'TH' ? 'วิธีการยืนยันตัวตน (MFA Verification)' : 'Verification Method'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSsprMethod('mfa')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-colors flex items-center gap-2 ${
                    ssprMethod === 'mfa'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-[#1E60D5] dark:text-blue-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Microsoft Auth</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSsprMethod('current')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-colors flex items-center gap-2 ${
                    ssprMethod === 'current'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-[#1E60D5] dark:text-blue-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">รหัสผ่านปัจจุบัน</span>
                </button>
              </div>
            </div>

            {ssprMethod === 'current' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'TH' ? 'รหัสผ่านปัจจุบัน *' : 'Current Password *'}
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#1E60D5] dark:focus:border-blue-500"
                />
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="unlockOnly"
                checked={unlockOnly}
                onChange={(e) => setUnlockOnly(e.target.checked)}
                className="rounded border-slate-300 text-[#1E60D5] focus:ring-0"
              />
              <label htmlFor="unlockOnly" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer font-medium">
                {language === 'TH' ? 'ขอปลดล็อกบัญชีเท่านั้น (ไม่เปลี่ยนรหัสผ่าน)' : 'Unlock account only (Keep current password)'}
              </label>
            </div>

            {!unlockOnly && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'รหัสผ่านใหม่ (อย่างน้อย 12 ตัวอักษร) *' : 'New Password *'}
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="อย่างน้อย 12 ตัวอักษร มีตัวพิมพ์ใหญ่และตัวเลข"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#1E60D5] dark:focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'ยืนยันรหัสผ่านใหม่ *' : 'Confirm New Password *'}
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="ยืนยันรหัสผ่านใหม่อีกครั้ง"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#1E60D5] dark:focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1E60D5] hover:bg-[#0B4ABF] rounded-xl shadow-xs"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>
                  {unlockOnly 
                    ? (language === 'TH' ? 'ปลดล็อกบัญชี' : 'Unlock Account')
                    : (language === 'TH' ? 'บันทึกรหัสผ่านใหม่' : 'Reset Password')}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: System Access Request */}
        {activeTab === 'access' && (
          <form onSubmit={handleSubmitAccess} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'TH' ? 'เลือกระบบงานที่ต้องการขอเปิดสิทธิ์ *' : 'Select Target Application *'}
              </label>
              <select
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#1E60D5] dark:focus:border-blue-500"
              >
                {ENTERPRISE_APPS.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.name} — {app.nameTh}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'TH' ? 'ระยะเวลาที่ต้องการใช้งาน' : 'Access Duration'}
              </label>
              <select
                value={accessPeriod}
                onChange={(e) => setAccessPeriod(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#1E60D5] dark:focus:border-blue-500"
              >
                <option value="Permanent">ถาวร (พนักงานประจำแผนก)</option>
                <option value="30 Days">ชั่วคราว 30 วัน (โครงการพิเศษ)</option>
                <option value="90 Days">ชั่วคราว 90 วัน (Audit / ตรวจสอบบัญชี)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'TH' ? 'เหตุผลความจำเป็นในการเข้าใช้งาน *' : 'Business Justification *'}
              </label>
              <textarea
                required
                rows={2}
                value={accessReason}
                onChange={(e) => setAccessReason(e.target.value)}
                placeholder={language === 'TH' ? 'ระบุหน้าที่ความรับผิดชอบ และคำสั่งจากหัวหน้างาน...' : 'Explain the business need...'}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#1E60D5] dark:focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1E60D5] hover:bg-[#0B4ABF] rounded-xl shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'TH' ? 'ส่งคำขออนุมัติ' : 'Request Access'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
