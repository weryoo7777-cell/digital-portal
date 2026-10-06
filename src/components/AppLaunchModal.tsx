import React, { useState } from 'react';
import { 
  X, 
  ArrowUpRight, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Monitor, 
  Terminal, 
  CheckCircle2,
  Lock,
  Server
} from 'lucide-react';
import { EnterpriseApp, UserProfile } from '../types';

interface AppLaunchModalProps {
  app: EnterpriseApp | null;
  currentUser: UserProfile;
  isOpen?: boolean;
  onClose: () => void;
  language: 'TH' | 'EN';
}

export const AppLaunchModal: React.FC<AppLaunchModalProps> = ({
  app,
  currentUser,
  isOpen = true,
  onClose,
  language
}) => {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchSuccess, setLaunchSuccess] = useState(false);

  if (!app) return null;

  const hasAccess = app.allowedRoles.includes(currentUser.role);
  const rdpCommand = `mstsc /v:${app.serverHost || 'qs-acc-srv01.qisheng.local'} /f`;

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(rdpCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleSimulateLaunch = () => {
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      setLaunchSuccess(true);
      setTimeout(() => {
        setLaunchSuccess(false);
        if (app.url && app.launchType !== 'remote_rdp') {
          window.open(app.url, '_blank', 'noopener,noreferrer');
        }
        onClose();
      }, 1000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-800 dark:text-slate-100 overflow-hidden">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 pr-8 mb-5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-[#1E60D5] dark:text-blue-400 flex items-center justify-center shrink-0">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{app.name}</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                {app.launchType.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'TH' ? app.nameTh : app.description}
            </p>
          </div>
        </div>

        {/* Security & SSO Clearance */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-750 mb-4 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {language === 'TH' ? 'การยืนยันตัวตน SSO:' : 'SSO Clearance:'}
            </span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {currentUser.ssoProvider} Verified
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-2 text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">{language === 'TH' ? 'สิทธิ์ผู้ใช้งาน (RBAC):' : 'User Permission:'}</span>
            <span className="font-mono text-[#1E60D5] dark:text-blue-400 font-bold">{currentUser.role} &bull; Authorized</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">{language === 'TH' ? 'เครือข่ายต้นทาง:' : 'Client Origin:'}</span>
            <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{currentUser.workstationHostname} ({currentUser.localIp})</span>
          </div>
        </div>

        {/* RDP instructions for Windows desktop apps like Express Accounting */}
        {app.launchType === 'remote_rdp' && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 mb-5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E60D5] dark:text-blue-400 mb-2">
              <Monitor className="w-4 h-4" />
              <span>{language === 'TH' ? 'คำสั่งเชื่อมต่อ Windows Remote Desktop (RDP)' : 'Windows RDP Direct Connection'}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              {language === 'TH' 
                ? 'ระบบบัญชี Express ทำงานบนเซิร์ฟเวอร์ฐานข้อมูลหลัก สามารถกดคำสั่งด้านล่างเพื่อเปิด RDP ได้ทันที:'
                : 'Express runs on Windows Server. Execute the command below to launch full remote desktop session:'}
            </p>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold">
              <span className="truncate">{rdpCommand}</span>
              <button
                onClick={handleCopyCommand}
                className="p-1 hover:text-[#1E60D5] dark:hover:text-blue-400 transition-colors ml-2"
                title="Copy Command"
              >
                {copiedCmd ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>
        )}

        {/* Web app URL preview */}
        {app.launchType !== 'remote_rdp' && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 mb-5 text-xs">
            <div className="text-slate-500 dark:text-slate-400 mb-1">{language === 'TH' ? 'เป้าหมายระบบ (Target Endpoint):' : 'Target Endpoint:'}</div>
            <div className="font-mono text-[#1E60D5] dark:text-blue-400 font-semibold truncate bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
              {app.url}
            </div>
            {app.internalPort && (
              <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-1.5">
                Service Port: {app.internalPort} &bull; Server: {app.serverHost || 'qisheng.internal'}
              </div>
            )}
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {language === 'TH' ? 'ปิดหน้าต่าง' : 'Cancel'}
          </button>

          <button
            onClick={handleSimulateLaunch}
            disabled={!hasAccess || isLaunching}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs
              ${hasAccess 
                ? 'bg-[#1E60D5] text-white hover:bg-[#0B4ABF]' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
            `}
          >
            {isLaunching ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{language === 'TH' ? 'กำลังเชื่อมต่อ SSO...' : 'Authenticating SSO...'}</span>
              </>
            ) : launchSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>{language === 'TH' ? 'เปิดระบบสำเร็จ!' : 'Launched Successfully!'}</span>
              </>
            ) : (
              <>
                <span>{language === 'TH' ? 'เข้าสู่ระบบแอปพลิเคชัน' : 'Launch Application'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
