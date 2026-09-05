import React from 'react';
import { Link } from 'react-router-dom';
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
  Layers,
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-app text-sb-main flex flex-col font-sans transition-colors duration-200">
      {/* Top Header Navbar */}
      <header className="border-b border-sb-default bg-surface/80 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white shadow-md">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-sb-main">
                Inaivazhi
              </span>
              <span className="text-[10px] text-sb-muted font-semibold tracking-widest uppercase block -mt-1">
                Placement & Skill Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-sb-main hover:bg-surface-sec border border-sb-default transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all flex items-center gap-2"
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
            Next-Gen Placement Intelligence & Skill Gap SaaS
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-sb-main leading-tight mb-6">
            Bridge the gap between your skills and your <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 dark:from-indigo-400 dark:via-sky-300 dark:to-violet-400 bg-clip-text text-transparent">next opportunity.</span>
          </h1>

          <p className="text-lg text-sb-sec max-w-3xl mx-auto font-normal leading-relaxed mb-10">
            Inaivazhi AI unifies student proficiency, trainer verification, dynamically calculated job skill matching, explainable candidate ranking, and ATS resume generation into one authoritative platform.
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
              className="px-8 py-4 rounded-2xl bg-surface border border-sb-default text-sb-main hover:bg-surface-sec font-bold text-base transition-all shadow-sm"
            >
              Explore Demo Portals
            </Link>
          </div>

          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 p-6 rounded-2xl bg-surface border border-sb-default shadow-sm">
            <div>
              <div className="text-2xl font-black text-sb-main">60+</div>
              <div className="text-xs font-medium text-sb-sec">Pre-seeded Candidates</div>
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

      {/* Footer */}
      <footer className="border-t border-sb-default py-10 mt-auto bg-surface text-sb-sec text-xs text-center transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-sb-main">Inaivazhi Platform</span>
          </div>
          <p>© 2026 Inaivazhi • Placement & Skill Intelligence Platform. All data MongoDB driven.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
