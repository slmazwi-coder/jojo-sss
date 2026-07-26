import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, setAdminPassword } from './utils/storage';
import { Eye, EyeOff, ArrowLeft, Lock } from 'lucide-react';

export const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [setupMode, setSetupMode] = useState(false);
  const [setupUsername, setSetupUsername] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (setupMode) {
      if (setupPassword.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (setupPassword !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      await setAdminPassword(setupUsername, setupPassword);
      const result = await login(setupUsername, setupPassword);
      if (result.success) {
        navigate('/admin');
      } else {
        setError('Could not complete setup. Please try again.');
      }
      return;
    }

    if (!username.trim()) {
      setError('Please enter your username.');
      return;
    }

    const result = await login(username.trim(), password);
    if (result.success) {
      navigate('/admin');
    } else if (result.requiresSetup) {
      setSetupMode(true);
      setSetupUsername(username.trim());
      setPassword('');
    } else {
      setError('Invalid username or password.');
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

        {setupMode ? (
          <div className="bg-[#CC0000]/10 border border-[#CC0000]/30 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-200">
              First login for <strong className="text-white">{setupUsername}</strong>. Please create a secure password.
            </p>
          </div>
        ) : null}

        <form onSubmit={handleLogin} className="space-y-5">
          {!setupMode && (
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

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {setupMode ? 'Create Password' : 'Password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={setupMode ? setupPassword : password}
                onChange={(e) => {
                  if (setupMode) {
                    setSetupPassword(e.target.value);
                  } else {
                    setPassword(e.target.value);
                  }
                  setError('');
                }}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F5C518] focus:border-transparent"
                placeholder={setupMode ? 'Create a password' : 'Enter your password'}
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

          {setupMode && (
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

          <button
            type="submit"
            className="w-full bg-[#CC0000] text-[#F5C518] py-3 rounded-xl font-bold hover:bg-[#990000] transition-colors"
          >
            {setupMode ? 'Create Password & Sign In' : 'Sign In'}
          </button>

          {setupMode && (
            <button
              type="button"
              onClick={() => {
                setSetupMode(false);
                setSetupPassword('');
                setConfirmPassword('');
                setError('');
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
