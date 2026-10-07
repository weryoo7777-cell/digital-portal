import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  Globe2, 
  AlertCircle,
  Sparkles,
  Crown,
  UserCheck,
  Building2,
  KeyRound
} from 'lucide-react';
import { UserProfile } from '../types';
import { 
  CORPORATE_USERS, 
  DEFAULT_ADMIN_ACCOUNT, 
  DEFAULT_USER_ACCOUNT, 
  QISHENG_LOGO,
  CORPORATE_BUILDING_BANNER
} from '../data/portalData';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  availableUsers: UserProfile[];
  language: 'TH' | 'EN';
  onToggleLanguage?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  availableUsers,
  language,
  onToggleLanguage
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethodNotice, setLoginMethodNotice] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanUsername) {
      setError(language === 'TH' ? 'กรุณากรอกชื่อผู้ใช้ / Username' : 'Please enter Username');
      return;
    }
    if (!cleanPassword) {
      setError(language === 'TH' ? 'กรุณากรอกรหัสผ่าน (Password)' : 'Please enter Password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Find matching user from available users by username or email
      const foundUser = availableUsers.find(u => {
        const matchUser = (u.username && u.username.toLowerCase() === cleanUsername) || 
                          u.email.toLowerCase() === cleanUsername;
        return matchUser;
      });

      if (!foundUser) {
        setIsLoading(false);
        setError(language === 'TH' 
          ? 'ไม่พบบัญชีผู้ใช้นี้ในระบบ กรุณาตรวจสอบชื่อผู้ใช้ / Username อีกครั้ง' 
          : 'User account not found. Please verify your username.');
        return;
      }

      // Check password
      const userPassword = foundUser.password || 'password123';
      if (cleanPassword !== userPassword) {
        setIsLoading(false);
        setError(language === 'TH' 
          ? 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' 
          : 'Invalid password. Please try again.');
        return;
      }

      // Successful login
      setIsLoading(false);
      onLoginSuccess(foundUser);
    }, 600);
  };

  const handleQuickLogin = (targetUser: UserProfile) => {
    setUsername(targetUser.username || targetUser.email);
    setPassword(targetUser.password || 'password123');
    setError(null);
    setIsLoading(true);
    setLoginMethodNotice(`Signing in as ${targetUser.name} (${targetUser.role.toUpperCase()})`);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(targetUser);
    }, 500);
  };

  const handleSsoSimulate = (provider: 'EntraID' | 'GoogleWorkspace') => {
    setIsLoading(true);
    setLoginMethodNotice(provider === 'EntraID' ? 'Connecting Microsoft Entra ID...' : 'Connecting Google Workspace...');
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      const targetUser = provider === 'EntraID' ? availableUsers[0] : availableUsers[1] || availableUsers[0];
      onLoginSuccess(targetUser);
    }, 900);
  };

  return (
    <div className="min-h-screen w-full bg-[#0F172A] relative flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#1E60D5] selection:text-white">
      {/* Background Decor & Atmospheric Glows */}
      <div 
        className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url(${CORPORATE_BUILDING_BANNER})` }}
      />
      <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Language Switcher in Top Right */}
      {onToggleLanguage && (
        <div className="absolute top-5 right-5 sm:top-6 sm:right-8 z-20">
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-200 text-xs font-semibold backdrop-blur-md transition-all shadow-sm"
          >
            <Globe2 className="w-3.5 h-3.5 text-blue-400" />
            <span>{language === 'TH' ? 'TH (ไทย)' : 'EN (English)'}</span>
          </button>
        </div>
      )}

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl">
        
        {/* Left Side: Brand Imagery & Corporate System Identity */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-[#133777] to-slate-900 text-white p-6 sm:p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-52 h-52 bg-blue-500/15 rounded-full blur-2xl" />
          <div className="absolute -left-16 -bottom-16 w-52 h-52 bg-indigo-500/20 rounded-full blur-2xl" />

          {/* Top Brand Header: Logo, QISHENG name and main title only */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 p-1 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-lg">
                <img 
                  src={QISHENG_LOGO} 
                  alt="QISHENG Logo" 
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="font-extrabold text-blue-400 text-xl tracking-wider">QS</span>
              </div>
              <div>
                <div className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span>QISHENG</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-300 border border-blue-400/30 font-bold">
                    PORTAL
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {language === 'TH' ? 'ศูนย์รวมระบบงานและแอปพลิเคชันองค์กร' : 'One Portal All Your Corporate Work'}
              </h2>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-white dark:bg-slate-900">
          <div>
            {/* Header Greeting */}
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {language === 'TH' ? 'เข้าสู่ระบบ (Sign In)' : 'Sign in to your account'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {language === 'TH' 
                  ? 'กรุณากรอก Username และ Password เพื่อเข้าใช้งานระบบ' 
                  : 'Enter your corporate credentials to access the digital portal'}
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Notice (e.g. progress) */}
            {loginMethodNotice && (
              <div className="mb-4 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
                <span>{loginMethodNotice}</span>
              </div>
            )}

            {/* Main Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Username Input: Only "ชื่อผู้ใช้ / Username" */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'TH' ? 'ชื่อผู้ใช้ / Username' : 'Username'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder={language === 'TH' ? 'ชื่อผู้ใช้ / Username' : 'Username'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E60D5] focus:border-transparent transition-all"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {language === 'TH' ? 'รหัสผ่าน / Password' : 'Password'}
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {language === 'TH' ? 'ระบบจดจำสิทธิ์อัตโนมัติ' : 'Role-based'}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E60D5] focus:border-transparent transition-all font-mono"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#1E60D5] hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{language === 'TH' ? 'กำลังตรวจสอบข้อมูล...' : 'Authenticating...'}</span>
                  </>
                ) : (
                  <>
                    <span>{language === 'TH' ? 'เข้าสู่ระบบ (Sign In)' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
