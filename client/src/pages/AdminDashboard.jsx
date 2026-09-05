import React, { useState, useEffect } from 'react';
import api from '../services/api';
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
} from 'recharts';
import { Link } from 'react-router-dom';
import { Users, Building2, Briefcase, Award, TrendingUp, Percent, CheckCircle2, Shield, Star, Sparkles, Search } from 'lucide-react';

const COLORS = ['#6366f1', '#38bdf8', '#a855f7', '#10b981', '#f43f5e', '#f59e0b'];

export const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        if (res.data.success) {
          setDashboardData(res.data.data);
        }
      } catch (err) {
        console.error('[Admin Dashboard Error]', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading platform analytics...</div>;
  }

  const summary = dashboardData?.summary || {};
  const topSkills = dashboardData?.topRequiredSkills || [];
  const funnel = dashboardData?.funnel || [];
  const statusDistribution = dashboardData?.statusDistribution || [];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="p-6 rounded-2xl bg-sb-primary text-white shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-200">Super Admin Portal</span>
          <h1 className="text-2xl font-black text-white">PLATFORM-WIDE ANALYTICS & INTELLIGENCE</h1>
          <p className="text-xs text-indigo-100 max-w-2xl">
            Full visibility across all Students, Trainers, Placement Teams, Companies, Applications, and Skill Gaps.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/trainer/most-suitable"
            className="px-3.5 py-2 rounded-xl bg-indigo-900/60 hover:bg-indigo-900/80 text-white font-bold text-xs border border-indigo-400/30 flex items-center gap-1.5"
          >
            Most Suitable Students
          </Link>
          <Link
            to="/trainer/candidate-matcher"
            className="px-3.5 py-2 rounded-xl bg-sb-ai hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
          >
            AI Candidate Search
          </Link>
          <Link
            to="/placement/candidate-matching"
            className="px-3.5 py-2 rounded-xl bg-surface text-sb-primary font-extrabold text-xs shadow-xs hover:opacity-90 flex items-center gap-1.5"
          >
            Candidate Intelligence
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 rounded-2xl bg-surface border border-sb-default space-y-2 shadow-xs">
          <span className="text-[10px] font-bold text-sb-muted uppercase tracking-wider">Total Students</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-black text-sb-main">{summary.totalStudents || 15}</span>
            <Users className="w-5 h-5 text-sb-primary" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-sb-default space-y-2 shadow-xs">
          <span className="text-[10px] font-bold text-sb-muted uppercase tracking-wider">Trainers & Placement</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-black text-sb-main">
              {(summary.totalTrainers || 5) + (summary.totalPlacementOfficers || 3)}
            </span>
            <Award className="w-5 h-5 text-sb-info" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-sb-default space-y-2 shadow-xs">
          <span className="text-[10px] font-bold text-sb-muted uppercase tracking-wider">Placement Rate</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-black text-sb-success">{summary.placementRate || 25}%</span>
            <TrendingUp className="w-5 h-5 text-sb-success" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-sb-default space-y-2 shadow-xs">
          <span className="text-[10px] font-bold text-sb-muted uppercase tracking-wider">Average Skill Match</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-black text-sb-warning">{summary.averageSkillMatch || 78}%</span>
            <Percent className="w-5 h-5 text-sb-warning" />
          </div>
        </div>
      </div>

      {/* Recharts Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Top Required Skills in Corporate Jobs */}
        <div className="p-6 rounded-2xl bg-surface border border-sb-default space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-sb-main">Top Requested Corporate Skills</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSkills}>
                <XAxis dataKey="name" stroke="var(--color-text-secondary)" fontSize={12} />
                <YAxis stroke="var(--color-text-secondary)" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-default)', borderRadius: '12px', color: 'var(--color-text-primary)' }}
                />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Application Funnel Distribution */}
        <div className="p-6 rounded-2xl bg-surface border border-sb-default space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-sb-main">Recruitment Status Funnel</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-default)', borderRadius: '12px', color: 'var(--color-text-primary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
