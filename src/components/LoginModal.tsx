import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  UserCheck, 
  Laptop, 
  Building2, 
  CheckCircle2, 
  Globe2,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';
import { CORPORATE_USERS, QISHENG_LOGO } from '../data/portalData';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: UserProfile) => void;
  language: 'TH' | 'EN';
  onToggleLanguage?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLoginSuccess,
  language,
  onToggleLanguage
}) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authProviderName, setAuthProviderName] = useState('');

  if (!isOpen) return null;

  const handleSsoLogin = (provider: 'EntraID' | 'GoogleWorkspace') => {
    setIsAuthenticating(true);
    setAuthProviderName(provider === 'EntraID' ? 'Microsoft Entra ID' : 'Google Workspace');
    
    // Simulate real SSO token validation
    setTimeout(() => {
      setIsAuthenticating(false);
      const user = provider === 'EntraID' ? CORPORATE_USERS[0] : CORPORATE_USERS[2];
      onLoginSuccess(user);
    }, 1200);
  };

  const handleQuickSelect = (user: UserProfile) => {
    setIsAuthenticating(true);
    setAuthProviderName(`Entra ID Directory Sync (${user.name})`);

    setTimeout(() => {
      setIsAuthenticating(false);
      onLoginSuccess(user);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-slate-800 dark:text-slate-100 my-8">
        {/* Language switch at top right */}
        {onToggleLanguage && (
          <div className="absolute top-6 right-6">
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            >
              <Globe2 className="w-3.5 h-3.5 text-[#1E60D5] dark:text-blue-400" />
              <span>{language === 'TH' ? 'TH' : 'EN'}</span>
            </button>
          </div>
        )}

        {/* Brand Lockup */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 p-1 shadow-sm mb-3 flex items-center justify-center">
            <img 
              src={QISHENG_LOGO} 
              alt="QISHENG Logo" 
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <span className="font-extrabold text-[#1E60D5] dark:text-blue-400 text-2xl tracking-wider">QS</span>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">QISHENG</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E60D5] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/80 px-2 py-0.5 rounded-md">
              Digital Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Enterprise Employee Intranet</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Corporate Single Sign-On Gateway</p>
        </div>

        {/* Loading overlay when authenticating */}
        {isAuthenticating ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
            <div className="w-8 h-8 border-2 border-[#1E60D5] border-t-transparent rounded-full animate-spin" />
            <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {language === 'TH' ? 'กำลังเชื่อมต่อ SSO...' : 'Authenticating SSO...'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{authProviderName}</div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Primary SSO Buttons */}
            <div className="space-y-2.5">
              {/* Microsoft Entra ID */}
              <button
                onClick={() => handleSsoLogin('EntraID')}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 transition-all shadow-2xs hover:border-slate-300 dark:hover:border-slate-600"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 21 21">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                </svg>
                <span>{language === 'TH' ? 'เข้าสู่ระบบด้วย Microsoft Entra ID' : 'Sign in with Microsoft Entra ID'}</span>
              </button>

              {/* Google Workspace */}
              <button
                onClick={() => handleSsoLogin('GoogleWorkspace')}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 transition-all shadow-2xs hover:border-slate-300 dark:hover:border-slate-600"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{language === 'TH' ? 'เข้าสู่ระบบด้วย Google Workspace' : 'Sign in with Google Workspace'}</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 dark:text-slate-500 font-mono font-medium">
                  {language === 'TH' ? 'หรือเลือกทดสอบโปรไฟล์ตามบทบาท (RBAC)' : 'Or Test RBAC Demo Roles'}
                </span>
              </div>
            </div>

            {/* Quick Demo Profiles */}
            <div className="space-y-1.5">
              {CORPORATE_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleQuickSelect(user)}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50/60 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 text-left transition-all group shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 shrink-0">
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#1E60D5] dark:group-hover:text-blue-400">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {language === 'TH' ? user.departmentTh : user.department}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    {user.role}
                  </span>
                </button>
              ))}
            </div>

            {/* Security Guarantee */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Protected by Active Directory Domain Services & TLS 1.3</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
