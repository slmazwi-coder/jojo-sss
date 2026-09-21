import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout, useAuth } from './utils/auth';
import { canAccessSection, type AdminSectionKey } from './utils/roles';
import {
  Newspaper,
  Info,
  Trophy,
  FileText,
  Activity,
  Users,
  Phone,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  ArrowLeft,
  FolderUp,
  GraduationCap,
  UserCog,
} from 'lucide-react';

type AdminTab = {
  path: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string }>;
  section: AdminSectionKey;
};

const adminTabs: AdminTab[] = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, section: 'dashboard' },
  { path: '/admin/news', label: 'News', icon: Newspaper, section: 'news' },
  { path: '/admin/about', label: 'About', icon: Info, section: 'about' },
  { path: '/admin/achievements', label: 'Achievements', icon: Trophy, section: 'achievements' },
  { path: '/admin/documents', label: 'Documents', icon: FileText, section: 'documents' },
  { path: '/admin/extra-curricular', label: 'Sport & Activities', icon: Activity, section: 'extra-curricular' },
  { path: '/admin/applications', label: 'Applications', icon: Users, section: 'applications' },
  { path: '/admin/student-documents', label: 'Student Docs', icon: FolderUp, section: 'student-documents' },
  { path: '/admin/contact', label: 'Contact', icon: Phone, section: 'contact' },
  { path: '/admin/staff', label: 'Staff', icon: UserCog, section: 'staff' },
];

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const visibleTabs = adminTabs.filter((tab) => canAccessSection(currentUser?.role, tab.section));

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const goBackToSite = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-[#CC0000] text-white text-center py-1.5 text-xs font-bold uppercase tracking-widest shadow-sm">
        ⚙ Admin Mode — Changes affect the live website
      </div>

      <nav className="bg-gray-800 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={goBackToSite}
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                aria-label="Back to website"
              >
                <ArrowLeft size={16} /> Back
              </button>

              <Link to="/admin" className="text-lg font-bold text-white flex items-center gap-2">
                <img
                  src="/jojo_logo.png"
                  alt=""
                  className="w-8 h-8 object-contain rounded-full bg-white p-1"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-[#F5C518]">Jojo</span> Staff Portal
              </Link>

              <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-bold text-green-400 uppercase tracking-tighter">
                <ShieldCheck size={12} />
                Anti-Malicious Defense Active
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-white/70">
              <GraduationCap size={14} />
              {currentUser ? `${currentUser.name} (${currentUser.role})` : 'Staff'}
            </div>

            <div className="hidden md:flex items-center gap-1">
              {visibleTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = location.pathname === tab.path;
                return (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#CC0000] text-[#F5C518]'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </Link>
                );
              })}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-white/80 hover:text-red-400 transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        <div className="md:hidden overflow-x-auto px-2 pb-2 flex gap-1">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
                  isActive ? 'bg-[#CC0000] text-[#F5C518]' : 'text-gray-400 bg-gray-700'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};
