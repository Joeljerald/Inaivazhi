import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Sparkles, Calendar, BookOpen, CheckCircle, Target, ArrowRight } from 'lucide-react';

export const StudentAIRoadmap = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [roadmap, setRoadmap] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs');
        if (res.data.success && res.data.data.length > 0) {
          setJobs(res.data.data);
          setSelectedJobId(res.data.data[0]._id);
        }
      } catch (err) {
        console.error('[Fetch Jobs Error]', err.message);
      }
    };
    fetchJobs();
  }, []);

  const handleGenerateRoadmap = async () => {
    if (!selectedJobId || !user?.profile?._id) return;
    try {
      setGenerating(true);
      const res = await api.post('/ai/student-roadmap', {
        studentId: user.profile._id,
        jobId: selectedJobId,
      });

      if (res.data.success) {
        setRoadmap(res.data.data);
        addToast('Personalized AI Learning Roadmap generated!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to generate roadmap', 'error');
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (selectedJobId && user?.profile?._id) {
      handleGenerateRoadmap();
    }
  }, [selectedJobId, user]);

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">AI Intelligence Layer</span>
          <h1 className="text-2xl font-black text-white">PERSONALIZED AI LEARNING ROADMAP</h1>
          <p className="text-xs text-slate-400 mt-1">
            Synthesized strictly from verified MongoDB student skills, trainer feedback, and target job requirements.
          </p>
        </div>

        <button
          onClick={handleGenerateRoadmap}
          disabled={generating}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Synthesizing...' : 'Regenerate Roadmap'}
        </button>
      </div>

      {/* Select Job */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Target Role</label>
        <select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
        >
          {jobs.map((j) => (
            <option key={j._id} value={j._id}>
              {j.title} — {j.companyId?.name}
            </option>
          ))}
        </select>
      </div>

      {roadmap && (
        <div className="space-y-8">
          {/* Summary Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>AI Analysis Overview</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">{roadmap.summary}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-indigo-500/20">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Top Strengths</span>
                <ul className="mt-1.5 space-y-1 text-xs text-slate-300">
                  {roadmap.topStrengths.map((str, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {str}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Critical Focus Areas</span>
                <ul className="mt-1.5 space-y-1 text-xs text-slate-300">
                  {roadmap.criticalGaps.map((gap, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Target className="w-3.5 h-3.5 text-rose-400 shrink-0" /> {gap}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Multi-Week Weekly Roadmap */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <span>Structured Weekly Learning Plan</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roadmap.weeklyRoadmap.map((week, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-indigo-500/50 transition-all shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 text-xs font-extrabold border border-indigo-500/30">
                      {week.week}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">4-5 Hours / Week</span>
                  </div>

                  <h4 className="text-base font-bold text-white">{week.topic}</h4>
                  <p className="text-xs text-slate-300 italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    "{week.focus}"
                  </p>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] uppercase font-bold text-slate-400 block">Actionable Steps</span>
                    {week.actionableSteps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAIRoadmap;
