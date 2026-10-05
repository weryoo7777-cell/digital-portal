export type UserRole = 'ADMIN' | 'ACCOUNTING' | 'IT' | 'HR' | 'SALES_OPERATIONS';

export interface UserProfile {
  id: string;
  name: string;
  nameTh: string;
  email: string;
  role: UserRole;
  department: string;
  departmentTh: string;
  position: string;
  employeeId: string;
  avatar: string;
  workstationHostname: string;
  assignedVlan: string;
  localIp: string;
  ssoProvider: 'EntraID' | 'GoogleWorkspace' | 'LocalAD';
}

export type AppCategory = 
  | 'all'
  | 'accounting' 
  | 'tax' 
  | 'hr' 
  | 'it' 
  | 'operations' 
  | 'productivity'
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
  badge?: string;
  url: string;
  allowedRoles: UserRole[];
  status: AppStatus;
  launchType: AppLaunchType;
  isFrequent?: boolean;
  version?: string;
  internalPort?: string;
  serverHost?: string;
}

export interface ClientMachineInfo {
  hostname: string;
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
  detectionMethod: 'WebRTC & Backend Intranet Forwarder' | 'Intranet Agent Simulation';
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
  tag: 'IT Maintenance' | 'HR Policy' | 'General' | 'Tax Deadline';
  priority: 'normal' | 'high' | 'urgent';
  author: string;
  read?: boolean;
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
