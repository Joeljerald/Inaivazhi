import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MatchScore from '../components/MatchScore';
import { Award, Briefcase, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';

export const TrainerMostSuitable = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchSuitableCandidates = async () => {
    if (!selectedJobId) return;
    try {
      setLoading(true);
      const res = await api.get(`/trainers/most-suitable/${selectedJobId}`);
      if (res.data.success) {
        setCandidates(res.data.data);
      }
    } catch (err) {
      console.error('[Fetch Suitable Error]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedJobId) {
      fetchSuitableCandidates();
    }
  }, [selectedJobId]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">Trainer Intelligence</span>
          <h1 className="text-2xl font-black text-white">MOST SUITABLE CANDIDATES</h1>
          <p className="text-xs text-slate-400 mt-1">
            Discover which assigned candidates are closest to placement readiness for target corporate jobs.
          </p>
        </div>
      </div>

      {/* Target Job Selector */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Select Target Position</label>
        <select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          className="w-full sm:w-1/2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
        >
          {jobs.map((j) => (
            <option key={j._id} value={j._id}>
              {j.title} — {j.companyId?.name} ({j.location})
            </option>
          ))}
        </select>
      </div>

      {/* Candidate Ranking List */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-white">Ranked Candidate Suitability</h3>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Calculating candidate readiness ranks...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {candidates.map((cand, idx) => (
              <div key={cand.student._id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold text-indigo-400">Rank #{idx + 1}</span>
                      <h4 className="text-lg font-black text-white">{cand.student.userId?.name}</h4>
                      <span className="text-xs text-slate-400">{cand.student.course}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-400">{cand.matchPercent}%</span>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">{cand.readinessLabel}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 text-xs text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span>Matched Skills:</span>
                      <strong className="text-emerald-400">{cand.matchedSkills.length}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Mandatory Gaps:</span>
                      <strong className="text-rose-400">{cand.mandatoryGaps.length}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerMostSuitable;
