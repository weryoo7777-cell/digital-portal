import React, { useState } from 'react';
import { 
  Server, 
  ShieldCheck, 
  Laptop, 
  KeyRound, 
  Network, 
  Code2, 
  Copy, 
  Check, 
  BookOpen,
  ArrowRight,
  Cpu,
  Layers
} from 'lucide-react';

interface ArchitectureGuideViewProps {
  language: 'TH' | 'EN';
}

export const ArchitectureGuideView: React.FC<ArchitectureGuideViewProps> = ({ language }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const nginxConfig = `# /etc/nginx/conf.d/qisheng-portal.conf
server {
    listen 443 ssl http2;
    server_name portal.qisheng.co.th;

    ssl_certificate /etc/ssl/certs/qisheng_wildcard.crt;
    ssl_certificate_key /etc/ssl/private/qisheng_wildcard.key;

    # Forward true Client IP from Corporate Core Gateway
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Internal API for Workstation Hostname / IP Lookup
    location /api/ {
        proxy_pass http://127.0.0.1:5000/;
    }
}`;

  const nodeHostnameDetector = `// server/hostnameDetector.js (Node.js & Express)
import dns from 'dns';
import os from 'os';

export async function resolveClientWorkstation(req) {
  // 1. Get true IP from NGINX reverse proxy header
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;

  // 2. Perform Reverse DNS (PTR) lookup in Windows Active Directory DNS
  let hostname = 'UNKNOWN-PC';
  try {
    const hostnames = await dns.promises.reverse(clientIp);
    if (hostnames && hostnames.length > 0) {
      hostname = hostnames[0]; // e.g. QS-BKK-ACC03.qisheng.local
    }
  } catch (err) {
    // 3. Fallback: Query DHCP Server Leases or AD Domain Controller via LDAP
    hostname = queryDhcpLeaseTable(clientIp) || \`QS-WS-\${clientIp.split('.').slice(-2).join('-')}\`;
  }

  return { clientIp, hostname };
}`;

  const entraIdOidc = `# .env for Microsoft Entra ID (Azure AD) SSO
ENTRA_TENANT_ID="d83f9821-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
ENTRA_CLIENT_ID="4a821901-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
ENTRA_CLIENT_SECRET="secret_from_azure_portal"
ENTRA_REDIRECT_URI="https://portal.qisheng.co.th/api/auth/callback/azure-ad"
ENTRA_SCOPES="openid profile email User.Read Directory.Read.All"`;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in">
      {/* Title Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2.5 py-0.5 rounded-full">
            Enterprise Architecture & Deployment
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-400 font-mono">QISHENG Production Standard</span>
        </div>
        <h2 className="text-2xl font-bold text-white">
          {language === 'TH' 
            ? 'คำแนะนำการต่อยอด Backend, SSO และการติดตั้งบนเครือข่ายความปลอดภัยองค์กร' 
            : 'Backend Architecture, SSO Integration & Corporate Deployment Guide'}
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          {language === 'TH'
            ? 'แนวทางปฏิบัติทางเทคนิคสำหรับการตรวจจับชื่อเครื่อง (Hostname) และ IP จริง, การเชื่อมต่อ Microsoft Entra ID / Google SSO, และการตั้งค่า Reverse Proxy'
            : 'Engineering guide covering Client Hostname/IP detection in intranet, SSO authentication, and secure reverse proxy setup.'}
        </p>
      </div>

      {/* Chapter 1: Client Machine Info Discovery */}
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              {language === 'TH' 
                ? '1. การตรวจจับข้อมูลเครื่องคอมพิวเตอร์ผู้ใช้ (Client Hostname & IP Discovery)' 
                : '1. Client Hostname & IP Discovery Mechanics'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'TH' ? 'เหตุใดเว็บเบราว์เซอร์ถึงไม่สามารถอ่านชื่อเครื่องตรงๆ ได้ และวิธีแก้ปัญหาในระดับองค์กร' : 'Why browsers isolate hostnames and how to resolve them at network level'}
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-300 leading-relaxed space-y-3 pt-2 border-t border-slate-800">
          <p>
            {language === 'TH' ? (
              <>
                ตามมาตรฐานความปลอดภัยของ Web Browser (W3C Sandbox) เว็บไซต์ไม่สามารถเรียกคำสั่งอ่านชื่อเครื่อง <code className="text-cyan-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded">Computer Name</code> หรือ MAC Address ได้โดยตรง เพื่อป้องกันการติดตามผู้ใช้ข้ามไซต์ ดังนั้นในระบบเครือข่ายองค์กร (Corporate Intranet) สามารถใช้ <strong>4 สถาปัตยกรรมหลัก</strong> ดังนี้:
              </>
            ) : (
              <>
                Due to standard browser sandbox security, browsers cannot directly inspect the Windows OS Hostname or MAC address. In corporate enterprise networks, QISHENG achieves this using 4 proven methods:
              </>
            )}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="font-semibold text-cyan-400 text-xs mb-1">
                วิธีที่ 1: Active Directory Reverse DNS (PTR Records) ⭐ แนะนำ
              </div>
              <p className="text-[11px] text-slate-400">
                เมื่อเครื่องลูกข่าย (Domain Joined) ได้รับ IP จาก DHCP จะอัปเดต Dynamic PTR Record ไปยัง Windows Server DNS อัตโนมัติ เซิร์ฟเวอร์ Portal จึงสามารถทำ <code className="text-cyan-300 font-mono">dns.reverse(clientIp)</code> เพื่อให้ได้ชื่อเครื่อง เช่น <code className="text-slate-200 font-mono">QS-BKK-ACC03.qisheng.local</code> ทันที
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="font-semibold text-cyan-400 text-xs mb-1">
                วิธีที่ 2: DHCP Lease Table Integration (MikroTik / Windows DHCP)
              </div>
              <p className="text-[11px] text-slate-400">
                DHCP Server เก็บ Client Hostname ที่เครื่องคอมพิวเตอร์ส่งมาใน <code className="text-cyan-300 font-mono">Option 12 (Host Name)</code> ไว้ใน Lease Database ระบบ Backend สามารถเชื่อมต่อ API ของ Router เพื่อแมป IP กับชื่อเครื่องได้แบบ 100%
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="font-semibold text-cyan-400 text-xs mb-1">
                วิธีที่ 3: WebRTC Local IP Detection (Client-side)
              </div>
              <p className="text-[11px] text-slate-400">
                ใช้ <code className="text-cyan-300 font-mono">RTCPeerConnection</code> สร้าง STUN candidate เพื่ออ่าน Private LAN IP ภายใน Subnet ของเครื่องผู้ใช้งาน (เช่น 192.168.10.x) โดยไม่ต้องผ่าน Gateway
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="font-semibold text-cyan-400 text-xs mb-1">
                วิธีที่ 4: QISHENG Lightweight Tray Agent (C# / Go / Electron)
              </div>
              <p className="text-[11px] text-slate-400">
                สำหรับองค์กรที่มีนโยบายติดตั้ง Agent สามารถติดตั้งโปรแกรมขนาดเล็ก (Service) ที่รันบน Localhost Port 18080 เพื่อส่ง Hostname, Serial Number, และสถานะ Windows Security เข้าสู่ Portal
              </p>
            </div>
          </div>

          {/* Code Sample */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-mono text-cyan-400">Node.js Reverse DNS Hostname Resolver Code:</span>
              <button
                onClick={() => copyCode(nodeHostnameDetector, 'node-dns')}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                {copiedSection === 'node-dns' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'node-dns' ? 'คัดลอกแล้ว' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
              {nodeHostnameDetector}
            </pre>
          </div>
        </div>
      </section>

      {/* Chapter 2: SSO Authentication & RBAC */}
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800 text-purple-400 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              {language === 'TH' 
                ? '2. การเชื่อมต่อ Single Sign-On (Microsoft Entra ID & Google Workspace)' 
                : '2. Enterprise SSO & Role-Based Access Control (RBAC)'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'TH' ? 'มาตรฐาน OpenID Connect (OIDC) และ SAML 2.0 สำหรับพนักงานองค์กร' : 'OpenID Connect & SAML 2.0 configuration for enterprise identity'}
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-300 leading-relaxed space-y-3 pt-2 border-t border-slate-800">
          <p>
            {language === 'TH' ? (
              <>
                พอร์ทัลใช้การพิสูจน์ตัวตนผ่าน <strong>Federated Identity Provider (IdP)</strong> เพื่อให้พนักงานไม่ต้องจำรหัสผ่านแยก เมื่อพนักงานคลิกปุ่ม "เข้าสู่ระบบด้วย Microsoft Entra ID" ระบบจะส่งคำขอไปยัง Microsoft Login Endpoint และรับ JWT ID Token ที่มี Claims:
              </>
            ) : (
              <>
                The portal integrates with enterprise identity providers via OAuth2 / OIDC. The returned JWT claims include:
              </>
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-purple-400 font-bold block mb-1">roles / groups</span>
              <span className="text-slate-400">Security Group IDs จาก Active Directory (เช่น "SG-Accounting-Staff")</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1">upn / email</span>
              <span className="text-slate-400">User Principal Name เช่น somchai.v@qisheng.co.th</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">department / employeeId</span>
              <span className="text-slate-400">รหัสพนักงานและสังกัดแผนกที่ซิงก์จาก HRMS</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-mono text-purple-400">Microsoft Entra ID (Azure AD) OIDC Setup:</span>
              <button
                onClick={() => copyCode(entraIdOidc, 'entra-env')}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                {copiedSection === 'entra-env' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'entra-env' ? 'คัดลอกแล้ว' : 'Copy Config'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
              {entraIdOidc}
            </pre>
          </div>
        </div>
      </section>

      {/* Chapter 3: NGINX Reverse Proxy & Deployment */}
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              {language === 'TH' 
                ? '3. การติดตั้ง Reverse Proxy ด้วย NGINX และความปลอดภัยเครือข่าย' 
                : '3. NGINX Reverse Proxy Configuration & Zero-Trust Network'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'TH' ? 'การตั้งค่า X-Forwarded-For เพื่อส่งผ่าน IP ผู้ใช้งานจริง และการแบ่งแยก VLAN' : 'Forwarding real client IP through reverse proxies and VLAN segmentation'}
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-300 leading-relaxed space-y-3 pt-2 border-t border-slate-800">
          <p>
            {language === 'TH' ? (
              <>
                ในการติดตั้งบน Production Server หลัง Load Balancer หรือ Firewall จำเป็นต้องกำหนดค่า NGINX ให้ส่งต่อ Client IP ที่แท้จริงผ่าน Header <code className="text-emerald-300 font-mono">X-Forwarded-For</code> เพื่อให้พอร์ทัลตรวจจับไอพีเครื่องคอมพิวเตอร์ได้อย่างถูกต้องแม่นยำ ไม่กลายเป็นไอพีของ Reverse Proxy:
              </>
            ) : (
              <>
                When deploying behind internal corporate firewalls or load balancers, NGINX must forward original client socket IPs:
              </>
            )}
          </p>

          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-mono text-emerald-400">NGINX Configuration (Production Ready):</span>
              <button
                onClick={() => copyCode(nginxConfig, 'nginx-cfg')}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                {copiedSection === 'nginx-cfg' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'nginx-cfg' ? 'คัดลอกแล้ว' : 'Copy NGINX'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
              {nginxConfig}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};
