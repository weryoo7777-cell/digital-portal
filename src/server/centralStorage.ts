import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  EnterpriseApp, 
  CorporateAnnouncement, 
  VendorContact, 
  AccessLogEntry 
} from '../types';
import { ENTERPRISE_APPS, CORPORATE_ANNOUNCEMENTS } from '../data/portalData';
import { INITIAL_VENDOR_CONTACTS } from '../data/vendorData';
import { ADMIN_PIN } from '../config/adminConfig';

export interface CentralPortalStorageData {
  adminPin: string;
  apps: EnterpriseApp[];
  announcements: CorporateAnnouncement[];
  vendorContacts: VendorContact[];
  recentLogs: AccessLogEntry[];
  lastAnnouncementUpdate: string;
  lastAppsUpdate: string;
  lastVendorsUpdate: string;
  lastPinUpdate: string;
}

const DEFAULT_RECENT_LOGS: AccessLogEntry[] = [
  {
    id: 'log-seed-1',
    appId: 'app-express',
    appName: 'Express Accounting',
    appTh: 'ระบบบัญชี Express for Windows',
    category: 'accounting',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    formattedTime: '10 นาทีที่แล้ว',
    user: 'General User',
    status: 'Authorized',
    url: 'rdp://192.168.20.10:3389',
    iconName: 'Calculator'
  },
  {
    id: 'log-seed-2',
    appId: 'app-protrack',
    appName: 'ProTrack Manufacturing & Execution',
    appTh: 'ระบบติดตามการผลิตและการทำงาน ProTrack',
    category: 'it',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    formattedTime: '25 นาทีที่แล้ว',
    user: 'General User',
    status: 'Authorized',
    url: 'https://protrack.qisheng.local',
    iconName: 'Activity'
  },
  {
    id: 'log-seed-3',
    appId: 'app-boi-sw',
    appName: 'Single Window for Visa and Work Permit',
    appTh: 'ระบบศูนย์บริการวีซ่าและใบอนุญาตทำงาน (Single Window)',
    category: 'boi',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    formattedTime: '45 นาทีที่แล้ว',
    user: 'General User',
    status: 'Authorized',
    url: 'https://visasw.boi.go.th',
    iconName: 'ReceiptText'
  },
  {
    id: 'log-seed-4',
    appId: 'gov-rd-efiling',
    appName: 'RD New e-Filing Portal',
    appTh: 'กรมสรรพากร — ระบบยื่นแบบภาษีออนไลน์',
    category: 'external',
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    formattedTime: '1 ชม. ที่แล้ว',
    user: 'General User',
    status: 'Authorized',
    url: 'https://efiling.rd.go.th',
    iconName: 'Landmark'
  }
];

function getStorageFilePath(): string {
  try {
    const currentDir = typeof __dirname !== 'undefined' 
      ? __dirname 
      : path.dirname(fileURLToPath(import.meta.url));
    const storageDir = path.resolve(currentDir, '../data');
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    return path.join(storageDir, 'centralPortalStorage.json');
  } catch {
    return path.resolve(process.cwd(), 'src/data/centralPortalStorage.json');
  }
}

let inMemoryData: CentralPortalStorageData | null = null;

export function loadCentralStorage(): CentralPortalStorageData {
  if (inMemoryData) {
    return inMemoryData;
  }

  const filePath = getStorageFilePath();
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content) as Partial<CentralPortalStorageData>;
      inMemoryData = {
        adminPin: parsed.adminPin || ADMIN_PIN || '1111',
        apps: Array.isArray(parsed.apps) && parsed.apps.length > 0 ? parsed.apps : ENTERPRISE_APPS,
        announcements: Array.isArray(parsed.announcements) && parsed.announcements.length > 0 ? parsed.announcements : CORPORATE_ANNOUNCEMENTS,
        vendorContacts: Array.isArray(parsed.vendorContacts) && parsed.vendorContacts.length > 0 ? parsed.vendorContacts : INITIAL_VENDOR_CONTACTS,
        recentLogs: Array.isArray(parsed.recentLogs) ? parsed.recentLogs : DEFAULT_RECENT_LOGS,
        lastAnnouncementUpdate: parsed.lastAnnouncementUpdate || new Date().toISOString(),
        lastAppsUpdate: parsed.lastAppsUpdate || new Date().toISOString(),
        lastVendorsUpdate: parsed.lastVendorsUpdate || new Date().toISOString(),
        lastPinUpdate: parsed.lastPinUpdate || new Date().toISOString(),
      };
      return inMemoryData;
    } catch (err) {
      console.warn('Error reading central storage file, creating default:', err);
    }
  }

  // Initialize with standard corporate portal data
  inMemoryData = {
    adminPin: ADMIN_PIN || '1111',
    apps: ENTERPRISE_APPS,
    announcements: CORPORATE_ANNOUNCEMENTS.map(a => ({
      ...a,
      updatedAt: a.updatedAt || new Date().toISOString()
    })),
    vendorContacts: INITIAL_VENDOR_CONTACTS,
    recentLogs: DEFAULT_RECENT_LOGS,
    lastAnnouncementUpdate: new Date().toISOString(),
    lastAppsUpdate: new Date().toISOString(),
    lastVendorsUpdate: new Date().toISOString(),
    lastPinUpdate: new Date().toISOString(),
  };

  saveCentralStorage(inMemoryData);
  return inMemoryData;
}

export function saveCentralStorage(data: CentralPortalStorageData): void {
  inMemoryData = data;
  try {
    const filePath = getStorageFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save central portal storage to disk:', err);
  }
}

// Helper accessors and mutators
export function getCentralData(): CentralPortalStorageData {
  return loadCentralStorage();
}

export function updateApps(apps: EnterpriseApp[]): CentralPortalStorageData {
  const data = loadCentralStorage();
  data.apps = apps;
  data.lastAppsUpdate = new Date().toISOString();
  saveCentralStorage(data);
  return data;
}

export function saveApp(app: EnterpriseApp): CentralPortalStorageData {
  const data = loadCentralStorage();
  const exists = data.apps.some(a => a.id === app.id);
  data.apps = exists 
    ? data.apps.map(a => a.id === app.id ? app : a)
    : [app, ...data.apps];
  data.lastAppsUpdate = new Date().toISOString();
  saveCentralStorage(data);
  return data;
}

export function deleteApp(appId: string): CentralPortalStorageData {
  const data = loadCentralStorage();
  data.apps = data.apps.filter(a => a.id !== appId);
  data.lastAppsUpdate = new Date().toISOString();
  saveCentralStorage(data);
  return data;
}

export function addAnnouncement(ann: CorporateAnnouncement): CentralPortalStorageData {
  const data = loadCentralStorage();
  const now = new Date().toISOString();
  const fullAnn: CorporateAnnouncement = {
    ...ann,
    id: ann.id || `ann-${Date.now()}`,
    updatedAt: now,
    createdAt: ann.createdAt || now
  };
  data.announcements = [fullAnn, ...data.announcements];
  data.lastAnnouncementUpdate = now;
  saveCentralStorage(data);
  return data;
}

export function deleteAnnouncement(annId: string): CentralPortalStorageData {
  const data = loadCentralStorage();
  data.announcements = data.announcements.filter(a => a.id !== annId);
  data.lastAnnouncementUpdate = new Date().toISOString();
  saveCentralStorage(data);
  return data;
}

export function saveVendor(vendor: VendorContact): CentralPortalStorageData {
  const data = loadCentralStorage();
  const exists = data.vendorContacts.some(v => v.id === vendor.id);
  data.vendorContacts = exists
    ? data.vendorContacts.map(v => v.id === vendor.id ? vendor : v)
    : [vendor, ...data.vendorContacts];
  data.lastVendorsUpdate = new Date().toISOString();
  saveCentralStorage(data);
  return data;
}

export function deleteVendor(vendorId: string): CentralPortalStorageData {
  const data = loadCentralStorage();
  data.vendorContacts = data.vendorContacts.filter(v => v.id !== vendorId);
  data.lastVendorsUpdate = new Date().toISOString();
  saveCentralStorage(data);
  return data;
}

export function resetVendors(): CentralPortalStorageData {
  const data = loadCentralStorage();
  data.vendorContacts = INITIAL_VENDOR_CONTACTS;
  data.lastVendorsUpdate = new Date().toISOString();
  saveCentralStorage(data);
  return data;
}

export function recordAccessLog(entry: Omit<AccessLogEntry, 'id' | 'timestamp'>): CentralPortalStorageData {
  const data = loadCentralStorage();
  const now = new Date();
  const newLog: AccessLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now.toISOString(),
    formattedTime: 'เมื่อสักครู่ (Just now)',
    status: entry.status || 'Authorized',
    ...entry,
  };

  // Keep top 60 logs
  data.recentLogs = [newLog, ...data.recentLogs.filter(l => l.id !== newLog.id)].slice(0, 60);
  saveCentralStorage(data);
  return data;
}

export function verifyAdminPin(pin?: string | null): boolean {
  if (!pin) return false;
  const data = loadCentralStorage();
  return pin.trim() === (data.adminPin || '1111').trim();
}

export function updateAdminPin(currentPin: string, newPin: string): { success: boolean; error?: string } {
  const data = loadCentralStorage();
  if (currentPin.trim() !== (data.adminPin || '1111').trim()) {
    return { success: false, error: 'Current PIN is invalid' };
  }
  if (!newPin || newPin.trim().length < 4) {
    return { success: false, error: 'New PIN must be at least 4 digits' };
  }
  data.adminPin = newPin.trim();
  data.lastPinUpdate = new Date().toISOString();
  saveCentralStorage(data);
  return { success: true };
}
