import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// ── Data version reset ──────────────────────────────────────────────────────
// Content and applications now live in Supabase, not the browser. Bumping the
// version wipes legacy browser-local copies, which also removes the learner
// personal data that older admissions submissions left behind on each device.
const DATA_VERSION = 'jojo-v3';
if (localStorage.getItem('data_version') !== DATA_VERSION) {
  Object.keys(localStorage)
    .filter(k => k.startsWith('admin_') || k.startsWith('mh_') || k.startsWith('jojo_'))
    .forEach(k => localStorage.removeItem(k));
  localStorage.setItem('data_version', DATA_VERSION);
}
// ────────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
