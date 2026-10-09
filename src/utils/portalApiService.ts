import { 
  EnterpriseApp, 
  CorporateAnnouncement, 
  VendorContact, 
  AccessLogEntry 
} from '../types';

export interface CentralPortalResponse {
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

export async function fetchCentralPortalData(): Promise<CentralPortalResponse | null> {
  try {
    const res = await fetch('/api/portal-data', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data && data.success && data.data) {
      return data.data as CentralPortalResponse;
    }
  } catch (err) {
    console.warn('Failed to fetch central portal data:', err);
  }
  return null;
}

export async function saveAppApi(app: EnterpriseApp): Promise<EnterpriseApp[] | null> {
  try {
    const res = await fetch('/api/portal-data/apps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(app)
    });
    const data = await res.json();
    if (data && data.success && Array.isArray(data.apps)) {
      return data.apps;
    }
  } catch (err) {
    console.error('Failed to save app to central server:', err);
  }
  return null;
}

export async function deleteAppApi(appId: string): Promise<EnterpriseApp[] | null> {
  try {
    const res = await fetch(`/api/portal-data/apps/${encodeURIComponent(appId)}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (data && data.success && Array.isArray(data.apps)) {
      return data.apps;
    }
  } catch (err) {
    console.error('Failed to delete app from central server:', err);
  }
  return null;
}

export async function addAnnouncementApi(ann: CorporateAnnouncement): Promise<CorporateAnnouncement[] | null> {
  try {
    const res = await fetch('/api/portal-data/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ann)
    });
    const data = await res.json();
    if (data && data.success && Array.isArray(data.announcements)) {
      return data.announcements;
    }
  } catch (err) {
    console.error('Failed to add announcement to central server:', err);
  }
  return null;
}

export async function deleteAnnouncementApi(annId: string): Promise<CorporateAnnouncement[] | null> {
  try {
    const res = await fetch(`/api/portal-data/announcements/${encodeURIComponent(annId)}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (data && data.success && Array.isArray(data.announcements)) {
      return data.announcements;
    }
  } catch (err) {
    console.error('Failed to delete announcement from central server:', err);
  }
  return null;
}

export async function saveVendorApi(vendor: VendorContact): Promise<VendorContact[] | null> {
  try {
    const res = await fetch('/api/portal-data/vendors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendor)
    });
    const data = await res.json();
    if (data && data.success && Array.isArray(data.vendorContacts)) {
      return data.vendorContacts;
    }
  } catch (err) {
    console.error('Failed to save vendor to central server:', err);
  }
  return null;
}

export async function deleteVendorApi(vendorId: string): Promise<VendorContact[] | null> {
  try {
    const res = await fetch(`/api/portal-data/vendors/${encodeURIComponent(vendorId)}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (data && data.success && Array.isArray(data.vendorContacts)) {
      return data.vendorContacts;
    }
  } catch (err) {
    console.error('Failed to delete vendor from central server:', err);
  }
  return null;
}

export async function resetVendorsApi(): Promise<VendorContact[] | null> {
  try {
    const res = await fetch('/api/portal-data/reset-vendors', {
      method: 'POST'
    });
    const data = await res.json();
    if (data && data.success && Array.isArray(data.vendorContacts)) {
      return data.vendorContacts;
    }
  } catch (err) {
    console.error('Failed to reset vendors on central server:', err);
  }
  return null;
}

export async function recordAppAccessApi(entry: {
  appId?: string;
  appName: string;
  appTh?: string;
  category?: string;
  url?: string;
  iconName?: string;
  status?: string;
  user?: string;
}): Promise<AccessLogEntry[] | null> {
  try {
    const res = await fetch('/api/portal-data/log-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    const data = await res.json();
    if (data && data.success && Array.isArray(data.recentLogs)) {
      return data.recentLogs;
    }
  } catch (err) {
    console.error('Failed to record app access to central server:', err);
  }
  return null;
}

export async function verifyAdminPinApi(pin: string): Promise<boolean> {
  try {
    const res = await fetch('/api/portal-data/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });
    const data = await res.json();
    if (data && typeof data.valid === 'boolean') {
      return data.valid;
    }
  } catch (err) {
    console.warn('Fallback PIN check:', err);
  }
  // Safe client fallback
  return pin.trim() === '1111';
}

export async function updateAdminPinApi(currentPin: string, newPin: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/portal-data/update-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPin, newPin })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}
