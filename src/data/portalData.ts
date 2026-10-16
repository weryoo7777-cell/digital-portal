import { EnterpriseApp, UserProfile, SystemServiceHealth, CorporateAnnouncement, HelpdeskTicket, RoomBooking } from '../types';
import { EXTERNAL_PORTALS } from './externalPortalsData';

export const QISHENG_LOGO = '/src/assets/images/qisheng_logo_emblem_1790322484489.jpg';
export const SOMCHAI_AVATAR = '/src/assets/images/avatar_somchai_user_1790322510012.jpg';
export const CORPORATE_BUILDING_BANNER = '/src/assets/images/corporate_glass_building_1791176459701.jpg';
export const CORPORATE_OFFICE_FACADE = CORPORATE_BUILDING_BANNER;
export const CORPORATE_MOUNTAIN_BRAND = '/src/assets/images/corporate_mountain_brand_1791176478081.jpg';

export const DEFAULT_ADMIN_ACCOUNT: UserProfile = {
  id: 'usr_admin_default',
  username: 'admin',
  password: 'adminpassword123',
  name: 'System Administrator',
  nameTh: 'ผู้ดูแลระบบ (Admin)',
  email: 'admin@qisheng.co.th',
  role: 'admin',
  roleLevel: 'admin',
  department: 'IT Administration & Corporate Systems',
  departmentTh: 'ฝ่ายเทคโนโลยีสารสนเทศและระบบงานกลาง',
  position: 'Enterprise Super Admin',
  employeeId: 'QS-ADM001',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  workstationHostname: 'QS-HQ-ADMIN-01',
  assignedVlan: 'VLAN 10 - Admin Subnet',
  localIp: '192.168.10.1',
  ssoProvider: 'DirectAuth',
  createdAt: '2026-01-10'
};

export const DEFAULT_USER_ACCOUNT: UserProfile = {
  id: 'usr_user_default',
  username: 'user',
  password: 'user123',
  name: 'Somchai Meesook',
  nameTh: 'สมชาย มีสุข',
  email: 'user@qisheng.co.th',
  role: 'user',
  roleLevel: 'user',
  department: 'General Operations & Staff',
  departmentTh: 'ฝ่ายปฏิบัติการและธุรการทั่วไป',
  position: 'Operations Specialist',
  employeeId: 'QS-USR002',
  avatar: SOMCHAI_AVATAR,
  workstationHostname: 'QS-HQ-STAFF-05',
  assignedVlan: 'VLAN 30 - General Staff Subnet',
  localIp: '192.168.30.22',
  ssoProvider: 'DirectAuth',
  createdAt: '2026-02-01'
};

export const CORPORATE_USERS: UserProfile[] = [
  DEFAULT_ADMIN_ACCOUNT,
  DEFAULT_USER_ACCOUNT,
  {
    id: 'usr_paramed_01',
    username: 'paramed',
    password: 'password123',
    name: 'Paramed Cherdchoo',
    nameTh: 'ปรเมศวร์ เชิดชู',
    email: 'paramed.c@qisheng.co.th',
    role: 'admin',
    roleLevel: 'admin',
    department: 'IT Infrastructure & User Support',
    departmentTh: 'ฝ่ายสนับสนุนเทคโนโลยีสารสนเทศ (IT Support)',
    position: 'IT Support Specialist',
    employeeId: 'QS-01092',
    avatar: SOMCHAI_AVATAR,
    workstationHostname: 'QISHENG-022',
    assignedVlan: 'VLAN 10 - IT Operations Subnet',
    localIp: '192.168.10.45',
    ssoProvider: 'EntraID',
    createdAt: '2026-01-15'
  },
  {
    id: 'usr_it_01',
    username: 'somchai.v',
    password: 'password123',
    name: 'Somchai Vijitsilp',
    nameTh: 'สมชาย วิจิตรศิลป์',
    email: 'somchai.v@qisheng.co.th',
    role: 'admin',
    roleLevel: 'admin',
    department: 'IT & Infrastructure Operations',
    departmentTh: 'ฝ่ายเทคโนโลยีสารสนเทศและโครงสร้างพื้นฐาน',
    position: 'Senior IT Network & Systems Lead',
    employeeId: 'QS-01048',
    avatar: SOMCHAI_AVATAR,
    workstationHostname: 'QS-BKK-IT-NB04.qisheng.local',
    assignedVlan: 'VLAN 10 - IT Operations Subnet',
    localIp: '192.168.10.46',
    ssoProvider: 'EntraID',
    createdAt: '2026-01-20'
  },
  {
    id: 'usr_acc_01',
    username: 'suda',
    password: 'password123',
    name: 'Suda Pornpitak',
    nameTh: 'สุดา พรพิทักษ์',
    email: 'suda.p@qisheng.co.th',
    role: 'user',
    roleLevel: 'user',
    department: 'Accounting & Corporate Finance',
    departmentTh: 'ฝ่ายการบัญชีและการเงินองค์กร',
    position: 'Accounting & Tax Manager',
    employeeId: 'QS-00412',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    workstationHostname: 'QS-BKK-ACC-PC03.qisheng.local',
    assignedVlan: 'VLAN 20 - Accounting & Finance',
    localIp: '192.168.20.12',
    ssoProvider: 'EntraID',
    createdAt: '2026-02-10'
  },
  {
    id: 'usr_hr_01',
    username: 'napatsorn',
    password: 'password123',
    name: 'Napatsorn Amphawa',
    nameTh: 'นภัสสร อัมพวา',
    email: 'napatsorn.a@qisheng.co.th',
    role: 'user',
    roleLevel: 'user',
    department: 'People & Human Resources',
    departmentTh: 'ฝ่ายบริหารทรัพยากรบุคคล',
    position: 'HR Director & People Operations',
    employeeId: 'QS-00219',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    workstationHostname: 'QS-BKK-HR-NB01.qisheng.local',
    assignedVlan: 'VLAN 30 - HR & Confidential',
    localIp: '192.168.30.5',
    ssoProvider: 'GoogleWorkspace',
    createdAt: '2026-02-15'
  },
  {
    id: 'usr_admin_01',
    username: 'thanakrit',
    password: 'password123',
    name: 'Thanakrit Wittayakorn',
    nameTh: 'ธนกฤต วิทยากร',
    email: 'thanakrit.w@qisheng.co.th',
    role: 'admin',
    roleLevel: 'admin',
    department: 'Executive Management & Board',
    departmentTh: 'คณะผู้บริหารและกรรมการผู้จัดการ',
    position: 'Managing Director & Enterprise Super Admin',
    employeeId: 'QS-00001',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    workstationHostname: 'QS-BKK-CEO-MAC01.qisheng.local',
    assignedVlan: 'VLAN 99 - Executive Management',
    localIp: '192.168.99.1',
    ssoProvider: 'EntraID',
    createdAt: '2026-01-01'
  },
  {
    id: 'usr_sales_01',
    username: 'kittisak',
    password: 'password123',
    name: 'Kittisak Charoenporn',
    nameTh: 'กิตติศักดิ์ เจริญพร',
    email: 'kittisak.c@qisheng.co.th',
    role: 'user',
    roleLevel: 'user',
    department: 'Sales & Warehouse Logistics',
    departmentTh: 'ฝ่ายขายและการจัดการคลังสินค้า',
    position: 'Supply Chain & Sales Coordinator',
    employeeId: 'QS-01320',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    workstationHostname: 'QS-BKK-WMS-PC08.qisheng.local',
    assignedVlan: 'VLAN 40 - Operations & Logistics',
    localIp: '192.168.40.24',
    ssoProvider: 'GoogleWorkspace',
    createdAt: '2026-03-01'
  }
];

export const ENTERPRISE_APPS: EnterpriseApp[] = [
  {
    id: 'app-1791453921197',
    name: 'การนิคมอุตสาหกรรมแห่งประเทศไทย (กนอ.)',
    nameTh: 'การนิคมอุตสาหกรรมแห่งประเทศไทย (กนอ.)',
    category: 'boi',
    description: 'การนิคมอุตสาหกรรมแห่งประเทศไทย (กนอ.) enterprise application for corporate workflow.',
    descriptionTh: 'การนิคมอุตสาหกรรมแห่งประเทศไทย (กนอ.) ระบบงานดิจิทัลสำหรับพนักงานองค์กร',
    url: 'https://www.ieat.go.th/en',
    iconName: 'https://www.google.com/s2/favicons?domain=www.ieat.go.th&sz=128',
    customIconUrl: 'https://www.google.com/s2/favicons?domain=www.ieat.go.th&sz=128',
    launchType: 'web',
    status: 'online',
    allowedRoles: [
      'ADMIN',
      'ACCOUNTING',
      'IT',
      'HR',
      'SALES_OPERATIONS',
      'admin',
      'user'
    ],
    isFrequent: false
  },
  {
    id: 'app-1791453688198',
    name: 'DataForge OCR',
    nameTh: 'DataForge OCR',
    category: 'accounting',
    description: 'DataForge OCR enterprise application for corporate workflow.',
    descriptionTh: 'ระบบคัดแยก จัดเตรียม และปรับโครงสร้างข้อมูลเพื่อส่งออกไปใช้งานต่อในทุกระบบอย่างสมบูรณ์',
    url: 'http://192.168.7.126:3003/',
    iconName: 'Layers',
    launchType: 'web',
    status: 'online',
    allowedRoles: [
      'ADMIN',
      'ACCOUNTING',
      'IT',
      'HR',
      'SALES_OPERATIONS',
      'admin',
      'user'
    ],
    isFrequent: false
  },
  {
    id: 'app-1791453410621',
    name: 'gemini',
    nameTh: 'gemini',
    category: 'it',
    description: 'gemini',
    descriptionTh: 'gemini ระบบงานดิจิทัลสำหรับพนักงานองค์กร',
    url: 'https://gemini.google.com/',
    iconName: 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128',
    customIconUrl: 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128',
    launchType: 'web',
    status: 'online',
    allowedRoles: [
      'ADMIN',
      'ACCOUNTING',
      'IT',
      'HR',
      'SALES_OPERATIONS',
      'admin',
      'user'
    ],
    isFrequent: false
  },
  {
    id: 'app-1791453362909',
    name: 'chatgpt',
    nameTh: 'chatgpt',
    category: 'it',
    description: 'AI',
    descriptionTh: 'chatgpt ระบบงานดิจิทัลสำหรับพนักงานองค์กร',
    url: 'https://chatgpt.com/',
    iconName: 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128',
    customIconUrl: 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128',
    launchType: 'web',
    status: 'online',
    allowedRoles: [
      'ADMIN',
      'ACCOUNTING',
      'IT',
      'HR',
      'SALES_OPERATIONS',
      'admin',
      'user'
    ],
    isFrequent: false
  },
  {
    id: 'app-1791453288133',
    name: 'deepseek',
    nameTh: 'deepseek',
    category: 'it',
    description: 'AI',
    descriptionTh: 'deepseek ระบบงานดิจิทัลสำหรับพนักงานองค์กร',
    url: 'https://chat.deepseek.com/',
    iconName: 'https://www.google.com/s2/favicons?domain=chat.deepseek.com&sz=128',
    customIconUrl: 'https://www.google.com/s2/favicons?domain=chat.deepseek.com&sz=128',
    launchType: 'web',
    status: 'online',
    allowedRoles: [
      'ADMIN',
      'ACCOUNTING',
      'IT',
      'HR',
      'SALES_OPERATIONS',
      'admin',
      'user'
    ],
    isFrequent: false
  },
  {
    id: 'app-1791453119061',
    name: 'ProTrack',
    nameTh: 'ระบบติดตามการดำเนินโครงการ AI & IT',
    category: 'it',
    description: 'ProTrack enterprise application for corporate workflow.',
    descriptionTh: 'ระบบติดตามการดำเนินโครงการ AI & IT',
    url: 'https://script.google.com/macros/s/AKfycbwO2uHhe_A3sqBD9yPCZwv2VBz2v18tuZidyiT9-qbr1eSuk7fFM0edPat_kglftcBz/exec',
    iconName: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAiACYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8qqKK7L4P/CnWPjZ8Q9K8G6DNY2+qakzLFJqNwIIF2qWO5sHsDwASTWdSpCjB1Kjslqyoxcmox3ZxtFfZ+nfsd6JY6P4MsfEWkanp3iSz1OUeJR9tUx3tpvIT7KQCFyoGG5+9yAQRXyv8T7PQ9O+IniO08MpPHoEF/NFZJcyCSQRKxChmAG48de9bUEsTg44+k06cm4pp72Sd13VmtTz6WMp1a08Ok1KDaaatZp2OYoooqTuCvQ/gx4z8HeCdX1K88W+GrrxCzW23TZLS8a3exuQwKzcEbsAHjIrzyis6lNVYOEtmdGHryw1WNaCTa7q6+5n2f4g/by0bWvDt9DP4d1O91tdPktdOv5blI/JlONkku0HzNvzccZzzXxi7tI7OxLMxySe5pKKMNTjhMJTwNFWpU+blXRczu/xIxE1icVUxkopTqWcrKydlbZaBRRRWhkFFFFABRRRQAUUUUAf/2SQvhNdAzhjTsjhBOH13ZUFr6yDzZHyyDP0nQ7nEF+gE',
    customIconUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAiACYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8qqKK7L4P/CnWPjZ8Q9K8G6DNY2+qakzLFJqNwIIF2qWO5sHsDwASTWdSpCjB1Kjslqyoxcmox3ZxtFfZ+nfsd6JY6P4MsfEWkanp3iSz1OUeJR9tUx3tpvIT7KQCFyoGG5+9yAQRXyv8T7PQ9O+IniO08MpPHoEF/NFZJcyCSQRKxChmAG48de9bUEsTg44+k06cm4pp72Sd13VmtTz6WMp1a08Ok1KDaaatZp2OYoooqTuCvQ/gx4z8HeCdX1K88W+GrrxCzW23TZLS8a3exuQwKzcEbsAHjIrzyis6lNVYOEtmdGHryw1WNaCTa7q6+5n2f4g/by0bWvDt9DP4d1O91tdPktdOv5blI/JlONkku0HzNvzccZzzXxi7tI7OxLMxySe5pKKMNTjhMJTwNFWpU+blXRczu/xIxE1icVUxkopTqWcrKydlbZaBRRRWhkFFFFABRRRQAUUUUAf/2SQvhNdAzhjTsjhBOH13ZUFr6yDzZHyyDP0nQ7nEF+gE',
    launchType: 'web',
    status: 'online',
    allowedRoles: [
      'ADMIN',
      'ACCOUNTING',
      'IT',
      'HR',
      'SALES_OPERATIONS',
      'admin',
      'user'
    ],
    isFrequent: false
  },
  {
    id: 'app-1791450581791',
    name: 'Book Cars',
    nameTh: 'จองรถ',
    category: 'it',
    description: 'Book Cars enterprise application for corporate workflow.',
    descriptionTh: 'จองรถองค์กร',
    url: 'https://docs.google.com/spreadsheets/d/1vBSReyBZ9eUEbUS3On9meloo3K5dDAsdkT0_iy1tGnQ/edit?gid=2095312518#gid=2095312518',
    iconName: 'https://www.google.com/s2/favicons?domain=docs.google.com&sz=128',
    customIconUrl: 'https://www.google.com/s2/favicons?domain=docs.google.com&sz=128',
    launchType: 'web',
    status: 'online',
    allowedRoles: [
      'ADMIN',
      'ACCOUNTING',
      'IT',
      'HR',
      'SALES_OPERATIONS',
      'admin',
      'user'
    ],
    isFrequent: false
  },
  ...EXTERNAL_PORTALS.map((portal) => ({
    id: portal.id,
    name: portal.name,
    nameTh: portal.nameTh,
    category: 'external' as const,
    description: portal.descriptionEn,
    descriptionTh: portal.descriptionTh,
    iconName: portal.category === 'banking' ? 'CreditCard' : portal.category === 'corporate-dbd' ? 'Building2' : 'Landmark',
    customIconUrl: portal.logoUrl,
    badge: portal.badge || 'ราชการ & ธนาคาร',
    url: portal.url,
    allowedRoles: ['admin', 'user'] as ('admin' | 'user')[],
    status: 'online' as const,
    launchType: 'web' as const,
    isFrequent: Boolean(portal.isPopular),
    version: 'Official Portal'
  }))
];

export const SYSTEM_SERVICES: SystemServiceHealth[] = [
  {
    id: 'svc-gw',
    name: 'HQ Fiber Gateway (MikroTik CCR2004)',
    category: 'Core Network',
    status: 'online',
    latency: 2,
    uptime: '99.99%',
    host: '192.168.1.1'
  },
  {
    id: 'svc-ad',
    name: 'Active Directory & Entra ID Sync',
    category: 'Identity & Access',
    status: 'online',
    latency: 4,
    uptime: '99.98%',
    host: 'qs-dc01.qisheng.local'
  },
  {
    id: 'svc-erp',
    name: 'Express & ERP Database Cluster',
    category: 'Business DB',
    status: 'online',
    latency: 5,
    uptime: '99.95%',
    host: '192.168.20.10:1433'
  },
  {
    id: 'svc-ocr',
    name: 'DataForge OCR Processing Nodes',
    category: 'AI Worker',
    status: 'online',
    latency: 18,
    uptime: '99.89%',
    host: 'ocr-node01.qisheng.internal'
  },
  {
    id: 'svc-rd',
    name: 'RD e-Filing External Tax Gateway',
    category: 'Government API',
    status: 'online',
    latency: 38,
    uptime: '99.70%',
    host: 'efiling.rd.go.th'
  },
  {
    id: 'svc-vpn',
    name: 'WireGuard Zero-Trust VPN Gateway',
    category: 'Security Tunnel',
    status: 'online',
    latency: 6,
    uptime: '99.99%',
    host: 'vpn.qisheng.co.th:51820'
  }
];

export const CORPORATE_ANNOUNCEMENTS: CorporateAnnouncement[] = [
  {
    id: 'ann-welcome',
    title: 'ยินดีต้อนรับเข้าสู่ระบบ QISHENG Digital Portal',
    titleEn: 'Welcome to QISHENG Digital Portal',
    summary: 'ศูนย์รวมแอปพลิเคชันและระบบงานองค์กร บริษัท ฉี เซิ่ง คอนซัลติ้ง จำกัด เชื่อมต่อทุกระบบงานไว้ในที่เดียว พร้อมระบบตรวจจับ Client Machine Info และ Single Sign-on (SSO)',
    date: '6 ตุลาคม 2026',
    tag: 'General',
    priority: 'normal',
    author: 'ฝ่ายสื่อสารองค์กรและดิจิทัล'
  },
  {
    id: 'ann-01',
    title: 'ประกาศกำหนดการยื่นแบบ ภ.ง.ด. และ ภ.พ.30 ประจำงวดเดือนนี้',
    titleEn: 'Monthly Tax Submission Deadline for P.N.D. and P.P.30',
    summary: 'ขอความร่วมมือแผนกที่เกี่ยวข้องส่งเอกสารใบเสร็จรับเงินและใบกำกับภาษีซื้อให้ฝ่ายบัญชีก่อนวันที่ 12 ของเดือน',
    date: '24 กันยายน 2026',
    tag: 'Tax Deadline',
    priority: 'high',
    author: 'ฝ่ายการบัญชีและการเงิน'
  },
  {
    id: 'ann-02',
    title: 'แจ้งแผนซ่อมบำรุงระบบ Core Switch และ Firmware Router ประจำไตรมาส',
    titleEn: 'Quarterly Core Network & Switch Firmware Maintenance Window',
    summary: 'ฝ่ายไอทีจะทำการอัปเดต Firmware ในวันเสาร์ เวลา 23:00 - 02:00 น. ระบบ Intranet และ RDP บางส่วนจะหยุดชั่วคราว',
    date: '22 กันยายน 2026',
    tag: 'IT Maintenance',
    priority: 'urgent',
    author: 'แผนกโครงสร้างพื้นฐานไอที'
  },
  {
    id: 'ann-03',
    title: 'เปิดใช้งานฟีเจอร์ DataForge OCR สแกนใบเสร็จด้วย AI เต็มรูปแบบ',
    titleEn: 'New DataForge OCR AI Document Intake Feature is Now Live',
    summary: 'พนักงานสามารถอัปโหลดใบเสร็จค่าน้ำมันและค่าเดินทางผ่านเมนู DataForge เพื่อประมวลผลการเบิกจ่ายได้รวดเร็วขึ้น',
    date: '18 กันยายน 2026',
    tag: 'General',
    priority: 'normal',
    author: 'ฝ่ายพัฒนาระบบและดิจิทัล'
  }
];

export const INITIAL_HELPDESK_TICKETS: HelpdeskTicket[] = [
  {
    id: 'TICK-8842',
    subject: 'ขอติดตั้งไดรเวอร์เครื่องพิมพ์บัญชี Epson LQ-310 บน Windows 11',
    category: 'Hardware & Peripheral',
    priority: 'Medium',
    status: 'In Progress',
    reportedBy: 'Suda Pornpitak (Accounting)',
    workstation: 'QS-BKK-ACC-PC03.qisheng.local',
    createdAt: '2026-09-24 14:30',
    description: 'ต้องการพิมพ์ใบกำกับภาษีต่อเนื่อง 3 ชั้นจากระบบ Express Accounting'
  },
  {
    id: 'TICK-8839',
    subject: 'ขอเปิดสิทธิ์การเข้าถึงคลังข้อมูล WMS สต็อกสินค้าสาขาบางนา',
    category: 'Access Permission',
    priority: 'High',
    status: 'Resolved',
    reportedBy: 'Kittisak Charoenporn (Sales)',
    workstation: 'QS-BKK-WMS-PC08.qisheng.local',
    createdAt: '2026-09-23 10:15',
    description: 'พนักงานย้ายมาดูแลโซนสินค้าเครื่องปรับอากาศ ต้องการสิทธิ์ตรวจนับสต็อก'
  }
];

export const INITIAL_ROOM_BOOKINGS: RoomBooking[] = [
  {
    id: 'room-b1',
    roomName: 'Boardroom ชั้น 4 (Diamond Room)',
    capacity: 20,
    date: 'วันนี้',
    timeSlot: '10:00 - 11:30 น.',
    title: 'ประชุมสรุปงบการเงินและภาษีประจำไตรมาส 3/2026',
    bookedBy: 'สุดา พรพิทักษ์',
    department: 'บัญชีและการเงิน'
  },
  {
    id: 'room-b2',
    roomName: 'Innovation Meeting Room 2 (ชั้น 3)',
    capacity: 8,
    date: 'วันนี้',
    timeSlot: '14:00 - 15:30 น.',
    title: 'ทดสอบระบบ Single Sign-On (SSO) ร่วมกับ Microsoft Entra',
    bookedBy: 'สมชาย วิจิตรศิลป์',
    department: 'เทคโนโลยีสารสนเทศ'
  },
  {
    id: 'room-b3',
    roomName: 'Training Center 1 (ชั้น 2)',
    capacity: 35,
    date: 'พรุ่งนี้',
    timeSlot: '09:30 - 12:00 น.',
    title: 'ปฐมนิเทศพนักงานใหม่และชี้แจงสวัสดิการองค์กร',
    bookedBy: 'นภัสสร อัมพวา',
    department: 'ทรัพยากรบุคคล'
  }
];

export const KNOWLEDGE_BASE_DOCS = [
  {
    id: 'kb-01',
    title: 'คู่มือการเชื่อมต่อ Express Accounting ผ่าน RDP Gateway บนเครื่องใหม่',
    category: 'IT Guide',
    updatedAt: '15 ก.ย. 2026',
    readTime: '3 นาที',
    description: 'ขั้นตอนการตั้งค่า Remote Desktop Connection, Certificate และการแมปไดรฟ์ Z: สำหรับข้อมูลบัญชี'
  },
  {
    id: 'kb-02',
    title: 'นโยบายความมั่นคงปลอดภัยสารสนเทศ และการใช้รหัสผ่านองค์กร (Password Policy)',
    category: 'Policy',
    updatedAt: '01 ก.ย. 2026',
    readTime: '5 นาที',
    description: 'ข้อกำหนดความยาวรหัสผ่านอย่างน้อย 12 ตัวอักษร, การเปิดใช้งาน Multi-Factor Authentication (MFA)'
  },
  {
    id: 'kb-03',
    title: 'ขั้นตอนการจัดเตรียมไฟล์ XML สำหรับระบบ e-Tax Invoice & e-Receipt',
    category: 'Accounting & Tax',
    updatedAt: '28 ส.ค. 2026',
    readTime: '4 นาที',
    description: 'โครงสร้าง Schema มาตรฐานตามประกาศกรมสรรพากร และการตรวจสอบ Digital Signature'
  },
  {
    id: 'kb-04',
    title: 'คู่มือการเชื่อมต่อ VPN WireGuard เข้าสำนักงานใหญ่ขณะทำงานนอกสถานที่',
    category: 'IT Guide',
    updatedAt: '20 ส.ค. 2026',
    readTime: '2 นาที',
    description: 'การดาวน์โหลด Config file และคีย์เข้ารหัสสำหรับการเข้าถึงระบบภายในบริษัทอย่างปลอดภัย'
  }
];
