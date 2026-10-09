import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EnterpriseApp, CorporateAnnouncement, ActivityLogItem, PortalDataSyncResponse, VendorContact } from '../types';
import { ENTERPRISE_APPS, CORPORATE_ANNOUNCEMENTS } from '../data/portalData';
import { INITIAL_VENDOR_CONTACTS } from '../data/vendorData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORAGE_FILE = path.resolve(__dirname, '../../central-portal-store.json');

export interface CentralStoreSchema {
  version: number;
  adminPin: string;
  latestAnnouncementId: string;
  latestAnnouncementUpdatedAt: number;
  lastAnnouncementAction?: 'create' | 'update' | 'delete' | 'init';
  apps: EnterpriseApp[];
  deletedAppIds?: string[];
  announcements: CorporateAnnouncement[];
  vendorContacts: VendorContact[];
  activityLogs: ActivityLogItem[];
  lastModified: number;
}

// Initial seed activity logs reflecting realistic corporate LAN access
const INITIAL_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'log-seed-1',
    appId: 'app-express',
    appName: 'Express Accounting',
    appNameTh: 'ระบบบัญชี Express for Windows',
    appUrl: 'rdp://192.168.20.10:3389',
    category: 'accounting',
    clientIp: '192.168.20.12',
    workstationHostname: 'QS-BKK-ACC-PC03',
    userName: 'Suda Pornpitak',
    userRole: 'user',
    timestamp: Date.now() - 1000 * 60 * 12, // 12 mins ago
    status: 'online',
    action: 'Launched RDP Session'
  },
  {
    id: 'log-seed-2',
    appId: 'app-protrack',
    appName: 'ProTrack System',
    appNameTh: 'ระบบบริหารและติดตามความคืบหน้างาน ProTrack',
    appUrl: 'https://protrack.qisheng.internal',
    category: 'it',
    clientIp: '192.168.10.45',
    workstationHostname: 'QISHENG-022',
    userName: 'Paramed Cherdchoo',
    userRole: 'admin',
    timestamp: Date.now() - 1000 * 60 * 28, // 28 mins ago
    status: 'online',
    action: 'Opened Dashboard'
  },
  {
    id: 'log-seed-3',
    appId: 'app-etax',
    appName: 'e-Tax Invoice & e-Receipt Portal',
    appNameTh: 'ระบบใบกำกับภาษีอิเล็กทรอนิกส์ (e-Tax)',
    appUrl: 'https://etax.rd.go.th',
    category: 'accounting',
    clientIp: '192.168.20.14',
    workstationHostname: 'QS-BKK-ACC-PC05',
    userName: 'Accounting Staff',
    userRole: 'user',
    timestamp: Date.now() - 1000 * 60 * 55, // 55 mins ago
    status: 'online',
    action: 'Tax Certificate Verify'
  },
  {
    id: 'log-seed-4',
    appId: 'app-mikrotik',
    appName: 'MikroTik CCR2004 Core Router',
    appNameTh: 'เราเตอร์เครือข่ายหลักและไฟร์วอลล์ MikroTik',
    appUrl: 'https://192.168.1.1',
    category: 'it',
    clientIp: '192.168.10.46',
    workstationHostname: 'QS-BKK-IT-NB04',
    userName: 'Somchai Vijitsilp',
    userRole: 'admin',
    timestamp: Date.now() - 1000 * 60 * 90, // 1.5 hours ago
    status: 'online',
    action: 'RouterOS Traffic Check'
  }
];

class CentralStoreManager {
  private store: CentralStoreSchema;
  private isLoaded: boolean = false;

  constructor() {
    this.store = this.getDefaultStore();
    this.loadStore();
  }

  private getDefaultStore(): CentralStoreSchema {
    const now = Date.now();
    const seededAnnouncements = CORPORATE_ANNOUNCEMENTS.map((a, idx) => ({
      ...a,
      updatedAt: now - (idx * 3600000)
    }));

    return {
      version: 1,
      adminPin: '1111',
      latestAnnouncementId: seededAnnouncements[0]?.id || 'ann-welcome',
      latestAnnouncementUpdatedAt: seededAnnouncements[0]?.updatedAt || now,
      apps: [...ENTERPRISE_APPS],
      deletedAppIds: [],
      announcements: seededAnnouncements,
      vendorContacts: [...INITIAL_VENDOR_CONTACTS],
      activityLogs: [...INITIAL_ACTIVITY_LOGS],
      lastModified: now
    };
  }

  private loadStore() {
    try {
      if (fs.existsSync(STORAGE_FILE)) {
        const raw = fs.readFileSync(STORAGE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.apps) && Array.isArray(parsed.announcements)) {
          const deletedAppIds: string[] = Array.isArray(parsed.deletedAppIds) ? parsed.deletedAppIds : [];
          const deletedSet = new Set<string>(deletedAppIds);

          const existingAppIds = new Set(parsed.apps.map((a: any) => a.id));
          // Only add missing defaults if they were never deleted by the user
          const missingAppDefaults = ENTERPRISE_APPS.filter(a => !existingAppIds.has(a.id) && !deletedSet.has(a.id));
          const allMergedApps = [...parsed.apps, ...missingAppDefaults].filter(a => !deletedSet.has(a.id));

          this.store = {
            version: parsed.version || 1,
            adminPin: parsed.adminPin || '1111',
            latestAnnouncementId: parsed.latestAnnouncementId !== undefined ? parsed.latestAnnouncementId : (parsed.announcements[0]?.id || ''),
            latestAnnouncementUpdatedAt: parsed.latestAnnouncementUpdatedAt || (parsed.announcements[0]?.updatedAt || Date.now()),
            lastAnnouncementAction: parsed.lastAnnouncementAction || 'init',
            apps: allMergedApps,
            deletedAppIds: Array.from(deletedSet),
            announcements: parsed.announcements,
            vendorContacts: Array.isArray(parsed.vendorContacts) ? parsed.vendorContacts : [...INITIAL_VENDOR_CONTACTS],
            activityLogs: Array.isArray(parsed.activityLogs) ? parsed.activityLogs : [...INITIAL_ACTIVITY_LOGS],
            lastModified: parsed.lastModified || Date.now()
          };
          this.isLoaded = true;
          return;
        }
      }
    } catch (err) {
      console.warn('[CentralStore] Failed to load existing store, falling back to defaults:', err);
    }

    this.store = this.getDefaultStore();
    this.persistStore();
    this.isLoaded = true;
  }

  private persistStore() {
    try {
      this.store.lastModified = Date.now();
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(this.store, null, 2), 'utf-8');
    } catch (err) {
      console.error('[CentralStore] Failed to save store to file:', err);
    }
  }

  public getPortalData(clientIp?: string, clientHost?: string, deviceId?: string): PortalDataSyncResponse {
    let clientLogs: ActivityLogItem[] = [];
    if (deviceId || clientIp || clientHost) {
      const normDeviceId = (deviceId || '').trim();
      const normIp = (clientIp || '').trim().toLowerCase();
      const normHost = (clientHost || '').trim().toLowerCase();

      clientLogs = this.store.activityLogs.filter((log) => {
        if (normDeviceId && log.deviceId && log.deviceId === normDeviceId) return true;
        if (normIp && log.clientIp && log.clientIp.trim().toLowerCase() === normIp) return true;
        if (normHost && log.workstationHostname && log.workstationHostname.trim().toLowerCase() === normHost) return true;
        return false;
      }).slice(0, 20);
    }

    return {
      apps: this.store.apps,
      deletedAppIds: this.store.deletedAppIds || [],
      announcements: this.store.announcements,
      vendorContacts: this.store.vendorContacts,
      activityLogs: clientLogs,
      latestAnnouncementId: this.store.latestAnnouncementId,
      latestAnnouncementUpdatedAt: this.store.latestAnnouncementUpdatedAt,
      lastAnnouncementAction: this.store.lastAnnouncementAction || 'init',
      serverTime: Date.now(),
      version: this.store.version
    };
  }

  public getApps(): EnterpriseApp[] {
    return this.store.apps;
  }

  public addApp(app: EnterpriseApp): EnterpriseApp {
    if (this.store.deletedAppIds) {
      this.store.deletedAppIds = this.store.deletedAppIds.filter(id => id !== app.id);
    }
    const existingIdx = this.store.apps.findIndex(a => a.id === app.id);
    if (existingIdx >= 0) {
      this.store.apps[existingIdx] = app;
    } else {
      this.store.apps.unshift(app);
    }
    this.store.version += 1;
    this.persistStore();
    return app;
  }

  public updateApp(app: EnterpriseApp): EnterpriseApp | null {
    if (this.store.deletedAppIds) {
      this.store.deletedAppIds = this.store.deletedAppIds.filter(id => id !== app.id);
    }
    const idx = this.store.apps.findIndex(a => a.id === app.id);
    if (idx === -1) {
      return this.addApp(app);
    }
    this.store.apps[idx] = { ...this.store.apps[idx], ...app };
    this.store.version += 1;
    this.persistStore();
    return this.store.apps[idx];
  }

  public deleteApp(appId: string): boolean {
    if (!this.store.deletedAppIds) {
      this.store.deletedAppIds = [];
    }
    if (!this.store.deletedAppIds.includes(appId)) {
      this.store.deletedAppIds.push(appId);
    }
    const initialLen = this.store.apps.length;
    this.store.apps = this.store.apps.filter(a => a.id !== appId);
    this.store.version += 1;
    this.persistStore();
    return true;
  }

  public getAnnouncements(): { announcements: CorporateAnnouncement[]; latestAnnouncementId: string; latestAnnouncementUpdatedAt: number } {
    return {
      announcements: this.store.announcements,
      latestAnnouncementId: this.store.latestAnnouncementId,
      latestAnnouncementUpdatedAt: this.store.latestAnnouncementUpdatedAt
    };
  }

  public addAnnouncement(ann: CorporateAnnouncement): CorporateAnnouncement {
    const now = Date.now();
    const newAnn: CorporateAnnouncement = {
      ...ann,
      id: ann.id || `ann-${now}`,
      updatedAt: now
    };
    this.store.announcements.unshift(newAnn);
    this.store.latestAnnouncementId = newAnn.id;
    this.store.latestAnnouncementUpdatedAt = now;
    this.store.lastAnnouncementAction = 'create';
    this.store.version += 1;
    this.persistStore();
    return newAnn;
  }

  public updateAnnouncement(ann: CorporateAnnouncement): CorporateAnnouncement | null {
    const idx = this.store.announcements.findIndex(a => a.id === ann.id);
    const now = Date.now();
    if (idx === -1) {
      return this.addAnnouncement(ann);
    }
    const updated: CorporateAnnouncement = {
      ...this.store.announcements[idx],
      ...ann,
      updatedAt: now
    };
    this.store.announcements[idx] = updated;
    this.store.latestAnnouncementId = updated.id;
    this.store.latestAnnouncementUpdatedAt = now;
    this.store.lastAnnouncementAction = 'update';
    this.store.version += 1;
    this.persistStore();
    return updated;
  }

  public deleteAnnouncement(annId: string): boolean {
    const initialLen = this.store.announcements.length;
    this.store.announcements = this.store.announcements.filter(a => a.id !== annId);
    if (this.store.announcements.length !== initialLen) {
      this.store.lastAnnouncementAction = 'delete';
      if (this.store.announcements.length > 0) {
        this.store.latestAnnouncementId = this.store.announcements[0].id;
        const rawTs = this.store.announcements[0].updatedAt;
        this.store.latestAnnouncementUpdatedAt = typeof rawTs === 'number' ? rawTs : (Date.parse(String(rawTs)) || 0);
      } else {
        this.store.latestAnnouncementId = '';
        this.store.latestAnnouncementUpdatedAt = 0;
      }
      this.store.version += 1;
      this.persistStore();
      return true;
    }
    return false;
  }

  public getActivityLogs(limit: number = 20, clientIp?: string, clientHost?: string, deviceId?: string): ActivityLogItem[] {
    if (!deviceId && !clientIp && !clientHost) {
      return [];
    }
    const normDeviceId = (deviceId || '').trim();
    const normIp = (clientIp || '').trim().toLowerCase();
    const normHost = (clientHost || '').trim().toLowerCase();

    return this.store.activityLogs.filter((log) => {
      if (normDeviceId && log.deviceId && log.deviceId === normDeviceId) return true;
      if (normIp && log.clientIp && log.clientIp.trim().toLowerCase() === normIp) return true;
      if (normHost && log.workstationHostname && log.workstationHostname.trim().toLowerCase() === normHost) return true;
      return false;
    }).slice(0, limit);
  }

  public addActivityLog(entry: Partial<ActivityLogItem>): ActivityLogItem {
    const now = Date.now();
    const clientHost = (entry.workstationHostname || '').trim().toLowerCase();
    const clientIp = (entry.clientIp || '').trim().toLowerCase();
    const deviceId = (entry.deviceId || '').trim();

    // Check if entry for the SAME app on the SAME machine already exists
    const existingIdx = this.store.activityLogs.findIndex((log) => {
      const logHost = (log.workstationHostname || '').trim().toLowerCase();
      const logIp = (log.clientIp || '').trim().toLowerCase();
      const logDeviceId = (log.deviceId || '').trim();
      
      const sameMachine = 
        (Boolean(deviceId) && Boolean(logDeviceId) && deviceId === logDeviceId) ||
        (Boolean(clientHost) && Boolean(logHost) && clientHost === logHost) ||
        (Boolean(clientIp) && Boolean(logIp) && clientIp === logIp);
      
      const sameApp = (entry.appId && log.appId && entry.appId === log.appId) ||
                      (entry.appUrl && log.appUrl && entry.appUrl === log.appUrl) ||
                      (entry.appName && log.appName && entry.appName.toLowerCase() === log.appName.toLowerCase());

      return sameMachine && sameApp;
    });

    if (existingIdx >= 0) {
      const existing = this.store.activityLogs[existingIdx];
      const updatedItem: ActivityLogItem = {
        ...existing,
        ...entry,
        id: existing.id,
        deviceId: deviceId || existing.deviceId,
        timestamp: now,
        status: entry.status || 'launched',
        action: entry.action || existing.action || 'Launched Web Application'
      };
      this.store.activityLogs.splice(existingIdx, 1);
      this.store.activityLogs.unshift(updatedItem);
      // Notice: Do NOT increment store.version - activity log is local audit and must not broadcast to LAN!
      this.persistStore();
      return updatedItem;
    }

    const logItem: ActivityLogItem = {
      id: `log-${now}-${Math.random().toString(36).substring(2, 7)}`,
      appId: entry.appId,
      appName: entry.appName || 'Unknown Application',
      appNameTh: entry.appNameTh || entry.appName || 'แอปพลิเคชัน',
      appUrl: entry.appUrl,
      category: entry.category || 'general',
      deviceId: entry.deviceId,
      clientIp: entry.clientIp || '127.0.0.1',
      workstationHostname: entry.workstationHostname || 'Workstation',
      userName: entry.userName || 'General User',
      userRole: entry.userRole || 'user',
      timestamp: now,
      status: entry.status || 'launched',
      action: entry.action || 'Direct Application Launch'
    };

    this.store.activityLogs.unshift(logItem);
    // Keep max 100 historical logs
    if (this.store.activityLogs.length > 100) {
      this.store.activityLogs = this.store.activityLogs.slice(0, 100);
    }
    // Notice: Do NOT increment store.version - prevents LAN broadcast!
    this.persistStore();
    return logItem;
  }

  public verifyPin(pin: string): boolean {
    if (!pin) return false;
    return pin.trim() === this.store.adminPin.trim();
  }

  public getVendorContacts(): VendorContact[] {
    return this.store.vendorContacts || [];
  }

  public setVendorContacts(vendors: VendorContact[]): void {
    this.store.vendorContacts = [...vendors];
    this.store.version += 1;
    this.persistStore();
  }

  public addVendor(vendor: VendorContact): VendorContact {
    const existingIdx = this.store.vendorContacts.findIndex(v => v.id === vendor.id);
    if (existingIdx >= 0) {
      this.store.vendorContacts[existingIdx] = vendor;
    } else {
      this.store.vendorContacts.unshift(vendor);
    }
    this.store.version += 1;
    this.persistStore();
    return vendor;
  }

  public updateVendor(vendor: VendorContact): VendorContact | null {
    const idx = this.store.vendorContacts.findIndex(v => v.id === vendor.id);
    if (idx === -1) {
      return this.addVendor(vendor);
    }
    this.store.vendorContacts[idx] = { ...this.store.vendorContacts[idx], ...vendor };
    this.store.version += 1;
    this.persistStore();
    return this.store.vendorContacts[idx];
  }

  public deleteVendor(vendorId: string): boolean {
    const initialLen = this.store.vendorContacts.length;
    this.store.vendorContacts = this.store.vendorContacts.filter(v => v.id !== vendorId);
    if (this.store.vendorContacts.length !== initialLen) {
      this.store.version += 1;
      this.persistStore();
      return true;
    }
    return false;
  }

  public resetVendors(): VendorContact[] {
    this.store.vendorContacts = [...INITIAL_VENDOR_CONTACTS];
    this.store.version += 1;
    this.persistStore();
    return this.store.vendorContacts;
  }

  public changePin(currentPin: string, newPin: string): { success: boolean; error?: string } {
    if (!this.verifyPin(currentPin)) {
      return { success: false, error: 'Current PIN is invalid' };
    }
    if (!newPin || newPin.trim().length < 4) {
      return { success: false, error: 'New PIN must be at least 4 digits' };
    }
    this.store.adminPin = newPin.trim();
    this.store.version += 1;
    this.persistStore();
    return { success: true };
  }
}

export const centralStore = new CentralStoreManager();
