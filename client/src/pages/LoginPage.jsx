import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BrainCircuit, Lock, Mail, Eye, EyeOff, Sparkles, User, GraduationCap, Briefcase, ShieldCheck } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('arun@skillbridge.com');
  const [password, setPassword] = useState('Arun@123');
  const [showPassword, setShowPassword] = useState(false);
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

  const roleDetails = {
    STUDENT: { icon: GraduationCap, label: 'Student', desc: 'Access skill gap radar & career benchmarks' },
    TRAINER: { icon: User, label: 'Trainer', desc: 'Track batch gaps & push AI recommendations' },
    PLACEMENT: { icon: Briefcase, label: 'Placement', desc: 'AI candidate search & role readiness analytics' },
    SUPER_ADMIN: { icon: ShieldCheck, label: 'Admin', desc: 'Platform settings & user role governance' },
  };

  return (
    <div className="min-h-screen bg-app flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors duration-200">
      {/* Background Ambient Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-surface border border-sb-default rounded-3xl shadow-xl p-6 sm:p-8 z-10 transition-colors duration-200">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/25 mb-3">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-sb-main flex items-center justify-center">
            Inaivazhi
          </h1>
          <p className="text-xs text-sb-sec font-medium mt-1">
            Employee & Student Skill Gap Intelligence Platform
          </p>
        </div>

        {/* Demo Quick-Select Role Switcher */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-[11px] font-bold text-sb-muted uppercase tracking-wider mb-2">
            <span>Select Demo Role Profile</span>
            <span className="text-indigo-600 font-semibold flex items-center gap-1 text-[10px]">
              <Sparkles className="w-3 h-3" /> Auto-fill
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-surface-sec rounded-2xl border border-sb-default text-[11px] font-bold">
            <button
              type="button"
              onClick={() => handleTabChange('STUDENT', 'arun@skillbridge.com', 'Arun@123')}
              className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                activeTab === 'STUDENT'
                  ? 'bg-sb-primary text-white shadow-md'
                  : 'text-sb-sec hover:text-sb-main hover:bg-surface'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('TRAINER', 'trainer.mern@skillbridge.com', 'Trainer@123')}
              className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                activeTab === 'TRAINER'
                  ? 'bg-sb-primary text-white shadow-md'
                  : 'text-sb-sec hover:text-sb-main hover:bg-surface'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Trainer</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('PLACEMENT', 'placement@skillbridge.com', 'Placement@123')}
              className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                activeTab === 'PLACEMENT'
                  ? 'bg-sb-primary text-white shadow-md'
                  : 'text-sb-sec hover:text-sb-main hover:bg-surface'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Placement</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('SUPER_ADMIN', 'admin@skillbridge.com', 'Admin@123')}
              className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                activeTab === 'SUPER_ADMIN'
                  ? 'bg-sb-primary text-white shadow-md'
                  : 'text-sb-sec hover:text-sb-main hover:bg-surface'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          <div className="mt-2 text-[11px] text-sb-muted text-center px-1">
            {roleDetails[activeTab]?.desc}
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-sb-main mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-sb-muted absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-sec border border-sb-default rounded-xl py-2.5 pl-10 pr-4 text-sm text-sb-main placeholder-sb-muted focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="email@domain.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-sb-main mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-sb-muted absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-sec border border-sb-default rounded-xl py-2.5 pl-10 pr-10 text-sm text-sb-main placeholder-sb-muted focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sb-muted hover:text-sb-main"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : `Sign In as ${roleDetails[activeTab]?.label}`}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-sb-default flex items-center justify-between text-xs">
          <span className="text-sb-muted">New student user?</span>
          <Link to="/register" className="text-indigo-600 font-bold hover:underline">
            Register Student Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
