import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Requirement #3: Enable explicit Console Logging for debugging and verification
if (typeof window !== 'undefined') {
  console.log(
    '%c[Qisheng Digital Portal] Console Logs Active & Enabled 🚀',
    'background: #1E60D5; color: #ffffff; font-weight: bold; font-size: 13px; padding: 4px 8px; border-radius: 4px;'
  );
  console.log('[Qisheng Portal] System Time:', new Date().toLocaleString('th-TH'));
  console.log('[Qisheng Portal] Ready for debugging actions (Delete, Save, Sync, Announcement Dismissal)');

  // Global helper for user testing in DevTools console
  (window as any).qishengPortal = {
    version: '2.5.0',
    getActiveTab: () => sessionStorage.getItem('qs_active_tab') || 'dashboard',
    getAnnouncements: () => JSON.parse(localStorage.getItem('qs_announcements_v1') || '[]'),
    getAnnouncementClosedStatus: () => ({
      lastClosedDate: localStorage.getItem('qs_announcement_last_closed_date'),
      lastClosedTimestamp: Number(localStorage.getItem('qs_announcement_last_closed_timestamp') || 0),
      closedIds: JSON.parse(localStorage.getItem('qs_announcement_closed_ids') || '[]')
    }),
    clearAnnouncementDismissal: () => {
      localStorage.removeItem('qs_announcement_last_closed_date');
      localStorage.removeItem('qs_announcement_last_closed_timestamp');
      localStorage.removeItem('qs_announcement_closed_ids');
      console.log('[Qisheng Portal] Cleared announcement dismissal history');
    }
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
