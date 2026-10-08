import { 
  EnterpriseApp, 
  CorporateAnnouncement, 
  ActivityLogItem, 
  PortalDataSyncResponse,
  UserProfile,
  VendorContact 
} from '../types';

type SyncListener = (data: PortalDataSyncResponse) => void;

class CentralSyncService {
  private listeners: Set<SyncListener> = new Set();
  private pollingIntervalId: any = null;
  private lastVersion: number = 0;
  private lastData: PortalDataSyncResponse | null = null;
  private isPolling: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', () => {
        this.syncNow();
      });
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.syncNow();
        }
      });
    }
  }

  // Subscribe to central data changes (cross-machine LAN dynamic sync)
  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    if (this.lastData) {
      listener(this.lastData);
    }
    this.startPolling();
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) {
        this.stopPolling();
      }
    };
  }

  private startPolling() {
    if (this.isPolling) return;
    this.isPolling = true;
    this.syncNow();
    this.pollingIntervalId = setInterval(() => {
      this.syncNow();
    }, 4000); // 4 seconds LAN sync interval
  }

  private stopPolling() {
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId);
      this.pollingIntervalId = null;
    }
    this.isPolling = false;
  }

  public async syncNow(): Promise<PortalDataSyncResponse | null> {
    try {
      const res = await fetch('/api/portal-data', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (!res.ok) return null;
      const data: PortalDataSyncResponse = await res.json();
      
      const hasChanged = !this.lastData || data.version !== this.lastVersion || 
        data.latestAnnouncementUpdatedAt !== this.lastData.latestAnnouncementUpdatedAt ||
        data.lastAnnouncementAction !== this.lastData.lastAnnouncementAction;

      this.lastData = data;
      this.lastVersion = data.version;

      if (hasChanged) {
        this.notifyListeners(data);
      }
      return data;
    } catch (err) {
      // In case of transient network error, keep existing data
      return this.lastData;
    }
  }

  private notifyListeners(data: PortalDataSyncResponse) {
    this.listeners.forEach((listener) => {
      try {
        listener(data);
      } catch (err) {
        console.error('[CentralSyncService] Error in listener callback:', err);
      }
    });
  }

  // 1. Fetch Central Portal Data
  public async fetchPortalData(): Promise<PortalDataSyncResponse | null> {
    return this.syncNow();
  }

  // 2. Record Activity Log on Central Server
  public async recordActivityLog(entry: {
    appId?: string;
    appName: string;
    appNameTh?: string;
    appUrl?: string;
    category?: string;
    currentUser?: UserProfile | null;
    status?: 'online' | 'success' | 'redirected' | 'launched';
    action?: string;
  }): Promise<ActivityLogItem | null> {
    try {
      const payload = {
        appId: entry.appId,
        appName: entry.appName,
        appNameTh: entry.appNameTh,
        appUrl: entry.appUrl,
        category: entry.category,
        clientIp: entry.currentUser?.localIp || '192.168.7.122',
        workstationHostname: entry.currentUser?.workstationHostname || 'QISHENG-122',
        userName: entry.currentUser?.name || 'General User',
        userRole: entry.currentUser?.role || 'user',
        status: entry.status || 'launched',
        action: entry.action || 'Direct App Access'
      };

      const res = await fetch('/api/activity-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      });

      if (!res.ok) return null;
      const result = await res.json();
      // Trigger instant sync to refresh live log UI
      setTimeout(() => this.syncNow(), 200);
      return result.log;
    } catch (err) {
      console.warn('[CentralSyncService] Failed to record activity log to central server:', err);
      return null;
    }
  }

  // 3. Central Apps Management
  public async saveApp(app: EnterpriseApp, isEdit: boolean = false): Promise<boolean> {
    try {
      console.log(`[CentralSyncService] ${isEdit ? 'Updating' : 'Creating'} app:`, app.name);
      const res = await fetch('/api/apps', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(app)
      });
      if (res.ok) {
        await this.syncNow();
        console.log(`[CentralSyncService] App ${isEdit ? 'updated' : 'created'} successfully:`, app.name);
        return true;
      }
      return false;
    } catch (err) {
      console.error('[CentralSyncService] Failed to save app:', err);
      return false;
    }
  }

  public async deleteApp(appId: string): Promise<boolean> {
    try {
      console.log('[CentralSyncService] Deleting app from backend:', appId);
      const res = await fetch('/api/apps/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId })
      });
      if (res.ok) {
        await this.syncNow();
        console.log('[CentralSyncService] App deleted successfully:', appId);
        return true;
      }
      return false;
    } catch (err) {
      console.error('[CentralSyncService] Failed to delete app:', err);
      return false;
    }
  }

  // 4. Central Announcements Management
  public async saveAnnouncement(ann: CorporateAnnouncement, isEdit: boolean = false): Promise<boolean> {
    try {
      console.log(`[CentralSyncService] ${isEdit ? 'Updating' : 'Creating'} announcement:`, ann.title);
      const res = await fetch('/api/announcements', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ann)
      });
      if (res.ok) {
        await this.syncNow();
        console.log(`[CentralSyncService] Announcement ${isEdit ? 'updated' : 'created'} successfully:`, ann.title);
        return true;
      }
      return false;
    } catch (err) {
      console.error('[CentralSyncService] Failed to save announcement:', err);
      return false;
    }
  }

  public async deleteAnnouncement(annId: string): Promise<boolean> {
    try {
      console.log('[CentralSyncService] Deleting announcement from backend:', annId);
      const res = await fetch('/api/announcements/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: annId })
      });
      if (res.ok) {
        await this.syncNow();
        console.log('[CentralSyncService] Announcement deleted successfully:', annId);
        return true;
      }
      return false;
    } catch (err) {
      console.error('[CentralSyncService] Failed to delete announcement:', err);
      return false;
    }
  }

  // 4.5 Vendor Contacts Central Persistence
  public async saveVendor(vendor: VendorContact): Promise<boolean> {
    try {
      console.log('[CentralSyncService] Saving vendor to backend:', vendor.name);
      const res = await fetch('/api/vendor-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendor)
      });
      if (res.ok) {
        await this.syncNow();
        console.log('[CentralSyncService] Vendor saved successfully:', vendor.name);
        return true;
      }
      return false;
    } catch (err) {
      console.error('[CentralSyncService] Failed to save vendor:', err);
      return false;
    }
  }

  public async saveAllVendors(vendors: VendorContact[]): Promise<boolean> {
    try {
      console.log('[CentralSyncService] Saving all vendors batch:', vendors.length);
      const res = await fetch('/api/vendor-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendors })
      });
      if (res.ok) {
        await this.syncNow();
        console.log('[CentralSyncService] Batch vendors saved successfully');
        return true;
      }
      return false;
    } catch (err) {
      console.error('[CentralSyncService] Failed to save all vendors:', err);
      return false;
    }
  }

  public async deleteVendor(vendorId: string): Promise<boolean> {
    try {
      console.log('[CentralSyncService] Deleting vendor from backend:', vendorId);
      const res = await fetch('/api/vendor-contacts/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: vendorId })
      });
      if (res.ok) {
        await this.syncNow();
        console.log('[CentralSyncService] Vendor deleted successfully:', vendorId);
        return true;
      }
      return false;
    } catch (err) {
      console.error('[CentralSyncService] Failed to delete vendor:', err);
      return false;
    }
  }

  public async resetVendors(): Promise<boolean> {
    try {
      console.log('[CentralSyncService] Resetting vendors to default on backend');
      const res = await fetch('/api/vendor-contacts/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        await this.syncNow();
        console.log('[CentralSyncService] Vendors reset successfully');
        return true;
      }
      return false;
    } catch (err) {
      console.error('[CentralSyncService] Failed to reset vendors:', err);
      return false;
    }
  }

  // 5. Admin PIN Verification on Server
  public async verifyAdminPin(pin: string): Promise<boolean> {
    try {
      const res = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      if (res.ok) {
        const data = await res.json();
        return Boolean(data.valid);
      }
      // Offline fallback
      return pin.trim() === '1111';
    } catch {
      return pin.trim() === '1111';
    }
  }

  public async changeAdminPin(currentPin: string, newPin: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/auth/change-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPin, newPin })
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  }

  // Relative time helper
  public formatRelativeTime(timestamp: number, language: 'TH' | 'EN'): string {
    if (!timestamp) return language === 'TH' ? 'เมื่อสักครู่' : 'Just now';
    const diffMs = Date.now() - timestamp;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (language === 'TH') {
      if (diffSec < 45) return 'เมื่อสักครู่';
      if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
      if (diffHour < 24) return `${diffHour} ชม. ที่แล้ว`;
      return `${diffDay} วันที่แล้ว`;
    } else {
      if (diffSec < 45) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHour < 24) return `${diffHour}h ago`;
      return `${diffDay}d ago`;
    }
  }
}

export const centralSyncService = new CentralSyncService();
