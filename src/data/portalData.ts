import { EnterpriseApp, UserProfile, SystemServiceHealth, CorporateAnnouncement, HelpdeskTicket, RoomBooking } from '../types';

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
    id: 'app-express',
    name: 'Express Accounting',
    nameTh: 'ระบบบัญชี Express for Windows',
    category: 'accounting',
    description: 'Enterprise accounting software, general ledger, AR/AP, inventory & financial statements',
    descriptionTh: 'โปรแกรมบัญชีสำเร็จรูป Express ระบบบัญชีแยกประเภท ผังบัญชี ซื้อ-ขาย ลูกหนี้-เจ้าหนี้ สต็อกสินค้า',
    iconName: 'Calculator',
    badge: 'Express Win',
    url: 'rdp://192.168.20.10:3389',
    allowedRoles: ['admin', 'user'],
    status: 'online',
    launchType: 'remote_rdp',
    isFrequent: true,
    version: 'v1.5 RDP',
    internalPort: '3389',
    documentationUrl: 'https://www.esg.co.th'
  },
  {
    id: 'app-etax',
    name: 'e-Tax Invoice & e-Receipt Portal',
    nameTh: 'ระบบใบกำกับภาษีอิเล็กทรอนิกส์ (e-Tax)',
    category: 'accounting',
    description: 'Digital signature certificate, XML format converter and electronic tax receipt portal',
    descriptionTh: 'ระบบจัดทำและส่งมอบใบกำกับภาษีและใบรับอิเล็กทรอนิกส์พร้อมลายมือชื่อดิจิทัลตามมาตรฐานกรมสรรพากร',
    iconName: 'FileText',
    badge: 'e-Tax',
    url: 'https://etax.rd.go.th',
    allowedRoles: ['admin', 'user'],
    status: 'online',
    launchType: 'web',
    isFrequent: true,
    version: 'v2.1 Web',
    documentationUrl: 'https://etax.rd.go.th'
  },
  {
    id: 'app-boi-sw',
    name: 'Single Window for Visa and Work Permit',
    nameTh: 'ระบบศูนย์บริการวีซ่าและใบอนุญาตทำงาน (Single Window)',
    category: 'boi',
    description: 'Integrated Visa and Work Permit application system for promoted foreign experts & investors',
    descriptionTh: 'ระบบคำขออนุญาตทำงานและตรวจลงตราวีซ่าอิเล็กทรอนิกส์สำหรับผู้เชี่ยวชาญต่างชาติและบริษัทที่ได้รับการส่งเสริม BOI',
    iconName: 'ReceiptText',
    badge: 'BOI Single Window',
    url: 'https://visasw.boi.go.th',
    allowedRoles: ['admin', 'user'],
    status: 'online',
    launchType: 'web',
    isFrequent: true,
    version: 'v3.0 Web',
    documentationUrl: 'https://visasw.boi.go.th'
  },
  {
    id: 'app-boi-esub',
    name: 'BOI e-Submission System',
    nameTh: 'ระบบยื่นคำขอรับการส่งเสริมการลงทุนออนไลน์ (e-Submission)',
    category: 'boi',
    description: 'Investment promotion application submission, tracking, project amendment and reporting',
    descriptionTh: 'ระบบยื่นแบบคำขอรับการส่งเสริมการลงทุน ติดตามสถานะคำขอ แก้ไขโครงการ และรายงานผลการดำเนินงาน',
    iconName: 'Building',
    badge: 'BOI e-Sub',
    url: 'https://esubmission.boi.go.th',
    allowedRoles: ['admin', 'user'],
    status: 'online',
    launchType: 'web',
    isFrequent: false,
    version: 'v2.0 Web',
    documentationUrl: 'https://www.boi.go.th'
  },
  {
    id: 'app-mikrotik',
    name: 'MikroTik CCR2004 Core Router',
    nameTh: 'เราเตอร์เครือข่ายหลักและไฟร์วอลล์ MikroTik',
    category: 'it',
    description: 'Headquarters core router gateway, bandwidth monitor, VLAN routing & firewall rules',
    descriptionTh: 'ระบบบริหารจัดการ Router Gateway ประจำสำนักงานใหญ่ มอนิเตอร์แบนด์วิดท์ จัดการ VLAN และระบบรักษาความปลอดภัย',
    iconName: 'Network',
    badge: 'RouterOS v7',
    url: 'https://192.168.1.1',
    allowedRoles: ['admin', 'user'],
    status: 'online',
    launchType: 'intranet',
    isFrequent: true,
    version: 'RouterOS 7.15',
    internalPort: '443',
    documentationUrl: 'https://wiki.mikrotik.com'
  },
  {
    id: 'app-vpn',
    name: 'WireGuard Zero-Trust VPN Gateway',
    nameTh: 'ระบบ VPN เครือข่ายความปลอดภัยระยะไกล (WireGuard)',
    category: 'it',
    description: 'High-speed encrypted VPN tunnel connecting remote staff to corporate internal resources',
    descriptionTh: 'อุโมงค์เชื่อมต่อเครือข่ายภายในองค์กรความเร็วสูงและเข้ารหัสลับ สำหรับการทำงานนอกสถานที่และสาขา',
    iconName: 'Shield',
    badge: 'WireGuard',
    url: 'https://vpn.qisheng.co.th',
    allowedRoles: ['admin', 'user'],
    status: 'online',
    launchType: 'intranet',
    isFrequent: true,
    version: 'WG 1.0',
    internalPort: '51820',
    documentationUrl: 'https://www.wireguard.com'
  },
  {
    id: 'app-protrack',
    name: 'ProTrack System',
    nameTh: 'ระบบบริหารและติดตามความคืบหน้างาน ProTrack',
    category: 'it',
    description: 'Enterprise Project & Task Tracking System for corporate workflows, milestones and assignments.',
    descriptionTh: 'ระบบบริหาร ติดตามความคืบหน้าโครงการ และมอบหมายภาระงานองค์กร (ProTrack)',
    iconName: 'Layers',
    badge: 'ProTrack v2',
    url: 'https://protrack.qisheng.internal',
    allowedRoles: ['admin', 'user'],
    status: 'online',
    launchType: 'web',
    isFrequent: true,
    version: 'v2.4.1',
    internalPort: '8080',
    documentationUrl: 'https://protrack.qisheng.internal/docs'
  }
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
