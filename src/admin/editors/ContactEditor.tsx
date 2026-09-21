import React, { useEffect, useState } from 'react';
import { getContact, setContact, type ContactInfo } from '../utils/storage';
import { runFullDefenseScan } from '../utils/defense';
import { Save, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

const emptyContact: ContactInfo = { address: '', phone: '', email: '', monThu: '', friday: '', weekend: '' };

export const ContactEditor = () => {
  const [info, setInfo] = useState<ContactInfo>(emptyContact);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    getContact()
      .then(setInfo)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Could not load contact details.'))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setIsScanning(true);
    let result;
    try {
      result = await runFullDefenseScan(info, 'contact');
    } catch {
      setIsScanning(false);
      setError('Could not run the content scan.');
      return;
    }
    setIsScanning(false);

    if (!result.safe) {
      setError(result.reason);
      return;
    }

    setError('');
    try {
      await setContact(info);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading contact details…
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Contact Information Editor</h1>
        <div className="flex flex-col items-end gap-2">
          <button 
            onClick={save} 
            disabled={isScanning} 
            className="flex items-center gap-2 bg-[#C8A400] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#540D1C] disabled:opacity-50"
          >
            {isScanning ? (
              <><Loader2 size={18} className="animate-spin" /> Scanning...</>
            ) : (
              <><Save size={18} /> {saved ? 'Saved ✓' : 'Save Changes'}</>
            )}
          </button>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            <ShieldCheck size={12} className="text-green-500" /> AMD Contact Shield Active
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 bg-red-900/30 border border-red-700 rounded-xl p-4 text-sm text-red-200">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Address</label>
          <input value={info.address} onChange={(e) => setInfo({ ...info, address: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
            <input value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email Address</label>
            <input value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-white pt-4 border-t border-gray-700">School Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Mon – Thu</label>
            <input value={info.monThu} onChange={(e) => setInfo({ ...info, monThu: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Friday</label>
            <input value={info.friday} onChange={(e) => setInfo({ ...info, friday: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Sat – Sun</label>
            <input value={info.weekend} onChange={(e) => setInfo({ ...info, weekend: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
