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
    { label: 'My Skills', path: '/student/skills', icon: Award },
    { label: 'Skill Gap Analyzer', path: '/student/skill-gap', icon: BrainCircuit },
    { label: 'AI Learning Roadmap', path: '/student/roadmap', icon: Sparkles },
    { label: 'Applications & Companies', path: '/student/applications', icon: Briefcase },
    { label: 'My Profile', path: '/student/profile', icon: User }
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
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-30 shrink-0 transition-colors">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/40">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white">
              Inaivazhi
            </h1>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">
              Placement Intelligence
            </span>
          </div>
        </div>

        {/* User Role Tag */}
        <div className="mx-4 my-4 p-3 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Logged in as</span>
          <span className="text-sm font-bold text-white truncate block mt-0.5">{user?.name}</span>
          <span className="text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 inline-block mt-1">
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
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
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
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-rose-950/40 text-rose-300 hover:bg-rose-900/50 border border-rose-500/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
