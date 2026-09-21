import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, setAdminPassword, requestPasswordReset, isAuthConfigured } from './utils/auth';
import { Eye, EyeOff, ArrowLeft, Lock, AlertTriangle } from 'lucide-react';

type Mode = 'login' | 'setup' | 'reset';

export const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<Mode>('login');
  const [busy, setBusy] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const configured = isAuthConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (mode === 'reset') {
      if (!username.trim()) {
        setError('Please enter your username.');
        return;
      }
      setBusy(true);
      const result = await requestPasswordReset(username.trim());
      setBusy(false);
      if (result.success) {
        setNotice('If that account exists, a reset link is on its way. Please check your email.');
      } else {
        setError(result.error || 'Could not start the reset. Please try again.');
      }
      return;
    }

    if (mode === 'setup') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      setBusy(true);
      const result = await setAdminPassword(username.trim(), password);
      if (!result.success) {
        setBusy(false);
        setError(result.error || 'Could not complete setup. Please try again.');
        return;
      }
      const signedIn = await login(username.trim(), password);
      setBusy(false);
      if (signedIn.success) {
        navigate('/admin');
      } else {
        setError(signedIn.error || 'Could not complete setup. Please try again.');
      }
      return;
    }

    if (!username.trim()) {
      setError('Please enter your username.');
      return;
    }

    setBusy(true);
    const result = await login(username.trim(), password);
    setBusy(false);

    if (result.success) {
      navigate('/admin');
    } else if (result.requiresSetup) {
      setMode('setup');
      setPassword('');
    } else {
      setError(result.error || 'Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
          aria-label="Back to website"
        >
          <ArrowLeft size={16} /> Back to website
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#CC0000] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#F5C518]">
            <Lock className="text-[#F5C518]" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white">Staff Portal</h1>
          <p className="text-gray-400 text-sm mt-1">Jojo SSS Administration</p>
        </div>

        {!configured ? (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 flex gap-3">
            <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-200">
              The staff portal is not connected yet. An administrator needs to set the Supabase
              environment variables before staff can sign in.
            </p>
          </div>
        ) : null}

        {mode === 'setup' ? (
          <div className="bg-[#CC0000]/10 border border-[#CC0000]/30 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-200">
              First login for <strong className="text-white">{username}</strong>. Please create a secure password.
            </p>
          </div>
        ) : null}

        {mode === 'reset' ? (
          <div className="bg-[#CC0000]/10 border border-[#CC0000]/30 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-200">
              Enter your username and we will email you a link to reset your password.
            </p>
          </div>
        ) : null}

        <form onSubmit={handleLogin} className="space-y-5">
          {mode !== 'setup' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F5C518] focus:border-transparent"
                placeholder="e.g. principal"
                autoFocus
              />
            </div>
          )}

          {mode !== 'reset' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {mode === 'setup' ? 'Create Password' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F5C518] focus:border-transparent"
                  placeholder={mode === 'setup' ? 'Create a password' : 'Enter your password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {mode === 'setup' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F5C518] focus:border-transparent"
                placeholder="Confirm your password"
              />
            </div>
          )}

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {notice && <p className="text-green-400 text-sm text-center">{notice}</p>}

          <button
            type="submit"
            disabled={busy || !configured}
            className="w-full bg-[#CC0000] text-[#F5C518] py-3 rounded-xl font-bold hover:bg-[#990000] transition-colors disabled:opacity-50"
          >
            {busy
              ? 'Please wait…'
              : mode === 'setup'
                ? 'Create Password & Sign In'
                : mode === 'reset'
                  ? 'Send Reset Link'
                  : 'Sign In'}
          </button>

          {mode !== 'reset' && configured && (
            <button
              type="button"
              onClick={() => {
                setMode('reset');
                setPassword('');
                setConfirmPassword('');
                setError('');
                setNotice('');
              }}
              className="w-full text-sm text-gray-400 hover:text-white"
            >
              Forgot password?
            </button>
          )}

          {mode !== 'login' && (
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setPassword('');
                setConfirmPassword('');
                setError('');
                setNotice('');
              }}
              className="w-full text-sm text-gray-400 hover:text-white"
            >
              Back to login
            </button>
          )}
        </form>

        <p className="text-center text-gray-500 text-xs mt-8">Authorized personnel only</p>
      </div>
    </div>
  );
};
