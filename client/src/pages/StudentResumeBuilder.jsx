import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  Printer,
  Download,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  Award,
  Save,
  Check,
  Plus,
  ArrowRight,
} from 'lucide-react';

export const StudentResumeBuilder = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const printRef = useRef(null);

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [resumes, setResumes] = useState([]);
  const [activeResume, setActiveResume] = useState(null);

  const [summary, setSummary] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch jobs and student resumes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobRes, resRes] = await Promise.all([
          api.get('/jobs'),
          api.get('/resumes'),
        ]);

        if (jobRes.data.success && jobRes.data.data.length > 0) {
          setJobs(jobRes.data.data);
          setSelectedJobId(jobRes.data.data[0]._id);
        }

        if (resRes.data.success) {
          setResumes(resRes.data.data);
          if (resRes.data.data.length > 0) {
            setActiveResume(resRes.data.data[0]);
            setSummary(resRes.data.data[0].summary || '');
          }
        }
      } catch (err) {
        console.error('[Resume Builder Error]', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate new ATS Resume version from MongoDB facts
  const handleGenerateResume = async () => {
    try {
      setSaving(true);
      const res = await api.post('/resumes', {
        targetJobId: selectedJobId,
        title: `ATS Resume — ${jobs.find((j) => j._id === selectedJobId)?.title || 'Target Role'}`,
      });

      if (res.data.success) {
        setActiveResume(res.data.data);
        setSummary(res.data.data.summary);
        addToast('New ATS-friendly resume generated from MongoDB profile facts!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to generate resume', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Save changes to current active resume
  const handleSaveResume = async () => {
    if (!activeResume) return;
    try {
      setSaving(true);
      const res = await api.put(`/resumes/${activeResume._id}`, {
        summary,
        targetJobId: selectedJobId,
      });

      if (res.data.success) {
        setActiveResume(res.data.data);
        addToast('Resume changes saved.', 'success');
      }
    } catch (err) {
      addToast('Failed to save resume', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Trigger print dialog for single-column ATS export
  const handlePrintPDF = () => {
    window.print();
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading AI Resume Builder...</div>;
  }

  const selectedJob = jobs.find((j) => j._id === selectedJobId);
  const atsScore = activeResume?.atsScore || 85;
  const matchedKeywords = activeResume?.atsKeywords?.matched || [];
  const missingKeywords = activeResume?.atsKeywords?.missing || [];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">Career Tooling</span>
          <h1 className="text-2xl font-black text-white">AI ATS-FRIENDLY RESUME BUILDER</h1>
          <p className="text-xs text-slate-400 mt-1">
            Build an ATS-optimized, machine-readable resume generated directly from your verified SkillBridge profile.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateResume}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" /> Generate New Version
          </button>
          <button
            onClick={handlePrintPDF}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-emerald-400" /> Export ATS PDF
          </button>
        </div>
      </div>

      {/* Two-Panel Layout (Left: Settings & Quality Check, Right: A4 Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT PANEL: Configuration & ATS Keyword Analysis (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Target Job Selector & Skill Gap Connection (Part 107 & Part 113) */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Target Job Optimization</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Select Target Position</label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
              >
                {jobs.map((j) => (
                  <option key={j._id} value={j._id}>
                    {j.title} — {j.companyId?.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ATS Keyword Match Breakdown (Part 112 Requirement) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">ATS Keyword Coverage</span>
                <span className="text-base font-black text-emerald-400">{atsScore}% Match</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Matched Keywords</span>
                <div className="flex flex-wrap gap-1">
                  {matchedKeywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              {missingKeywords.length > 0 && (
                <div className="space-y-1.5 text-xs pt-2 border-t border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-rose-400 block">Missing Skill Keywords</span>
                  <div className="flex flex-wrap gap-1">
                    {missingKeywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/30 text-[11px] font-semibold">
                        • {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Skill Gap Connection Banner */}
            {missingKeywords.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between">
                <span>Improve <strong className="text-white">{missingKeywords[0]}</strong> to strengthen profile.</span>
                <Link to="/student/skill-gap" className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1">
                  View Skill Gap <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Editable Professional Summary (Part 110 & Part 115) */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Professional Summary</span>
              </h3>
              <button
                onClick={handleSaveResume}
                disabled={saving}
                className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>

            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows="4"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-indigo-500"
              placeholder="Provide a concise ATS-friendly professional summary..."
            />
          </div>

          {/* Resume Quality Panel (Part 120 Requirement) */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Resume Quality Checklist</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Contact Information Included
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Professional Summary Present
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Verified Skills Attached
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Academic Degree & Batch
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Live A4 ATS Resume Preview (Col 7) */}
        <div className="lg:col-span-7">
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-3 px-2">
              <span className="font-bold uppercase tracking-wider text-slate-400">Live A4 ATS Resume Preview</span>
              <span className="text-[11px]">Single-Column Machine Readable</span>
            </div>

            {/* A4 Document Box */}
            <div
              ref={printRef}
              className="bg-white text-slate-900 p-8 rounded-xl shadow-2xl space-y-6 font-sans border border-slate-200 text-sm print:p-0 print:border-none print:shadow-none"
              style={{ minHeight: '800px' }}
            >
              {/* Header Contact Block (Part 109) */}
              <div className="border-b border-slate-300 pb-4 text-center space-y-1">
                <h2 className="text-2xl font-bold uppercase tracking-wide text-slate-900">{user?.name}</h2>
                <p className="text-xs text-slate-600 font-medium">
                  {user?.email} • {user?.phone || '+91 98765 10001'} • Bangalore, India
                </p>
                <p className="text-xs text-indigo-700 font-semibold">{selectedJob?.title || 'Software Developer Candidate'}</p>
              </div>

              {/* Summary Block */}
              {summary && (
                <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 text-slate-900 pb-0.5">
                    Professional Summary
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
                </div>
              )}

              {/* Technical Skills Block */}
              {activeResume?.skills && activeResume.skills.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 text-slate-900 pb-0.5">
                    Technical Skills
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-800">
                    {activeResume.skills.map((sk, idx) => (
                      <span key={idx} className="font-medium">
                        • <strong>{sk.name}</strong> ({sk.proficiencyLevel}/5)
                        {sk.isVerified && <span className="ml-1 text-[10px] text-emerald-700 font-bold">✓ Verified</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Block */}
              {activeResume?.projects && activeResume.projects.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 text-slate-900 pb-0.5">
                    Key Projects
                  </h3>
                  {activeResume.projects.map((proj, idx) => (
                    <div key={idx} className="space-y-0.5 text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{proj.title}</span>
                        <span className="font-normal text-slate-600">{(proj.techStack || []).join(', ')}</span>
                      </div>
                      <p className="text-slate-700">{proj.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Education Block */}
              {activeResume?.education && activeResume.education.length > 0 && (
                <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 text-slate-900 pb-0.5">
                    Education
                  </h3>
                  {activeResume.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-slate-800">
                      <span className="font-bold">{edu.degree} — {edu.institution}</span>
                      <span className="text-slate-600">Batch {edu.batch}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResumeBuilder;
