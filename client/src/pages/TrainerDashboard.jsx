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
    return <div className="p-8 text-center text-slate-400">Loading trainer analytics...</div>;
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-slate-900 to-slate-900 border border-indigo-500/30 flex items-center justify-between shadow-2xl">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">Trainer Portal</span>
          <h1 className="text-2xl font-black text-white">TRAINER INTELLIGENCE DASHBOARD</h1>
          <p className="text-xs text-slate-300">
            Evaluate candidate proficiencies, manage skill feedback, and match students to corporate job drives.
          </p>
        </div>

        <Link
          to="/trainer/candidate-matcher"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all"
        >
          AI Candidate Matcher
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Students</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-white">{totalStudents}</span>
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Evaluated</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-emerald-400">{evaluatedCount}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Review</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-amber-400">{pendingCount}</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Skill Score</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-indigo-400">{avgRating}/5</span>
            <Award className="w-5 h-5 text-indigo-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Placement Ready</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-sky-400">{readyCount}</span>
            <ShieldCheck className="w-5 h-5 text-sky-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Critical Gaps</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-rose-400">{criticalCount}</span>
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
        </div>
      </div>

      {/* Assigned Students Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white">Assigned Student Roster</h3>
          <Link to="/trainer/students" className="text-xs font-bold text-indigo-400 hover:underline">
            View & Filter All Students
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Candidate Name</th>
                <th className="p-3">Course / Dept</th>
                <th className="p-3">Skills Count</th>
                <th className="p-3">Overall Rating</th>
                <th className="p-3">Associated Company</th>
                <th className="p-3">Interview Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {students.map((st) => (
                <tr key={st._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-white">{st.userId?.name}</td>
                  <td className="p-3 text-slate-300">{st.course}</td>
                  <td className="p-3 text-slate-300 font-bold">{st.skillCount} skills</td>
                  <td className="p-3 font-bold text-emerald-400">{st.overallRating}/5</td>
                  <td className="p-3 text-slate-300">{st.associatedCompany}</td>
                  <td className="p-3 text-indigo-300 font-medium">{st.interviewStatus}</td>
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
