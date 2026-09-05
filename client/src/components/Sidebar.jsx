import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Award,
  Sparkles,
  Search,
  Building2,
  Briefcase,
  Users,
  FileCheck,
  Calendar,
  LogOut,
  BrainCircuit,
  ShieldCheck,
  Star,
  FileText,
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const role = user?.role || 'STUDENT';

  const studentLinks = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Skill Passport', path: '/student/passport', icon: ShieldCheck },
    { label: 'AI Resume Builder', path: '/student/resume-builder', icon: FileText },
    { label: 'My Profile', path: '/student/profile', icon: User },
    { label: 'My Skills', path: '/student/skills', icon: Award },
    { label: 'Skill Gap Analyzer', path: '/student/skill-gap', icon: BrainCircuit },
    { label: 'AI Learning Roadmap', path: '/student/roadmap', icon: Sparkles },
    { label: 'Applications & Companies', path: '/student/applications', icon: Briefcase },
  ];

  const trainerLinks = [
    { label: 'Dashboard', path: '/trainer/dashboard', icon: LayoutDashboard },
    { label: 'My Students & Ratings', path: '/trainer/students', icon: Users },
    { label: 'Most Suitable Students', path: '/trainer/most-suitable', icon: Star },
    { label: 'AI Candidate Search', path: '/trainer/candidate-matcher', icon: Search },
  ];

  const placementLinks = [
    { label: 'Dashboard', path: '/placement/dashboard', icon: LayoutDashboard },
    { label: 'Candidate Intelligence', path: '/placement/candidate-matching', icon: Search },
    { label: 'Most Suitable Students', path: '/trainer/most-suitable', icon: Star },
    { label: 'AI Candidate Search', path: '/trainer/candidate-matcher', icon: Sparkles },
    { label: 'Companies', path: '/placement/companies', icon: Building2 },
    { label: 'Job Openings', path: '/placement/jobs', icon: Briefcase },
    { label: 'Applications & Interviews', path: '/placement/applications', icon: FileCheck },
  ];

  const adminLinks = [
    { label: 'Platform Analytics', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Management', path: '/admin/users', icon: Users },
    { label: 'Candidate Intelligence', path: '/placement/candidate-matching', icon: Search },
    { label: 'Most Suitable Students', path: '/trainer/most-suitable', icon: Star },
    { label: 'AI Candidate Search', path: '/trainer/candidate-matcher', icon: Sparkles },
    { label: 'Companies', path: '/placement/companies', icon: Building2 },
    { label: 'Job Openings', path: '/placement/jobs', icon: Briefcase },
    { label: 'Applications', path: '/placement/applications', icon: FileCheck },
  ];

  let links = studentLinks;
  if (role === 'TRAINER') links = trainerLinks;
  if (role === 'PLACEMENT') links = placementLinks;
  if (role === 'SUPER_ADMIN') links = adminLinks;

  return (
    <aside className="w-64 bg-sb-sidebar border-r border-sb-sidebar flex flex-col justify-between h-screen sticky top-0 z-30 shrink-0 transition-colors">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-sb-sidebar gap-3">
          <div className="p-2 rounded-xl bg-sb-primary text-white shadow-xs">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-sb-main flex items-center gap-1">
              SkillBridge <span className="text-sb-ai font-extrabold text-xs px-1.5 py-0.5 rounded bg-sb-ai-soft border border-sb-ai">AI</span>
            </h1>
            <span className="text-[10px] text-sb-muted font-semibold tracking-wider uppercase block">
              Placement Intelligence
            </span>
          </div>
        </div>

        {/* User Role Tag */}
        <div className="mx-4 my-4 p-3 rounded-xl bg-surface-sec border border-sb-sidebar">
          <span className="text-[10px] text-sb-muted uppercase font-bold tracking-wider block">Logged in as</span>
          <span className="text-sm font-bold text-sb-main truncate block mt-0.5">{user?.name}</span>
          <span className="text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded bg-sb-primary-soft text-sb-primary inline-block mt-1">
            {role.replace('_', ' ')}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-sb-sidebar-active text-sb-sidebar-active font-bold shadow-xs'
                      : 'text-sb-sidebar hover:bg-[var(--color-sidebar-hover)] hover:text-sb-main'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="p-4 border-t border-sb-sidebar">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-sb-danger-soft text-sb-danger border border-sb-default hover:opacity-90 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
