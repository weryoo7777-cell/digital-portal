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
  ArrowUpRight
} from 'lucide-react';
import { EnterpriseApp, UserRole } from '../types';

interface AppCardProps {
  app: EnterpriseApp;
  currentUserRole: UserRole;
  isFavorite: boolean;
  onToggleFavorite: (appId: string) => void;
  onLaunchApp: (app: EnterpriseApp) => void;
  language: 'TH' | 'EN';
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
  language
}) => {
  const IconComponent = ICON_MAP[app.iconName] || Layers;
  const hasAccess = app.allowedRoles.includes(currentUserRole);

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'accounting':
        return { label: 'Accounting', style: 'bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300 border-blue-200 dark:border-blue-800/60' };
      case 'tax':
        return { label: 'Tax / Gov', style: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60' };
      case 'hr':
        return { label: 'HR & People', style: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60' };
      case 'it':
        return { label: 'IT Infra', style: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60' };
      case 'operations':
        return { label: 'Operations', style: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60' };
      case 'productivity':
        return { label: 'Workspace', style: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60' };
      default:
        return { label: 'General', style: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
    }
  };

  const catBadge = getCategoryBadge(app.category);

  return (
    <div 
      onClick={() => onLaunchApp(app)}
      className={`
        group relative rounded-2xl border bg-white dark:bg-slate-900 p-4 flex items-center justify-between gap-3.5 cursor-pointer transition-all duration-200
        ${hasAccess 
          ? 'border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md dark:hover:shadow-slate-950/60 hover:-translate-y-0.5' 
          : 'border-slate-200/60 dark:border-slate-800/60 opacity-60 bg-slate-50/50 dark:bg-slate-950/40'}
      `}
    >
      {/* Left: App Icon & Details */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-2xs
          ${hasAccess 
            ? 'bg-blue-50/80 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 text-[#1E60D5] dark:text-blue-400 group-hover:bg-[#1E60D5] dark:group-hover:bg-[#1E60D5] group-hover:text-white group-hover:border-[#1E60D5]' 
            : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'}
        `}>
          <IconComponent className="w-5 h-5" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-[#1E60D5] dark:group-hover:text-blue-400 transition-colors truncate">
              {app.name}
            </h3>
            {!hasAccess && (
              <Lock className="w-3 h-3 text-amber-500 shrink-0" />
            )}
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md border ${catBadge.style}`}>
              {catBadge.label}
            </span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-normal line-clamp-1 mt-0.5">
            {language === 'TH' ? app.nameTh : app.description}
          </div>
        </div>
      </div>

      {/* Right: Star Icon for Favorite & Arrow hint */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(app.id);
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
