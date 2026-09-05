import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProficiencyBadge from './ProficiencyBadge';
import StatusBadge from './StatusBadge';
import MatchScore from './MatchScore';
import { X, User, Award, BrainCircuit, Sparkles, FileText, Calendar, Building, CheckCircle2 } from 'lucide-react';

export const CandidateDrawer = ({ isOpen, onClose, studentId, selectedJobId }) => {
  const [student, setStudent] = useState(null);
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      if (!studentId) return;
      try {
        setLoading(true);
        const res = await api.get(`/students/${studentId}`);
        if (res.data.success) {
          setStudent(res.data.data);
        }

        if (selectedJobId) {
          const gapRes = await api.get(`/students/${studentId}/jobs/${selectedJobId}/skill-gap`);
          if (gapRes.data.success) {
            setGapAnalysis(gapRes.data.data.analysis);
          }
        }
      } catch (err) {
        console.error('[Candidate Drawer Error]', err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && studentId) {
      fetchCandidateDetails();
    }
  }, [isOpen, studentId, selectedJobId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm transition-all">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white text-lg font-black shadow-lg">
                {student?.userId?.name?.charAt(0) || 'C'}
              </div>
              <div>
                <h2 className="text-xl font-black text-white">{student?.userId?.name || 'Candidate Profile'}</h2>
                <span className="text-xs text-slate-400">{student?.course} • Batch {student?.batch}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Navigation Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 text-xs font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-4 border-b-2 transition-all ${
                activeTab === 'overview' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'
              }`}
            >
              Overview & Ratings
            </button>
            <button
              onClick={() => setActiveTab('gap')}
              className={`py-3 px-4 border-b-2 transition-all ${
                activeTab === 'gap' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'
              }`}
            >
              Skill Gap Analysis
            </button>
            <button
              onClick={() => setActiveTab('journey')}
              className={`py-3 px-4 border-b-2 transition-all ${
                activeTab === 'journey' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'
              }`}
            >
              Applications & Journey
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading candidate intelligence...</div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Self vs Trainer Rating Table (Part 11 Requirement) */}
                    <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                        <Award className="w-4 h-4 text-indigo-400" />
                        <span>Self Assessment vs. Trainer Evaluation</span>
                      </h4>

                      <div className="space-y-2">
                        {(student?.skills || []).map((sk) => (
                          <div key={sk._id} className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-bold text-white block">{sk.skillId?.name}</span>
                              <span className="text-[10px] text-slate-400">{sk.skillId?.category}</span>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <span className="text-[9px] uppercase text-slate-400 block font-bold">Student Says</span>
                                <span className="font-bold text-sky-400">{sk.selfProficiencyLevel || 4}/5</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] uppercase text-slate-400 block font-bold">Trainer Verified</span>
                                <span className="font-bold text-emerald-400">{sk.proficiencyLevel}/5</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Trainer Feedback */}
                    <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Trainer Feedback Summary</h4>
                      <p className="text-xs text-slate-200 italic leading-relaxed">
                        "Strong technical fundamentals. High potential for engineering placement opportunities."
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'gap' && (
                  <div className="space-y-6">
                    {gapAnalysis ? (
                      <div className="space-y-4">
                        <MatchScore score={gapAnalysis.overallMatchPercent} readinessLabel={gapAnalysis.readinessLabel} />

                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase text-slate-400">Skill Level Comparison</h4>
                          {gapAnalysis.skillBreakdown.map((sk) => (
                            <div key={sk.skillId} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                              <span className="font-bold text-white">{sk.name}</span>
                              <span className="text-slate-300">
                                Current: <strong className="text-indigo-400">{sk.currentLevel}/5</strong> • Required: <strong>{sk.requiredLevel}/5</strong>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-400">Select a job opening to evaluate live skill gap match.</div>
                    )}
                  </div>
                )}

                {activeTab === 'journey' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase text-slate-400">Submitted Applications</h4>
                    {(student?.applications || []).map((app) => (
                      <div key={app._id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <h5 className="font-bold text-white">{app.jobId?.title || 'Job Opening'}</h5>
                          <span className="text-slate-400">{app.companyId?.name}</span>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDrawer;
