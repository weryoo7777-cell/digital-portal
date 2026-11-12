import {
  LayoutDashboard,
  Building2,
  BookUser,
  Calendar,
  Bell,
  Grid,
  Calculator,
  ReceiptText,
  Network,
  Landmark
} from 'lucide-react';
import type { ElementType } from 'react';
import { AppCategory, NavTab } from '../types';

export interface NavItemConfig {
  id: NavTab;
  labelTh: string;
  labelEn: string;
  icon: ElementType;
  badgeText?: string;
}

export interface AppCategoryTabConfig {
  id: AppCategory;
  labelTh: string;
  labelEn: string;
  icon: ElementType;
}

/**
 * Global Primary Navigation Configuration
 * Hardcoded in source control so all users across all sessions render the exact same menu by default.
 */
export const PRIMARY_NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'dashboard',
    labelTh: 'หน้าหลัก',
    labelEn: 'Home',
    icon: LayoutDashboard
  },
  {
    id: 'affiliates',
    labelTh: 'บริษัทในเครือ qisheng',
    labelEn: 'Qisheng Group Affiliates',
    icon: Building2
  },
  {
    id: 'vendor-contact',
    labelTh: 'จัดการผู้ให้บริการ (Vendor Contact)',
    labelEn: 'Vendor Contacts',
    icon: BookUser
  }
];

export const CALENDAR_NAV_ITEM: NavItemConfig = {
  id: 'calendar',
  labelTh: 'ปฏิทินองค์กร',
  labelEn: 'Organization Calendar',
  icon: Calendar
};

export const ADMIN_NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'announcements',
    labelTh: 'จัดการประกาศข่าวสาร',
    labelEn: 'Manage Announcements',
    icon: Bell,
    badgeText: 'Admin'
  }
];

export const VALID_NAV_TABS: NavTab[] = [
  'dashboard',
  'affiliates',
  'vendor-contact',
  'calendar',
  'announcements'
];

export const APP_CATEGORY_TABS: AppCategoryTabConfig[] = [
  { id: 'all', labelTh: 'ทั้งหมด (All)', labelEn: 'All Apps', icon: Grid },
  { id: 'accounting', labelTh: 'บัญชี (Accounting)', labelEn: 'Accounting', icon: Calculator },
  { id: 'boi', labelTh: 'BOI', labelEn: 'BOI', icon: ReceiptText },
  { id: 'it', labelTh: 'IT', labelEn: 'IT', icon: Network },
  { id: 'external', labelTh: 'ระบบราชการ & ธนาคาร', labelEn: 'Gov & Banking', icon: Landmark }
];

export const getNavTabTitle = (tab: NavTab, language: 'TH' | 'EN'): string => {
  switch (tab) {
    case 'dashboard':
      return language === 'TH' ? 'หน้าหลัก' : 'Home';
    case 'affiliates':
      return language === 'TH' ? 'บริษัทในเครือ qisheng' : 'Qisheng Group Affiliates';
    case 'vendor-contact':
      return language === 'TH' ? 'จัดการผู้ให้บริการ (Vendor Contact)' : 'Vendor Contacts';
    case 'calendar':
      return language === 'TH' ? 'ปฏิทินองค์กร' : 'Organization Calendar';
    case 'announcements':
      return language === 'TH' ? 'จัดการประกาศข่าวสาร (Announcements)' : 'Manage Announcements';
    default:
      return 'QISHENG';
  }
};
