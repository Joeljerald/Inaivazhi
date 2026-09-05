import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  BrainCircuit,
  Target,
  ShieldCheck,
  Sparkles,
  Search,
  TrendingUp,
  FileText,
  ArrowRight,
  CheckCircle2,
  Users,
  Building2,
  Briefcase,
  Star,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Zap,
  BarChart3,
  Award,
} from 'lucide-react';

export const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('STUDENT');
  const [openFaq, setOpenFaq] = useState(null);

  const rolePreviews = {
    STUDENT: {
      title: 'Student Portal & Skill Passport',
      subtitle: 'Real-time readiness radar, weighted gap analysis & ATS resume builder.',
      icon: GraduationCap,
      features: [
        'Interactive Skill Gap Radar chart comparing self vs target job requirements',
        'AI Learning Roadmap with prioritized multi-week sequence',
        'Single-column ATS-friendly resume generator with direct PDF print',
        'Live placement readiness index percentage (e.g. 78% Match)',
      ],
      ctaText: 'Explore Student Portal',
      loginEmail: 'arun@skillbridge.com',
      loginPass: 'Arun@123',
      badge: 'Student View',
    },
    TRAINER: {
      title: 'Trainer Intelligence Portal',
      subtitle: 'Batch skill analytics, proficiency evaluation & candidate recommendation.',
      icon: User,
      features: [
        'Comprehensive batch roster with skill evaluation modal',
        'Low-readiness alerts for students needing early intervention',
        'AI Suitable Candidate Search for matching students to active drives',
        'Curriculum skill gap heatmaps across MERN, Java, Python & AI tracks',
      ],
      ctaText: 'Explore Trainer Portal',
      loginEmail: 'trainer.mern@skillbridge.com',
      loginPass: 'Trainer@123',
      badge: 'Trainer View',
    },
    PLACEMENT: {
      title: 'Placement Officer Portal',
      subtitle: 'Job posting, skill weighting, candidate intelligence & interview pipelines.',
      icon: Briefcase,
      features: [
        'Create corporate job postings with custom skill importance weights',
        'Dynamic candidate matching engine searching across 60+ candidates',
        'Explainable candidate match breakdown drawer with gap facts',
        'Placement status pipeline tracking (Shortlisted, Tech Round, HR, Selected)',
      ],
      ctaText: 'Explore Placement Portal',
      loginEmail: 'placement@skillbridge.com',
      loginPass: 'Placement@123',
      badge: 'Recruiter View',
    },
    SUPER_ADMIN: {
      title: 'Super Admin Command Center',
      subtitle: 'Platform-wide governance, user management & database audit logs.',
      icon: ShieldCheck,
      features: [
        'Global ecosystem analytics across all 4 user roles',
        'User role management & privilege assignment',
        'System audit trail & placement conversion velocity tracking',
        'Unrestricted database inspection for students, trainers & drives',
      ],
      ctaText: 'Explore Admin Portal',
      loginEmail: 'admin@skillbridge.com',
      loginPass: 'Admin@123',
      badge: 'Admin View',
    },
  };

  const faqs = [
    {
      q: 'How does Inaivazhi calculate candidate placement readiness?',
      a: 'Inaivazhi uses a deterministic weighted math engine: Readiness = sum(min(100, (Student Skill / Required Skill) * 100) * Weight) / sum(Weight). All skill ratings are verified by assigned trainers in MongoDB.',
    },
    {
      q: 'Can corporate placement officers customize skill requirements per job opening?',
      a: 'Yes! Placement Officers can set required skill proficiency levels (1-5) and custom weight multipliers (e.g. Mandatory vs Preferred) for each published job position.',
    },
    {
      q: 'How does the ATS Resume Builder work?',
      a: 'The ATS builder dynamically compiles the student database profile, compares keyword coverage against MongoDB job descriptions, calculates ATS match scores, and formats a clean single-column printable resume.',
    },
    {
      q: 'Is Inaivazhi compatible with both Light and Dark themes?',
      a: 'Yes! Inaivazhi features a dual theme engine supporting Light, Dark, and System modes with high contrast ratios for comfortable, all-day usage.',
    },
  ];

  return (
    <div className="min-h-screen bg-app text-sb-main flex flex-col font-sans transition-colors duration-200">
      {/* Top Header Navbar */}
      <header className="border-b border-sb-default bg-surface/90 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white shadow-md shadow-indigo-600/20">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-sb-main">Inaivazhi</span>
              <span className="text-[10px] text-sb-muted font-semibold tracking-widest uppercase block -mt-1">
                Placement & Skill Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-surface-sec border border-sb-default text-sb-sec hover:text-sb-main transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-sb-main hover:bg-surface-sec border border-sb-default transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-sb-default">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Employee & Student Skill Gap Intelligence Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-sb-main leading-tight mb-6">
            Bridge the gap between academic training and <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 dark:from-indigo-400 dark:via-sky-300 dark:to-violet-400 bg-clip-text text-transparent">corporate placements.</span>
          </h1>

          <p className="text-lg text-sb-sec max-w-3xl mx-auto font-normal leading-relaxed mb-10">
            Inaivazhi unifies student proficiency, trainer verification, dynamically calculated job skill matching, explainable candidate ranking, and ATS resume generation into one authoritative platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-md hover:scale-105 transition-all flex items-center gap-3"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-2xl bg-surface border border-sb-default text-sb-main hover:bg-surface-sec font-bold text-base transition-all shadow-sm flex items-center gap-2"
            >
              <Zap className="w-5 h-5 text-amber-500" />
              1-Click Role Login
            </Link>
          </div>

          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 p-6 rounded-2xl bg-surface border border-sb-default shadow-sm">
            <div>
              <div className="text-2xl font-black text-sb-main">60+</div>
              <div className="text-xs font-medium text-sb-sec">Active Candidates</div>
            </div>
            <div>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">5 Tracks</div>
              <div className="text-xs font-medium text-sb-sec">Trainer Specializations</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">100%</div>
              <div className="text-xs font-medium text-sb-sec">Database-Driven Math</div>
            </div>
            <div>
              <div className="text-2xl font-black text-sky-600 dark:text-sky-400">ATS Ready</div>
              <div className="text-xs font-medium text-sb-sec">PDF Resume Engine</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Role Showcase Section */}
      <section className="py-20 bg-surface-sec border-b border-sb-default">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Role-Based Architecture</span>
            <h2 className="text-3xl font-extrabold text-sb-main tracking-tight mt-1">
              Four Synchronized Role Portals
            </h2>
            <p className="text-sb-sec text-sm mt-2 max-w-2xl mx-auto">
              Click any role profile below to preview its specialized capabilities and live features.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 bg-surface rounded-2xl border border-sb-default max-w-2xl w-full">
              {Object.keys(rolePreviews).map((rKey) => (
                <button
                  key={rKey}
                  onClick={() => setActiveTab(rKey)}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTab === rKey
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-sb-sec hover:text-sb-main hover:bg-surface-sec'
                  }`}
                >
                  <span>{rolePreviews[rKey].badge}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Role Active Preview Card */}
          {rolePreviews[activeTab] && (
            <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-surface border border-sb-default shadow-sm transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-sb-default">
                <div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {rolePreviews[activeTab].badge}
                  </span>
                  <h3 className="text-2xl font-black text-sb-main mt-1">
                    {rolePreviews[activeTab].title}
                  </h3>
                  <p className="text-xs text-sb-sec mt-1">
                    {rolePreviews[activeTab].subtitle}
                  </p>
                </div>

                <Link
                  to="/login"
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all shrink-0 flex items-center justify-center gap-2"
                >
                  {rolePreviews[activeTab].ctaText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {rolePreviews[activeTab].features.map((feat, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-surface-sec border border-sb-default flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-sb-main font-semibold leading-relaxed">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Core Platform Capabilities Section */}
      <section className="py-20 bg-app relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-sb-main tracking-tight">
              Architected for Complete Placement Lifecycle
            </h2>
            <p className="text-sb-sec text-sm mt-2 max-w-2xl mx-auto">
              Four specialized portal roles working in complete sync using a unified MongoDB backend.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-surface border border-sb-default hover:border-indigo-500 transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-sb-main mb-2">Skill Gap Engine</h3>
              <p className="text-sb-sec text-xs leading-relaxed">
                Deterministic weighted math calculating exact percentage match, readiness level, missing mandatory skills, and gap score per candidate.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-surface border border-sb-default hover:border-indigo-500 transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-sb-main mb-2">Trainer Verification</h3>
              <p className="text-sb-sec text-xs leading-relaxed">
                Distinct self-assessment vs trainer-verified proficiency tracking with complete progress history and structured feedback logging.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-surface border border-sb-default hover:border-indigo-500 transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-600/20 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-sb-main mb-2">AI Personal Roadmap</h3>
              <p className="text-sb-sec text-xs leading-relaxed">
                Generates personalized learning order, estimated effort, practice projects, and strategy strictly based on database gap facts.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-3xl bg-surface border border-sb-default hover:border-indigo-500 transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-600/20 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-sb-main mb-2">Candidate Intelligence</h3>
              <p className="text-sb-sec text-xs leading-relaxed">
                Recruiters filter candidates by job requirements, inspect explainable match breakdowns, associate students, and track round statuses.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-3xl bg-surface border border-sb-default hover:border-indigo-500 transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-600/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-sb-main mb-2">Placement Tracking</h3>
              <p className="text-sb-sec text-xs leading-relaxed">
                Full lifecycle audit trail from application, shortlisting, technical interviews, HR round, selection, and status history logs.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-3xl bg-surface border border-sb-default hover:border-indigo-500 transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-600/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-sb-main mb-2">ATS Resume Builder</h3>
              <p className="text-sb-sec text-xs leading-relaxed">
                Generates single-column text-based resumes matching target job requirements with keyword coverage scoring & clean PDF export.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 bg-surface border-t border-sb-default">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Questions & Answers</span>
            <h2 className="text-3xl font-extrabold text-sb-main tracking-tight mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-surface-sec border border-sb-default overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm text-sb-main flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-sb-sec shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-xs text-sb-sec leading-relaxed border-t border-sb-divider">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
          <h2 className="text-3xl font-black tracking-tight">Accelerate Placement Readiness Today</h2>
          <p className="text-sm text-indigo-100 max-w-xl mx-auto leading-relaxed">
            Experience complete skill gap analytics, trainer rating verification, and recruiter candidate intelligence.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-xl bg-white text-indigo-700 font-extrabold text-sm shadow-lg hover:bg-indigo-50 transition-all"
            >
              Sign In to Portal
            </Link>
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-900/80 text-white font-extrabold text-sm border border-indigo-400/30 transition-all"
            >
              Create Student Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sb-default py-10 bg-surface text-sb-sec text-xs text-center transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-sb-main">Inaivazhi Platform</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>MongoDB Systems Operational</span>
          </div>
          <p>© 2026 Inaivazhi • Placement & Skill Intelligence Platform.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
