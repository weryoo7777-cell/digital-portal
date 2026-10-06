import React, { useState, useEffect, useMemo } from 'react';
import { 
  CORPORATE_USERS, 
  ENTERPRISE_APPS, 
  CORPORATE_ANNOUNCEMENTS, 
  INITIAL_HELPDESK_TICKETS,
  INITIAL_ROOM_BOOKINGS 
} from './data/portalData';
import { 
  UserProfile, 
  EnterpriseApp, 
  AppCategory, 
  ClientMachineInfo, 
  HelpdeskTicket, 
  CorporateAnnouncement,
  RoomBooking 
} from './types';
import { detectClientMachineInfo } from './utils/clientMachineDetector';

import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { HeroClientInfo } from './components/HeroClientInfo';
import { AppCard } from './components/AppCard';
import { AppLaunchModal } from './components/AppLaunchModal';
import { QuickActionsModal } from './components/QuickActionsModal';
import { SystemStatusDrawer } from './components/SystemStatusDrawer';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { CalendarView } from './components/CalendarView';
import { ExternalPortalsView } from './components/ExternalPortalsView';
import { GoogleSearchModal } from './components/GoogleSearchModal';
import { GoogleTranslateModal } from './components/GoogleTranslateModal';
import { LoginModal } from './components/LoginModal';
import { AvatarModal, PasswordResetModal } from './components/ProfileModals';
import { EXTERNAL_PORTALS } from './data/externalPortalsData';

import { 
  Clock, 
  Grid, 
  ArrowUpRight, 
  Bell, 
  CheckCircle2,
  Calendar as CalendarIcon,
  Landmark,
  Languages,
  Search,
  ExternalLink,
  ShieldCheck,
  Headphones,
  KeyRound,
  PhoneCall,
  Activity,
  Layers,
  Sparkles,
  ChevronRight,
  Calculator,
  ReceiptText,
  Users,
  HardDrive,
  Mail,
  Network,
  BookOpen,
  Globe2,
  Filter,
  Check,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw
} from 'lucide-react';

export default function App() {
  // Authentication & Profile state (Default to Paramed Cherdchoo - IT Support)
  const [currentUser, setCurrentUser] = useState<UserProfile>(CORPORATE_USERS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Layout & Navigation state
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<'TH' | 'EN'>('TH');

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AppCategory>('all');
  const [allAppsFilterDropdownOpen, setAllAppsFilterDropdownOpen] = useState(false);

  // Client Machine Info
  const [machineInfo, setMachineInfo] = useState<ClientMachineInfo | null>(null);
  const [isDetectingMachine, setIsDetectingMachine] = useState(false);

  // Favorites (Stored in localStorage)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('qs_favorites');
      return stored ? JSON.parse(stored) : ['app-express-accounting', 'app-dataforge-ocr', 'app-rd-efiling', 'app-google-drive', 'app-corporate-mail', 'app-router-config'];
    } catch {
      return ['app-express-accounting', 'app-dataforge-ocr', 'app-rd-efiling', 'app-google-drive', 'app-corporate-mail', 'app-router-config'];
    }
  });

  // Modals & Drawers
  const [selectedAppForLaunch, setSelectedAppForLaunch] = useState<EnterpriseApp | null>(null);
  const [quickActionModal, setQuickActionModal] = useState<{
    isOpen: boolean;
    type: 'helpdesk' | 'sspr' | 'access';
  }>({ isOpen: false, type: 'helpdesk' });
  const [systemStatusOpen, setSystemStatusOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<CorporateAnnouncement | null>(null);
  const [googleSearchModalOpen, setGoogleSearchModalOpen] = useState(false);
  const [googleSearchInitialQuery, setGoogleSearchInitialQuery] = useState('');
  const [googleTranslateModalOpen, setGoogleTranslateModalOpen] = useState(false);

  // Profile Settings Modals & Theme Mode (User Request #3)
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [passwordResetModalOpen, setPasswordResetModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('qs_theme') === 'dark';
    } catch {
      return false;
    }
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('qs_theme', next ? 'dark' : 'light');
      } catch {}
      return next;
    });
  };

  // Synchronize dark class to documentElement (html) and body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSaveAvatar = (newAvatarUrl: string) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, avatar: newAvatarUrl };
      try {
        localStorage.setItem(`qs_avatar_${prev.id}`, newAvatarUrl);
      } catch {}
      return updated;
    });
  };

  // Restore custom avatar if stored in localStorage
  useEffect(() => {
    try {
      const storedAvatar = localStorage.getItem(`qs_avatar_${currentUser.id}`);
      if (storedAvatar && storedAvatar !== currentUser.avatar) {
        setCurrentUser(prev => ({ ...prev, avatar: storedAvatar }));
      }
    } catch {}
  }, [currentUser.id]);

  // Interactive Collections
  const [tickets, setTickets] = useState<HelpdeskTicket[]>(INITIAL_HELPDESK_TICKETS);
  const [roomBookings] = useState<RoomBooking[]>(INITIAL_ROOM_BOOKINGS);
  const [announcements, setAnnouncements] = useState<CorporateAnnouncement[]>(CORPORATE_ANNOUNCEMENTS);

  // Announcements read tracking
  const [readAnnouncementIds, setReadAnnouncementIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('qs_read_announcements');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const unreadAnnouncementsCount = announcements.filter(a => !readAnnouncementIds.includes(a.id)).length;

  const handleMarkAnnouncementAsRead = (id: string) => {
    setReadAnnouncementIds(prev => {
      if (!prev.includes(id)) {
        const next = [...prev, id];
        try {
          localStorage.setItem('qs_read_announcements', JSON.stringify(next));
        } catch {}
        return next;
      }
      return prev;
    });
  };

  const handleMarkAllAnnouncementsAsRead = () => {
    const allIds = announcements.map(a => a.id);
    setReadAnnouncementIds(allIds);
    try {
      localStorage.setItem('qs_read_announcements', JSON.stringify(allIds));
    } catch {}
  };

  // High-Priority Notifications Alert Feed for Right Sidebar
  const highPriorityAlerts = [
    {
      id: 'al-1',
      title: 'Router & Core Network Restored',
      titleTh: 'สลับเราเตอร์สำรองและระบบเครือข่ายกลับสู่ปกติ',
      time: '10m ago',
      type: 'resolved',
      badge: 'Urgent Resolved',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'al-2',
      title: 'October 2026 Company Holidays Released',
      titleTh: 'ประกาศวันหยุดราชการประจำเดือนตุลาคม 2026',
      time: '2h ago',
      type: 'notice',
      badge: 'Notice',
      badgeColor: 'bg-blue-50 text-[#1E60D5] border-blue-200'
    },
    {
      id: 'al-3',
      title: 'DataForge OCR Engine v3.2 Updated',
      titleTh: 'อัปเดตโมเดลอ่านบิลและใบเสร็จภาษีอัตโนมัติ',
      time: '1d ago',
      type: 'update',
      badge: 'System Update',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  // Recently accessed apps with relative timestamps for 2-column recent updates
  const recentAccessLog = [
    { appName: 'Express Accounting', appTh: 'ระบบบัญชี Express', time: '10m ago', icon: Calculator, color: 'text-[#1E60D5] bg-blue-50' },
    { appName: 'DataForge OCR', appTh: 'ระบบสแกนเอกสารบิล AI', time: '35m ago', icon: Layers, color: 'text-purple-600 bg-purple-50' },
    { appName: 'RD e-Filing (สรรพากร)', appTh: 'ยื่นแบบภาษีออนไลน์', time: '2h ago', icon: ReceiptText, color: 'text-emerald-600 bg-emerald-50' },
    { appName: 'Google Drive Workspace', appTh: 'เอกสารส่วนกลางองค์กร', time: '4h ago', icon: HardDrive, color: 'text-amber-600 bg-amber-50' },
    { appName: 'Qisheng Router & Firewall', appTh: 'เราเตอร์ & ระบบไฟร์วอลล์', time: 'Yesterday', icon: Network, color: 'text-indigo-600 bg-indigo-50' }
  ];

  // Trigger Machine Info Detection when user changes
  const runMachineDetection = async (user: UserProfile) => {
    setIsDetectingMachine(true);
    try {
      const info = await detectClientMachineInfo(user);
      setMachineInfo(info);
    } catch (e) {
      console.error('Failed to detect machine info', e);
    } finally {
      setIsDetectingMachine(false);
    }
  };

  useEffect(() => {
    runMachineDetection(currentUser);
  }, [currentUser]);

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

  // Filter apps based on role, category, and search query
  const filteredApps = useMemo(() => {
    return ENTERPRISE_APPS.filter((app) => {
      const matchesSearch = 
        searchQuery === '' ||
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.nameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.descriptionTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Frequently used & Favorites combined for Section 2 (Top 6 apps)
  const frequentAndFavoriteApps = useMemo(() => {
    const list: EnterpriseApp[] = [];
    const seen = new Set<string>();

    // 1. Favorites first
    ENTERPRISE_APPS.forEach(app => {
      if (favorites.includes(app.id) && !seen.has(app.id)) {
        seen.add(app.id);
        list.push(app);
      }
    });

    // 2. Then frequent apps
    ENTERPRISE_APPS.forEach(app => {
      if (app.isFrequent && !seen.has(app.id)) {
        seen.add(app.id);
        list.push(app);
      }
    });

    return list.slice(0, 6);
  }, [favorites]);

  // Home Page Filter State (User Request: เพิ่มปุ่มกรองลงไปแทนที่จะให้มันโชว์ทั้งหมด)
  type HomeFilterType = 'all' | 'favorites' | 'accounting' | 'tax' | 'it' | 'operations' | 'productivity';
  const [homeFilter, setHomeFilter] = useState<HomeFilterType>('all');
  const [homeFilterOpen, setHomeFilterOpen] = useState(false);

  const homeFilterOptions: { id: HomeFilterType; labelTh: string; labelEn: string; count?: number }[] = [
    { id: 'all', labelTh: 'ทั้งหมด (ใช้บ่อย)', labelEn: 'All (Frequent)' },
    { id: 'favorites', labelTh: '⭐ รายการโปรด', labelEn: 'Favorites', count: favorites.length },
    { id: 'accounting', labelTh: 'การบัญชี', labelEn: 'Accounting', count: ENTERPRISE_APPS.filter(a => a.category === 'accounting').length },
    { id: 'tax', labelTh: 'ภาษี & ราชการ', labelEn: 'Tax / Gov', count: ENTERPRISE_APPS.filter(a => a.category === 'tax').length },
    { id: 'it', labelTh: 'โครงสร้างไอที', labelEn: 'IT Infra', count: ENTERPRISE_APPS.filter(a => a.category === 'it').length },
    { id: 'operations', labelTh: 'ปฏิบัติการ & AI', labelEn: 'Operations & AI', count: ENTERPRISE_APPS.filter(a => a.category === 'operations').length },
    { id: 'productivity', labelTh: 'เครื่องมือสำนักงาน', labelEn: 'Workspace', count: ENTERPRISE_APPS.filter(a => a.category === 'productivity').length },
  ];

  const displayedHomeApps = useMemo(() => {
    if (homeFilter === 'favorites') {
      return ENTERPRISE_APPS.filter(app => favorites.includes(app.id));
    }
    if (homeFilter === 'all') {
      return frequentAndFavoriteApps;
    }
    return ENTERPRISE_APPS.filter(app => app.category === homeFilter);
  }, [homeFilter, favorites, frequentAndFavoriteApps]);

  // 2x4 System Categories specification
  const categoryGridItems = [
    {
      id: 'accounting' as const,
      nameTh: 'การบัญชี',
      nameEn: 'Accounting',
      descTh: 'Express, GL, AP/AR, DataForge',
      icon: Calculator,
      badgeStyle: 'bg-blue-50 text-[#1E60D5] border-blue-200 group-hover:bg-[#1E60D5] group-hover:text-white',
      count: ENTERPRISE_APPS.filter(a => a.category === 'accounting').length,
      onClick: () => { setSelectedCategory('accounting'); setCurrentTab('all-apps'); }
    },
    {
      id: 'tax' as const,
      nameTh: 'ภาษี & ภาครัฐ',
      nameEn: 'Tax / Gov',
      descTh: 'RD e-Filing, e-Tax, สรรพากร',
      icon: ReceiptText,
      badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white',
      count: ENTERPRISE_APPS.filter(a => a.category === 'tax').length,
      onClick: () => { setSelectedCategory('tax'); setCurrentTab('all-apps'); }
    },
    {
      id: 'hr' as const,
      nameTh: 'ทรัพยากรบุคคล',
      nameEn: 'HR',
      descTh: 'HRMS, บันทึกเวลา, ลางาน',
      icon: Users,
      badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200 group-hover:bg-amber-600 group-hover:text-white',
      count: ENTERPRISE_APPS.filter(a => a.category === 'hr').length,
      onClick: () => { setSelectedCategory('hr'); setCurrentTab('all-apps'); }
    },
    {
      id: 'it' as const,
      nameTh: 'โครงสร้างพื้นฐานไอที',
      nameEn: 'IT Infrastructure',
      descTh: 'Router, Firewall, WireGuard VPN',
      icon: Network,
      badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200 group-hover:bg-purple-600 group-hover:text-white',
      count: ENTERPRISE_APPS.filter(a => a.category === 'it').length,
      onClick: () => { setSelectedCategory('it'); setCurrentTab('all-apps'); }
    },
    {
      id: 'ai-tools' as const,
      nameTh: 'เครื่องมือ AI',
      nameEn: 'AI Tools',
      descTh: 'DataForge OCR, Smart Extraction',
      icon: Sparkles,
      badgeStyle: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 group-hover:bg-fuchsia-600 group-hover:text-white',
      count: ENTERPRISE_APPS.filter(a => a.badge === 'AI Powered' || a.id.includes('ocr')).length,
      onClick: () => { setSearchQuery('OCR'); setSelectedCategory('all'); setCurrentTab('all-apps'); }
    },
    {
      id: 'documents' as const,
      nameTh: 'เอกสารภายใน',
      nameEn: 'Internal Docs',
      descTh: 'Knowledge Base, Policy & Guides',
      icon: BookOpen,
      badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white',
      count: 4,
      onClick: () => { setCurrentTab('documents'); }
    },
    {
      id: 'external' as const,
      nameTh: 'เว็บไซต์ภายนอก',
      nameEn: 'External Sites',
      descTh: '16 พอร์ทัลราชการ & สถาบันการเงิน',
      icon: Globe2,
      badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200 group-hover:bg-rose-600 group-hover:text-white',
      count: EXTERNAL_PORTALS.length,
      onClick: () => { setCurrentTab('external-portals'); }
    },
    {
      id: 'others' as const,
      nameTh: 'ระบบอื่นๆ',
      nameEn: 'Others',
      descTh: 'ERP Central, WMS & All Systems',
      icon: Grid,
      badgeStyle: 'bg-slate-100 text-slate-800 border-slate-300 group-hover:bg-slate-900 group-hover:text-white',
      count: ENTERPRISE_APPS.length,
      onClick: () => { setSelectedCategory('all'); setSearchQuery(''); setCurrentTab('all-apps'); }
    }
  ];

  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard': return language === 'TH' ? 'หน้าหลัก' : 'Home';
      case 'all-apps': return language === 'TH' ? 'แอปพลิเคชันทั้งหมด' : 'All Applications';
      case 'external-portals': return language === 'TH' ? 'ระบบราชการ & ธนาคาร (External Portals)' : 'External Corporate Portals';
      case 'announcements': return language === 'TH' ? 'ข่าวสาร & ประกาศ' : 'Announcements';
      case 'calendar': return language === 'TH' ? 'ปฏิทินบริษัท' : 'Company Calendar';
      case 'documents': return language === 'TH' ? 'เอกสาร & คู่มือการใช้งาน (Documents & Manuals)' : 'Documents & Manuals';
      default: return 'QISHENG Digital Portal';
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#0B0F19] text-slate-100' : 'bg-[#F4F6F9] text-slate-900'} flex font-sans antialiased transition-colors duration-200`}>
      {/* 1. Left Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        unreadAnnouncementsCount={unreadAnnouncementsCount}
        onOpenQuickAction={(action) => setQuickActionModal({ isOpen: true, type: action })}
        onOpenSystemStatus={() => setSystemStatusOpen(true)}
        onOpenGoogleSearch={() => {
          setGoogleSearchInitialQuery(searchQuery);
          setGoogleSearchModalOpen(true);
        }}
        onOpenGoogleTranslate={() => setGoogleTranslateModalOpen(true)}
        language={language}
        onToggleLanguage={() => setLanguage(l => l === 'TH' ? 'EN' : 'TH')}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* 2. Top App Bar */}
        <Header
          currentUser={currentUser}
          machineInfo={machineInfo}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenSystemStatus={() => setSystemStatusOpen(true)}
          onOpenGoogleSearch={() => {
            setGoogleSearchInitialQuery(searchQuery);
            setGoogleSearchModalOpen(true);
          }}
          onOpenGoogleTranslate={() => setGoogleTranslateModalOpen(true)}
          onOpenAvatarModal={() => setAvatarModalOpen(true)}
          onSaveAvatar={handleSaveAvatar}
          onOpenPasswordResetModal={() => setPasswordResetModalOpen(true)}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          announcements={announcements}
          unreadAnnouncementsCount={unreadAnnouncementsCount}
          onOpenAnnouncements={() => setCurrentTab('announcements')}
          onLogout={() => setIsLoggedIn(false)}
          language={language}
          onToggleLanguage={() => setLanguage(l => l === 'TH' ? 'EN' : 'TH')}
          currentTabName={getTabTitle()}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {/* Real-time Search Filter Results Banner */}
          {searchQuery && (
            <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 shadow-xs flex items-center justify-between">
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {language === 'TH' ? 'ผลการค้นหาสำหรับ:' : 'Search results for:'}{' '}
                <span className="font-mono text-[#1E60D5] dark:text-blue-400 font-bold">"{searchQuery}"</span>{' '}
                <span className="text-slate-400 dark:text-slate-500">({filteredApps.length} {language === 'TH' ? 'ระบบ' : 'apps'})</span>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#1E60D5] dark:text-blue-400 hover:underline font-semibold"
              >
                {language === 'TH' ? 'ล้างการค้นหา' : 'Clear Search'}
              </button>
            </div>
          )}

          {/* 3. HOME VIEW: CLEAN MODERN ENTERPRISE DASHBOARD */}
          {currentTab === 'dashboard' && (
            <div className="space-y-7 max-w-7xl mx-auto">
              {/* 1) Clean Welcome Banner */}
              <HeroClientInfo
                currentUser={currentUser}
                language={language}
              />

              {/* 2) Frequently Used Apps (Clean Section without Filter or View-All buttons) */}
              <section className="space-y-3.5">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-400 flex items-center justify-center font-bold">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {language === 'TH' ? 'ระบบที่ใช้บ่อย & รายการโปรด' : 'Frequently Used Applications'}
                  </h2>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                    ({frequentAndFavoriteApps.length} {language === 'TH' ? 'ระบบ' : 'apps'})
                  </span>
                </div>

                {frequentAndFavoriteApps.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {frequentAndFavoriteApps.map((app) => (
                      <AppCard
                        key={app.id}
                        app={app}
                        currentUserRole={currentUser.role}
                        isFavorite={favorites.includes(app.id)}
                        onToggleFavorite={toggleFavorite}
                        onLaunchApp={setSelectedAppForLaunch}
                        language={language}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {language === 'TH' ? 'ไม่มีระบบที่บันทึกไว้ในขณะนี้' : 'No applications in list.'}
                    </p>
                  </div>
                )}
              </section>

                {/* 3) System Categories (2x4 Category Grid) */}
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
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      2x4 Category Matrix
                    </span>
                  </div>

                  {/* 2x4 Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {categoryGridItems.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <div
                          key={cat.id}
                          onClick={cat.onClick}
                          className="group p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md dark:hover:shadow-slate-950/50 cursor-pointer transition-all flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-colors ${cat.badgeStyle}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-transparent dark:border-slate-700">
                              {cat.count}
                            </span>
                          </div>

                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#1E60D5] dark:group-hover:text-blue-400 transition-colors truncate">
                              {language === 'TH' ? cat.nameTh : cat.nameEn}
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-400 truncate mt-0.5">
                              {cat.descTh}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* 4) Recent Activity / Updates (Two Columns) */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column: Recently Accessed Apps */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#1E60D5] dark:text-blue-400" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {language === 'TH' ? 'ประวัติการเข้าใช้งานล่าสุด' : 'Recent App Activity'}
                        </h3>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">Live Log</span>
                    </div>

                    <div className="space-y-2.5">
                      {recentAccessLog.map((log, idx) => {
                        const Icon = log.icon;
                        return (
                          <div 
                            key={idx} 
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${log.color}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                  {language === 'TH' ? log.appTh : log.appName}
                                </div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500">
                                  {log.appName}
                                </div>
                              </div>
                            </div>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono shrink-0">
                              {log.time}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Important Announcements with Status Badges */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {language === 'TH' ? 'ประกาศสำคัญขององค์กร' : 'Company Announcements'}
                        </h3>
                      </div>
                      <button
                        onClick={() => setCurrentTab('announcements')}
                        className="text-xs text-[#1E60D5] dark:text-blue-400 hover:underline font-semibold"
                      >
                        {language === 'TH' ? 'ดูทั้งหมด' : 'View All'}
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {announcements.slice(0, 3).map((ann) => (
                        <div
                          key={ann.id}
                          onClick={() => setSelectedAnnouncement(ann)}
                          className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800/70 hover:bg-blue-50/30 dark:hover:bg-slate-800/50 cursor-pointer transition-all group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                              ann.priority === 'urgent'
                                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
                                : ann.tag === 'Tax Deadline'
                                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                                : 'bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300 border-blue-200 dark:border-blue-800/60'
                            }`}>
                              {ann.priority === 'urgent' ? 'Urgent' : ann.tag === 'Tax Deadline' ? 'Notice' : 'News'}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{ann.date}</span>
                          </div>

                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#1E60D5] dark:group-hover:text-blue-400 line-clamp-1">
                            {language === 'TH' ? ann.title : ann.titleEn}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {ann.summary}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
            </div>
          )}

          {/* ALL APPS VIEW */}
          {currentTab === 'all-apps' && (() => {
            const allAppsCategories = [
              { id: 'all' as AppCategory, labelTh: 'ทั้งหมด', labelEn: 'All Apps', count: ENTERPRISE_APPS.length },
              { id: 'accounting' as AppCategory, labelTh: 'การบัญชี', labelEn: 'Accounting', count: ENTERPRISE_APPS.filter(a => a.category === 'accounting').length },
              { id: 'tax' as AppCategory, labelTh: 'ภาษี & ราชการ', labelEn: 'Tax / Gov', count: ENTERPRISE_APPS.filter(a => a.category === 'tax').length },
              { id: 'hr' as AppCategory, labelTh: 'ทรัพยากรบุคคล', labelEn: 'HR', count: ENTERPRISE_APPS.filter(a => a.category === 'hr').length },
              { id: 'it' as AppCategory, labelTh: 'โครงสร้างไอที', labelEn: 'IT Infra', count: ENTERPRISE_APPS.filter(a => a.category === 'it').length },
              { id: 'operations' as AppCategory, labelTh: 'ปฏิบัติการ & ERP', labelEn: 'Operations', count: ENTERPRISE_APPS.filter(a => a.category === 'operations').length },
              { id: 'productivity' as AppCategory, labelTh: 'เครื่องมือสำนักงาน', labelEn: 'Workspace', count: ENTERPRISE_APPS.filter(a => a.category === 'productivity').length },
            ];

            return (
              <div className="space-y-6 animate-in fade-in">
                {/* Filter and Search Bar: Only Filter Button and ทั้งหมด */}
                <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 relative ${allAppsFilterDropdownOpen ? 'z-40' : 'z-20'}`}>
                  {/* Left: Icon-Only Filter Button & ทั้งหมด only (ไม่มีหัวข้ออื่น) */}
                  <div className="flex items-center gap-2">
                    {/* ปุ่มกรองมีแค่รูป (Icon-only Filter Button) with high z-index and click-outside backdrop */}
                    <div className="relative z-50">
                      <button
                        onClick={() => setAllAppsFilterDropdownOpen(!allAppsFilterDropdownOpen)}
                        className={`w-9 h-9 rounded-xl border transition-all shadow-2xs flex items-center justify-center shrink-0 relative ${
                          selectedCategory !== 'all'
                            ? 'bg-[#1E60D5] text-white border-[#1E60D5] shadow-xs'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                        title={
                          selectedCategory !== 'all'
                            ? `${language === 'TH' ? 'ตัวกรอง:' : 'Filter:'} ${allAppsCategories.find(c => c.id === selectedCategory)?.labelTh}`
                            : (language === 'TH' ? 'ตัวกรอง' : 'Filter')
                        }
                        aria-label="Filter"
                      >
                        <Filter className="w-4 h-4" />
                        {selectedCategory !== 'all' && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white dark:ring-slate-900" />
                        )}
                      </button>

                      {/* Click outside backdrop */}
                      {allAppsFilterDropdownOpen && (
                        <div 
                          className="fixed inset-0 z-[90]" 
                          onClick={() => setAllAppsFilterDropdownOpen(false)} 
                        />
                      )}

                      {/* Filter Dropdown Menu - rendered in front with high z-index */}
                      {allAppsFilterDropdownOpen && (
                        <div className="absolute left-0 top-full mt-2 z-[100] w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl dark:shadow-slate-950/80 p-2.5 animate-in fade-in zoom-in-95">
                          <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            {language === 'TH' ? 'เลือกหมวดหมู่ที่ต้องการกรอง' : 'Select Category to Filter'}
                          </div>
                          <div className="space-y-1 mt-1 max-h-80 overflow-y-auto">
                            {allAppsCategories.map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => {
                                  setSelectedCategory(cat.id);
                                  setAllAppsFilterDropdownOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
                                  selectedCategory === cat.id
                                    ? 'bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300'
                                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                              >
                                <span>{language === 'TH' ? cat.labelTh : cat.labelEn}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                                  selectedCategory === cat.id
                                    ? 'bg-[#1E60D5] text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                }`}>
                                  {cat.count}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ปุ่มแสดงชื่อหมวดหมู่ที่เลือก */}
                    {(() => {
                      const currentCatObj = allAppsCategories.find(c => c.id === selectedCategory) || allAppsCategories[0];
                      return (
                        <button
                          onClick={() => {
                            if (selectedCategory !== 'all') {
                              setSelectedCategory('all');
                            }
                          }}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 bg-[#1E60D5] text-white shadow-2xs"
                          title={selectedCategory !== 'all' ? (language === 'TH' ? 'คลิกเพื่อกลับไปแสดงทั้งหมด' : 'Click to reset to all') : undefined}
                        >
                          <span>{language === 'TH' ? currentCatObj.labelTh : currentCatObj.labelEn}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-blue-800 text-white">
                            {currentCatObj.count}
                          </span>
                        </button>
                      );
                    })()}
                  </div>

                  {/* Search input */}
                  <div className="relative min-w-[200px] sm:w-64 shrink-0">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={language === 'TH' ? 'ค้นหาระบบงานองค์กร...' : 'Filter apps...'}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#1E60D5] dark:focus:border-blue-500 transition-colors shadow-2xs"
                    />
                  </div>
                </div>

                {/* Grid of All Application Cards */}
                {filteredApps.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {filteredApps.map((app) => (
                      <AppCard
                        key={app.id}
                        app={app}
                        currentUserRole={currentUser.role}
                        isFavorite={favorites.includes(app.id)}
                        onToggleFavorite={toggleFavorite}
                        onLaunchApp={setSelectedAppForLaunch}
                        language={language}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2.5">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {language === 'TH' ? 'ไม่พบระบบงานที่ตรงกับตัวกรองที่เลือก' : 'No applications match the current filter.'}
                    </p>
                    <button
                      onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                      className="text-xs text-[#1E60D5] dark:text-blue-400 font-bold hover:underline"
                    >
                      {language === 'TH' ? 'ล้างตัวกรองเพื่อแสดงทั้งหมด' : 'Reset filter to show all'}
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* EXTERNAL PORTALS VIEW */}
          {currentTab === 'external-portals' && (
            <ExternalPortalsView
              language={language}
              onOpenGoogleSearchWithQuery={(q) => {
                setGoogleSearchInitialQuery(q);
                setGoogleSearchModalOpen(true);
              }}
            />
          )}

          {/* ANNOUNCEMENTS VIEW */}
          {currentTab === 'announcements' && (
            <AnnouncementsView
              announcements={announcements}
              language={language}
              readAnnouncementIds={readAnnouncementIds}
              onMarkAsRead={handleMarkAnnouncementAsRead}
              onMarkAllAsRead={handleMarkAllAnnouncementsAsRead}
              onAddWelcomeAnnouncement={() => setAnnouncements(CORPORATE_ANNOUNCEMENTS)}
            />
          )}

          {/* CALENDAR VIEW */}
          {currentTab === 'calendar' && (
            <CalendarView
              roomBookings={roomBookings}
              language={language}
            />
          )}

          {/* DOCUMENTS & MANUALS VIEW */}
          {currentTab === 'documents' && (
            <KnowledgeBaseView language={language} />
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

      {/* Quick Actions Modal (Helpdesk, SSPR, Access Request) */}
      <QuickActionsModal
        isOpen={quickActionModal.isOpen}
        initialType={quickActionModal.type}
        currentUser={currentUser}
        onClose={() => setQuickActionModal({ isOpen: false, type: 'helpdesk' })}
        onSubmitTicket={(newTicket) => {
          setTickets([newTicket, ...tickets]);
        }}
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

      {/* Login Modal */}
      <LoginModal
        isOpen={!isLoggedIn}
        onLoginSuccess={() => setIsLoggedIn(true)}
        language={language}
      />

      {/* User Profile Settings Modals (Avatar & Password Reset) */}
      <AvatarModal
        isOpen={avatarModalOpen}
        currentUser={currentUser}
        onClose={() => setAvatarModalOpen(false)}
        onSaveAvatar={handleSaveAvatar}
        language={language}
      />

      <PasswordResetModal
        isOpen={passwordResetModalOpen}
        currentUser={currentUser}
        onClose={() => setPasswordResetModalOpen(false)}
        language={language}
      />
    </div>
  );
}
