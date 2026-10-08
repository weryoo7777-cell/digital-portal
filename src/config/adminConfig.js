/**
 * Central Configuration for Admin Identification (JavaScript version)
 * Switched to Admin PIN Mode: PIN "1111" unlocks Admin privileges.
 */

export const ADMIN_PIN = '1111';

export function verifyAdminPin(pin) {
  if (!pin) return false;
  return pin.trim() === ADMIN_PIN;
}

export const ADMIN_CONFIG = {
  adminPin: ADMIN_PIN,
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

export function checkIsAdminClient(_clientIp, _clientHostname) {
  return false;
}

