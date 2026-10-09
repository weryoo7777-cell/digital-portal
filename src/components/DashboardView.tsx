import React from 'react';
import { 
  Clock, 
  LayoutGrid, 
  ArrowRight, 
  Star, 
  ChevronRight, 
  Megaphone, 
  Bell, 
  Zap, 
  Activity, 
  Headphones, 
  PlusCircle, 
  Calendar as CalendarIcon, 
  Users, 
  Globe, 
  Wifi, 
  Router as RouterHardwareIcon, 
  Laptop, 
  Calculator, 
  Landmark, 
  User, 
  Share2, 
  Sparkles, 
  FileText, 
  MoreHorizontal,
  ArrowUpRight
} from 'lucide-react';
import { EnterpriseApp, UserProfile, CorporateAnnouncement } from '../types';
import { HeroGreetingBanner } from './HeroGreetingBanner';
import { 
  ExpressIcon, 
  DataForgeOcrIcon, 
  RdEfilingIcon, 
  GoogleDriveIcon, 
  GmailIcon, 
  RouterIcon 
} from './BrandIcons';

interface DashboardViewProps {
  currentUser: UserProfile;
  apps: EnterpriseApp[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onLaunchApp: (app: EnterpriseApp) => void;
  onSelectCategory: (categoryId: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenQuickAction: (action: 'helpdesk' | 'sspr' | 'access') => void;
  onOpenSystemStatus: () => void;
  onSelectAnnouncement: (announcement: CorporateAnnouncement) => void;
  announcements: CorporateAnnouncement[];
  language: 'TH' | 'EN';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  apps,
  favorites,
  onToggleFavorite,
  onLaunchApp,
  onSelectCategory,
  onNavigateTab,
  onOpenQuickAction,
  onOpenSystemStatus,
  onSelectAnnouncement,
  announcements,
  language
}) => {
  // Frequently Used Apps matching image.png (Express, DataForge OCR, RD e-Filing, Google Drive, Gmail, Router)
  const frequentAppCards = [
    {
      id: 'app-express-accounting',
      name: 'Express',
      category: 'บัญชี / Express',
      icon: <ExpressIcon className="w-10 h-10" />,
      app: apps?.find(a => a?.id === 'app-express-accounting') || {
        id: 'app-express-accounting',
        name: 'Express Accounting',
        nameTh: 'ระบบบัญชี Express for Windows',
        category: 'accounting',
        description: 'General ledger, AP/AR, Inventory and tax report generation.',
        descriptionTh: 'ระบบบัญชีแยกประเภท ลูกหนี้ เจ้าหนี้ และสินค้าคงคลัง',
        iconName: 'Calculator',
        badge: 'Accounting',
        url: 'app://express.local',
        allowedRoles: ['ADMIN', 'ACCOUNTING'],
        status: 'online',
        launchType: 'intranet',
        isFrequent: true
      } as EnterpriseApp
    },
    {
      id: 'app-dataforge-ocr',
      name: 'DataForge OCR',
      category: 'บัญชี / OCR',
      icon: <DataForgeOcrIcon className="w-10 h-10" />,
      app: apps?.find(a => a?.id === 'app-dataforge-ocr') || {
        id: 'app-dataforge-ocr',
        name: 'DataForge OCR',
        nameTh: 'ระบบแปลงเอกสารใบกำกับภาษี DataForge OCR',
        category: 'accounting',
        description: 'Automated invoice and receipt OCR data extraction.',
        descriptionTh: 'ระบบอ่านเอกสารใบกำกับภาษีอัตโนมัติด้วย AI OCR',
        iconName: 'ScanText',
        badge: 'Smart OCR',
        url: 'https://ocr.qisheng.local',
        allowedRoles: ['ADMIN', 'ACCOUNTING'],
        status: 'online',
        launchType: 'web',
        isFrequent: true
      } as EnterpriseApp
    },
    {
      id: 'app-rd-efiling',
      name: 'RD e-Filing',
      category: 'ภาษี / RD',
      icon: <RdEfilingIcon className="w-10 h-10" />,
      app: apps?.find(a => a?.id === 'app-rd-efiling') || {
        id: 'app-rd-efiling',
        name: 'RD e-Filing (กรมสรรพากร)',
        nameTh: 'ระบบยื่นแบบภาษีออนไลน์ กรมสรรพากร',
        category: 'accounting',
        description: 'Online tax return submission (ภ.พ.30, ภ.ง.ด.1/3/53).',
        descriptionTh: 'ระบบยื่นแบบแสดงรายการภาษีผ่านเครือข่ายอินเทอร์เน็ต',
        iconName: 'ReceiptText',
        badge: 'Gov Portal',
        url: 'https://efiling.rd.go.th',
        allowedRoles: ['ADMIN', 'ACCOUNTING', 'USER'],
        status: 'online',
        launchType: 'web',
        isFrequent: true
      } as EnterpriseApp
    },
    {
      id: 'app-google-drive',
      name: 'Google Drive',
      category: 'เครื่องมือ / Google',
      icon: <GoogleDriveIcon className="w-10 h-10" />,
      app: apps.find(a => a.id === 'app-google-drive') || {
        id: 'app-google-drive',
        name: 'Google Drive',
        nameTh: 'Google Drive สำหรับองค์กร',
        category: 'it',
        description: 'Cloud document storage and collaborative spreadsheets.',
        descriptionTh: 'พื้นที่จัดเก็บเอกสารและแชร์ไฟล์บนคลาวด์องค์กร',
        iconName: 'HardDrive',
        badge: 'Workspace',
        url: 'https://drive.google.com',
        allowedRoles: ['ADMIN', 'IT', 'ACCOUNTING', 'HR'],
        status: 'online',
        launchType: 'web',
        isFrequent: true
      } as EnterpriseApp
    },
    {
      id: 'app-gmail',
      name: 'Gmail',
      category: 'อีเมล / Google',
      icon: <GmailIcon className="w-10 h-10" />,
      app: apps.find(a => a.id === 'app-gmail') || {
        id: 'app-gmail',
        name: 'Gmail',
        nameTh: 'ระบบอีเมลองค์กร Gmail',
        category: 'it',
        description: 'Corporate email and contact directory.',
        descriptionTh: 'กล่องจดหมายอีเมลองค์กร',
        iconName: 'Mail',
        badge: 'Email',
        url: 'https://mail.google.com',
        allowedRoles: ['ADMIN', 'IT', 'ACCOUNTING', 'HR'],
        status: 'online',
        launchType: 'web',
        isFrequent: true
      } as EnterpriseApp
    },
    {
      id: 'app-router-config',
      name: 'Router',
      category: 'IT / เครือข่าย',
      icon: <RouterIcon className="w-10 h-10" />,
      app: apps.find(a => a.id === 'app-router-config') || {
        id: 'app-router-config',
        name: 'Core Router & Gateway',
        nameTh: 'ระบบจัดการ Router & Firewall',
        category: 'it',
        description: 'Network gateway and routing console.',
        descriptionTh: 'ระบบจัดการเครือข่ายและเกตเวย์องค์กร',
        iconName: 'Network',
        badge: 'Network',
        url: 'https://router.qisheng.local',
        allowedRoles: ['ADMIN', 'IT'],
        status: 'online',
        launchType: 'web',
        isFrequent: true
      } as EnterpriseApp
    }
  ];

  // System Categories matching image.png (8 categories)
  const systemCategories = [
    {
      id: 'accounting',
      title: 'การบัญชี',
      subTitle: 'Accounting',
      count: '12 แอปพลิเคชัน',
      icon: Calculator,
      bgColor: 'bg-blue-600',
    },
    {
      id: 'tax',
      title: 'ภาษี / Government',
      subTitle: 'Government',
      count: '8 แอปพลิเคชัน',
      icon: Landmark,
      bgColor: 'bg-emerald-600',
    },
    {
      id: 'hr',
      title: 'ทรัพยากรบุคคล',
      subTitle: 'HR',
      count: '7 แอปพลิเคชัน',
      icon: User,
      bgColor: 'bg-purple-600',
    },
    {
      id: 'infrastructure',
      title: 'IT & โครงสร้างพื้นฐาน',
      subTitle: 'IT & Infrastructure',
      count: '10 แอปพลิเคชัน',
      icon: Share2,
      bgColor: 'bg-teal-600',
    },
    {
      id: 'ai',
      title: 'AI & เครื่องมืออัจฉริยะ',
      subTitle: 'AI Tools',
      count: '5 แอปพลิเคชัน',
      customIcon: (
        <span className="font-extrabold text-sm tracking-tight text-white select-none">AI</span>
      ),
      bgColor: 'bg-indigo-600',
    },
    {
      id: 'documents',
      title: 'เอกสาร / ข้อมูลบริษัท',
      subTitle: 'Corporate Docs',
      count: '6 แอปพลิเคชัน',
      icon: FileText,
      bgColor: 'bg-amber-600',
    },
    {
      id: 'external',
      title: 'เว็บไซต์ภายนอก',
      subTitle: 'External Sites',
      count: '8 แอปพลิเคชัน',
      icon: Globe,
      bgColor: 'bg-blue-500',
    },
    {
      id: 'other',
      title: 'อื่นๆ',
      subTitle: 'Others',
      count: '4 แอปพลิเคชัน',
      icon: MoreHorizontal,
      bgColor: 'bg-slate-500',
    },
  ];

  // Recently Used Apps matching image.png
  const recentUsedApps = [
    {
      name: 'DataForge OCR',
      category: 'บัญชี / OCR',
      time: 'เมื่อ 1 ชั่วโมงที่แล้ว',
      icon: <DataForgeOcrIcon className="w-9 h-9" />,
      app: frequentAppCards[1].app
    },
    {
      name: 'Express',
      category: 'บัญชี / Express',
      time: 'เมื่อ 2 ชั่วโมงที่แล้ว',
      icon: <ExpressIcon className="w-9 h-9" />,
      app: frequentAppCards[0].app
    },
    {
      name: 'RD e-Filing',
      category: 'ภาษี / RD',
      time: 'เมื่อ 3 ชั่วโมงที่แล้ว',
      icon: <RdEfilingIcon className="w-9 h-9" />,
      app: frequentAppCards[2].app
    },
    {
      name: 'Google Drive',
      category: 'เครื่องมือ / Google',
      time: 'เมื่อ 3 ชั่วโมงที่แล้ว',
      icon: <GoogleDriveIcon className="w-9 h-9" />,
      app: frequentAppCards[3].app
    },
    {
      name: 'Gmail',
      category: 'อีเมล / Google',
      time: 'เมื่อ 4 ชั่วโมงที่แล้ว',
      icon: <GmailIcon className="w-9 h-9" />,
      app: frequentAppCards[4].app
    },
  ];

  // Latest Announcements matching image.png
  const latestAnnouncementItems = [
    {
      id: 'anno-01',
      tag: 'สำคัญ',
      tagColor: 'bg-rose-500 text-white',
      title: 'ระบบ RD e-Filing ปิดปรับปรุงชั่วคราว',
      desc: 'ในวันที่ 20 ก.ย. 2568 เวลา 22:00 - 23:00 น.',
      date: '18 ก.ย. 2568'
    },
    {
      id: 'anno-02',
      tag: 'แจ้งเตือน',
      tagColor: 'bg-amber-500 text-white',
      title: 'ขอความร่วมมือส่งเอกสารภายในวันที่ 25 ก.ย. 2568',
      desc: 'ฝ่ายบัญชีขอความร่วมมือในการส่งเอกสาร...',
      date: '17 ก.ย. 2568'
    },
    {
      id: 'anno-03',
      tag: 'ข่าวสาร',
      tagColor: 'bg-blue-500 text-white',
      title: 'บริษัทจะหยุดทำการในวันที่ 13 ตุลาคม 2568',
      desc: 'เนื่องในวันหยุดชดเชยวันนวมินทรมหาราช',
      date: '16 ก.ย. 2568'
    },
  ];

  // Right column: 5 Notifications matching image.png
  const rightNotifications = [
    {
      id: 'notif-1',
      title: 'ระบบ Router',
      desc: 'Internet กลับมาใช้งานได้ตามปกติแล้ว',
      time: 'เมื่อ 10 นาทีที่แล้ว',
      iconBg: 'bg-emerald-500 text-white',
      icon: RouterHardwareIcon
    },
    {
      id: 'notif-2',
      title: 'ประกาศจากบริษัท',
      desc: 'ประกาศวันหยุดเพิ่มเติม 13 ตุลาคม 2568',
      time: 'เมื่อ 1 ชั่วโมงที่แล้ว',
      iconBg: 'bg-amber-500 text-white',
      icon: Megaphone
    },
    {
      id: 'notif-3',
      title: 'DataForge OCR',
      desc: 'มีเวอร์ชันใหม่ พร้อมใช้งานแล้ว',
      time: 'เมื่อ 3 ชั่วโมงที่แล้ว',
      iconBg: 'bg-purple-600 text-white',
      icon: Sparkles
    },
    {
      id: 'notif-4',
      title: 'เอกสารรอตรวจสอบ',
      desc: 'มีเอกสารรอการตรวจสอบ 3 รายการ',
      time: 'เมื่อ 5 ชั่วโมงที่แล้ว',
      iconBg: 'bg-amber-600 text-white',
      icon: FileText
    },
    {
      id: 'notif-5',
      title: 'กิจกรรมในปฏิทิน',
      desc: 'ประชุมทีมประจำสัปดาห์ เวลา 10:00 น.',
      time: 'เมื่อ 6 ชั่วโมงที่แล้ว',
      iconBg: 'bg-blue-600 text-white',
      icon: CalendarIcon
    }
  ];

  // Right column: 4 Quick Actions matching image.png
  const quickActionsList = [
    {
      id: 'helpdesk',
      title: 'แจ้งปัญหา IT',
      sub: 'ติดต่อฝ่าย IT',
      icon: Headphones,
      iconBg: 'bg-blue-500 text-white',
      action: () => onOpenQuickAction('helpdesk')
    },
    {
      id: 'access',
      title: 'ขอเปิดใช้งานระบบ',
      sub: 'ยื่นคำร้องขอระบบใหม่',
      icon: PlusCircle,
      iconBg: 'bg-emerald-500 text-white',
      action: () => onOpenQuickAction('access')
    },
    {
      id: 'calendar',
      title: 'ปฏิทินองค์กร',
      sub: 'ดูตารางกิจกรรม',
      icon: CalendarIcon,
      iconBg: 'bg-purple-600 text-white',
      action: () => onNavigateTab('calendar')
    },
    {
      id: 'admin_contact',
      title: 'ติดต่อผู้ดูแลระบบ',
      sub: 'เบอร์โทรศัพท์ / อีเมล',
      icon: Users,
      iconBg: 'bg-indigo-600 text-white',
      action: () => onOpenQuickAction('helpdesk')
    }
  ];

  // Right column: 4 System Status rows matching image.png
  const systemStatusRows = [
    {
      id: 'net-3bb',
      title: 'Internet (3BB)',
      statusText: 'ปกติ',
      statusColor: 'text-emerald-600',
      icon: Globe
    },
    {
      id: 'net-ais',
      title: 'Internet (AIS)',
      statusText: 'พร้อมใช้งาน (สำรอง)',
      statusColor: 'text-emerald-600',
      icon: Wifi
    },
    {
      id: 'router',
      title: 'Router',
      statusText: 'ปกติ',
      statusColor: 'text-emerald-600',
      icon: RouterHardwareIcon
    },
    {
      id: 'internal',
      title: 'ระบบภายใน',
      statusText: 'ปกติ',
      statusColor: 'text-emerald-600',
      icon: Laptop
    }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6 items-start animate-in fade-in">
      {/* ========================================================
          LEFT COLUMN (~68% width on desktop, col-span-8)
          ======================================================== */}
      <div className="xl:col-span-8 space-y-6">
        {/* 1. Hero Greeting Banner matching image.png */}
        <HeroGreetingBanner currentUser={currentUser} language={language} />

        {/* 2. แอปที่ใช้บ่อย (Frequently Used Apps) matching image.png */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                {language === 'TH' ? 'แอปที่ใช้บ่อย' : 'Frequently Used Apps'}
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('all-apps')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
            >
              <span>{language === 'TH' ? 'ดูทั้งหมด' : 'View All'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* 6 Grid Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            {frequentAppCards.map((item) => {
              const isFav = favorites.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item?.app) {
                      onLaunchApp(item.app);
                    }
                  }}
                  className="relative rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400/80 hover:shadow-md transition-all p-4 flex flex-col items-center text-center cursor-pointer group shadow-xs"
                >
                  {/* Star Top-Right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                    }}
                    className="absolute top-2.5 right-2.5 p-1 text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    <Star className={`w-3.5 h-3.5 ${isFav ? 'text-amber-400 fill-amber-400' : 'fill-amber-400 text-amber-400'}`} />
                  </button>

                  {/* App Icon */}
                  <div className="my-1 group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>

                  {/* App Title & Category */}
                  <div className="mt-2 w-full">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate font-normal">
                      {item.category}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. หมวดหมู่ระบบ (System Categories) matching image.png */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                {language === 'TH' ? 'หมวดหมู่ระบบ' : 'System Categories'}
              </h2>
            </div>
          </div>

          {/* 8 Category Cards (4x2 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {systemCategories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onNavigateTab('all-apps');
                  }}
                  className="rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition-all p-3.5 flex items-center justify-between cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Category Icon Box */}
                    <div className={`w-10 h-10 rounded-xl ${cat.bgColor} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                      {cat.customIcon ? (
                        cat.customIcon
                      ) : (
                        IconComp && <IconComp className="w-5 h-5 text-white" />
                      )}
                    </div>

                    {/* Category Texts */}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {cat.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {cat.subTitle}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Bottom Two-Column Row: ระบบที่ใช้ล่าสุด + ประกาศล่าสุด matching image.png */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A: ระบบที่ใช้ล่าสุด (Recently Used Systems) */}
          <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900">
                  {language === 'TH' ? 'ระบบที่ใช้ล่าสุด' : 'Recently Used'}
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('all-apps')}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
              >
                <span>{language === 'TH' ? 'ดูทั้งหมด' : 'View All'}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* 5 Apps Horizontal Strip */}
            <div className="grid grid-cols-5 gap-1.5 pt-3">
              {recentUsedApps.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onLaunchApp(item.app)}
                  className="flex flex-col items-center text-center p-1.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <div className="group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <div className="mt-1.5 w-full">
                    <div className="text-[11px] font-bold text-slate-900 truncate">
                      {item.name}
                    </div>
                    <div className="text-[9px] text-slate-400 truncate">
                      {item.category}
                    </div>
                  </div>
                  <div className="mt-2 text-[8px] text-slate-400 flex items-center gap-0.5 whitespace-nowrap">
                    <Clock className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card B: ประกาศล่าสุด (Latest Announcements) */}
          <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900">
                  {language === 'TH' ? 'ประกาศล่าสุด' : 'Latest Announcements'}
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('announcements')}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
              >
                <span>{language === 'TH' ? 'ดูทั้งหมด' : 'View All'}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* List of 3 Announcement Rows */}
            <div className="divide-y divide-slate-100">
              {latestAnnouncementItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    const found = announcements.find(a => a.id === item.id) || announcements[0];
                    onSelectAnnouncement(found);
                  }}
                  className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-1 rounded-xl cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${item.tagColor}`}>
                      {item.tag}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono shrink-0">
                    <span>{item.date}</span>
                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          RIGHT COLUMN (~32% width on desktop, col-span-4)
          ======================================================== */}
      <div className="xl:col-span-4 space-y-5">
        {/* Widget 1: การแจ้งเตือน (Notifications) matching image.png */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900">
                {language === 'TH' ? 'การแจ้งเตือน' : 'Notifications'}
              </h3>
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center">
                5
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('announcements')}
              className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
            >
              <span>{language === 'TH' ? 'ดูทั้งหมด' : 'View All'}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* 5 Notification rows */}
          <div className="space-y-2.5">
            {rightNotifications.map((notif) => {
              const IconComponent = notif.icon;
              return (
                <div
                  key={notif.id}
                  className="flex items-start gap-3 p-1.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <div className={`w-8 h-8 rounded-full ${notif.iconBg} flex items-center justify-center shrink-0 shadow-xs mt-0.5`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {notif.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {notif.desc}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block font-normal">
                      {notif.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Widget 2: Quick Actions matching image.png */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-4 space-y-2.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Zap className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900">
              Quick Actions
            </h3>
          </div>

          <div className="space-y-2">
            {quickActionsList.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.sub}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Widget 3: สถานะระบบ (System Status) matching image.png */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-4 space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900">
                {language === 'TH' ? 'สถานะระบบ' : 'System Status'}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{language === 'TH' ? 'ออนไลน์' : 'Online'}</span>
            </div>
          </div>

          <div className="space-y-1">
            {systemStatusRows.map((row) => {
              const IconComp = row.icon;
              return (
                <div
                  key={row.id}
                  onClick={onOpenSystemStatus}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors text-xs group"
                >
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <IconComp className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-medium text-xs">{row.title}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className={`text-[11px] font-semibold ${row.statusColor}`}>
                      {row.statusText}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
