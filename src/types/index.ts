export type RoleLevel = 'admin' | 'user';
export type UserRole = 'ADMIN' | 'ACCOUNTING' | 'IT' | 'HR' | 'SALES_OPERATIONS' | 'admin' | 'user';

export interface UserProfile {
  id: string;
  username?: string;
  password?: string;
  name: string;
  nameTh: string;
  email: string;
  role: UserRole;
  roleLevel?: RoleLevel;
  department: string;
  departmentTh: string;
  position: string;
  employeeId: string;
  avatar: string;
  workstationHostname?: string;
  assignedVlan?: string;
  localIp?: string;
  ssoProvider?: 'EntraID' | 'GoogleWorkspace' | 'LocalAD' | 'DirectAuth';
  createdAt?: string;
}

export const isAdminUser = (user?: UserProfile | null): boolean => {
  if (!user) return false;
  const r = (user.role || '').toLowerCase();
  return r === 'admin' || user.roleLevel === 'admin';
};

export const getUserRoleLevel = (user?: UserProfile | null): RoleLevel => {
  return isAdminUser(user) ? 'admin' : 'user';
};

export type AppCategory = 
  | 'all'
  | 'accounting' 
  | 'boi' 
  | 'it' 
  | 'external';

export type AppStatus = 'online' | 'maintenance' | 'restricted';
export type AppLaunchType = 'web' | 'intranet' | 'remote_rdp' | 'cloud';

export interface EnterpriseApp {
  id: string;
  name: string;
  nameTh: string;
  category: Exclude<AppCategory, 'all'>;
  description: string;
  descriptionTh: string;
  iconName: string;
  customIconUrl?: string;
  badge?: string;
  url: string;
  allowedRoles: UserRole[];
  status: AppStatus;
  launchType: AppLaunchType;
  isFrequent?: boolean;
  version?: string;
  internalPort?: string;
  serverHost?: string;
  documentationUrl?: string;
}

export interface NetworkAdapterInfo {
  name: string;
  ip: string;
  isPhysical: boolean;
  mac?: string;
}

export interface DeviceHardwareSpecs {
  deviceName: string;
  domainSuffix?: string;
  processor: string;
  installedRam: string;
  graphicsCard: string;
  storage: string;
  deviceId: string;
  productId: string;
  systemType: string;
  penAndTouch: string;
}

export interface ClientMachineInfo {
  hostname: string;
  deviceName?: string;
  localIp: string;
  publicIp: string;
  gatewayIp: string;
  dnsServer: string;
  domainName: string;
  vlan: string;
  osName: string;
  osVersion: string;
  browserName: string;
  browserVersion: string;
  screenResolution: string;
  networkType: string;
  downlinkSpeed: string;
  latencyMs: number;
  detectedAt: string;
  detectionMethod: 'WebRTC & Backend Intranet Forwarder' | 'Intranet Agent Simulation' | 'Host OS Live Detection' | string;
  isRealLocalhost?: boolean;
  realHostname?: string;
  realLocalIp?: string;
  corporateHostname?: string;
  corporateLocalIp?: string;
  networkAdapters?: NetworkAdapterInfo[];
  displayMode?: 'real' | 'corporate';
  deviceSpecs?: DeviceHardwareSpecs;
  showFqdn?: boolean;
}

export interface SystemServiceHealth {
  id: string;
  name: string;
  category: string;
  status: 'online' | 'degraded' | 'maintenance';
  latency: number;
  uptime: string;
  host: string;
}

export interface CorporateAnnouncement {
  id: string;
  title: string;
  titleEn: string;
  summary: string;
  date: string;
  tag: 'IT Maintenance' | 'HR Policy' | 'General' | 'Tax Deadline' | 'Policy' | string;
  priority: 'normal' | 'high' | 'urgent';
  author: string;
  read?: boolean;
  updatedAt?: number;
}

export interface ActivityLogItem {
  id: string;
  appId?: string;
  appName: string;
  appNameTh?: string;
  appUrl?: string;
  category?: string;
  clientIp?: string;
  workstationHostname?: string;
  userName?: string;
  userRole?: string;
  timestamp: number;
  timeFormatted?: string;
  status: 'online' | 'success' | 'redirected' | 'launched';
  action?: string;
}

export interface PortalDataSyncResponse {
  apps: EnterpriseApp[];
  announcements: CorporateAnnouncement[];
  activityLogs: ActivityLogItem[];
  latestAnnouncementId: string;
  latestAnnouncementUpdatedAt: number;
  lastAnnouncementAction?: 'create' | 'update' | 'delete' | 'init';
  serverTime: number;
  version: number;
  vendorContacts?: VendorContact[];
}

export interface HelpdeskTicket {
  id: string;
  subject: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'In Progress' | 'Resolved';
  reportedBy: string;
  workstation: string;
  createdAt: string;
  description: string;
}

export interface RoomBooking {
  id: string;
  roomName: string;
  capacity: number;
  date: string;
  timeSlot: string;
  title: string;
  bookedBy: string;
  department: string;
}

export type VendorCategory = 
  | 'accounting' 
  | 'boi' 
  | 'it' 
  | 'isp' 
  | 'facility' 
  | 'other';

export interface VendorContact {
  id: string;
  name: string;
  nameEn?: string;
  category: VendorCategory;
  serviceDescription: string;
  contactPerson?: string;
  phone: string;
  phoneSecondary?: string;
  email?: string;
  lineId?: string;
  website?: string;
  operatingHours?: string;
  contractNumber?: string;
  notes?: string;
  isHotline24h?: boolean;
  updatedAt?: string;
}

export type NavTab = 
  | 'dashboard' 
  | 'all-apps' 
  | 'vendor-contact'
  | 'calendar' 
  | 'announcements';
