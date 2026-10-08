/**
 * Central Configuration for Admin Authentication
 * Switched to Admin PIN Mode: PIN "1111" is required to unlock Admin privileges.
 * Automatic IP/Hostname authentication has been disabled per user requirements.
 */

export const ADMIN_PIN = '1111';

/**
 * Validates entered Admin PIN
 * @param pin The entered PIN string
 * @returns boolean true if PIN is exactly '1111'
 */
export function verifyAdminPin(pin?: string | null): boolean {
  if (!pin) return false;
  return pin.trim() === ADMIN_PIN;
}

export interface AdminDeviceRule {
  ip?: string;
  hostname?: string;
  description?: string;
}

export interface AdminConfig {
  adminPin: string;
  adminIps: string[];
  adminHostnames: string[];
  adminRules: AdminDeviceRule[];
}

export const ADMIN_CONFIG: AdminConfig = {
  adminPin: ADMIN_PIN,
  // Retained for reference/telemetry only, not used for auto-admin
  adminIps: [
    '192.168.7.122',
  ],
  adminHostnames: [
    'QISHENG-122',
  ],
  adminRules: [
    {
      ip: '192.168.7.122',
      hostname: 'QISHENG-122',
      description: 'QISHENG Workstation (Rayong HQ)',
    },
  ],
};

/**
 * Note: IP/Hostname check is disabled. Always returns false.
 * Admin privileges require entering PIN '1111' via Admin Mode.
 */
export function checkIsAdminClient(
  _clientIp?: string | null,
  _clientHostname?: string | null
): boolean {
  return false;
}
