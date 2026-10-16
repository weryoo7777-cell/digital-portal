import { EnterpriseApp } from '../types';

export interface ResolvedAppIcon {
  iconName: string;
  customIconUrl?: string;
  icon: string;
  isCustom: boolean;
}

/**
 * Robust App Icon Resolver
 * Guarantees that whether an app uses:
 * 1. An uploaded file (data:image/...)
 * 2. An external image/favicon URL (https://...)
 * 3. A preset Lucide icon name (Layers, Calculator, Shield, etc.)
 * Or whether the caller passed `icon`, `iconName`, or `customIconUrl`,
 * all properties stay strictly synchronized and are never overwritten by stale defaults.
 */
export function resolveAppIcon(
  app?: Partial<EnterpriseApp> & { icon?: string } | null
): ResolvedAppIcon {
  if (!app) {
    return {
      iconName: 'Layers',
      customIconUrl: undefined,
      icon: 'Layers',
      isCustom: false
    };
  }

  // 1. Check for custom icon (Data URI, HTTP/HTTPS URL, or root-relative URL)
  const candidateCustom = [
    typeof app.customIconUrl === 'string' ? app.customIconUrl.trim() : '',
    typeof app.icon === 'string' && (app.icon.startsWith('http') || app.icon.startsWith('data:') || app.icon.startsWith('/')) ? app.icon.trim() : '',
    typeof app.iconName === 'string' && (app.iconName.startsWith('http') || app.iconName.startsWith('data:') || app.iconName.startsWith('/')) ? app.iconName.trim() : ''
  ].find(c => c && (c.startsWith('http://') || c.startsWith('https://') || c.startsWith('data:') || c.startsWith('/')));

  if (candidateCustom) {
    return {
      iconName: candidateCustom,
      customIconUrl: candidateCustom,
      icon: candidateCustom,
      isCustom: true
    };
  }

  // 2. Preset icon name (e.g. Layers, Calculator, CreditCard, Shield, etc.)
  const candidatePreset = [
    typeof app.iconName === 'string' && !app.iconName.startsWith('http') && !app.iconName.startsWith('data:') ? app.iconName.trim() : '',
    typeof app.icon === 'string' && !app.icon.startsWith('http') && !app.icon.startsWith('data:') ? app.icon.trim() : ''
  ].find(p => Boolean(p && p !== ''));

  const finalPreset = candidatePreset || 'Layers';

  return {
    iconName: finalPreset,
    customIconUrl: undefined,
    icon: finalPreset,
    isCustom: false
  };
}
