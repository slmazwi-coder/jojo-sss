import React, { useCallback, useEffect, useState } from 'react';
import { getHallOfFame, setHallOfFame, deleteHallOfFame, generateId, uploadFile, publicFileUrl, type HallOfFameEntry } from '../utils/storage';
import { runFullDefenseScan } from '../utils/defense';
import { Plus, Trash2, Save, Trophy, X, ImageIcon, Pencil, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

export const AchievementsEditor = () => {
  const [hall, setHall] = useState<HallOfFameEntry[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<HallOfFameEntry | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saved, setSaved] = useState(false);

  const [isScanning, setIsScanning] = useState(false);

  const load = useCallback(async () => {
    try {
      setHall(await getHallOfFame());
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the hall of fame.');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveHall = async () => {
    if (!editing) return;

    setIsScanning(true);
    let result;
    try {
      result = await runFullDefenseScan(editing, 'achievements');
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
    setBusy(true);
    try {
      await setHallOfFame([editing]);
      await load();
      setEditing(null);
      setIsNew(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the entry.');
    } finally {
      setBusy(false);
    }
  };

  const removeHall = async (id: string) => {
    if (!confirm('Remove this Hall of Fame entry?')) return;
    setBusy(true);
    try {
      await deleteHallOfFame(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not remove the entry.');
    } finally {
      setBusy(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setBusy(true);
    try {
      const path = await uploadFile('public-media', file, 'achievements');
      setEditing({ ...editing, image: publicFileUrl('public-media', path) });
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not upload the image.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Achievements Editor</h1>

      {error && (
        <div className="mb-6 flex items-start gap-3 bg-red-900/30 border border-red-700 rounded-xl p-4 text-sm text-red-200">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Hall of Fame */}
      <section className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold flex items-center gap-2"><Trophy size={20} className="text-yellow-500" /> Hall of Fame</h2>
          <button
            onClick={() => {
              setEditing({ id: generateId(), name: '', title: '', year: '', desc: '', image: '' });
              setIsNew(true);
            }}
            className="flex items-center gap-2 bg-[#C8A400] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#540D1C]"
          >
            <Plus size={16} /> Add Entry
          </button>
        </div>

        {editing && (
          <div className="bg-gray-700 rounded-xl p-4 mb-4 space-y-3">
            <div className="flex justify-between"><h3 className="font-bold text-sm">{isNew ? 'New Entry' : 'Edit Entry'}</h3><button onClick={() => { setEditing(null); setIsNew(false); }}><X size={16} /></button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Student Name" className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white text-sm" />
              <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Achievement Title" className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white text-sm" />
              <input value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} placeholder="Year" className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white text-sm" />
              <input value={editing.desc} onChange={(e) => setEditing({ ...editing, desc: e.target.value })} placeholder="Description" className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 cursor-pointer text-sm">
                <ImageIcon size={14} /> Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {editing.image && <img src={editing.image} className="h-10 w-10 rounded object-cover" />}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-600">
              <button 
                onClick={saveHall} 
                disabled={isScanning}
                className="flex items-center gap-2 bg-[#C8A400] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#540D1C] disabled:opacity-50"
              >
                {isScanning ? (
                  <><Loader2 size={14} className="animate-spin" /> Analyzing...</>
                ) : (
                  <><Save size={14} /> Save</>
                )}
              </button>
              <div className="flex items-center gap-1 text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                <ShieldCheck size={10} className="text-green-500" /> Anti-Malicious Defense Active
              </div>
            </div>
          </div>
        )}

        {hall.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No Hall of Fame entries yet. Click "Add Entry" to create one.</p>
        ) : (
          <div className="space-y-3">
            {hall.map(h => (
              <div key={h.id} className="flex items-center gap-4 bg-gray-700/50 rounded-xl p-3">
                {h.image ? <img src={h.image} className="w-12 h-12 rounded-lg object-cover" /> : <div className="w-12 h-12 bg-gray-600 rounded-lg" />}
                <div className="flex-grow min-w-0">
                  <p className="font-bold text-sm text-white truncate">{h.name}</p>
                  <p className="text-xs text-gray-400 truncate">{h.title} • {h.year}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(h); setIsNew(false); }} className="p-1.5 hover:bg-gray-600 rounded text-gray-400 hover:text-white"><Pencil size={14} /></button>
                  <button onClick={() => removeHall(h.id)} className="p-1.5 hover:bg-gray-600 rounded text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
        <p className="text-gray-400 text-sm">💡 To edit yearly results data and subject pass rates, update the code in <code className="text-[#CC0000]">Achievements.tsx</code> directly for now.</p>
      </div>
    </div>
  );
};

