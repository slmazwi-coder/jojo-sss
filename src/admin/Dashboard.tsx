import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Info, Trophy, FileText, Activity, Users, Phone, FolderUp, UserCog } from 'lucide-react';
import { useAuth } from './utils/auth';
import { canAccessSection, needsRoleAssignment, type AdminSectionKey } from './utils/roles';
import { NoRoleNotice } from './ProtectedRoute';

type DashboardCard = {
  label: string;
  desc: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  path: string;
  color: string;
  section: AdminSectionKey;
  staffAdminOnly?: boolean;
};

const cards: DashboardCard[] = [
  { label: 'News', desc: 'Add, edit, or remove news articles', icon: Newspaper, path: '/admin/news', color: 'bg-blue-600', section: 'news' },
  { label: 'About', desc: 'Edit school history & principal info', icon: Info, path: '/admin/about', color: 'bg-emerald-600', section: 'about' },
  { label: 'Achievements', desc: 'Manage results & Hall of Fame', icon: Trophy, path: '/admin/achievements', color: 'bg-yellow-600', section: 'achievements' },
  { label: 'Documents', desc: 'Upload & manage school documents', icon: FileText, path: '/admin/documents', color: 'bg-purple-600', section: 'documents' },
  {
    label: 'Sport & Activities',
    desc: 'Manage sport and academic activities shown on the website',
    icon: Activity,
    path: '/admin/extra-curricular',
    color: 'bg-orange-600',
    section: 'extra-curricular',
  },
  { label: 'Applications', desc: 'Review student applications', icon: Users, path: '/admin/applications', color: 'bg-red-600', section: 'applications' },
  { label: 'Student Docs', desc: 'Manage per-student documents', icon: FolderUp, path: '/admin/student-documents', color: 'bg-indigo-600', section: 'student-documents' },
  { label: 'Contact', desc: 'Update contact information', icon: Phone, path: '/admin/contact', color: 'bg-teal-600', section: 'contact' },
  { label: 'Staff & Roles', desc: 'Assign roles to staff members', icon: UserCog, path: '/admin/staff', color: 'bg-slate-600', section: 'staff' },
];

export const AdminDashboard = () => {
  const { user } = useAuth();

  if (needsRoleAssignment(user?.role)) {
    return <NoRoleNotice />;
  }

  const visible = cards.filter((card) => canAccessSection(user?.role, card.section));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name || 'Staff'}</h1>
      <p className="text-gray-400 mb-10">
        Signed in as {user?.role}. Manage your website content from here.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.path}
              to={card.path}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-[#CC0000] transition-all group"
            >
              <div
                className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{card.label}</h3>
              <p className="text-gray-400 text-sm">{card.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
