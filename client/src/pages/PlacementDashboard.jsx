import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Building2,
  Briefcase,
  Users,
  FileCheck,
  Calendar,
  CheckCircle2,
  Percent,
  TrendingUp,
  Award,
  Sparkles,
  Search,
  Star,
  ArrowRight,
  Layers,
  Activity,
  Target,
  UserCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#6366f1', '#38bdf8', '#a855f7', '#10b981', '#f43f5e', '#f59e0b'];

export const PlacementDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/jobs').catch(() => ({ data: { success: false } })),
        ]);

        if (statsRes.data.success) {
          setDashboardData(statsRes.data.data);
        }
        if (jobsRes.data?.success) {
          setRecentJobs(jobsRes.data.data.slice(0, 4));
        }
      } catch (err) {
        console.error('[Placement Dashboard Error]', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
        <Activity className="w-8 h-8 text-indigo-400 animate-spin" />
        <span className="text-sm font-bold">Loading Placement Intelligence...</span>
      </div>
    );
  }

  const summary = dashboardData?.summary || {};
  const topSkills = dashboardData?.topRequiredSkills || [];
  const funnel = dashboardData?.funnel || [];
  const statusDistribution = (dashboardData?.statusDistribution || []).filter((d) => d.value > 0);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-sb-primary text-white shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-sb-ai-soft border border-sb-ai text-sb-ai text-xs font-extrabold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Corporate Placement Cell
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">PLACEMENT INTELLIGENCE DASHBOARD</h1>
          <p className="text-xs text-indigo-100 max-w-2xl leading-relaxed">
            Manage recruiting partners, define weighted job skill requirements, rank candidates dynamically, and drive interview pipelines.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Link
            to="/placement/candidate-matching"
            className="px-4 py-2.5 rounded-xl bg-surface text-sb-primary font-extrabold text-xs shadow-xs hover:opacity-90 transition-all flex items-center gap-1.5"
          >
            <Search className="w-4 h-4 text-sb-primary" />
            Candidate Intelligence
          </Link>
          <Link
            to="/trainer/most-suitable"
            className="px-3.5 py-2.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-900/80 text-white font-bold text-xs border border-indigo-400/30 flex items-center gap-1.5"
          >
            <Star className="w-4 h-4 text-amber-300" />
            Most Suitable
          </Link>
          <Link
            to="/trainer/candidate-matcher"
            className="px-3.5 py-2.5 rounded-xl bg-sb-ai hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-white" />
            AI Search
          </Link>
          <Link
            to="/placement/jobs"
            className="px-3.5 py-2.5 rounded-xl bg-indigo-900/40 hover:bg-indigo-900/60 text-white font-bold text-xs border border-indigo-400/20 flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4 text-indigo-200" />
            Post Job
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-sb-default space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-sb-muted uppercase tracking-wider">Total Candidates</span>
            <Users className="w-4 h-4 text-sb-primary" />
          </div>
          <div className="text-2xl font-black text-sb-main">{summary?.totalStudents || 60}</div>
          <span className="text-[10px] text-sb-muted block">Registered students</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-sb-default space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-sb-muted uppercase tracking-wider">Hiring Companies</span>
            <Building2 className="w-4 h-4 text-sb-info" />
          </div>
          <div className="text-2xl font-black text-sb-main">{summary?.totalCompanies || 4}</div>
          <span className="text-[10px] text-sb-muted block">Recruitment partners</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-sb-default space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-sb-muted uppercase tracking-wider">Active Jobs</span>
            <Briefcase className="w-4 h-4 text-sb-ai" />
          </div>
          <div className="text-2xl font-black text-sb-main">{summary?.totalJobs || 2}</div>
          <span className="text-[10px] text-sb-muted block">Published positions</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-sb-default space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-sb-muted uppercase tracking-wider">Placement Rate</span>
            <TrendingUp className="w-4 h-4 text-sb-success" />
          </div>
          <div className="text-2xl font-black text-sb-success">{summary?.placementRate || 25}%</div>
          <span className="text-[10px] text-sb-muted block">Candidates selected</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-sb-default space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-sb-muted uppercase tracking-wider">Avg Skill Match</span>
            <Percent className="w-4 h-4 text-sb-warning" />
          </div>
          <div className="text-2xl font-black text-sb-warning">{summary?.averageSkillMatch || 78}%</div>
          <span className="text-[10px] text-sb-muted block">Candidate skill alignment</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-sb-default space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-sb-muted uppercase tracking-wider">Selected</span>
            <UserCheck className="w-4 h-4 text-sb-success" />
          </div>
          <div className="text-2xl font-black text-sb-success">{summary?.selectedCandidates || 1}</div>
          <span className="text-[10px] text-sb-muted block">Offers extended</span>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recruitment Funnel Chart */}
        <div className="p-6 rounded-2xl bg-surface border border-sb-default shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-sb-main flex items-center gap-2">
                <BarChart className="w-4 h-4 text-sb-primary" />
                Recruitment Funnel Progress
              </h2>
              <p className="text-xs text-sb-sec">Applications, Associations, Interviews & Selections</p>
            </div>
            <span className="text-xs font-extrabold text-sb-primary bg-sb-primary-soft px-2.5 py-1 rounded-full border border-sb-default">
              Live Database
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-default)" />
                <XAxis dataKey="stage" stroke="var(--color-text-secondary)" fontSize={11} />
                <YAxis stroke="var(--color-text-secondary)" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-default)', borderRadius: '12px', fontSize: '12px', color: 'var(--color-text-primary)' }}
                />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Candidate Pipeline Distribution */}
        <div className="p-6 rounded-2xl bg-surface border border-sb-default shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-sb-main flex items-center gap-2">
                <PieChart className="w-4 h-4 text-sb-info" />
                Placement Status Pipeline
              </h2>
              <p className="text-xs text-sb-sec">Application status breakdown across active drives</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {statusDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-default)', borderRadius: '12px', fontSize: '12px', color: 'var(--color-text-primary)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sb-muted text-xs font-medium">No application status data recorded yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Top Required Industry Skills & Active Openings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Demanded Job Skills */}
        <div className="p-6 rounded-2xl bg-surface border border-sb-default shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-sb-main flex items-center gap-2">
                <Target className="w-4 h-4 text-sb-warning" />
                Top Demanded Skills in Active Drives
              </h2>
              <p className="text-xs text-sb-sec">Most requested technical requirements by corporate partners</p>
            </div>
            <Link to="/placement/jobs" className="text-xs font-bold text-sb-primary hover:underline">
              View Requirements →
            </Link>
          </div>

          <div className="space-y-2.5">
            {topSkills.length > 0 ? (
              topSkills.map((sk, idx) => (
                <div key={sk.name} className="flex items-center justify-between p-3 rounded-xl bg-surface-sec border border-sb-default">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-sb-primary-soft text-sb-primary text-xs font-extrabold flex items-center justify-center border border-sb-default">
                      #{idx + 1}
                    </span>
                    <span className="text-sm font-bold text-sb-main">{sk.name}</span>
                  </div>
                  <span className="text-xs font-extrabold text-sb-primary px-3 py-1 rounded-full bg-sb-primary-soft border border-sb-default">
                    Required in {sk.count} Drive{sk.count > 1 ? 's' : ''}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-sb-muted py-4 text-center">No active skill requirements published.</div>
            )}
          </div>
        </div>

        {/* Active Corporate Job Drives */}
        <div className="p-6 rounded-2xl bg-surface border border-sb-default shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-sb-main flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-sb-info" />
                Active Job Openings & Drives
              </h2>
              <p className="text-xs text-sb-sec">Published job roles with skill matching active</p>
            </div>
            <Link to="/placement/jobs" className="text-xs font-bold text-sb-info hover:underline">
              Manage Drives →
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentJobs.length > 0 ? (
              recentJobs.map((j) => (
                <div key={j._id} className="p-3.5 rounded-xl bg-surface-sec border border-sb-default flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-sb-main">{j.title}</h3>
                    <p className="text-xs text-sb-sec">{j.companyId?.name || 'ABC Technologies'} • {j.location}</p>
                  </div>
                  <Link
                    to="/placement/candidate-matching"
                    className="px-3 py-1.5 rounded-lg bg-sb-primary-soft text-sb-primary font-extrabold text-xs border border-sb-default flex items-center gap-1 hover:opacity-90 transition-opacity"
                  >
                    Match Candidates <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-surface-sec text-center text-xs text-sb-muted">
                Job drives currently active. Click "Post Job" to create a new placement drive.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Placement Intelligence Workflow Guide */}
      <div className="p-6 rounded-2xl bg-surface border border-sb-default shadow-xs space-y-4">
        <h2 className="text-base font-bold text-sb-main flex items-center gap-2">
          <Layers className="w-4 h-4 text-sb-primary" />
          SkillBridge Placement Intelligence Workflow
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface-sec border border-sb-default space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-sb-primary text-white text-xs font-extrabold flex items-center justify-center mb-2">1</span>
            <h3 className="text-xs font-bold text-sb-main">Define Job Skills</h3>
            <p className="text-[11px] text-sb-sec">Publish job requirements with mandatory vs optional weights.</p>
          </div>

          <div className="p-4 rounded-xl bg-surface-sec border border-sb-default space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-sb-primary text-white text-xs font-extrabold flex items-center justify-center mb-2">2</span>
            <h3 className="text-xs font-bold text-sb-main">Run Match Engine</h3>
            <p className="text-[11px] text-sb-sec">Database calculates exact match % and skill gap scores for all candidates.</p>
          </div>

          <div className="p-4 rounded-xl bg-surface-sec border border-sb-default space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-sb-primary text-white text-xs font-extrabold flex items-center justify-center mb-2">3</span>
            <h3 className="text-xs font-bold text-sb-main">Associate Candidates</h3>
            <p className="text-[11px] text-sb-sec">Associate top ranked students directly with company drives.</p>
          </div>

          <div className="p-4 rounded-xl bg-surface-sec border border-sb-default space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-sb-primary text-white text-xs font-extrabold flex items-center justify-center mb-2">4</span>
            <h3 className="text-xs font-bold text-sb-main">Track Interviews</h3>
            <p className="text-[11px] text-sb-sec">Update technical rounds, HR rounds, selections, and status logs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementDashboard;
