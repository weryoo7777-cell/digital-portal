import React from 'react';
import { 
  Calculator, 
  ScanText, 
  ReceiptText, 
  FileCheck, 
  Layers, 
  Network, 
  ShieldCheck, 
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

const ICON_MAP: Record<string, React.ElementType> = {
  Calculator,
  ScanText,
  ReceiptText,
  FileCheck,
  Layers,
  Network,
  ShieldCheck,
  Headphones,
  Users,
  Package,
  HardDrive,
  Mail,
  CalendarCheck,
  BarChart3,
  Building2,
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
        return { label: 'บัญชี', style: 'bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300 border-blue-200 dark:border-blue-800/60' };
      case 'boi':
        return { label: 'BOI', style: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60' };
      case 'it':
        return { label: 'IT', style: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60' };
      case 'external':
        return { label: 'ราชการ & ธนาคาร', style: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60' };
      default:
        return { label: (cat || '').toUpperCase(), style: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
    }
  };

  const catBadge = getCategoryBadge(app?.category);

  return (
    <div 
      onClick={() => onLaunchApp(app)}
      className={`
        group relative rounded-2xl border bg-white dark:bg-slate-900 p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 min-w-0 overflow-hidden
        ${hasAccess 
          ? 'border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md dark:hover:shadow-slate-950/60 hover:-translate-y-0.5' 
          : 'border-slate-200/60 dark:border-slate-800/60 opacity-60 bg-slate-50/50 dark:bg-slate-950/40'}
      `}
    >
      {/* Left: App Icon & Details with strict text truncate */}
      <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
        <div className={`
          w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-2xs
          ${hasAccess 
            ? 'bg-blue-50/80 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 text-[#1E60D5] dark:text-blue-400 group-hover:bg-[#1E60D5] dark:group-hover:bg-[#1E60D5] group-hover:text-white group-hover:border-[#1E60D5]' 
            : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'}
        `}>
          <IconComponent className="w-5 h-5 shrink-0" />
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex items-center gap-1.5 min-w-0 w-full overflow-hidden">
            <h3 
              className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#1E60D5] dark:group-hover:text-blue-400 transition-colors truncate min-w-0 flex-1 block"
              title={app.name}
            >
              {app.name}
            </h3>
            {!hasAccess && (
              <Lock className="w-3 h-3 text-amber-500 shrink-0" />
            )}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border shrink-0 ${catBadge.style}`}>
              {catBadge.label}
            </span>
          </div>
          <p 
            className="text-xs text-slate-500 dark:text-slate-400 font-normal truncate block min-w-0 mt-0.5" 
            title={language === 'TH' ? (app.nameTh || app.descriptionTh || app.description) : (app.description || app.descriptionTh)}
          >
            {language === 'TH' ? (app.nameTh || app.descriptionTh || app.description) : (app.description || app.descriptionTh)}
          </p>
        </div>
      </div>

      {/* Right: Star Icon for Favorite & Admin Controls & Arrow hint */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Admin CRUD Actions (Requirement #4: Only visible to Admin) */}
        {isUserAdmin && onEditApp && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEditApp(app);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#1E60D5] hover:bg-blue-50 dark:hover:bg-blue-950/60 dark:hover:text-blue-400 transition-colors"
            title={language === 'TH' ? 'แก้ไขแอปพลิเคชัน' : 'Edit application'}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}

        {isUserAdmin && onDeleteApp && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (app?.id) onDeleteApp(app.id);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 transition-colors"
            title={language === 'TH' ? 'ลบแอปพลิเคชัน' : 'Delete application'}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (app?.id) onToggleFavorite(app.id);
          }}
          className={`p-1.5 rounded-lg transition-colors ${
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
