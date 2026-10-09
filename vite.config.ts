import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import os from 'os';
import http from 'http';
import {defineConfig, Plugin} from 'vite';
import { centralStore } from './src/server/centralStore';

function parseBody(req: http.IncomingMessage): Promise<any> {
  if ((req as any).body && typeof (req as any).body === 'object') {
    return Promise.resolve((req as any).body);
  }
  if (req.readableEnded) {
    return Promise.resolve({});
  }
  return new Promise((resolve) => {
    let resolved = false;
    const done = (val: any) => {
      if (!resolved) {
        resolved = true;
        resolve(val);
      }
    };
    const timer = setTimeout(() => done({}), 1500);

    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      clearTimeout(timer);
      try {
        done(body ? JSON.parse(body) : {});
      } catch {
        done({});
      }
    });
    req.on('error', () => {
      clearTimeout(timer);
      done({});
    });
  });
}

const filterClientLogs = (logs: any[], clientIp: string, clientHost?: string) => {
  const normIp = (clientIp || '').trim().toLowerCase();
  const normHost = (clientHost || '').trim().toLowerCase();

  return (logs || []).filter((log) => {
    const logIp = (log.clientIp || '').trim().toLowerCase();
    const logHost = (log.workstationHostname || '').trim().toLowerCase();

    if (normIp && logIp && (normIp === logIp || normIp.includes(logIp) || logIp.includes(normIp))) {
      return true;
    }
    if (normHost && logHost && (normHost === logHost || normHost.includes(logHost) || logHost.includes(normHost))) {
      return true;
    }
    return false;
  });
};

function corporateApiPlugin(): Plugin {
  return {
    name: 'corporate-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        res.setHeader('Content-Type', 'application/json');

        const customClientIp = ((req.headers['x-client-ip'] as string) || '').trim();
        const rawForwarded = (req.headers['x-forwarded-for'] as string) || '';
        const clientIp = (
          customClientIp ||
          rawForwarded.split(',')[0].trim() || 
          (req.headers['x-real-ip'] as string) || 
          req.socket.remoteAddress || 
          '127.0.0.1'
        ).replace('::ffff:', '');
        const clientHost = ((req.headers['x-workstation-hostname'] as string) || '').trim().toLowerCase();
        const deviceId = ((req.headers['x-device-id'] as string) || '').trim();

        // 1. Central Portal Sync Endpoint (GET /api/portal-data) (Client-Isolated: never broadcast other machines' logs)
        if (url.pathname === '/api/portal-data' && req.method === 'GET') {
          res.statusCode = 200;
          const data = centralStore.getPortalData(clientIp, clientHost, deviceId);
          return res.end(JSON.stringify(data));
        }

        // 2. Apps Management Endpoints
        if (url.pathname === '/api/apps') {
          if (req.method === 'GET') {
            res.statusCode = 200;
            return res.end(JSON.stringify({ apps: centralStore.getApps() }));
          }
          if (req.method === 'POST') {
            const body = await parseBody(req);
            if (!body || !body.name) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'App name is required' }));
            }
            const saved = centralStore.addApp(body);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, app: saved }));
          }
          if (req.method === 'PUT') {
            const body = await parseBody(req);
            if (!body || !body.id) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'App ID is required' }));
            }
            const updated = centralStore.updateApp(body);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, app: updated }));
          }
        }

        if (url.pathname === '/api/apps/delete' && req.method === 'POST') {
          const body = await parseBody(req);
          const appId = body?.id || body?.appId;
          if (!appId) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'App ID is required' }));
          }
          const deleted = centralStore.deleteApp(appId);
          res.statusCode = 200;
          return res.end(JSON.stringify({ success: deleted, id: appId }));
        }

        // 3. Announcements Management Endpoints
        if (url.pathname === '/api/announcements') {
          if (req.method === 'GET') {
            res.statusCode = 200;
            return res.end(JSON.stringify(centralStore.getAnnouncements()));
          }
          if (req.method === 'POST') {
            const body = await parseBody(req);
            if (!body || !body.title || !body.summary) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Title and summary are required' }));
            }
            const saved = centralStore.addAnnouncement(body);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, announcement: saved }));
          }
          if (req.method === 'PUT') {
            const body = await parseBody(req);
            if (!body || !body.id) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Announcement ID is required' }));
            }
            const updated = centralStore.updateAnnouncement(body);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, announcement: updated }));
          }
        }

        if (url.pathname === '/api/announcements/delete' && req.method === 'POST') {
          const body = await parseBody(req);
          const annId = body?.id || body?.announcementId;
          if (!annId) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Announcement ID is required' }));
          }
          const deleted = centralStore.deleteAnnouncement(annId);
          res.statusCode = 200;
          return res.end(JSON.stringify({ success: deleted, id: annId }));
        }

        // 3.5 Vendor Contacts Management Endpoints
        if (url.pathname === '/api/vendor-contacts') {
          if (req.method === 'GET') {
            res.statusCode = 200;
            return res.end(JSON.stringify({ vendors: centralStore.getVendorContacts() }));
          }
          if (req.method === 'POST') {
            const body = await parseBody(req);
            if (body && Array.isArray(body.vendors)) {
              centralStore.setVendorContacts(body.vendors);
              res.statusCode = 200;
              return res.end(JSON.stringify({ success: true, vendors: centralStore.getVendorContacts() }));
            }
            if (!body || !body.name || !body.phone) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Vendor name and phone are required' }));
            }
            const saved = body.id ? centralStore.updateVendor(body) : centralStore.addVendor(body);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, vendor: saved }));
          }
        }

        if (url.pathname === '/api/vendor-contacts/delete' && req.method === 'POST') {
          const body = await parseBody(req);
          const vendorId = body?.id || body?.vendorId;
          if (!vendorId) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Vendor ID is required' }));
          }
          const deleted = centralStore.deleteVendor(vendorId);
          res.statusCode = 200;
          return res.end(JSON.stringify({ success: deleted, id: vendorId }));
        }

        if (url.pathname === '/api/vendor-contacts/reset' && req.method === 'POST') {
          const reset = centralStore.resetVendors();
          res.statusCode = 200;
          return res.end(JSON.stringify({ success: true, vendors: reset }));
        }

        // 4. Central Activity Logs Endpoints
        if (url.pathname === '/api/activity-logs') {
          if (req.method === 'GET') {
            const limit = parseInt(url.searchParams.get('limit') || '20', 10);
            const filtered = centralStore.getActivityLogs(limit, clientIp, clientHost, deviceId);
            res.statusCode = 200;
            return res.end(JSON.stringify({ logs: filtered }));
          }
          if (req.method === 'POST') {
            const body = await parseBody(req);
            const logEntry = centralStore.addActivityLog({
              ...body,
              deviceId: body.deviceId || deviceId,
              clientIp: body.clientIp || clientIp
            });
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, log: logEntry }));
          }
        }

        // 5. Admin PIN Verification & Updating
        if (url.pathname === '/api/auth/verify-pin' && req.method === 'POST') {
          const body = await parseBody(req);
          const valid = centralStore.verifyPin(body?.pin || '');
          res.statusCode = 200;
          return res.end(JSON.stringify({ valid }));
        }

        if (url.pathname === '/api/auth/change-pin' && req.method === 'POST') {
          const body = await parseBody(req);
          const result = centralStore.changePin(body?.currentPin || '', body?.newPin || '');
          res.statusCode = result.success ? 200 : 400;
          return res.end(JSON.stringify(result));
        }

        // 6. Client Hardware / Network Info
        if (url.pathname === '/api/client-info') {
          const rawForwarded = (req.headers['x-forwarded-for'] as string) || '';
          const clientIp = (
            rawForwarded.split(',')[0].trim() || 
            (req.headers['x-real-ip'] as string) || 
            (req.headers['cf-connecting-ip'] as string) || 
            req.socket.remoteAddress || 
            '127.0.0.1'
          ).replace('::ffff:', '');
          const userAgent = (req.headers['user-agent'] as string) || 'Mozilla/5.0';
          const platformHint = (req.headers['sec-ch-ua-platform'] as string) || '';
          const hostHeader = (req.headers.host || '').toLowerCase();
          
          const isLocalhost = 
            hostHeader.includes('localhost') || 
            hostHeader.includes('127.0.0.1') || 
            clientIp === '127.0.0.1' || 
            clientIp === '::1';

          res.statusCode = 200;
          return res.end(JSON.stringify({
            status: 'success',
            isLocalhost,
            clientIp,
            userAgent,
            platformHint: platformHint.replace(/"/g, ''),
            timestamp: new Date().toISOString(),
          }));
        }

        // 7. System Health Monitor
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

        // 8. SSO Auth Status
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
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/central-portal-store.json', '**/src/data/centralPortalStorage.json'],
      },
    },
  };
});

