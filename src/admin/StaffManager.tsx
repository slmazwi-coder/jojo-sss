import React, { useCallback, useEffect, useState } from 'react';
import { getStaffProfiles, setStaffRole, type StaffProfile } from './utils/storage';
import { useAuth } from './utils/auth';
import { STAFF_ROLES, isStaffAdmin, needsRoleAssignment } from './utils/roles';
import { Loader2, AlertCircle, UserCog } from 'lucide-react';

/** Lets a Principal or Administrator assign staff roles.
 *
 *  The database independently enforces this: the staff_profiles write policy
 *  rejects anyone who is not a staff admin, so hiding the controls is only a
 *  convenience. */
export const StaffManager = () => {
  const { user } = useAuth();
  const [staff, setStaff] = useState<StaffProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setStaff(await getStaffProfiles());
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the staff list.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const mayEdit = isStaffAdmin(user?.role);

  const changeRole = async (id: string, role: string) => {
    setSavingId(id);
    try {
      await setStaffRole(id, role);
      setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, role } : s)));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update the role.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UserCog size={22} /> Staff &amp; Roles
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Roles decide which sections of the portal a staff member can use.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 bg-red-900/30 border border-red-700 rounded-xl p-4 text-sm text-red-200">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!mayEdit && (
        <div className="mb-6 bg-gray-800 border border-gray-700 rounded-xl p-4 text-sm text-gray-400">
          Only a Principal or Administrator can change roles. You can view the staff list below.
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading staff…
        </div>
      ) : staff.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No staff accounts yet.</p>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
          {staff.map((member) => (
            <div
              key={member.id}
              className="flex flex-wrap items-center gap-4 px-5 py-4 border-b border-gray-700 last:border-b-0"
            >
              <div className="flex-grow min-w-0">
                <p className="font-bold text-white truncate">
                  {member.fullName}
                  {needsRoleAssignment(member.role) && (
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-2 py-0.5">
                      No role
                    </span>
                  )}
                </p>
                <p className="text-gray-400 text-xs truncate">@{member.username}</p>
              </div>

              {mayEdit ? (
                <div className="flex items-center gap-2">
                  <select
                    value={member.role}
                    disabled={savingId === member.id}
                    onChange={(e) => changeRole(member.id, e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50"
                  >
                    {STAFF_ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  {savingId === member.id && <Loader2 size={16} className="animate-spin text-gray-400" />}
                </div>
              ) : (
                <span className="text-sm text-gray-300">{member.role}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
