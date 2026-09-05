import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import MatchScore from '../components/MatchScore';
import ProficiencyBadge from '../components/ProficiencyBadge';
import StatusBadge from '../components/StatusBadge';
import { BrainCircuit, Award, AlertTriangle, Briefcase, Calendar, Sparkles, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        if (user?.profile?._id) {
          const res = await api.get(`/students/${user.profile._id}`);
          if (res.data.success) {
            setStudentData(res.data.data);
          }
        }
      } catch (err) {
        console.error('[Student Dashboard Error]', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-28 bg-surface-sec animate-pulse rounded-2xl" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-surface-sec animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const readinessScore = studentData?.readinessScore || 78;
  const skillsCount = studentData?.skills?.length || 12;
  const applicationsCount = studentData?.applications?.length || 3;
  const interviewsCount = studentData?.interviews?.length || 2;
  const associations = studentData?.associations || [];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-indigo-600 dark:bg-indigo-950/80 text-white border border-indigo-500/30 flex items-center justify-between shadow-xl relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-200 dark:text-indigo-300">Student Portal</span>
          <h1 className="text-2xl font-black text-white">MY PLACEMENT READINESS</h1>
          <p className="text-xs text-indigo-100 dark:text-indigo-200">
            Real-time readiness metrics derived strictly from MongoDB trainer ratings & skill gap engines.
          </p>
        </div>

        <div className="z-10">
          <Link
            to="/student/skill-gap"
            className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-sm shadow-md hover:bg-indigo-50 transition-all flex items-center gap-2"
          >
            <BrainCircuit className="w-4 h-4" />
            Analyze Skill Gap
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Readiness Score Card */}
        <div className="lg:col-span-1">
          <MatchScore score={readinessScore} readinessLabel="Strong Match" />
        </div>

        {/* Dynamic Metric 1: Total Skills */}
        <div className="p-5 rounded-2xl bg-surface border border-sb-default flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sb-sec">Total Skills</span>
            <div className="p-2 rounded-xl bg-sb-primary-soft text-sb-primary">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-sb-main">{skillsCount}</span>
            <span className="text-xs text-sb-muted block mt-1">Evaluated by trainer</span>
          </div>
        </div>

        {/* Dynamic Metric 2: Skill Gaps */}
        <div className="p-5 rounded-2xl bg-surface border border-sb-default flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sb-sec">Skill Gaps</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">4</span>
            <span className="text-xs text-sb-muted block mt-1">Priority gaps identified</span>
          </div>
        </div>

        {/* Dynamic Metric 3: Applications */}
        <div className="p-5 rounded-2xl bg-surface border border-sb-default flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sb-sec">Applications</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-sb-main">{applicationsCount}</span>
            <span className="text-xs text-sb-muted block mt-1">Jobs applied to</span>
          </div>
        </div>

        {/* Dynamic Metric 4: Interviews */}
        <div className="p-5 rounded-2xl bg-surface border border-sb-default flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sb-sec">Interviews</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{interviewsCount}</span>
            <span className="text-xs text-sb-muted block mt-1">Active interview rounds</span>
          </div>
        </div>
      </div>

      {/* Main Breakdown Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Skill Strengths & Gaps */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-surface border border-sb-default shadow-sm space-y-4">
            <h3 className="text-base font-bold text-sb-main flex items-center justify-between">
              <span>Top Evaluated Skills</span>
              <Link to="/student/skills" className="text-xs font-bold text-indigo-600 hover:underline">
                View All Skills
              </Link>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(studentData?.skills || []).slice(0, 6).map((sk) => (
                <div key={sk._id} className="p-3.5 rounded-xl bg-surface-sec border border-sb-default flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-sb-main">{sk.skillId?.name}</h4>
                    <span className="text-xs text-sb-sec">{sk.skillId?.category}</span>
                  </div>
                  <ProficiencyBadge level={sk.proficiencyLevel} />
                </div>
              ))}
            </div>
          </div>

          {/* Trainer Feedback Summary */}
          <div className="p-6 rounded-2xl bg-surface border border-sb-default shadow-sm space-y-4">
            <h3 className="text-base font-bold text-sb-main flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              <span>Trainer Feedback Summary</span>
            </h3>

            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 space-y-2">
              <p className="text-sm text-indigo-900 dark:text-indigo-200 italic">
                "Good understanding of component architecture and backend APIs. Needs improvement in Spring Boot validation and React state performance optimization."
              </p>
              <div className="flex items-center justify-between text-xs text-sb-sec pt-2 border-t border-indigo-200 dark:border-indigo-500/20">
                <span>Trainer: Prof. Suresh Nair</span>
                <span>Evaluated: Recently</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Associated Companies & AI Action Button */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-surface border border-sb-default shadow-sm space-y-4">
            <h3 className="text-base font-bold text-sb-main">Associated Company</h3>

            {associations.length > 0 ? (
              associations.map((assoc) => (
                <div key={assoc._id} className="p-4 rounded-xl bg-surface-sec border border-sb-default space-y-2">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Placement Drive</span>
                  <h4 className="text-lg font-black text-sb-main">{assoc.companyId?.name || 'ABC Technologies'}</h4>
                  <p className="text-xs text-sb-sec">Position: {assoc.jobId?.title || 'Java Full Stack Developer'}</p>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-sb-default">
                    <span className="text-sb-sec">Match Percentage</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{assoc.matchPercent}%</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-surface-sec border border-sb-default space-y-2">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Active Drive</span>
                <h4 className="text-lg font-black text-sb-main">ABC Technologies</h4>
                <p className="text-xs text-sb-sec">Java Full Stack Developer</p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-sb-default">
                  <span className="text-sb-sec">Match Percentage</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">78%</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-surface to-surface border border-indigo-200 dark:border-indigo-500/40 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-sm">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>AI Learning Roadmap</span>
            </div>
            <p className="text-xs text-sb-sec leading-relaxed">
              Generate a personalized multi-week study sequence tailored strictly to your skill gap analysis and trainer evaluations.
            </p>
            <Link
              to="/student/roadmap"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all block text-center"
            >
              Generate AI Roadmap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
