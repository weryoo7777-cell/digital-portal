/**
 * Universal clipboard utility supporting both modern HTTPS Clipboard API
 * and fallback document.execCommand('copy') for non-secure HTTP contexts on LAN IPs.
 */
export const copyToClipboard = async (textToCopy: string): Promise<boolean> => {
  if (!textToCopy && textToCopy !== '') return false;

  // 1. Try modern Clipboard API if supported and in secure context (HTTPS / localhost)
  if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(textToCopy);
      return true;
    } catch (err) {
      console.warn('[Clipboard] navigator.clipboard.writeText failed, falling back to execCommand:', err);
    }
  }

  // 2. Fallback for non-HTTPS (e.g. HTTP LAN connection http://192.168.x.x) or when permission denied
  try {
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    
    // Prevent scrolling and position off-screen
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', '');
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch (err) {
    console.error('[Clipboard] Failed to copy text to clipboard:', err);
    return false;
  }
};
