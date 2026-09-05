import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BrainCircuit, Lock, Mail, UserCheck, ShieldAlert, KeyRound } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('arun@skillbridge.com');
  const [password, setPassword] = useState('Arun@123');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('STUDENT');

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleTabChange = (role, defaultEmail, defaultPass) => {
    setActiveTab(role);
    setEmail(defaultEmail);
    setPassword(defaultPass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please provide both email and password.', 'error');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      addToast(`Welcome back, ${user.name}!`, 'success');

      if (user.role === 'STUDENT') navigate('/student/dashboard');
      else if (user.role === 'TRAINER') navigate('/trainer/dashboard');
      else if (user.role === 'PLACEMENT') navigate('/placement/dashboard');
      else if (user.role === 'SUPER_ADMIN') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err) {
      addToast(err.response?.data?.message || err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl p-8 z-10">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-sky-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-500/30 mb-3">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">SkillBridge AI</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Employee & Student Skill Gap Intelligence Platform
          </p>
        </div>

        {/* Demo Quick-Select Tabs (Section 13) */}
        <div className="mb-6">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
            Select Pre-seeded Demo Role
          </div>
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => handleTabChange('STUDENT', 'arun@skillbridge.com', 'Arun@123')}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'STUDENT' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('TRAINER', 'trainer.mern@skillbridge.com', 'Trainer@123')}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'TRAINER' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Trainer
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('PLACEMENT', 'placement@skillbridge.com', 'Placement@123')}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'PLACEMENT' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Placement
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('SUPER_ADMIN', 'admin@skillbridge.com', 'Admin@123')}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'SUPER_ADMIN' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="email@domain.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-indigo-600 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : `Sign In as ${activeTab.replace('_', ' ')}`}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">New student?</span>
          <Link to="/register" className="text-indigo-400 font-bold hover:underline">
            Register Student Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
