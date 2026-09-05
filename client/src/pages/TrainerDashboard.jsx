import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Users, CheckCircle2, Clock, Award, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TrainerDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        if (user?.profile?._id) {
          const res = await api.get(`/trainers/${user.profile._id}/students`);
          if (res.data.success) {
            setStudents(res.data.data);
          }
        }
      } catch (err) {
        console.error('[Trainer Dashboard Error]', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainerData();
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center text-sb-muted font-medium">Loading trainer analytics...</div>;
  }

  const totalStudents = students.length;
  const evaluatedCount = students.filter((s) => s.evaluationsCount > 0).length;
  const pendingCount = totalStudents - evaluatedCount;
  const readyCount = students.filter((s) => s.overallRating >= 3.5).length;
  const criticalCount = students.filter((s) => s.overallRating < 2.5).length;

  const avgRatingSum = students.reduce((acc, curr) => acc + (curr.overallRating || 0), 0);
  const avgRating = totalStudents > 0 ? (avgRatingSum / totalStudents).toFixed(1) : '4.0';

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="p-6 rounded-3xl bg-indigo-600 dark:bg-indigo-950/80 text-white border border-indigo-500/30 flex items-center justify-between shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-200 dark:text-indigo-300">Trainer Portal</span>
          <h1 className="text-2xl font-black text-white">TRAINER INTELLIGENCE DASHBOARD</h1>
          <p className="text-xs text-indigo-100 dark:text-indigo-200">
            Evaluate candidate proficiencies, manage skill feedback, and match students to corporate job drives.
          </p>
        </div>

        <Link
          to="/trainer/candidate-matcher"
          className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-sm shadow-md hover:bg-indigo-50 transition-all"
        >
          AI Candidate Matcher
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="p-5 rounded-2xl bg-surface border border-sb-default space-y-2 shadow-sm">
          <span className="text-[10px] font-bold text-sb-muted uppercase tracking-wider">Assigned Students</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-sb-main">{totalStudents}</span>
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-sb-default space-y-2 shadow-sm">
          <span className="text-[10px] font-bold text-sb-muted uppercase tracking-wider">Evaluated</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{evaluatedCount}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-sb-default space-y-2 shadow-sm">
          <span className="text-[10px] font-bold text-sb-muted uppercase tracking-wider">Pending Review</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingCount}</span>
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-sb-default space-y-2 shadow-sm">
          <span className="text-[10px] font-bold text-sb-muted uppercase tracking-wider">Avg Skill Score</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{avgRating}/5</span>
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-sb-default space-y-2 shadow-sm">
          <span className="text-[10px] font-bold text-sb-muted uppercase tracking-wider">Placement Ready</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-sky-600 dark:text-sky-400">{readyCount}</span>
            <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-sb-default space-y-2 shadow-sm">
          <span className="text-[10px] font-bold text-sb-muted uppercase tracking-wider">Critical Gaps</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{criticalCount}</span>
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
        </div>
      </div>

      {/* Assigned Students Table */}
      <div className="p-6 rounded-2xl bg-surface border border-sb-default space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-sb-main">Assigned Student Roster</h3>
          <Link to="/trainer/students" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            View & Filter All Students
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-sec text-sb-muted uppercase font-bold tracking-wider border-b border-sb-default">
              <tr>
                <th className="p-3">Candidate Name</th>
                <th className="p-3">Course / Dept</th>
                <th className="p-3">Skills Count</th>
                <th className="p-3">Overall Rating</th>
                <th className="p-3">Associated Company</th>
                <th className="p-3">Interview Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sb-divider">
              {students.map((st) => (
                <tr key={st._id} className="hover:bg-surface-sec transition-colors">
                  <td className="p-3 font-bold text-sb-main">{st.userId?.name}</td>
                  <td className="p-3 text-sb-sec">{st.course}</td>
                  <td className="p-3 text-sb-sec font-bold">{st.skillCount} skills</td>
                  <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">{st.overallRating}/5</td>
                  <td className="p-3 text-sb-sec">{st.associatedCompany}</td>
                  <td className="p-3 text-indigo-600 dark:text-indigo-400 font-medium">{st.interviewStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
