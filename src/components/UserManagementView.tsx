import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Search, 
  ShieldCheck, 
  Crown, 
  UserCheck, 
  Building2, 
  Mail, 
  IdCard, 
  Key, 
  Check, 
  X, 
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  FileSpreadsheet,
  Download,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, RoleLevel, isAdminUser } from '../types';
import { SOMCHAI_AVATAR } from '../data/portalData';

interface UserManagementViewProps {
  currentUser: UserProfile;
  users: UserProfile[];
  onAddUser: (user: UserProfile) => void;
  onUpdateUser: (user: UserProfile) => void;
  onDeleteUser: (userId: string) => void;
  language: 'TH' | 'EN';
}


const AVATAR_PRESETS = [
  SOMCHAI_AVATAR,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
];

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  currentUser,
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  language
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formShowPassword, setFormShowPassword] = useState(false);
  const [formName, setFormName] = useState('');
  const [formNameTh, setFormNameTh] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDepartment, setFormDepartment] = useState('');
  const [formDepartmentTh, setFormDepartmentTh] = useState('');
  const [formPosition, setFormPosition] = useState('');
  const [formEmployeeId, setFormEmployeeId] = useState('');
  const [formRole, setFormRole] = useState<RoleLevel>('user');
  const [formAvatar, setFormAvatar] = useState(AVATAR_PRESETS[0]);
  const [formError, setFormError] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // User Request 4.1: Reset local state on unmount
  useEffect(() => {
    return () => {
      setSearchQuery('');
      setRoleFilter('all');
      setIsModalOpen(false);
      setEditingUser(null);
      setDeleteConfirmId(null);
      setExportNotice(null);
    };
  }, []);

  // User Request 3.1: Export all user accounts to Excel (.csv with UTF-8 BOM)
  const handleExportUsers = () => {
    try {
      const headers = [
        'ลำดับ (No.)',
        'รหัสพนักงาน (Employee ID)',
        'ชื่อผู้ใช้งาน (Username)',
        'ชื่อ-สกุล (ภาษาไทย)',
        'Name (English)',
        'อีเมล (Email)',
        'สิทธิ์การใช้งาน (Role)',
        'ระดับสิทธิ์ (Role Level)',
        'แผนก (ภาษาไทย)',
        'Department (English)',
        'ตำแหน่ง (Position)',
        'สถานะการใช้งาน (Status)',
        'ระบบล็อกอิน (SSO Provider)',
        'คอมพิวเตอร์ประจำตัว (Workstation)',
        'VLAN ที่สังกัด',
        'IP Address',
        'วันที่สร้างบัญชี (Created At)'
      ];

      const escapeCsvCell = (val?: string | number | null) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      const rows = users.map((u, idx) => [
        escapeCsvCell(idx + 1),
        escapeCsvCell(u.employeeId || '-'),
        escapeCsvCell(u.username || '-'),
        escapeCsvCell(u.nameTh || u.name),
        escapeCsvCell(u.name),
        escapeCsvCell(u.email),
        escapeCsvCell(isAdminUser(u) ? 'ผู้ดูแลระบบ (Admin)' : 'ผู้ใช้ทั่วไป (User)'),
        escapeCsvCell(u.roleLevel || (isAdminUser(u) ? 'admin' : 'user')),
        escapeCsvCell(u.departmentTh || u.department),
        escapeCsvCell(u.department),
        escapeCsvCell(u.position || '-'),
        escapeCsvCell('Active (เปิดใช้งาน)'),
        escapeCsvCell(u.ssoProvider || 'DirectAuth'),
        escapeCsvCell(u.workstationHostname || '-'),
        escapeCsvCell(u.assignedVlan || '-'),
        escapeCsvCell(u.localIp || '-'),
        escapeCsvCell(u.createdAt || '-')
      ].join(','));

      // UTF-8 BOM (\uFEFF) ensures Excel opens Thai and English text without garbled characters
      const csvString = '\uFEFF' + [headers.map(h => `"${h}"`).join(','), ...rows].join('\r\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      const filename = `QISHENG_User_Accounts_${new Date().toISOString().slice(0, 10)}.csv`;

      downloadLink.setAttribute('href', url);
      downloadLink.setAttribute('download', filename);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);

      setExportNotice(language === 'TH' 
        ? `ส่งออกข้อมูลผู้ใช้ ${users.length} รายการเป็นไฟล์ Excel (.csv) สำเร็จ!` 
        : `Exported ${users.length} user accounts to Excel (.csv) successfully!`);
      setTimeout(() => setExportNotice(null), 4000);
    } catch (err) {
      console.error('Failed to export users to Excel:', err);
    }
  };

  const isAdmin = isAdminUser(currentUser);

  // Open modal for new user
  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormUsername('');
    setFormPassword('');
    setFormName('');
    setFormNameTh('');
    setFormEmail('');
    setFormDepartment('IT & Operations');
    setFormDepartmentTh('ฝ่ายปฏิบัติการและระบบงาน');
    setFormPosition('Staff Member');
    setFormEmployeeId(`QS-${Math.floor(10000 + Math.random() * 90000)}`);
    setFormRole('user');
    setFormAvatar(AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)]);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for editing user
  const handleOpenEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setFormUsername(user.username || '');
    setFormPassword(user.password || '');
    setFormName(user.name);
    setFormNameTh(user.nameTh);
    setFormEmail(user.email);
    setFormDepartment(user.department);
    setFormDepartmentTh(user.departmentTh);
    setFormPosition(user.position);
    setFormEmployeeId(user.employeeId);
    setFormRole(isAdminUser(user) ? 'admin' : 'user');
    setFormAvatar(user.avatar || AVATAR_PRESETS[0]);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFormError(null);

    const cleanUsername = formUsername.trim();
    const cleanName = formName.trim();
    const cleanEmail = formEmail.trim();

    if (!cleanUsername) {
      setFormError(language === 'TH' ? 'กรุณาระบุ Username' : 'Username is required');
      return;
    }

    if (!editingUser && !formPassword.trim()) {
      setFormError(language === 'TH' ? 'กรุณาระบุรหัสผ่าน (Password)' : 'Password is required');
      return;
    }

    if (!cleanName) {
      setFormError(language === 'TH' ? 'กรุณาระบุชื่อผู้ใช้งาน' : 'Name is required');
      return;
    }

    // Check duplicate username (except current editing user)
    const duplicate = users.find(u => 
      u.username?.toLowerCase() === cleanUsername.toLowerCase() && 
      u.id !== editingUser?.id
    );

    if (duplicate) {
      setFormError(language === 'TH' ? 'Username นี้ถูกใช้งานแล้ว' : 'Username already exists');
      return;
    }

    if (editingUser) {
      // Update existing
      const updated: UserProfile = {
        ...editingUser,
        username: cleanUsername,
        password: formPassword.trim() ? formPassword.trim() : editingUser.password,
        name: cleanName,
        nameTh: formNameTh.trim() || cleanName,
        email: cleanEmail || `${cleanUsername}@qisheng.co.th`,
        department: formDepartment.trim() || 'General Operations',
        departmentTh: formDepartmentTh.trim() || 'ฝ่ายปฏิบัติการทั่วไป',
        position: formPosition.trim() || 'Corporate Staff',
        employeeId: formEmployeeId.trim() || editingUser.employeeId,
        role: formRole,
        roleLevel: formRole,
        avatar: formAvatar,
      };
      onUpdateUser(updated);
    } else {
      // Create new
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        username: cleanUsername,
        password: formPassword.trim() || 'password123',
        name: cleanName,
        nameTh: formNameTh.trim() || cleanName,
        email: cleanEmail || `${cleanUsername}@qisheng.co.th`,
        department: formDepartment.trim() || 'General Operations',
        departmentTh: formDepartmentTh.trim() || 'ฝ่ายปฏิบัติการทั่วไป',
        position: formPosition.trim() || 'Corporate Staff',
        employeeId: formEmployeeId.trim() || `QS-${Math.floor(10000 + Math.random() * 90000)}`,
        role: formRole,
        roleLevel: formRole,
        avatar: formAvatar,
        workstationHostname: `QS-WS-${cleanUsername.toUpperCase()}`,
        assignedVlan: formRole === 'admin' ? 'VLAN 10 - Admin Subnet' : 'VLAN 30 - General Staff',
        localIp: `192.168.30.${Math.floor(10 + Math.random() * 200)}`,
        ssoProvider: 'DirectAuth',
        createdAt: new Date().toISOString().split('T')[0]
      };
      onAddUser(newUser);
    }

    setIsModalOpen(false);
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.nameTh.toLowerCase().includes(q) ||
        (user.username && user.username.toLowerCase().includes(q)) ||
        user.email.toLowerCase().includes(q) ||
        user.department.toLowerCase().includes(q) ||
        user.employeeId.toLowerCase().includes(q);

      const isUserAdmin = isAdminUser(user);
      const matchesRole = 
        roleFilter === 'all' ||
        (roleFilter === 'admin' && isUserAdmin) ||
        (roleFilter === 'user' && !isUserAdmin);

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // Metrics
  const adminCount = users.filter(u => isAdminUser(u)).length;
  const userCount = users.length - adminCount;
  const departmentsCount = new Set(users.map(u => u.department)).size;

  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto pb-12">
      {/* 1. Header Banner & Actions */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-[#1E60D5] to-indigo-600" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-[#1E60D5] dark:text-blue-400 shadow-2xs shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {language === 'TH' ? 'จัดการผู้ใช้งานระบบ (User Management)' : 'User Account Management'}
                </h1>
                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#1E60D5] dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'TH' 
                  ? 'สร้าง แก้ไข และกำหนดสิทธิ์การเข้าใช้งานระหว่าง Admin และ User' 
                  : 'Create, modify, and assign access control between Admin and User roles'}
              </p>
            </div>
          </div>

          {/* Action Buttons: Export to Excel & Add User */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportUsers}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-98 shrink-0 cursor-pointer"
              title={language === 'TH' ? 'ส่งออกข้อมูลผู้ใช้ทั้งหมดเป็นไฟล์ Excel (.csv)' : 'Export all user accounts to Excel (.csv)'}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{language === 'TH' ? 'Export ข้อมูลผู้ใช้' : 'Export to Excel'}</span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E60D5] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-98 shrink-0 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>{language === 'TH' ? '+ เพิ่มผู้ใช้ (Add User)' : '+ Add New User'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Export Notice Banner */}
      {exportNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportNotice}</span>
          </div>
          <button type="button" onClick={() => setExportNotice(null)} className="p-1 text-emerald-600 hover:text-emerald-800 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Statistical Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {language === 'TH' ? 'ผู้ใช้งานทั้งหมด' : 'Total Accounts'}
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-0.5">
              {users.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-[#1E60D5] dark:text-blue-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {language === 'TH' ? 'ผู้ดูแลระบบ (Admin)' : 'Admin Accounts'}
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono mt-0.5">
              {adminCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Crown className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {language === 'TH' ? 'ผู้ใช้ทั่วไป (User)' : 'Standard Users'}
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
              {userCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {language === 'TH' ? 'แผนกที่เปิดใช้งาน' : 'Active Depts'}
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-mono mt-0.5">
              {departmentsCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-3 rounded-2xl shadow-xs">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              roleFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-[#1E60D5] dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {language === 'TH' ? 'ทั้งหมด' : 'All Roles'} ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              roleFilter === 'admin'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Admin ({adminCount})</span>
          </button>
          <button
            onClick={() => setRoleFilter('user')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              roleFilter === 'user'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>User ({userCount})</span>
          </button>
        </div>

        <div className="relative min-w-[220px] sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'TH' ? 'ค้นหาชื่อ, username, แผนก...' : 'Search by name, username, dept...'}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E60D5] transition-all"
          />
        </div>
      </div>

      {/* 4. User Accounts Table / Grid */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase text-[11px] font-mono">
              <tr>
                <th className="py-3 px-4">{language === 'TH' ? 'ผู้ใช้งาน' : 'User Profile'}</th>
                <th className="py-3 px-4">{language === 'TH' ? 'ชื่อผู้ใช้ (Username)' : 'Username / ID'}</th>
                <th className="py-3 px-4">{language === 'TH' ? 'แผนกและตำแหน่ง' : 'Department & Title'}</th>
                <th className="py-3 px-3 text-center">{language === 'TH' ? 'บทบาท / สิทธิ์' : 'Role'}</th>
                <th className="py-3 px-4">{language === 'TH' ? 'รหัสผ่าน' : 'Password'}</th>
                {isAdmin && <th className="py-3 px-4 text-center">{language === 'TH' ? 'จัดการ' : 'Actions'}</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const isCurrentAdmin = isAdminUser(user);
                  const isSelf = user.id === currentUser?.id;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                      {/* User Profile */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                            <img 
                              src={user.avatar} 
                              alt={user.name} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {isSelf && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-[#1E60D5] dark:text-blue-300 font-mono font-bold">
                                  {language === 'TH' ? 'บัญชีของคุณ' : 'You'}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {user.nameTh}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Username & Email */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {user.username || '-'}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{user.email}</span>
                        </div>
                      </td>

                      {/* Department & Position */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {language === 'TH' ? user.departmentTh : user.department}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {user.position} &bull; <span className="font-mono">{user.employeeId}</span>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                          isCurrentAdmin
                            ? 'bg-blue-50 dark:bg-blue-950/70 text-[#1E60D5] dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                            : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        }`}>
                          {isCurrentAdmin ? <Crown className="w-3 h-3 text-blue-600 dark:text-blue-400" /> : <UserCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                          <span>{isCurrentAdmin ? 'admin' : 'user'}</span>
                        </span>
                      </td>

                      {/* Password Info */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {user.password ? (
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            {user.password}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">SSO Managed</span>
                        )}
                      </td>

                      {/* Actions (Edit / Delete) - Only for Admin */}
                      {isAdmin && (
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleOpenEditModal(user);
                              }}
                              className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#1E60D5] dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 transition-colors cursor-pointer"
                              title={language === 'TH' ? 'แก้ไขผู้ใช้' : 'Edit User'}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button (disabled for self) */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeleteConfirmId(user.id);
                              }}
                              disabled={isSelf}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                isSelf
                                  ? 'opacity-30 cursor-not-allowed bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                                  : 'bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/60'
                              }`}
                              title={isSelf ? (language === 'TH' ? 'ไม่สามารถลบบัญชีของตัวเองได้' : 'Cannot delete yourself') : (language === 'TH' ? 'ลบผู้ใช้' : 'Delete User')}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="font-semibold text-sm">
                      {language === 'TH' ? 'ไม่พบผู้ใช้งานตามคำค้นหา' : 'No user accounts match the search'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl text-slate-900 dark:text-white my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-[#1E60D5] dark:text-blue-400">
                  {editingUser ? <Edit3 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">
                    {editingUser 
                      ? (language === 'TH' ? 'แก้ไขข้อมูลผู้ใช้ (Edit User)' : 'Edit User Profile')
                      : (language === 'TH' ? 'เพิ่มผู้ใช้งานใหม่ (Add User)' : 'Create New User Account')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {language === 'TH' ? 'กำหนด Username, Password และสิทธิ์ (Admin / User)' : 'Set credentials and role permissions'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsModalOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4 mt-5">
              {/* Username & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'ชื่อผู้ใช้ (Username) *' : 'Username *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    placeholder="e.g. somchai"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E60D5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'รหัสผ่าน (Password) *' : 'Password *'}
                  </label>
                  <div className="relative">
                    <input
                      type={formShowPassword ? 'text' : 'password'}
                      required={!editingUser}
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      placeholder={editingUser ? 'เว้นว่างหากไม่เปลี่ยน' : '••••••••'}
                      className="w-full pl-3 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E60D5] font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setFormShowPassword(!formShowPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {formShowPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Role Level Selection: 'admin' vs 'user' */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'TH' ? 'ระดับสิทธิ์การใช้งาน (Role Level) *' : 'Role-Based Access Level *'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormRole('admin')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      formRole === 'admin'
                        ? 'bg-blue-50 dark:bg-blue-950/70 border-[#1E60D5] text-[#1E60D5] dark:text-blue-300 ring-2 ring-blue-300 dark:ring-blue-800'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-xs font-bold">Admin (ผู้ดูแลระบบ)</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">สิทธิ์เต็ม จัดการผู้ใช้ & แอป</div>
                      </div>
                    </div>
                    {formRole === 'admin' && <Check className="w-4 h-4 text-[#1E60D5]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormRole('user')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      formRole === 'user'
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-600 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-300 dark:ring-emerald-800'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="text-xs font-bold">User (ผู้ใช้งานทั่วไป)</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">เปิดแอปและใช้งานระบบ</div>
                      </div>
                    </div>
                    {formRole === 'user' && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                </div>
              </div>

              {/* Name (EN & TH) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'ชื่อ-นามสกุล (ภาษาอังกฤษ) *' : 'Full Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Somchai Prasert"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E60D5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'ชื่อ-นามสกุล (ภาษาไทย)' : 'Full Name (Thai)'}
                  </label>
                  <input
                    type="text"
                    value={formNameTh}
                    onChange={(e) => setFormNameTh(e.target.value)}
                    placeholder="e.g. สมชาย ประเสริฐ"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E60D5]"
                  />
                </div>
              </div>

              {/* Email & Employee ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'อีเมลองค์กร (Corporate Email)' : 'Email'}
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="somchai@qisheng.co.th"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E60D5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'รหัสพนักงาน (Employee ID)' : 'Employee ID'}
                  </label>
                  <input
                    type="text"
                    value={formEmployeeId}
                    onChange={(e) => setFormEmployeeId(e.target.value)}
                    placeholder="QS-01234"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E60D5] font-mono"
                  />
                </div>
              </div>

              {/* Department & Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'แผนก (Department)' : 'Department'}
                  </label>
                  <input
                    type="text"
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    placeholder="Accounting / IT / HR / Logistics"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E60D5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'TH' ? 'ตำแหน่ง (Position / Title)' : 'Position'}
                  </label>
                  <input
                    type="text"
                    value={formPosition}
                    onChange={(e) => setFormPosition(e.target.value)}
                    placeholder="Officer / Manager / Specialist"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E60D5]"
                  />
                </div>
              </div>

              {/* Avatar Presets Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'TH' ? 'เลือกรูปภาพโปรไฟล์ (Avatar)' : 'Select Avatar'}
                </label>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {AVATAR_PRESETS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormAvatar(av)}
                      className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-transform shrink-0 ${
                        formAvatar === av
                          ? 'border-[#1E60D5] scale-110 shadow-md ring-2 ring-blue-300'
                          : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="Avatar option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1E60D5] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingUser ? (language === 'TH' ? 'บันทึกการแก้ไข' : 'Save Changes') : (language === 'TH' ? 'สร้างผู้ใช้' : 'Create User')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {language === 'TH' ? 'ยืนยันการลบผู้ใช้งาน' : 'Confirm User Deletion'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'TH' 
                  ? 'คุณต้องการลบบัญชีผู้ใช้นี้ออกจากระบบใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้' 
                  : 'Are you sure you want to delete this user account? This action cannot be undone.'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (deleteConfirmId) {
                    onDeleteUser(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                {language === 'TH' ? 'ยืนยันลบ' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
