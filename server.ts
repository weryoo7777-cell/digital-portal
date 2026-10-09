import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  getCentralData, 
  saveApp, 
  deleteApp, 
  addAnnouncement, 
  deleteAnnouncement, 
  saveVendor, 
  deleteVendor, 
  resetVendors, 
  recordAccessLog, 
  verifyAdminPin, 
  updateAdminPin 
} from './src/server/centralStorage';

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

// 1. Client Machine Info Endpoint
app.get('/api/client-info', (req, res) => {
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
      { id: 'vpn', name: 'HQ WireGuard/IPsec VPN Hub', status: 'online', latency: 6, uptime: '99.99%' }
    ],
    checkedAt: new Date().toISOString()
  });
});

// 3. SSO Status Endpoint
app.get('/api/auth/sso', (req, res) => {
  res.json({
    authenticated: true,
    provider: 'Microsoft Entra ID (Azure AD)',
    tenantId: 'qisheng-corp-prod-tenant',
    ssoSession: 'valid'
  });
});

// 4. Central Portal Data API
// Get complete centralized state (apps, announcements, vendor contacts, recent logs, PIN, timestamps)
app.get('/api/portal-data', (req, res) => {
  res.json({
    success: true,
    data: getCentralData()
  });
});

// Apps CRUD
app.post('/api/portal-data/apps', (req, res) => {
  const appData = req.body;
  if (!appData || !appData.id || !appData.name) {
    return res.status(400).json({ success: false, error: 'App data is required' });
  }
  const updated = saveApp(appData);
  res.json({ success: true, apps: updated.apps, lastAppsUpdate: updated.lastAppsUpdate });
});

app.delete('/api/portal-data/apps/:id', (req, res) => {
  const appId = req.params.id;
  if (!appId) {
    return res.status(400).json({ success: false, error: 'App ID is required' });
  }
  const updated = deleteApp(appId);
  res.json({ success: true, apps: updated.apps, lastAppsUpdate: updated.lastAppsUpdate });
});

// Announcements CRUD
app.post('/api/portal-data/announcements', (req, res) => {
  const annData = req.body;
  if (!annData || !annData.title) {
    return res.status(400).json({ success: false, error: 'Title is required' });
  }
  const updated = addAnnouncement(annData);
  res.json({ 
    success: true, 
    announcements: updated.announcements, 
    lastAnnouncementUpdate: updated.lastAnnouncementUpdate 
  });
});

app.delete('/api/portal-data/announcements/:id', (req, res) => {
  const annId = req.params.id;
  if (!annId) {
    return res.status(400).json({ success: false, error: 'Announcement ID is required' });
  }
  const updated = deleteAnnouncement(annId);
  res.json({ 
    success: true, 
    announcements: updated.announcements, 
    lastAnnouncementUpdate: updated.lastAnnouncementUpdate 
  });
});

// Vendor Contacts CRUD
app.post('/api/portal-data/vendors', (req, res) => {
  const vendor = req.body;
  if (!vendor || !vendor.name) {
    return res.status(400).json({ success: false, error: 'Vendor name is required' });
  }
  const updated = saveVendor(vendor);
  res.json({ success: true, vendorContacts: updated.vendorContacts, lastVendorsUpdate: updated.lastVendorsUpdate });
});

app.delete('/api/portal-data/vendors/:id', (req, res) => {
  const vendorId = req.params.id;
  if (!vendorId) {
    return res.status(400).json({ success: false, error: 'Vendor ID is required' });
  }
  const updated = deleteVendor(vendorId);
  res.json({ success: true, vendorContacts: updated.vendorContacts, lastVendorsUpdate: updated.lastVendorsUpdate });
});

app.post('/api/portal-data/reset-vendors', (req, res) => {
  const updated = resetVendors();
  res.json({ success: true, vendorContacts: updated.vendorContacts });
});

// Recent Access Log Real-time Recording
app.post('/api/portal-data/log-access', (req, res) => {
  const { appId, appName, appTh, category, url, iconName, status, user } = req.body;
  if (!appName) {
    return res.status(400).json({ success: false, error: 'App name is required' });
  }
  const clientIp = (
    ((req.headers['x-forwarded-for'] as string) || '').split(',')[0].trim() || 
    req.socket.remoteAddress || 
    '127.0.0.1'
  ).replace('::ffff:', '');

  const updated = recordAccessLog({
    appId,
    appName,
    appTh,
    category,
    url,
    iconName,
    status: status || 'Authorized',
    user: user || 'User',
    clientIp
  });

  res.json({ success: true, recentLogs: updated.recentLogs });
});

app.get('/api/portal-data/recent-logs', (req, res) => {
  const data = getCentralData();
  res.json({ success: true, recentLogs: data.recentLogs });
});

// Admin PIN Verification & Update
app.post('/api/portal-data/verify-pin', (req, res) => {
  const { pin } = req.body;
  const isValid = verifyAdminPin(pin);
  res.json({ valid: isValid });
});

app.post('/api/portal-data/update-pin', (req, res) => {
  const { currentPin, newPin } = req.body;
  const result = updateAdminPin(currentPin, newPin);
  res.json(result);
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
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
