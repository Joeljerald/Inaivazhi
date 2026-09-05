import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import MatchScore from '../components/MatchScore';
import SkillGapCard from '../components/SkillGapCard';
import AIRecommendationCard from '../components/AIRecommendationCard';
import { BrainCircuit, RefreshCw, Sparkles, Briefcase, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentSkillGap = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Fetch available jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs');
        if (res.data.success && res.data.data.length > 0) {
          setJobs(res.data.data);
          // Default select the primary demo job: Java Full Stack Developer
          const defaultJob = res.data.data.find((j) => j.title.includes('Java Full Stack')) || res.data.data[0];
          setSelectedJobId(defaultJob._id);
        }
      } catch (err) {
        console.error('[Fetch Jobs Error]', err.message);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  // Run skill gap calculation
  const handleAnalyze = async (showToast = true) => {
    if (!selectedJobId || !user?.profile?._id) return;
    try {
      setAnalyzing(true);

      const [gapRes, recRes] = await Promise.all([
        api.get(`/students/${user.profile._id}/jobs/${selectedJobId}/skill-gap`),
        api.get(`/students/${user.profile._id}/jobs/${selectedJobId}/recommendations`),
      ]);

      if (gapRes.data.success) {
        setAnalysisResult(gapRes.data.data);
      }
      if (recRes.data.success) {
        setRecommendations(recRes.data.data.recommendations || []);
      }

      if (showToast) {
        addToast('Skill gap analysis refreshed from live MongoDB data!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || err.message || 'Analysis failed', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    if (selectedJobId && user?.profile?._id) {
      handleAnalyze(false);
    }
  }, [selectedJobId, user]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">Core Engine</span>
          <h1 className="text-2xl font-black text-white">SKILL GAP ANALYZER</h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare current skill proficiencies against target job requirements in real-time.
          </p>
        </div>

        <button
          onClick={() => handleAnalyze(true)}
          disabled={analyzing}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-indigo-400 ${analyzing ? 'animate-spin' : ''}`} />
          {analyzing ? 'Re-analyzing...' : 'Re-analyze'}
        </button>
      </div>

      {/* Target Job Selector */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Select Target Job Opening</label>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full sm:w-1/2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-indigo-500 transition-colors"
          >
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title} — {job.companyId?.name || 'Company'} ({job.location})
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <span>Targeting position with weighted skill metrics</span>
          </div>
        </div>
      </div>

      {analysisResult && (
        <div className="space-y-8">
          {/* Match Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <MatchScore
                score={analysisResult.analysis.overallMatchPercent}
                readinessLabel={analysisResult.analysis.readinessLabel}
              />
            </div>

            <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Analysis Summary</span>
                <h3 className="text-lg font-black text-white mt-1">
                  {analysisResult.job.title} at {analysisResult.job.companyName}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Calculated using exact formula: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-indigo-300">weightedScore = sum(score × weight) / sum(weight)</code>.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 mt-4 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Matched Skills</span>
                  <span className="text-xl font-black text-emerald-400 mt-0.5 block">
                    {analysisResult.analysis.matchedSkills.length}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Skill Gaps</span>
                  <span className="text-xl font-black text-amber-400 mt-0.5 block">
                    {analysisResult.analysis.gaps.length}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Mandatory Gaps</span>
                  <span className="text-xl font-black text-rose-400 mt-0.5 block">
                    {analysisResult.analysis.mandatoryGaps.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Breakdown Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-400" />
              <span>Skill Level Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysisResult.analysis.skillBreakdown.map((sk) => (
                <SkillGapCard key={sk.skillId} skill={sk} />
              ))}
            </div>
          </div>

          {/* Prioritized Recommendations */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Prioritized Learning Recommendations</span>
              </h3>

              <Link
                to="/student/roadmap"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
              >
                Generate AI Roadmap
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec, idx) => (
                <AIRecommendationCard key={rec.skillId || idx} recommendation={rec} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSkillGap;
