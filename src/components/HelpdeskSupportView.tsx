import React from 'react';
import { 
  HelpCircle, 
  Send, 
  Laptop, 
  PhoneCall, 
  KeyRound, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { HelpdeskTicket, UserProfile, ClientMachineInfo } from '../types';

interface HelpdeskSupportViewProps {
  currentUser: UserProfile;
  machineInfo: ClientMachineInfo | null;
  tickets: HelpdeskTicket[];
  onOpenQuickAction: (action: 'helpdesk' | 'sspr' | 'access') => void;
  language: 'TH' | 'EN';
}

export const HelpdeskSupportView: React.FC<HelpdeskSupportViewProps> = ({
  currentUser,
  machineInfo,
  tickets,
  onOpenQuickAction,
  language
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in">
      {/* Title */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-cyan-400" />
            <span>{language === 'TH' ? 'แจ้งปัญหา IT Helpdesk & บริการสนับสนุน' : 'IT Helpdesk & Corporate Support'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {language === 'TH' 
              ? 'ระบบรับแจ้งปัญหาคอมพิวเตอร์ เครือข่าย และบริการรีเซ็ตรหัสผ่านตนเอง (SSPR)' 
              : 'Submit technical incident tickets, reset password, and track resolution status.'}
          </p>
        </div>

        <button
          onClick={() => onOpenQuickAction('helpdesk')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-all shadow-md shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{language === 'TH' ? '+ เปิดคำร้องแจ้งซ่อมใหม่' : '+ Submit New Ticket'}</span>
        </button>
      </div>

      {/* 3 Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Action 1: Helpdesk */}
        <div 
          onClick={() => onOpenQuickAction('helpdesk')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
            {language === 'TH' ? 'แจ้งปัญหาไอที / อุปกรณ์' : 'IT Incident Ticket'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {language === 'TH' 
              ? 'ระบบดึงชื่อเครื่อง Hostname และ Local IP ไปให้อัตโนมัติ' 
              : 'Auto-attaches machine hostname and local IP to technician.'}
          </p>
          <div className="mt-3 text-xs text-cyan-400 font-semibold flex items-center gap-1">
            <span>{language === 'TH' ? 'แจ้งซ่อมทันที' : 'Create Ticket'}</span>
            <span aria-hidden="true">&rarr;</span>
          </div>
        </div>

        {/* Action 2: SSPR Password Reset */}
        <div 
          onClick={() => onOpenQuickAction('sspr')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/80 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <KeyRound className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
            {language === 'TH' ? 'เปลี่ยนรหัสผ่าน / SSPR' : 'Self-Service Password Reset'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {language === 'TH' 
              ? 'ปลดล็อกบัญชีหรือเปลี่ยนรหัสผ่าน Active Directory ด้วยตนเอง' 
              : 'Unlock corporate account or reset password via Authenticator.'}
          </p>
          <div className="mt-3 text-xs text-purple-400 font-semibold flex items-center gap-1">
            <span>{language === 'TH' ? 'จัดการรหัสผ่าน' : 'Manage Password'}</span>
            <span aria-hidden="true">&rarr;</span>
          </div>
        </div>

        {/* Action 3: Request Access */}
        <div 
          onClick={() => onOpenQuickAction('access')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
            {language === 'TH' ? 'ขอเปิดสิทธิ์ใช้งานระบบ' : 'Request System Access'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {language === 'TH' 
              ? 'ยื่นคำร้องขอสิทธิ์เข้าใช้งาน Express, WMS หรือ ERP' 
              : 'Request role-based access to restricted business apps.'}
          </p>
          <div className="mt-3 text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <span>{language === 'TH' ? 'ยื่นคำขอ' : 'Request Access'}</span>
            <span aria-hidden="true">&rarr;</span>
          </div>
        </div>
      </div>

      {/* Ticket History Section */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {language === 'TH' ? 'ประวัติคำร้องแจ้งปัญหาของคุณ' : 'Your Ticket History'}
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {tickets.length} {language === 'TH' ? 'รายการ' : 'tickets'}
          </span>
        </div>

        <div className="divide-y divide-slate-800">
          {tickets.map((t) => (
            <div key={t.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan-400 font-bold text-xs">#{t.id}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    t.status === 'Resolved'
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                      : t.status === 'In Progress'
                      ? 'bg-blue-950/80 text-blue-400 border-blue-800'
                      : 'bg-amber-950/80 text-amber-400 border-amber-800'
                  }`}>
                    {t.status}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">· {t.createdAt}</span>
                </div>
                <div className="font-medium text-slate-100 text-sm">{t.subject}</div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>{t.category}</span>
                  <span>·</span>
                  <span className="font-mono text-slate-500">Host: {t.workstation}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 sm:text-right shrink-0">
                <div>ความเร่งด่วน: <span className="font-semibold text-slate-200">{t.priority}</span></div>
                <div className="text-[10px] text-slate-500">โดย: {t.reportedBy}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IT Contact & Hotline Box */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 flex items-center justify-center shrink-0">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-200">
              {language === 'TH' ? 'ติดต่อฝ่ายไอทีเร่งด่วน (Emergency Hotline)' : 'IT Urgent Hotline'}
            </div>
            <div className="text-slate-400 text-[11px]">
              เบอร์ต่อภายใน: <span className="text-cyan-400 font-mono font-bold">Ext. 8000</span> (08:30 - 17:30 น.) · อาคาร A ชั้น 2 ห้อง IT Ops
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>SLA: Response within 15 mins for Critical</span>
        </div>
      </div>
    </div>
  );
};
