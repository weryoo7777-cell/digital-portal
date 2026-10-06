import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import os from 'os';
import {defineConfig, Plugin} from 'vite';

function corporateApiPlugin(): Plugin {
  return {
    name: 'corporate-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        res.setHeader('Content-Type', 'application/json');

        if (url.pathname === '/api/client-info') {
          const rawForwarded = (req.headers['x-forwarded-for'] as string) || '';
          const clientIp = (rawForwarded.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1').replace('::ffff:', '');
          const userAgent = (req.headers['user-agent'] as string) || 'Mozilla/5.0';
          const hostHeader = (req.headers.host || '').toLowerCase();
          
          const networkInterfaces = os.networkInterfaces();
          const detectedAdapters: Array<{ name: string; ip: string; isPhysical: boolean; mac?: string }> = [];

          for (const [name, ifaceList] of Object.entries(networkInterfaces)) {
            if (!ifaceList) continue;
            for (const iface of ifaceList) {
              if (iface.family === 'IPv4' && !iface.internal) {
                const lowerName = name.toLowerCase();
                const isVirtual = 
                  lowerName.includes('virtual') || 
                  lowerName.includes('vethernet') || 
                  lowerName.includes('wsl') || 
                  lowerName.includes('docker') || 
                  lowerName.includes('vmware') || 
                  lowerName.includes('vbox');

                detectedAdapters.push({
                  name,
                  ip: iface.address,
                  isPhysical: !isVirtual,
                  mac: iface.mac
                });
              }
            }
          }

          // Prioritize physical adapters (Wi-Fi, Ethernet) over virtual switches
          detectedAdapters.sort((a, b) => {
            if (a.isPhysical && !b.isPhysical) return -1;
            if (!a.isPhysical && b.isPhysical) return 1;
            if (a.ip.startsWith('192.168.') && !b.ip.startsWith('192.168.')) return -1;
            if (!a.ip.startsWith('192.168.') && b.ip.startsWith('192.168.')) return 1;
            return 0;
          });

          const primaryLanIp = detectedAdapters[0]?.ip || '192.168.1.105';
          const isLocalhost = 
            hostHeader.includes('localhost') || 
            hostHeader.includes('127.0.0.1') || 
            clientIp === '127.0.0.1' || 
            clientIp === '::1';

          const rawHost = os.hostname();
          const realHostname = (rawHost && !rawHost.includes('ais-') && !rawHost.includes('localhost') && rawHost !== '127.0.0.1')
            ? rawHost
            : 'QISHENG-022';
          const gatewayIp = primaryLanIp.includes('.')
            ? `${primaryLanIp.substring(0, primaryLanIp.lastIndexOf('.'))}.1 (Default Gateway)`
            : '192.168.1.1 (Gateway)';

          res.statusCode = 200;
          return res.end(JSON.stringify({
            status: 'success',
            isLocalhost,
            clientIp,
            serverLanIp: primaryLanIp,
            realHostname,
            serverHostname: realHostname,
            networkAdapters: detectedAdapters,
            gatewayIp,
            dnsServer: '192.168.1.1 (Local DNS / Router)',
            domainJoined: !isLocalhost,
            domainName: isLocalhost ? 'WORKGROUP' : 'qisheng.local',
            userAgent,
            timestamp: new Date().toISOString(),
            intranetVlan: isLocalhost ? 'Local Network (DHCP)' : 'VLAN 10 - HQ Workstations',
          }));
        }

        if (url.pathname === '/api/system-health') {
          res.statusCode = 200;
          return res.end(JSON.stringify({
            status: 'healthy',
            services: [
              { id: 'gw', name: 'Corporate Gateway (MikroTik CCR2004)', status: 'online', latency: 2, uptime: '99.99%' },
              { id: 'ad', name: 'Active Directory / Entra ID Sync', status: 'online', latency: 4, uptime: '99.98%' },
              { id: 'erp', name: 'Express & Central ERP Server', status: 'online', latency: 5, uptime: '99.95%' },
              { id: 'ocr', name: 'DataForge OCR Engine Cluster', status: 'online', latency: 18, uptime: '99.89%' },
              { id: 'rd', name: 'RD e-Filing Thai Tax Gateway', status: 'online', latency: 42, uptime: '99.70%' },
              { id: 'vpn', name: 'HQ WireGuard/IPsec VPN Hub', status: 'online', latency: 6, uptime: '99.99%' }
            ],
            checkedAt: new Date().toISOString()
          }));
        }

        if (url.pathname === '/api/auth/sso') {
          res.statusCode = 200;
          return res.end(JSON.stringify({
            authenticated: true,
            provider: 'Microsoft Entra ID (Azure AD)',
            tenantId: 'qisheng-corp-prod-tenant',
            ssoSession: 'valid'
          }));
        }

        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Endpoint not found' }));
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), corporateApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

