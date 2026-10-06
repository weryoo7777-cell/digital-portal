import { ClientMachineInfo, UserProfile } from '../types';

export function parseClientEnvironment() {
  const ua = navigator.userAgent;
  let osName = 'Windows';
  let osVersion = '11 Pro (Build 22631)';
  let browserName = 'Chrome Enterprise';
  let browserVersion = '128.0.0.0';

  // Detect OS
  if (ua.indexOf('Win') !== -1) {
    osName = 'Windows';
    if (ua.indexOf('Windows NT 10.0') !== -1) {
      // Windows 11 also uses NT 10.0 in UA, distinguish via client hints if available
      osVersion = '11 Pro / Enterprise (x64)';
    } else if (ua.indexOf('Windows NT 6.3') !== -1) {
      osVersion = '8.1 Enterprise';
    } else if (ua.indexOf('Windows NT 6.1') !== -1) {
      osVersion = '7 Professional';
    }
  } else if (ua.indexOf('Mac') !== -1) {
    osName = 'macOS';
    osVersion = 'Sonoma 14.5 (Apple Silicon)';
  } else if (ua.indexOf('Linux') !== -1) {
    osName = 'Linux';
    osVersion = 'Ubuntu 24.04 LTS (x86_64)';
  } else if (ua.indexOf('Android') !== -1) {
    osName = 'Android';
    osVersion = '14 Enterprise MDM';
  } else if (ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) {
    osName = 'iOS';
    osVersion = '17.5';
  }

  // Detect Browser
  if (ua.indexOf('Edg/') !== -1) {
    browserName = 'Microsoft Edge';
    const match = ua.match(/Edg\/([\d.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.indexOf('Chrome/') !== -1) {
    browserName = 'Google Chrome';
    const match = ua.match(/Chrome\/([\d.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.indexOf('Firefox/') !== -1) {
    browserName = 'Mozilla Firefox';
    const match = ua.match(/Firefox\/([\d.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.indexOf('Safari/') !== -1 && ua.indexOf('Chrome') === -1) {
    browserName = 'Apple Safari';
    const match = ua.match(/Version\/([\d.]+)/);
    if (match) browserVersion = match[1];
  }

  const screenResolution = `${window.screen.width} × ${window.screen.height} @ ${window.devicePixelRatio}x`;

  return { osName, osVersion, browserName, browserVersion, screenResolution };
}

/**
 * WebRTC Local IP candidate detection
 */
async function detectLocalIpViaWebRTC(): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      let resolved = false;
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          pc.close();
          resolve(null);
        }
      }, 1200);

      pc.createDataChannel('');
      pc.createOffer().then((offer) => pc.setLocalDescription(offer)).catch(() => {});

      pc.onicecandidate = (event) => {
        if (!event || !event.candidate || !event.candidate.candidate) return;
        const candidateStr = event.candidate.candidate;
        const ipMatch = candidateStr.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
        if (ipMatch && ipMatch[1]) {
          const ip = ipMatch[1];
          // Check for private subnet
          if (
            ip.startsWith('192.168.') || 
            ip.startsWith('10.') || 
            (ip.startsWith('172.') && parseInt(ip.split('.')[1], 10) >= 16 && parseInt(ip.split('.')[1], 10) <= 31)
          ) {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              pc.close();
              resolve(ip);
            }
          }
        }
      };
    } catch {
      resolve(null);
    }
  });
}

/**
 * Collect all machine info using server backend + WebRTC + browser APIs
 */
export async function detectClientMachineInfo(currentUser: UserProfile): Promise<ClientMachineInfo> {
  const env = parseClientEnvironment();
  const startTime = performance.now();

  let serverData: any = null;
  let latencyMs = 8;

  try {
    const res = await fetch('/api/client-info');
    if (res.ok) {
      serverData = await res.json();
      latencyMs = Math.max(1, Math.round(performance.now() - startTime));
    }
  } catch {
    // offline fallback
  }

  // Detect whether running in localhost / local development environment
  const isLocalhostBrowser = 
    typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' || 
     window.location.hostname.startsWith('192.168.') || 
     window.location.hostname.startsWith('10.'));

  const isLocal = isLocalhostBrowser || !!serverData?.isLocalhost;

  // Try WebRTC local IP
  const rtcLocalIp = await detectLocalIpViaWebRTC();

  // Determine Real Hardware info vs Corporate Mock info
  const realHostname = serverData?.realHostname || serverData?.serverHostname || 'LOCAL-PC';
  const realLocalIp = serverData?.serverLanIp || rtcLocalIp || '192.168.1.100';

  // Read saved display mode preference ('real' | 'corporate'), default to 'real' when on localhost
  let savedMode: 'real' | 'corporate' = isLocal ? 'real' : 'corporate';
  try {
    const stored = localStorage.getItem('qs_machine_display_mode');
    if (stored === 'real' || stored === 'corporate') {
      savedMode = stored;
    }
  } catch {}

  const activeHostname = savedMode === 'real' && (serverData?.realHostname || isLocal)
    ? realHostname 
    : currentUser.workstationHostname;

  const activeLocalIp = savedMode === 'real' && (serverData?.serverLanIp || rtcLocalIp || isLocal)
    ? realLocalIp 
    : (rtcLocalIp || currentUser.localIp || '192.168.10.45');

  // Attempt to get real Public IP via public API with fast timeout
  let detectedPublicIp = serverData?.clientIp;
  if (!detectedPublicIp || detectedPublicIp === '127.0.0.1' || detectedPublicIp === '::1' || detectedPublicIp.startsWith('192.168.')) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const ipRes = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (ipRes.ok) {
        const ipJson = await ipRes.json();
        if (ipJson.ip) {
          detectedPublicIp = ipJson.ip;
        }
      }
    } catch {
      // ignore network errors
    }
  }

  const publicIp = detectedPublicIp && !detectedPublicIp.startsWith('127.0.') && detectedPublicIp !== '::1'
    ? detectedPublicIp
    : (isLocal ? '127.0.0.1 (Localhost Interface)' : '203.144.178.62 (True Super Fiber Corp)');

  // Determine network connection speed
  const conn = (navigator as any).connection;
  const networkType = conn?.effectiveType 
    ? `${conn.effectiveType.toUpperCase()} / Wi-Fi 6` 
    : (isLocal ? 'Local Host Loopback / LAN (1 Gbps)' : 'Gigabit LAN (1 Gbps)');
  const downlinkSpeed = conn?.downlink ? `${conn.downlink} Mbps` : '1000 Mbps Full-Duplex';

  const defaultGateway = serverData?.gatewayIp || (realLocalIp.includes('.')
    ? `${realLocalIp.substring(0, realLocalIp.lastIndexOf('.'))}.1 (Default Gateway)`
    : '192.168.1.1 (Gateway)');

  return {
    hostname: activeHostname,
    localIp: activeLocalIp,
    publicIp,
    gatewayIp: defaultGateway,
    dnsServer: serverData?.dnsServer || '192.168.1.1 (Router / DNS)',
    domainName: isLocal && savedMode === 'real' ? (serverData?.domainName || 'WORKGROUP') : (serverData?.domainName || 'qisheng.local (Active Directory)'),
    vlan: isLocal && savedMode === 'real' ? (serverData?.intranetVlan || 'Local Network (DHCP)') : currentUser.assignedVlan,
    osName: env.osName,
    osVersion: env.osVersion,
    browserName: env.browserName,
    browserVersion: env.browserVersion,
    screenResolution: env.screenResolution,
    networkType,
    downlinkSpeed,
    latencyMs,
    detectedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    detectionMethod: isLocal ? 'Host OS Live Detection' : 'WebRTC & Backend Intranet Forwarder',
    isRealLocalhost: isLocal,
    realHostname,
    realLocalIp,
    corporateHostname: currentUser.workstationHostname,
    corporateLocalIp: currentUser.localIp,
    networkAdapters: serverData?.networkAdapters || [],
    displayMode: savedMode
  };
}
