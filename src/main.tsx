import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// ── Data version reset ──────────────────────────────────────────────────────
// If the stored version doesn't match, wipe ALL admin_ keys so stale
// Mt Hargreaves data (principal names, contact info, etc.) is purged and
// the Ludidi defaults in storage.ts take effect immediately.
const DATA_VERSION = 'ludidi-v2';
if (localStorage.getItem('data_version') !== DATA_VERSION) {
  Object.keys(localStorage)
    .filter(k => k.startsWith('admin_') || k.startsWith('mh_') || k.startsWith('ludidi_'))
    .forEach(k => localStorage.removeItem(k));
  localStorage.setItem('data_version', DATA_VERSION);
}
// ────────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
