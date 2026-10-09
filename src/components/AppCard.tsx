import React, { useState } from 'react';
import { 
  Calculator, 
  ScanText, 
  ReceiptText, 
  FileCheck, 
  FileText,
  Layers, 
  Network, 
  ShieldCheck, 
  Shield,
  Headphones, 
  Users, 
  Package, 
  HardDrive, 
  Mail, 
  CalendarCheck, 
  BarChart3, 
  Star, 
  Lock,
  Building2,
  Building,
  Landmark, 
  Globe, 
  CreditCard, 
  Banknote,
  ExternalLink,
  ArrowUpRight,
  Edit2,
  Trash2
} from 'lucide-react';
import { EnterpriseApp, UserRole } from '../types';

interface AppCardProps {
  app: EnterpriseApp;
  currentUserRole: UserRole;
  isFavorite: boolean;
  onToggleFavorite: (appId: string) => void;
  onLaunchApp: (app: EnterpriseApp) => void;
  language: 'TH' | 'EN';
  isAdmin?: boolean;
  onEditApp?: (app: EnterpriseApp) => void;
  onDeleteApp?: (appId: string) => void;
}

export const ICON_MAP: Record<string, React.ElementType> = {
  Calculator,
  ScanText,
  ReceiptText,
  FileCheck,
  FileText,
  Layers,
  Network,
  ShieldCheck,
  Shield,
  Headphones,
  Users,
  Package,
  HardDrive,
  Mail,
  CalendarCheck,
  BarChart3,
  Building2,
  Building,
  Landmark,
  Globe,
  CreditCard,
  Banknote
};

export const AppCard: React.FC<AppCardProps> = ({
  app,
  currentUserRole,
  isFavorite,
  onToggleFavorite,
  onLaunchApp,
  language,
  isAdmin = false,
  onEditApp,
  onDeleteApp
}) => {
  const [imgError, setImgError] = useState(false);

  if (!app) return null;

  const IconComponent = (app && app.iconName && ICON_MAP[app.iconName]) || Layers;
  const isUserAdmin = isAdmin || (currentUserRole || '').toLowerCase() === 'admin';
  const rolesList = (app && app.allowedRoles) || [];
  const hasAccess = isUserAdmin || 
    rolesList.length === 0 ||
    rolesList.includes(currentUserRole) || 
    rolesList.some(r => (r || '').toLowerCase() === 'user');

  const getCategoryBadge = (cat?: string) => {
    switch (cat) {
      case 'accounting':
        return { 
          label: 'บัญชี', 
          dot: 'bg-blue-500 dark:bg-blue-400',
          style: 'bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300 border-blue-200 dark:border-blue-800/60' 
        };
      case 'boi':
        return { 
          label: 'BOI', 
          dot: 'bg-amber-500 dark:bg-amber-400',
          style: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60' 
        };
      case 'it':
        return { 
          label: 'IT', 
          dot: 'bg-purple-500 dark:bg-purple-400',
          style: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60' 
        };
      case 'external':
        return { 
          label: 'ราชการ & ธนาคาร', 
          dot: 'bg-emerald-500 dark:bg-emerald-400',
          style: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60' 
        };
      default:
        return { 
          label: (cat || '').toUpperCase(), 
          dot: 'bg-slate-400 dark:bg-slate-500',
          style: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' 
        };
    }
  };

  const catBadge = getCategoryBadge(app?.category);

  // Main topic (หัวข้อหลัก) resolution for clean, complete display without abrupt cut-off
  const displayName = language === 'TH' ? (app.nameTh || app.name) : (app.name || app.nameTh);
  const rawDescription = language === 'TH' ? (app.descriptionTh || app.description) : (app.description || app.descriptionTh);
  const displayDesc = rawDescription ? rawDescription.trim() : '';

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Direct open to destination URL without page refresh or home redirect
    if (app.url && app.launchType !== 'remote_rdp') {
      try {
        window.open(app.url, '_blank', 'noopener,noreferrer');
      } catch (err) {
        console.error('Failed to open app URL:', err);
      }
    }
    onLaunchApp(app);
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`
        group relative rounded-2xl border bg-white dark:bg-slate-900 p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 min-w-0 overflow-hidden
        ${hasAccess 
          ? 'border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md dark:hover:shadow-slate-950/60 hover:-translate-y-0.5' 
          : 'border-slate-200/60 dark:border-slate-800/60 opacity-60 bg-slate-50/50 dark:bg-slate-950/40'}
      `}
    >
      {/* Top-Right Category Micro-Badge & Color Dot (ชิดขอบขวาบนของกรอบ ไม่แย่งความเด่นของหัวข้อหลัก) */}
      <div 
        className="absolute top-2 right-3 flex items-center gap-1.5 pointer-events-none select-none z-10"
        title={catBadge.label}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${catBadge.dot}`} />
        <span className="text-[9.5px] font-medium text-slate-400 dark:text-slate-500 tracking-tight">
          {catBadge.label}
        </span>
      </div>

      {/* Left: App Icon & Details showing complete main topic / title */}
      <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden pr-1">
        <div className={`
          w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-2xs overflow-hidden
          ${hasAccess 
            ? 'bg-blue-50/80 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 text-[#1E60D5] dark:text-blue-400 group-hover:bg-[#1E60D5] dark:group-hover:bg-[#1E60D5] group-hover:text-white group-hover:border-[#1E60D5]' 
            : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'}
        `}>
          {(() => {
            const imgUrl = app.customIconUrl || (app.iconName?.startsWith('http') || app.iconName?.startsWith('data:') ? app.iconName : null);
            if (imgUrl && !imgError) {
              return (
                <img 
                  src={imgUrl} 
                  alt={app.name} 
                  className="w-7 h-7 object-contain rounded-md bg-white/80 dark:bg-slate-800/80 p-0.5"
                  onError={() => setImgError(true)}
                />
              );
            }
            return <IconComponent className="w-5 h-5 shrink-0" />;
          })()}
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex items-center gap-1.5 min-w-0 w-full">
            <h3 
              className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#1E60D5] dark:group-hover:text-blue-400 transition-colors line-clamp-1 min-w-0 flex-1 block leading-snug"
              title={displayName}
            >
              {displayName}
            </h3>
            {!hasAccess && (
              <Lock className="w-3 h-3 text-amber-500 shrink-0" />
            )}
          </div>
          {displayDesc && (
            <p 
              className="text-xs text-slate-500 dark:text-slate-400 font-normal line-clamp-2 leading-relaxed block min-w-0 mt-0.5" 
              title={displayDesc}
            >
              {displayDesc}
            </p>
          )}
        </div>
      </div>

      {/* Right: Star Icon for Favorite & Admin Controls & Arrow hint */}
      <div className="flex items-center gap-1 shrink-0 mt-3 sm:mt-2">
        {/* Admin CRUD Actions (Requirement #4: Only visible to Admin) */}
        {isUserAdmin && onEditApp && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEditApp(app);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#1E60D5] hover:bg-blue-50 dark:hover:bg-blue-950/60 dark:hover:text-blue-400 transition-colors cursor-pointer"
            title={language === 'TH' ? 'แก้ไขแอปพลิเคชัน' : 'Edit application'}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}

        {isUserAdmin && onDeleteApp && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (app?.id) onDeleteApp(app.id);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 transition-colors cursor-pointer"
            title={language === 'TH' ? 'ลบแอปพลิเคชัน' : 'Delete application'}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (app?.id) onToggleFavorite(app.id);
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isFavorite 
              ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40' 
              : 'text-slate-300 dark:text-slate-600 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400 dark:text-slate-500'}`} />
        </button>

        <div className="text-slate-300 dark:text-slate-600 group-hover:text-[#1E60D5] dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all hidden sm:block">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
