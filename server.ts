import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { centralStore } from './src/server/centralStore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const app = express();

app.use(express.json());

// Enable CORS for LAN devices
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Helper to extract client IP
const getClientIp = (req: express.Request): string => {
  const rawForwarded = (req.headers['x-forwarded-for'] as string) || '';
  return (
    rawForwarded.split(',')[0].trim() ||
    (req.headers['x-real-ip'] as string) ||
    (req.headers['cf-connecting-ip'] as string) ||
    req.socket.remoteAddress ||
    '127.0.0.1'
  ).replace('::ffff:', '');
};

// 1. Client Machine Info Endpoint
app.get('/api/client-info', (req, res) => {
  const clientIp = getClientIp(req);
  const userAgent = (req.headers['user-agent'] as string) || 'Mozilla/5.0';
  const platformHint = (req.headers['sec-ch-ua-platform'] as string) || '';
  const hostHeader = (req.headers.host || '').toLowerCase();

  const isLocalhost =
    hostHeader.includes('localhost') ||
    hostHeader.includes('127.0.0.1') ||
    clientIp === '127.0.0.1' ||
    clientIp === '::1';

  res.json({
    status: 'success',
    isLocalhost,
    clientIp,
    userAgent,
    platformHint: platformHint.replace(/"/g, ''),
    timestamp: new Date().toISOString(),
  });
});

// 2. System Health Endpoint
app.get('/api/system-health', (req, res) => {
  res.json({
    status: 'healthy',
    services: [
      { id: 'gw', name: 'Corporate Gateway (MikroTik CCR2004)', status: 'online', latency: 2, uptime: '99.99%' },
      { id: 'ad', name: 'Active Directory / Entra ID Sync', status: 'online', latency: 4, uptime: '99.98%' },
      { id: 'erp', name: 'Express & Central ERP Server', status: 'online', latency: 5, uptime: '99.95%' },
      { id: 'ocr', name: 'DataForge OCR Engine Cluster', status: 'online', latency: 18, uptime: '99.89%' },
      { id: 'rd', name: 'RD e-Filing Thai Tax Gateway', status: 'online', latency: 42, uptime: '99.70%' },
      { id: 'vpn', name: 'HQ WireGuard/IPsec VPN Hub', status: 'online', latency: 6, uptime: '99.99%' },
    ],
    checkedAt: new Date().toISOString(),
  });
});

// 3. SSO Status Endpoint
app.get('/api/auth/sso', (req, res) => {
  res.json({
    authenticated: true,
    provider: 'Microsoft Entra ID (Azure AD)',
    tenantId: 'qisheng-corp-prod-tenant',
    ssoSession: 'valid',
  });
});

// 4. Central Portal Data API
app.get('/api/portal-data', (req, res) => {
  res.json(centralStore.getPortalData());
});

// 5. Admin PIN Verification & Update (Supports both /api/auth/* and /api/portal-data/* routes)
const handleVerifyPin = (req: express.Request, res: express.Response) => {
  const pin = req.body?.pin || '';
  const valid = centralStore.verifyPin(pin);
  res.json({ valid });
};
app.post('/api/auth/verify-pin', handleVerifyPin);
app.post('/api/portal-data/verify-pin', handleVerifyPin);

const handleUpdatePin = (req: express.Request, res: express.Response) => {
  const { currentPin, newPin } = req.body || {};
  const result = centralStore.changePin(currentPin, newPin);
  res.json(result);
};
app.post('/api/auth/change-pin', handleUpdatePin);
app.post('/api/portal-data/update-pin', handleUpdatePin);

// 6. Apps Management Endpoints
app.get('/api/apps', (req, res) => {
  res.json({ apps: centralStore.getApps() });
});

app.post('/api/apps', (req, res) => {
  const body = req.body;
  if (!body || !body.name) {
    return res.status(400).json({ error: 'App name is required' });
  }
  const saved = centralStore.addApp(body);
  res.json({ success: true, app: saved });
});

app.put('/api/apps', (req, res) => {
  const body = req.body;
  if (!body || !body.id) {
    return res.status(400).json({ error: 'App ID is required' });
  }
  const updated = centralStore.updateApp(body);
  res.json({ success: true, app: updated });
});

app.post('/api/apps/delete', (req, res) => {
  const appId = req.body?.id || req.body?.appId;
  if (!appId) {
    return res.status(400).json({ error: 'App ID is required' });
  }
  const deleted = centralStore.deleteApp(appId);
  res.json({ success: deleted, id: appId });
});

// Legacy portal-data apps endpoints
app.post('/api/portal-data/apps', (req, res) => {
  const appData = req.body;
  if (!appData || !appData.name) {
    return res.status(400).json({ success: false, error: 'App data is required' });
  }
  const saved = centralStore.addApp(appData);
  res.json({ success: true, app: saved });
});

app.delete('/api/portal-data/apps/:id', (req, res) => {
  const appId = req.params.id;
  if (!appId) {
    return res.status(400).json({ success: false, error: 'App ID is required' });
  }
  const deleted = centralStore.deleteApp(appId);
  res.json({ success: deleted, id: appId });
});

// 7. Announcements Management Endpoints
app.get('/api/announcements', (req, res) => {
  res.json(centralStore.getAnnouncements());
});

app.post('/api/announcements', (req, res) => {
  const body = req.body;
  if (!body || !body.title || !body.summary) {
    return res.status(400).json({ error: 'Title and summary are required' });
  }
  const saved = centralStore.addAnnouncement(body);
  res.json({ success: true, announcement: saved });
});

app.put('/api/announcements', (req, res) => {
  const body = req.body;
  if (!body || !body.id) {
    return res.status(400).json({ error: 'Announcement ID is required' });
  }
  const updated = centralStore.updateAnnouncement(body);
  res.json({ success: true, announcement: updated });
});

app.post('/api/announcements/delete', (req, res) => {
  const annId = req.body?.id || req.body?.announcementId;
  if (!annId) {
    return res.status(400).json({ error: 'Announcement ID is required' });
  }
  const deleted = centralStore.deleteAnnouncement(annId);
  res.json({ success: deleted, id: annId });
});

// Legacy portal-data announcements endpoints
app.post('/api/portal-data/announcements', (req, res) => {
  const annData = req.body;
  if (!annData || !annData.title) {
    return res.status(400).json({ success: false, error: 'Title is required' });
  }
  const saved = centralStore.addAnnouncement(annData);
  res.json({ success: true, announcement: saved });
});

app.delete('/api/portal-data/announcements/:id', (req, res) => {
  const annId = req.params.id;
  if (!annId) {
    return res.status(400).json({ success: false, error: 'Announcement ID is required' });
  }
  const deleted = centralStore.deleteAnnouncement(annId);
  res.json({ success: deleted, id: annId });
});

// 8. Vendor Contacts Management Endpoints
app.get('/api/vendor-contacts', (req, res) => {
  res.json({ vendors: centralStore.getVendorContacts() });
});

app.post('/api/vendor-contacts', (req, res) => {
  const body = req.body;
  if (body && Array.isArray(body.vendors)) {
    centralStore.setVendorContacts(body.vendors);
    return res.json({ success: true, vendors: centralStore.getVendorContacts() });
  }
  if (!body || !body.name || !body.phone) {
    return res.status(400).json({ error: 'Vendor name and phone are required' });
  }
  const saved = body.id ? centralStore.updateVendor(body) : centralStore.addVendor(body);
  res.json({ success: true, vendor: saved });
});

app.post('/api/vendor-contacts/delete', (req, res) => {
  const vendorId = req.body?.id || req.body?.vendorId;
  if (!vendorId) {
    return res.status(400).json({ error: 'Vendor ID is required' });
  }
  const deleted = centralStore.deleteVendor(vendorId);
  res.json({ success: deleted, id: vendorId });
});

app.post('/api/vendor-contacts/reset', (req, res) => {
  const reset = centralStore.resetVendors();
  res.json({ success: true, vendors: reset });
});

// Legacy portal-data vendors endpoints
app.post('/api/portal-data/vendors', (req, res) => {
  const vendor = req.body;
  if (!vendor || !vendor.name) {
    return res.status(400).json({ success: false, error: 'Vendor name is required' });
  }
  const saved = vendor.id ? centralStore.updateVendor(vendor) : centralStore.addVendor(vendor);
  res.json({ success: true, vendor: saved });
});

app.delete('/api/portal-data/vendors/:id', (req, res) => {
  const vendorId = req.params.id;
  if (!vendorId) {
    return res.status(400).json({ success: false, error: 'Vendor ID is required' });
  }
  const deleted = centralStore.deleteVendor(vendorId);
  res.json({ success: deleted, id: vendorId });
});

app.post('/api/portal-data/reset-vendors', (req, res) => {
  const reset = centralStore.resetVendors();
  res.json({ success: true, vendors: reset });
});

// 9. Activity Logs Endpoints
app.get('/api/activity-logs', (req, res) => {
  const limit = parseInt((req.query.limit as string) || '20', 10);
  res.json({ logs: centralStore.getActivityLogs(limit) });
});

app.post('/api/activity-logs', (req, res) => {
  const body = req.body;
  const detectedIp = getClientIp(req);
  const logEntry = centralStore.addActivityLog({
    ...body,
    clientIp: body.clientIp || detectedIp,
  });
  res.json({ success: true, log: logEntry });
});

app.post('/api/portal-data/log-access', (req, res) => {
  const body = req.body;
  const detectedIp = getClientIp(req);
  const logEntry = centralStore.addActivityLog({
    ...body,
    clientIp: body.clientIp || detectedIp,
  });
  res.json({ success: true, recentLogs: centralStore.getActivityLogs(20), log: logEntry });
});

app.get('/api/portal-data/recent-logs', (req, res) => {
  res.json({ success: true, recentLogs: centralStore.getActivityLogs(20) });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`QISHENG Digital Portal server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
