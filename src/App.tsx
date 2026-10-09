import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  CORPORATE_USERS, 
  DEFAULT_ADMIN_ACCOUNT,
  DEFAULT_USER_ACCOUNT,
  SOMCHAI_AVATAR,
  INITIAL_ROOM_BOOKINGS,
  CORPORATE_ANNOUNCEMENTS,
  ENTERPRISE_APPS
} from './data/portalData';
import { 
  UserProfile, 
  EnterpriseApp, 
  AppCategory, 
  ClientMachineInfo, 
  RoomBooking,
  VendorContact,
  CorporateAnnouncement,
  NavTab,
  ActivityLogItem
} from './types';
import { centralSyncService } from './services/centralSyncService';
import { detectClientMachineInfo } from './utils/clientMachineDetector';
import { ADMIN_PIN } from './config/adminConfig';
import { INITIAL_VENDOR_CONTACTS } from './data/vendorData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HeroClientInfo } from './components/HeroClientInfo';
import { AppCard, ICON_MAP } from './components/AppCard';
import { AppLaunchModal } from './components/AppLaunchModal';
import { QuickActionsModal } from './components/QuickActionsModal';
import { SystemStatusDrawer } from './components/SystemStatusDrawer';
import { CalendarView } from './components/CalendarView';
import { ExternalPortalsView } from './components/ExternalPortalsView';
import { GoogleSearchModal } from './components/GoogleSearchModal';
import { GoogleTranslateModal } from './components/GoogleTranslateModal';
import { AnnouncementsView } from './components/AnnouncementsView';
import { AppManageModal } from './components/AppManageModal';
import { VendorContactView } from './components/VendorContactView';
import { AdminPinModal } from './components/AdminPinModal';
import { DailyAnnouncementModal } from './components/DailyAnnouncementModal';
import { ErrorBoundary } from './components/ErrorBoundary';

import { 
  Clock, 
  Grid, 
  Search, 
  Plus, 
  Trash2, 
  Calculator, 
  ReceiptText, 
  Network, 
  Landmark, 
  Activity, 
  HardDrive, 
  Layers,
  BookUser,
  Bell,
  Star
} from 'lucide-react';

export default function App() {
  // Requirement #1: Ensure default route is '/' and clear any leftover '/login'
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/' && window.location.pathname.includes('login')) {
      window.history.replaceState(null, '', '/');
    }
  }, []);

  // 1. Available User Accounts (Stored in localStorage for User Management)
  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem('qs_user_accounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return CORPORATE_USERS;
  });

  // Requirement #1: Admin PIN Mode (PIN 1111)
  // Replaced automatic IP/Hostname authentication with explicit Admin PIN Unlock
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('qs_admin_mode') === 'true';
    } catch {
      return false;
    }
  });

  const [adminPinModalOpen, setAdminPinModalOpen] = useState(false);

  // Client Machine Info (for badge display and telemetry only)
  const [machineInfo, setMachineInfo] = useState<ClientMachineInfo | null>(null);

  // Default initial user state is regular User role
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    return {
      ...DEFAULT_USER_ACCOUNT,
      workstationHostname: 'QISHENG-122',
      localIp: '192.168.7.122',
      role: 'user',
      roleLevel: 'user',
      name: 'General User',
      nameTh: 'ผู้ใช้งานทั่วไป (User)',
    };
  });

  // Effective Admin privilege is strictly driven by Admin Mode (PIN 1111)
  const isAdmin = isAdminMode;

  // Sync currentUser with Admin Mode toggle
  useEffect(() => {
    setCurrentUser((prev) => ({
      ...prev,
      role: isAdminMode ? 'admin' : 'user',
      roleLevel: isAdminMode ? 'admin' : 'user',
      nameTh: isAdminMode ? 'ผู้ดูแลระบบ (Admin)' : 'ผู้ใช้งานทั่วไป (User)',
      name: isAdminMode ? 'System Administrator' : 'General User',
    }));
  }, [isAdminMode]);

  // Handle Admin PIN Unlock / Exit
  const handleAdminPinSuccess = () => {
    setIsAdminMode(true);
    try {
      sessionStorage.setItem('qs_admin_mode', 'true');
    } catch {}
  };

  const handleExitAdminMode = () => {
    setIsAdminMode(false);
    try {
      sessionStorage.removeItem('qs_admin_mode');
    } catch {}
  };

  // Detect Client Machine on startup for badge display only
  useEffect(() => {
    let isMounted = true;
    detectClientMachineInfo(currentUser).then((info) => {
      if (!isMounted) return;
      setMachineInfo(info);
      const clientIp = info.localIp || '192.168.7.122';
      const clientHostname = info.deviceName || info.hostname || 'QISHENG-122';

      setCurrentUser((prev) => ({
        ...prev,
        workstationHostname: clientHostname,
        localIp: clientIp,
      }));
    });
    return () => { isMounted = false; };
  }, []);

  // 1. Centralized Announcements State (Prioritizes Storage over Default Mock Data)
  const [announcements, setAnnouncements] = useState<CorporateAnnouncement[]>(() => {
    try {
      const stored = localStorage.getItem('qs_announcements_v1');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed; // Persisted announcements (including deletions)
        }
      }
    } catch {}
    return CORPORATE_ANNOUNCEMENTS;
  });

// Helper to extract machine suffix/number from hostname or IP (e.g. '127' from 'QISHENG-127' or '192.168.7.127')
const extractMachineIdentifier = (val?: string): string => {
  if (!val) return '';
  const match = val.match(/(\d+)(?!.*\d)/);
  return match ? match[1] : '';
};

// Check if an activity log belongs to THIS specific workstation/machine
const isCurrentMachineLog = (
  log: ActivityLogItem,
  workstationHostname?: string,
  localIp?: string
): boolean => {
  if (!log) return false;
  const myHost = (workstationHostname || '').trim().toLowerCase();
  const myIp = (localIp || '').trim().toLowerCase();
  const logHost = (log.workstationHostname || '').trim().toLowerCase();
  const logIp = (log.clientIp || '').trim().toLowerCase();

  if (myHost && logHost && (myHost === logHost || myHost.includes(logHost) || logHost.includes(myHost))) return true;
  if (myIp && logIp && (myIp === logIp || myIp.includes(logIp) || logIp.includes(myIp))) return true;

  const myId = extractMachineIdentifier(myHost) || extractMachineIdentifier(myIp);
  const logId = extractMachineIdentifier(logHost) || extractMachineIdentifier(logIp);
  if (myId && logId && myId === logId) return true;

  return false;
};

  // Centralized Activity Logs State (from server)
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);

  // Requirement #1: Per-machine Recent Activity Logs (Isolated to this machine e.g. 127)
  const [machineActivityLogs, setMachineActivityLogs] = useState<ActivityLogItem[]>(() => {
    try {
      const stored = localStorage.getItem('qs_machine_activity_logs_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // 2. Enterprise Apps Collection (Prioritizes Storage over Default Mock Data, honoring deletions)
  const [enterpriseApps, setEnterpriseApps] = useState<EnterpriseApp[]>(() => {
    try {
      const storedDeleted = localStorage.getItem('qs_deleted_app_ids');
      const deletedSet = new Set<string>(storedDeleted ? JSON.parse(storedDeleted) : []);

      const stored = localStorage.getItem('qs_enterprise_apps_v2');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const defaultAppMap = new Map(ENTERPRISE_APPS.map(a => [a.id, a]));
          const updatedParsed = parsed
            .filter((a: any) => !deletedSet.has(a.id))
            .map((a: any) => {
              const def = defaultAppMap.get(a.id);
              if (def) {
                return {
                  ...a,
                  nameTh: def.nameTh || a.nameTh,
                  descriptionTh: def.descriptionTh || a.descriptionTh,
                  description: def.description || a.description
                };
              }
              return a;
            });
          return updatedParsed;
        }
      }
      return ENTERPRISE_APPS.filter(a => !deletedSet.has(a.id));
    } catch {}
    return ENTERPRISE_APPS;
  });

  // App CRUD Modal States
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<EnterpriseApp | null>(null);
  const [appToDeleteId, setAppToDeleteId] = useState<string | null>(null);

  // Daily Announcement Modal State & Smart Detection
  const [dailyAnnouncementModalOpen, setDailyAnnouncementModalOpen] = useState<boolean>(() => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const lastClosedDate = localStorage.getItem('qs_announcement_last_closed_date');

      // Rule 1: If user closed announcements today, NEVER show on refresh
      if (lastClosedDate === todayStr) {
        return false;
      }

      const rawClosedIds = localStorage.getItem('qs_announcement_closed_ids');
      const closedIds: string[] = rawClosedIds ? JSON.parse(rawClosedIds) : [];

      const rawStored = localStorage.getItem('qs_announcements_v1');
      const anns = rawStored ? JSON.parse(rawStored) : CORPORATE_ANNOUNCEMENTS;
      const latest = anns[0];
      if (!latest || !latest.id) return false;

      // Rule 2: If from a previous day and this announcement ID was already closed, do not show
      if (closedIds.includes(latest.id)) {
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[Qisheng Portal] Announcement init error:', err);
      return false;
    }
  });

  const [isDismissedToday, setIsDismissedToday] = useState<boolean>(() => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const lastClosedDate = localStorage.getItem('qs_announcement_last_closed_date');
      return lastClosedDate === todayStr;
    } catch {
      return false;
    }
  });

  // 5-second delayed notification timer for new announcements
  const newAnnouncementTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync tracking to prevent initial fetch or refresh from triggering new announcement alerts
  const isFirstSyncRef = useRef<boolean>(true);
  const knownAnnouncementIdsRef = useRef<Set<string>>(new Set());

  // Clean up any pending timer on component unmount
  useEffect(() => {
    return () => {
      if (newAnnouncementTimerRef.current) {
        clearTimeout(newAnnouncementTimerRef.current);
      }
    };
  }, []);

  // Trigger delayed notification for new announcements (Requirement: Delay 5 seconds, notify only once per day)
  const triggerNewAnnouncementNotificationWithDelay = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const alreadyNotifiedToday = localStorage.getItem('qs_new_announcement_notified_date') === todayStr;

    // Requirement: แจ้งเตือนแค่ครั้งเดียวของวัน ถึงแม้วันนั้นจะกดปิดไปแล้ว
    if (alreadyNotifiedToday) {
      console.log('[Qisheng Portal] New announcement notification has already fired today -> skip repeated notification');
      return;
    }

    if (newAnnouncementTimerRef.current) {
      clearTimeout(newAnnouncementTimerRef.current);
    }

    console.log('[Qisheng Portal] Scheduling new announcement notification in 5 seconds (only once per day)...');
    newAnnouncementTimerRef.current = setTimeout(() => {
      const currentToday = new Date().toISOString().split('T')[0];
      const checkAgain = localStorage.getItem('qs_new_announcement_notified_date') === currentToday;
      if (!checkAgain) {
        localStorage.setItem('qs_new_announcement_notified_date', currentToday);
        setDailyAnnouncementModalOpen(true);
        setIsDismissedToday(false);
        console.log('[Qisheng Portal] 5s delay elapsed -> Triggered new announcement notification (once per day)');
      }
    }, 5000);
  };

  // Central Dynamic Sync Subscription (Listens for updates across all LAN machines)
  useEffect(() => {
    const unsubscribe = centralSyncService.subscribe((data) => {
      if (data.apps && Array.isArray(data.apps)) {
        const storedDeleted = localStorage.getItem('qs_deleted_app_ids');
        const deletedSet = new Set<string>(storedDeleted ? JSON.parse(storedDeleted) : []);
        if (Array.isArray(data.deletedAppIds)) {
          data.deletedAppIds.forEach((id: string) => deletedSet.add(id));
          try {
            localStorage.setItem('qs_deleted_app_ids', JSON.stringify(Array.from(deletedSet)));
          } catch {}
        }

        const validApps = data.apps.filter((a: any) => !deletedSet.has(a.id));
        setEnterpriseApps(validApps);
        try {
          localStorage.setItem('qs_enterprise_apps_v2', JSON.stringify(validApps));
        } catch {}
      }
      if (data.vendorContacts && Array.isArray(data.vendorContacts)) {
        setVendorContacts(data.vendorContacts);
        try {
          localStorage.setItem('qs_vendor_contacts_v1', JSON.stringify(data.vendorContacts));
          localStorage.setItem('qs_vendor_contacts_persisted', 'true');
        } catch {}
      }
      if (data.activityLogs && Array.isArray(data.activityLogs)) {
        setActivityLogs(data.activityLogs);
        // Requirement #1: Filter central logs to ONLY those belonging to this workstation/machine
        const myLogs = data.activityLogs.filter(log => 
          isCurrentMachineLog(log, currentUser.workstationHostname, currentUser.localIp)
        );

        setMachineActivityLogs(prev => {
          const map = new Map<string, ActivityLogItem>();
          prev.forEach(item => {
            const key = item.appId || item.appUrl || item.appName;
            if (key) map.set(key, item);
          });
          myLogs.forEach(item => {
            const key = item.appId || item.appUrl || item.appName;
            if (!key) return;
            const existing = map.get(key);
            if (!existing || item.timestamp >= existing.timestamp) {
              map.set(key, item);
            }
          });
          const merged = Array.from(map.values())
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 20);
          try {
            localStorage.setItem('qs_machine_activity_logs_v2', JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
      if (data.announcements && Array.isArray(data.announcements)) {
        console.log('[Qisheng Portal] Synced announcements received:', data.announcements.length, 'action:', data.lastAnnouncementAction);
        setAnnouncements(data.announcements);
        try {
          localStorage.setItem('qs_announcements_v1', JSON.stringify(data.announcements));
        } catch {}

        // When an announcement is DELETED, NEVER trigger popup notification
        if (data.lastAnnouncementAction === 'delete') {
          console.log('[Qisheng Portal] Announcement deleted, keeping modal closed');
          if (newAnnouncementTimerRef.current) {
            clearTimeout(newAnnouncementTimerRef.current);
          }
          setDailyAnnouncementModalOpen(false);
          try {
            const rawClosedIds = localStorage.getItem('qs_announcement_closed_ids');
            const closedIds: string[] = rawClosedIds ? JSON.parse(rawClosedIds) : [];
            const allIds = data.announcements.map(a => a.id).filter(Boolean);
            const combined = Array.from(new Set([...closedIds, ...allIds]));
            localStorage.setItem('qs_announcement_closed_ids', JSON.stringify(combined));
          } catch {}
          return;
        }

        // On first sync after mount/refresh: DO NOT trigger any popup notification
        if (isFirstSyncRef.current) {
          isFirstSyncRef.current = false;
          knownAnnouncementIdsRef.current = new Set(data.announcements.map(a => a.id));
          return;
        }

        // On subsequent syncs: detect if an announcement was newly added remotely
        const hasBrandNewAnnouncement = data.announcements.some(a => a.id && !knownAnnouncementIdsRef.current.has(a.id));
        data.announcements.forEach(a => {
          if (a.id) knownAnnouncementIdsRef.current.add(a.id);
        });

        if (hasBrandNewAnnouncement && data.lastAnnouncementAction === 'create') {
          console.log('[Qisheng Portal] Remote new announcement detected -> triggering 5s delayed notification if not notified today');
          triggerNewAnnouncementNotificationWithDelay();
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleDismissAnnouncementToday = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const nowTs = Date.now();
    console.log('[Qisheng Portal] handleDismissAnnouncementToday executed at:', todayStr, nowTs);
    if (newAnnouncementTimerRef.current) {
      clearTimeout(newAnnouncementTimerRef.current);
    }
    try {
      localStorage.setItem('qs_announcement_last_closed_date', todayStr);
      localStorage.setItem('qs_announcement_last_closed_timestamp', String(nowTs));

      // Append all current announcement IDs to closed IDs
      const rawClosedIds = localStorage.getItem('qs_announcement_closed_ids');
      let closedIds: string[] = [];
      try {
        closedIds = rawClosedIds ? JSON.parse(rawClosedIds) : [];
      } catch {
        closedIds = [];
      }
      const currentIds = announcements.map(a => a.id).filter(Boolean);
      const combined = Array.from(new Set([...closedIds, ...currentIds]));
      localStorage.setItem('qs_announcement_closed_ids', JSON.stringify(combined));
      console.log('[Qisheng Portal] Updated closed announcement IDs in localStorage:', combined);
    } catch (err) {
      console.warn('[Qisheng Portal] Failed to save dismiss info:', err);
    }

    setIsDismissedToday(true);
    setDailyAnnouncementModalOpen(false);
  };

  const handleAddAnnouncement = async (newAnn: CorporateAnnouncement) => {
    console.log('[Qisheng Portal] Adding new announcement:', newAnn.title);
    if (newAnn.id) {
      knownAnnouncementIdsRef.current.add(newAnn.id);
    }

    // 1. Save to LocalStorage immediately
    setAnnouncements((prev) => {
      const updated = [newAnn, ...prev];
      try {
        localStorage.setItem('qs_announcements_v1', JSON.stringify(updated));
        localStorage.setItem('qs_announcements_persisted', 'true');
      } catch {}
      return updated;
    });

    // Requirement: เวลาเพิ่มข่าวใหม่เข้าไปให้ดีเลย์5วิแล้วแจ้งเตือนแค่ครั้งเดียวของวัน ถึงแม้วันนั้นจะกดปิดไปแล้ว
    triggerNewAnnouncementNotificationWithDelay();

    // 2. Save to Central Server/Backend Database immediately
    await centralSyncService.saveAnnouncement(newAnn);
  };

  const handleDeleteAnnouncement = async (annId: string) => {
    console.log('[Qisheng Portal] handleDeleteAnnouncement for:', annId, 'Staying on tab:', currentTab);
    // Requirement: In case of deletion, DO NOT show notification popup
    if (newAnnouncementTimerRef.current) {
      clearTimeout(newAnnouncementTimerRef.current);
    }
    setDailyAnnouncementModalOpen(false);

    // 1. Update State and LocalStorage immediately (prevents mock data overwrite on refresh)
    setAnnouncements((prev) => {
      const updated = prev.filter(a => a.id !== annId);
      try {
        localStorage.setItem('qs_announcements_v1', JSON.stringify(updated));
        localStorage.setItem('qs_announcements_persisted', 'true');
        const rawClosedIds = localStorage.getItem('qs_announcement_closed_ids');
        const closedIds: string[] = rawClosedIds ? JSON.parse(rawClosedIds) : [];
        const remainingIds = updated.map(a => a.id).filter(Boolean);
        const combined = Array.from(new Set([...closedIds, ...remainingIds, annId]));
        localStorage.setItem('qs_announcement_closed_ids', JSON.stringify(combined));
        if (updated[0]) {
          localStorage.setItem('qs_announcement_dismissed_id', updated[0].id);
          localStorage.setItem('qs_announcement_dismissed_updated_at', String(updated[0].updatedAt || Date.now()));
        } else {
          localStorage.removeItem('qs_announcement_dismissed_id');
        }
      } catch {}
      return updated;
    });
    // 2. Delete from Central Server/Backend Database immediately without page redirect
    await centralSyncService.deleteAnnouncement(annId);
  };

  const handleSaveApp = async (app: EnterpriseApp) => {
    const isEdit = enterpriseApps.some(a => a.id === app.id);
    // If restoring or creating an app with this id, remove from deleted list
    try {
      const storedDeleted = localStorage.getItem('qs_deleted_app_ids');
      if (storedDeleted) {
        const deletedList: string[] = JSON.parse(storedDeleted);
        const filtered = deletedList.filter(id => id !== app.id);
        localStorage.setItem('qs_deleted_app_ids', JSON.stringify(filtered));
      }
    } catch {}

    setEnterpriseApps((prev) => {
      const exists = prev.some(a => a.id === app.id);
      const updated = exists ? prev.map(a => a.id === app.id ? app : a) : [app, ...prev];
      try {
        localStorage.setItem('qs_enterprise_apps_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    await centralSyncService.saveApp(app, isEdit);
    setAppModalOpen(false);
    setEditingApp(null);
  };

  const handleDeleteApp = async (appId: string) => {
    console.log('[Qisheng Portal] handleDeleteApp for:', appId, 'Keeping current tab:', currentTab);
    // 1. Mark as permanently deleted so it NEVER comes back on sync or refresh
    try {
      const storedDeleted = localStorage.getItem('qs_deleted_app_ids');
      const deletedList: string[] = storedDeleted ? JSON.parse(storedDeleted) : [];
      if (!deletedList.includes(appId)) {
        deletedList.push(appId);
        localStorage.setItem('qs_deleted_app_ids', JSON.stringify(deletedList));
      }
    } catch {}

    // 2. Remove from favorites
    setFavorites((prev) => {
      const updated = prev.filter(id => id !== appId);
      try {
        localStorage.setItem('qs_favorites', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 3. Remove from enterpriseApps
    setEnterpriseApps((prev) => {
      const updated = prev.filter(a => a.id !== appId);
      try {
        localStorage.setItem('qs_enterprise_apps_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setAppToDeleteId(null);
    await centralSyncService.deleteApp(appId);
  };

  // User CRUD Handlers
  const handleAddUser = (newUser: UserProfile) => {
    console.log('[Qisheng Portal] Adding user:', newUser.name);
    setAvailableUsers((prev) => {
      const updated = [newUser, ...prev];
      try {
        localStorage.setItem('qs_user_accounts', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    console.log('[Qisheng Portal] Updating user:', updatedUser.name);
    setAvailableUsers((prev) => {
      const updated = prev.map(u => u.id === updatedUser.id ? updatedUser : u);
      try {
        localStorage.setItem('qs_user_accounts', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (userId: string) => {
    console.log('[Qisheng Portal] handleDeleteUser for:', userId, 'Keeping current tab:', currentTab);
    if (userId === currentUser.id) return;
    setAvailableUsers((prev) => {
      const updated = prev.filter(u => u.id !== userId);
      try {
        localStorage.setItem('qs_user_accounts', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Vendor Contacts Collection with state persistence and central server sync
  const [vendorContacts, setVendorContacts] = useState<VendorContact[]>(() => {
    try {
      const persisted = localStorage.getItem('qs_vendor_contacts_persisted');
      const stored = localStorage.getItem('qs_vendor_contacts_v1');
      if (stored !== null && (persisted === 'true' || stored !== '')) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return INITIAL_VENDOR_CONTACTS;
  });

  const handleAddVendor = async (newVendor: VendorContact) => {
    console.log('[Qisheng Portal] Adding vendor:', newVendor.name);
    setVendorContacts((prev) => {
      const updated = [newVendor, ...prev];
      try {
        localStorage.setItem('qs_vendor_contacts_v1', JSON.stringify(updated));
        localStorage.setItem('qs_vendor_contacts_persisted', 'true');
      } catch {}
      return updated;
    });
    await centralSyncService.saveVendor(newVendor);
  };

  const handleUpdateVendor = async (updatedVendor: VendorContact) => {
    console.log('[Qisheng Portal] Updating vendor:', updatedVendor.name);
    setVendorContacts((prev) => {
      const updated = prev.map(v => v.id === updatedVendor.id ? updatedVendor : v);
      try {
        localStorage.setItem('qs_vendor_contacts_v1', JSON.stringify(updated));
        localStorage.setItem('qs_vendor_contacts_persisted', 'true');
      } catch {}
      return updated;
    });
    await centralSyncService.saveVendor(updatedVendor);
  };

  const handleDeleteVendor = async (vendorId: string) => {
    console.log('[Qisheng Portal] handleDeleteVendor for:', vendorId, 'Keeping current tab:', currentTab);
    // Keep current tab active - never redirect to home or reload
    let remainingLength = 0;
    setVendorContacts((prev) => {
      const updated = prev.filter(v => v.id !== vendorId);
      remainingLength = updated.length;
      try {
        localStorage.setItem('qs_vendor_contacts_v1', JSON.stringify(updated));
        localStorage.setItem('qs_vendor_contacts_persisted', 'true');
      } catch {}
      return updated;
    });

    if (remainingLength === 0) {
      // When 0 items remain, explicitly persist empty array [] to central server so refresh never restores old data
      await centralSyncService.saveAllVendors([]);
    } else {
      await centralSyncService.deleteVendor(vendorId);
    }
  };

  const handleResetVendors = async () => {
    console.log('[Qisheng Portal] Resetting vendors to default');
    setVendorContacts(INITIAL_VENDOR_CONTACTS);
    try {
      localStorage.setItem('qs_vendor_contacts_v1', JSON.stringify(INITIAL_VENDOR_CONTACTS));
      localStorage.setItem('qs_vendor_contacts_persisted', 'true');
    } catch {}
    await centralSyncService.resetVendors();
  };

  // Launch History tracking
  const [launchHistory, setLaunchHistory] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('qs_launch_history');
      if (stored) return JSON.parse(stored);
    } catch {}
    return {};
  });

  // Layout & Navigation state:
  // Requirement: First time entering web AND closing & reopening web must ALWAYS show 'dashboard' (หน้าหลัก)
  const [currentTab, setCurrentTab] = useState<NavTab>(() => {
    try {
      // Clear legacy localStorage key so old persistent tab never overrides initial load
      localStorage.removeItem('qs_active_tab');
      const saved = sessionStorage.getItem('qs_active_tab');
      if (saved && typeof saved === 'string') {
        return saved as NavTab;
      }
    } catch {}
    return 'dashboard';
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<'TH' | 'EN'>('TH');

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  // Requirement #3: Default category is 'all' (All Apps)
  const [selectedCategory, setSelectedCategory] = useState<AppCategory>('all');

  // Favorites (Stored in localStorage with sensible defaults, excluding deleted apps)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const storedDeleted = localStorage.getItem('qs_deleted_app_ids');
      const deletedSet = new Set<string>(storedDeleted ? JSON.parse(storedDeleted) : []);
      const stored = localStorage.getItem('qs_favorites');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed.filter((id: string) => !deletedSet.has(id));
      }
      return ['app-express', 'app-boi-sw'].filter(id => !deletedSet.has(id));
    } catch {}
    return ['app-express', 'app-boi-sw'];
  });

  // Modals & Drawers
  const [selectedAppForLaunch, setSelectedAppForLaunch] = useState<EnterpriseApp | null>(null);
  const [quickActionModal, setQuickActionModal] = useState<{
    isOpen: boolean;
    type: 'helpdesk' | 'sspr' | 'access';
  }>({ isOpen: false, type: 'helpdesk' });
  const [systemStatusOpen, setSystemStatusOpen] = useState(false);
  const [googleSearchModalOpen, setGoogleSearchModalOpen] = useState(false);
  const [googleSearchInitialQuery, setGoogleSearchInitialQuery] = useState('');
  const [googleTranslateModalOpen, setGoogleTranslateModalOpen] = useState(false);

  // Centralized Navigation with State Reset & SessionStorage Synchronization
  const handleTabChange = (newTab: NavTab) => {
    console.log('[Qisheng Portal] Navigating to tab:', newTab);
    try {
      sessionStorage.setItem('qs_active_tab', newTab);
    } catch {}
    setSelectedAppForLaunch(null);
    setQuickActionModal({ isOpen: false, type: 'helpdesk' });
    setSystemStatusOpen(false);
    setGoogleSearchModalOpen(false);
    setGoogleTranslateModalOpen(false);
    setAppModalOpen(false);
    setEditingApp(null);
    setAppToDeleteId(null);
    setMobileSidebarOpen(false);
    setSearchQuery('');
    setCurrentTab(newTab);
  };

  // App Log Icon Helper
  const getAppLogIcon = (category?: string, name?: string) => {
    const n = (name || '').toLowerCase();
    if (n.includes('express') || n.includes('บัญชี')) return Calculator;
    if (n.includes('tax') || n.includes('สรรพากร') || n.includes('ภาษี') || n.includes('etax')) return Landmark;
    if (n.includes('router') || n.includes('mikrotik') || n.includes('vpn') || n.includes('network')) return Network;
    if (n.includes('boi') || n.includes('visa')) return ReceiptText;
    if (n.includes('protrack') || n.includes('track') || n.includes('task')) return Layers;
    if (n.includes('drive') || n.includes('storage') || n.includes('cloud')) return HardDrive;
    return Activity;
  };

  // Launch App Handler: Records Central Activity Log immediately upon click
  const handleLaunchApp = (app: EnterpriseApp) => {
    if (!app || !app.id) return;
    const now = Date.now();
    const currentHost = currentUser.workstationHostname || 'QISHENG-122';
    const currentIp = currentUser.localIp || '192.168.7.122';

    // 1. Send event to Central Server Database immediately
    centralSyncService.recordActivityLog({
      appId: app.id,
      appName: app.name,
      appNameTh: app.nameTh,
      appUrl: app.url,
      category: app.category,
      currentUser,
      status: 'launched',
      action: app.launchType === 'remote_rdp' ? 'Launched RDP Session' : 'Launched Web Application'
    });

    // 2. Requirement #1: Update per-machine recent activity logs
    // "ถ้าเข้าลิงเดิมให้อัพเดทเวลาแทนเพิ่มเข้าไป" -> update timestamp instead of adding duplicate entry!
    setMachineActivityLogs((prev) => {
      const matchIdx = prev.findIndex(item => 
        (app.id && item.appId === app.id) ||
        (app.url && item.appUrl && item.appUrl.trim().toLowerCase() === app.url.trim().toLowerCase()) ||
        (item.appName && item.appName.trim().toLowerCase() === app.name.trim().toLowerCase())
      );

      let updatedList: ActivityLogItem[];
      if (matchIdx >= 0) {
        // App exists in history -> update timestamp and move to front
        const existing = prev[matchIdx];
        const updatedEntry: ActivityLogItem = {
          ...existing,
          appId: app.id,
          appName: app.name,
          appNameTh: app.nameTh || existing.appNameTh,
          appUrl: app.url || existing.appUrl,
          category: app.category || existing.category,
          timestamp: now,
          workstationHostname: currentHost,
          clientIp: currentIp,
          userName: currentUser.name || 'General User',
          userRole: currentUser.role || 'user',
          status: 'launched',
          action: app.launchType === 'remote_rdp' ? 'Launched RDP Session' : 'Launched Web Application'
        };
        const remaining = prev.filter((_, idx) => idx !== matchIdx);
        updatedList = [updatedEntry, ...remaining].slice(0, 20);
      } else {
        // New app -> insert at front
        const newEntry: ActivityLogItem = {
          id: `log-${now}-${Math.random().toString(36).substring(2, 6)}`,
          appId: app.id,
          appName: app.name,
          appNameTh: app.nameTh,
          appUrl: app.url,
          category: app.category,
          workstationHostname: currentHost,
          clientIp: currentIp,
          userName: currentUser.name || 'General User',
          userRole: currentUser.role || 'user',
          timestamp: now,
          status: 'launched',
          action: app.launchType === 'remote_rdp' ? 'Launched RDP Session' : 'Launched Web Application'
        };
        updatedList = [newEntry, ...prev].slice(0, 20);
      }

      try {
        localStorage.setItem('qs_machine_activity_logs_v2', JSON.stringify(updatedList));
      } catch {}
      return updatedList;
    });

    // For Remote RDP sessions or apps without a web URL, show launch modal (credentials/mstsc instructions)
    if (app.launchType === 'remote_rdp' || !app.url) {
      setSelectedAppForLaunch(app);
    }
    setLaunchHistory((prev) => {
      const updated = { ...prev, [app.id]: (prev[app.id] || 0) + 1 };
      try {
        localStorage.setItem('qs_launch_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Theme Mode (Light / Dark) with persistence & <html> class synchronization
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('qs_theme_mode');
      if (saved !== null) {
        return saved === 'dark';
      }
    } catch {}
    return false;
  });

  useEffect(() => {
    try {
      localStorage.setItem('qs_theme_mode', darkMode ? 'dark' : 'light');
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {}
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Corporate Calendar Data
  const [roomBookings] = useState<RoomBooking[]>(INITIAL_ROOM_BOOKINGS);

  // Persist favorites
  const toggleFavorite = (appId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId];
      try {
        localStorage.setItem('qs_favorites', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Filter apps based on category and search query
  const filteredApps = useMemo(() => {
    return enterpriseApps.filter((app) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q || 
        app.name.toLowerCase().includes(q) ||
        app.nameTh.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.descriptionTh.toLowerCase().includes(q) ||
        Boolean(app.badge && app.badge.toLowerCase().includes(q));

      const matchesCategory = selectedCategory === 'all' || selectedCategory === app.category;

      return matchesSearch && matchesCategory;
    });
  }, [enterpriseApps, searchQuery, selectedCategory]);

  // Requirement #2.1: Frequently Used & Favorites Apps Collection
  const frequentAndFavoriteApps = useMemo(() => {
    const favSet = new Set(favorites);
    const favs = enterpriseApps.filter((app) => favSet.has(app.id));

    // Also include frequent apps based on launch history that are not already in favs
    const frequent = enterpriseApps
      .filter((app) => !favSet.has(app.id) && (launchHistory[app.id] || 0) > 0)
      .sort((a, b) => (launchHistory[b.id] || 0) - (launchHistory[a.id] || 0));

    return [...favs, ...frequent];
  }, [enterpriseApps, favorites, launchHistory]);

  const favoriteApps = useMemo(() => {
    return enterpriseApps.filter((app) => favorites.includes(app.id));
  }, [enterpriseApps, favorites]);

  // Dashboard Category Matrix
  const categoryGridItems = [
    {
      id: 'accounting' as const,
      nameTh: 'บัญชี (Accounting)',
      nameEn: 'Accounting',
      descTh: 'ระบบบัญชี การเงิน งบทดลอง ผังบัญชี',
      icon: Calculator,
      badgeStyle: 'bg-blue-50 text-[#1E60D5] border-blue-200 group-hover:bg-[#1E60D5] group-hover:text-white',
      onClick: () => { 
        setSelectedCategory('accounting'); 
        setSearchQuery(''); 
        handleTabChange('all-apps'); 
      }
    },
    {
      id: 'boi' as const,
      nameTh: 'BOI',
      nameEn: 'BOI',
      descTh: 'ระบบสิทธิประโยชน์ BOI งานนำเข้าส่งออก',
      icon: ReceiptText,
      badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white',
      onClick: () => { 
        setSelectedCategory('boi'); 
        setSearchQuery(''); 
        handleTabChange('all-apps'); 
      }
    },
    {
      id: 'it' as const,
      nameTh: 'IT',
      nameEn: 'IT Infrastructure',
      descTh: 'ระบบเครือข่าย เราเตอร์ และไอทีองค์กร',
      icon: Network,
      badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200 group-hover:bg-purple-600 group-hover:text-white',
      onClick: () => { 
        setSelectedCategory('it'); 
        setSearchQuery(''); 
        handleTabChange('all-apps'); 
      }
    },
    {
      id: 'external' as const,
      nameTh: 'ระบบราชการ & ธนาคาร',
      nameEn: 'Government & Banking',
      descTh: 'สรรพากร ประกันสังคม DBD ธนาคารพาณิชย์',
      icon: Landmark,
      badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200 group-hover:bg-amber-600 group-hover:text-white',
      onClick: () => { 
        setSelectedCategory('external'); 
        setSearchQuery(''); 
        handleTabChange('all-apps'); 
      }
    },
    {
      id: 'vendor' as const,
      nameTh: 'จัดการผู้ให้บริการ (Vendor)',
      nameEn: 'Vendor Contacts',
      descTh: 'รายชื่อคู่ค้า ซัพพอร์ตโปรแกรม บัญชี และไอที',
      icon: BookUser,
      badgeStyle: 'bg-teal-50 text-teal-700 border-teal-200 group-hover:bg-teal-600 group-hover:text-white',
      onClick: () => { 
        handleTabChange('vendor-contact'); 
      }
    }
  ];

  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard': return language === 'TH' ? 'หน้าหลัก' : 'Home';
      case 'all-apps': return language === 'TH' ? 'แอปพลิเคชันทั้งหมด' : 'All Applications';
      case 'vendor-contact': return language === 'TH' ? 'จัดการผู้ให้บริการ (Vendor Contact)' : 'Vendor Contacts';
      case 'calendar': return language === 'TH' ? 'ปฏิทินองค์กร' : 'Organization Calendar';
      case 'announcements': return language === 'TH' ? 'จัดการประกาศข่าวสาร (Announcements)' : 'Manage Announcements';
      default: return 'QISHENG';
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#0B0F19] text-slate-100' : 'bg-[#F4F6F9] text-slate-900'} flex font-sans antialiased transition-colors duration-200`}>
      {/* 1. Left Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleTabChange}
        onOpenGoogleSearch={() => {
          setGoogleSearchInitialQuery(searchQuery);
          setGoogleSearchModalOpen(true);
        }}
        onOpenGoogleTranslate={() => setGoogleTranslateModalOpen(true)}
        language={language}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        isAdmin={isAdmin}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* 2. Top App Bar (Only [ชื่อเครื่อง | IP] Badge + Copy + Language Toggle + Admin Mode button + Theme Toggle) */}
        <Header
          machineInfo={machineInfo}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          language={language}
          onToggleLanguage={() => setLanguage(l => l === 'TH' ? 'EN' : 'TH')}
          currentTabName={getTabTitle()}
          isAdmin={isAdmin}
          onOpenAdminPinModal={() => setAdminPinModalOpen(true)}
          onExitAdminMode={handleExitAdminMode}
          darkMode={darkMode}
          onToggleTheme={toggleDarkMode}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {/* 3. HOME VIEW: DASHBOARD */}
          {currentTab === 'dashboard' && (
            <div className="space-y-7 max-w-7xl mx-auto">
              {/* 1) Clean Welcome Banner (No 'สวัสดี, คุณ Corporate', Navigator Welcome description) */}
              <HeroClientInfo
                language={language}
                onOpenAnnouncements={() => setDailyAnnouncementModalOpen(true)}
                hasUnreadAnnouncements={!isDismissedToday}
              />


              {/* 2) Favorites Section (Requirement #2: Only favorites, no frequent apps, no count badge): HIDE completely when empty */}
              {favoriteApps.length > 0 && (
                <section className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400 flex items-center justify-center font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      </div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        {language === 'TH' ? 'รายการโปรด' : 'Favorites'}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTabChange('all-apps')}
                      className="text-xs text-[#1E60D5] dark:text-blue-400 font-bold hover:underline cursor-pointer"
                    >
                      {language === 'TH' ? 'ดูระบบทั้งหมด →' : 'View all apps →'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {favoriteApps.map((app) => (
                      <AppCard
                        key={app.id}
                        app={app}
                        currentUserRole={currentUser.role}
                        isFavorite={favorites.includes(app.id)}
                        onToggleFavorite={toggleFavorite}
                        onLaunchApp={handleLaunchApp}
                        language={language}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* 3) System Categories Matrix */}
              <section className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                      <Grid className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        {language === 'TH' ? 'หมวดหมู่ระบบงานองค์กร' : 'System Categories'}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* 5 Category Cards (Navigates directly to category) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {categoryGridItems.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <div
                        key={cat.id}
                        onClick={cat.onClick}
                        className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-center mb-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${cat.badgeStyle}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#1E60D5] dark:group-hover:text-blue-400 transition-colors truncate">
                            {language === 'TH' ? cat.nameTh : cat.nameEn}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                            {cat.descTh}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 4) Recent Activity (Requirement #1: Isolated per machine, dedup with updated time, icons linked from all apps) */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#1E60D5] dark:text-blue-400" />
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {language === 'TH' ? 'ประวัติการเข้าใช้งานล่าสุด' : 'Recent App Activity'}
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                      {currentUser.workstationHostname || currentUser.localIp || 'This Workstation'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {machineActivityLogs && machineActivityLogs.length > 0 ? (
                      machineActivityLogs.slice(0, 5).map((log) => {
                        // Requirement #1: Link icon & details from All Apps (enterpriseApps)
                        const matchedApp = enterpriseApps.find(a => 
                          (log.appId && a.id === log.appId) ||
                          (log.appUrl && a.url && a.url.toLowerCase() === log.appUrl.toLowerCase()) ||
                          (log.appName && a.name.toLowerCase() === log.appName.toLowerCase()) ||
                          (log.appNameTh && a.nameTh && a.nameTh.toLowerCase() === log.appNameTh.toLowerCase())
                        );

                        const imgUrl = matchedApp?.customIconUrl || 
                          (matchedApp?.iconName?.startsWith('http') || matchedApp?.iconName?.startsWith('data:') ? matchedApp.iconName : null);
                        const AppIcon = (matchedApp && matchedApp.iconName && ICON_MAP[matchedApp.iconName]) || getAppLogIcon(log.category || matchedApp?.category, log.appName);

                        const displayName = language === 'TH' 
                          ? (matchedApp?.nameTh || log.appNameTh || log.appName) 
                          : (matchedApp?.name || log.appName);

                        return (
                          <div 
                            key={log.id} 
                            onClick={() => {
                              if (matchedApp) {
                                handleLaunchApp(matchedApp);
                              } else if (log.appUrl) {
                                window.open(log.appUrl, '_blank', 'noopener,noreferrer');
                              }
                            }}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                            title={log.appUrl ? `เปิด ${displayName}` : displayName}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 group-hover:bg-[#1E60D5] group-hover:text-white transition-all shadow-2xs overflow-hidden">
                                {imgUrl ? (
                                  <img 
                                    src={imgUrl} 
                                    alt={displayName} 
                                    className="w-5 h-5 object-contain rounded bg-white/90 p-0.5" 
                                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                  />
                                ) : (
                                  <AppIcon className="w-4 h-4" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#1E60D5] dark:group-hover:text-blue-400 transition-colors truncate">
                                  {displayName}
                                </div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5 truncate">
                                  <span>{log.userName || 'User'}</span>
                                  <span>•</span>
                                  <span className="font-mono text-slate-500 dark:text-slate-400">{log.workstationHostname || log.clientIp}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right shrink-0 ml-2">
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">
                                {centralSyncService.formatRelativeTime(log.timestamp, language)}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                                {log.status || 'Active'}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-5 text-xs text-slate-400 dark:text-slate-500 space-y-1">
                        <Activity className="w-6 h-6 mx-auto text-slate-300 dark:text-slate-600" />
                        <p>{language === 'TH' ? 'ยังไม่มีประวัติการเข้าใช้งานล่าสุด' : 'No recent activity recorded yet'}</p>
                        <p className="text-[11px] text-slate-400">{language === 'TH' ? 'คลิกเปิดแอปพลิเคชันเพื่อบันทึกประวัติเข้าสู่ระบบกลาง' : 'Click any app to log your session to central server'}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Machine Network & Workstation Status */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {language === 'TH' ? 'สถานะเครื่องลูกข่าย (Client Machine)' : 'Workstation Status'}
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Online
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-slate-500 dark:text-slate-400">{language === 'TH' ? 'ชื่อเครื่อง Workstation' : 'Hostname'}:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{currentUser.workstationHostname || 'QISHENG-122'}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-slate-500 dark:text-slate-400">{language === 'TH' ? 'ที่อยู่ IP เครือข่าย' : 'Client IP Address'}:</span>
                      <span className="font-mono font-bold text-[#1E60D5] dark:text-blue-400">{currentUser.localIp || '192.168.7.122'}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-slate-500 dark:text-slate-400">{language === 'TH' ? 'สิทธิ์การใช้งานระบบ' : 'Access Role'}:</span>
                      <span className={`font-bold px-2 py-0.5 rounded-lg text-[11px] ${isAdmin ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-blue-100 text-[#1E60D5]'}`}>
                        {isAdmin ? 'Admin (ผู้ดูแลระบบ)' : 'User (พนักงานทั่วไป)'}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* 4. ALL APPS VIEW */}
          {currentTab === 'all-apps' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Category Tabs & Search Bar / Add App Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                {/* 5 Tabs: 1) ทั้งหมด (All) 2) บัญชี (Accounting) 3) BOI 4) IT 5) ระบบราชการ & ธนาคาร */}
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-x-auto">
                  {[
                    { id: 'all' as const, labelTh: 'ทั้งหมด (All)', labelEn: 'All Apps', icon: Grid },
                    { id: 'accounting' as const, labelTh: 'บัญชี (Accounting)', labelEn: 'Accounting', icon: Calculator },
                    { id: 'boi' as const, labelTh: 'BOI', labelEn: 'BOI', icon: ReceiptText },
                    { id: 'it' as const, labelTh: 'IT', labelEn: 'IT', icon: Network },
                    { id: 'external' as const, labelTh: 'ระบบราชการ & ธนาคาร', labelEn: 'Gov & Banking', icon: Landmark }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = selectedCategory === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setSelectedCategory(tab.id);
                          setSearchQuery('');
                        }}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                          isActive
                            ? 'bg-[#1E60D5] text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{language === 'TH' ? tab.labelTh : tab.labelEn}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Right: Search Input & Admin "+ Add App" Button */}
                <div className="flex items-center gap-2">
                  <div className="relative min-w-[180px] sm:w-60 shrink-0">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={language === 'TH' ? 'ค้นหาระบบงาน, เว็บไซต์...' : 'Search apps...'}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#1E60D5] dark:focus:border-blue-500 transition-colors shadow-2xs"
                    />
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setEditingApp(null);
                        setAppModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E60D5] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                      title={language === 'TH' ? 'เพิ่มแอปพลิเคชันองค์กรใหม่' : 'Add new enterprise app'}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'TH' ? '+ เพิ่มแอป' : '+ Add App'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Unified Apps Grid using AppCard for all categories including Government & Banking */}
              <div>
                {filteredApps.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {filteredApps.map((app) => (
                      <AppCard
                        key={app.id}
                        app={app}
                        currentUserRole={currentUser.role}
                        isFavorite={favorites.includes(app.id)}
                        onToggleFavorite={toggleFavorite}
                        onLaunchApp={handleLaunchApp}
                        language={language}
                        isAdmin={isAdmin}
                        onEditApp={(appToEdit) => {
                          setEditingApp(appToEdit);
                          setAppModalOpen(true);
                        }}
                        onDeleteApp={(appIdToDelete) => {
                          setAppToDeleteId(appIdToDelete);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  /* Clean empty state prepared for real apps */
                  <div className="py-16 px-6 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-4 max-w-xl mx-auto my-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-[#1E60D5] dark:text-blue-400">
                      {selectedCategory === 'accounting' ? (
                        <Calculator className="w-7 h-7" />
                      ) : selectedCategory === 'boi' ? (
                        <ReceiptText className="w-7 h-7" />
                      ) : selectedCategory === 'it' ? (
                        <Network className="w-7 h-7" />
                      ) : selectedCategory === 'external' ? (
                        <Landmark className="w-7 h-7" />
                      ) : (
                        <Grid className="w-7 h-7" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                        {language === 'TH' 
                          ? `ยังไม่มีระบบงาน${selectedCategory === 'all' ? '' : `ในหมวด ${selectedCategory === 'accounting' ? 'บัญชี (Accounting)' : selectedCategory === 'boi' ? 'BOI' : selectedCategory === 'it' ? 'IT' : 'ระบบราชการ & ธนาคาร'}`}`
                          : `No applications found`}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                        {language === 'TH'
                          ? 'เว้นพื้นที่ว่างเตรียมรับลิงก์ระบบงานจริงขององค์กร ผู้ดูแลระบบสามารถกดปุ่ม "+ เพิ่มแอป" เพื่อเพิ่มลิงก์ใช้งาน'
                          : 'Clean empty space reserved for real corporate application links. Administrators can use "+ Add App" to add links.'}
                      </p>
                    </div>
                    {isAdmin && (
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setEditingApp(null);
                            setAppModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E60D5] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>
                            {language === 'TH' 
                              ? `+ เพิ่มแอป${selectedCategory === 'all' ? '' : `ในหมวด ${selectedCategory === 'accounting' ? 'บัญชี' : selectedCategory === 'boi' ? 'BOI' : selectedCategory === 'it' ? 'IT' : 'ราชการ & ธนาคาร'}`}` 
                              : `+ Add App`}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. VENDOR CONTACT VIEW */}
          {currentTab === 'vendor-contact' && (
            <VendorContactView
              vendors={vendorContacts}
              onAddVendor={handleAddVendor}
              onUpdateVendor={handleUpdateVendor}
              onDeleteVendor={handleDeleteVendor}
              onResetDefaultVendors={handleResetVendors}
              isAdmin={isAdmin}
              language={language}
              onOpenAdminPinModal={() => setAdminPinModalOpen(true)}
            />
          )}

          {/* 6. CALENDAR VIEW */}
          {currentTab === 'calendar' && (
            <CalendarView
              key="calendar"
              roomBookings={roomBookings}
              language={language}
              isAdmin={isAdmin}
            />
          )}

          {/* 7. MANAGE ANNOUNCEMENTS VIEW (Requirement #4.2: Admin Announcements Management) */}
          {currentTab === 'announcements' && (
            <AnnouncementsView
              announcements={announcements}
              language={language}
              isAdmin={isAdmin}
              onAddAnnouncement={handleAddAnnouncement}
              onDeleteAnnouncement={handleDeleteAnnouncement}
            />
          )}
        </main>
      </div>

      {/* App Launch Modal */}
      <AppLaunchModal
        app={selectedAppForLaunch}
        currentUser={currentUser}
        onClose={() => setSelectedAppForLaunch(null)}
        language={language}
      />

      {/* Admin App Manage Modal (Requirement #4: Create / Edit App) */}
      <AppManageModal
        isOpen={appModalOpen}
        editingApp={editingApp}
        defaultCategory={selectedCategory === 'all' ? 'accounting' : selectedCategory}
        onClose={() => {
          setAppModalOpen(false);
          setEditingApp(null);
        }}
        onSaveApp={handleSaveApp}
        language={language}
      />

      {/* Admin Delete App Confirmation Modal */}
      {appToDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {language === 'TH' ? 'ยืนยันการลบแอปพลิเคชัน' : 'Confirm Application Deletion'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'TH' 
                  ? `คุณต้องการลบแอปพลิเคชัน "${enterpriseApps.find(a => a.id === appToDeleteId)?.name || 'นี้'}" ออกจากพอร์ทัลใช่หรือไม่?` 
                  : `Are you sure you want to remove "${enterpriseApps.find(a => a.id === appToDeleteId)?.name || 'this app'}" from the digital portal?`}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAppToDeleteId(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteApp(appToDeleteId);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                {language === 'TH' ? 'ยืนยันลบ' : 'Delete App'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Modal */}
      <QuickActionsModal
        isOpen={quickActionModal.isOpen}
        initialType={quickActionModal.type}
        currentUser={currentUser}
        machineInfo={machineInfo}
        apps={enterpriseApps}
        onClose={() => setQuickActionModal({ isOpen: false, type: 'helpdesk' })}
        language={language}
      />

      {/* System Status Drawer */}
      <SystemStatusDrawer
        isOpen={systemStatusOpen}
        onClose={() => setSystemStatusOpen(false)}
        language={language}
      />

      {/* Google Search Modal */}
      <GoogleSearchModal
        isOpen={googleSearchModalOpen}
        onClose={() => setGoogleSearchModalOpen(false)}
        initialQuery={googleSearchInitialQuery}
        language={language}
      />

      {/* Google Translate Modal */}
      <GoogleTranslateModal
        isOpen={googleTranslateModalOpen}
        onClose={() => setGoogleTranslateModalOpen(false)}
        language={language}
      />

      {/* Admin PIN Unlock Modal (PIN 1111 Mode) */}
      <AdminPinModal
        isOpen={adminPinModalOpen}
        onClose={() => setAdminPinModalOpen(false)}
        onSuccess={handleAdminPinSuccess}
        language={language}
      />

      {/* Daily Announcement Modal (Daily Auto-popup / Dismissed by Date in LocalStorage) */}
      <DailyAnnouncementModal
        isOpen={dailyAnnouncementModalOpen}
        onClose={handleDismissAnnouncementToday}
        onDismissToday={handleDismissAnnouncementToday}
        announcements={announcements}
        language={language}
      />
    </div>
  );
}

