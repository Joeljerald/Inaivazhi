import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import MatchScore from '../components/MatchScore';
import CandidateDrawer from '../components/CandidateDrawer';
import { Search, Filter, UserCheck, Building2, Briefcase, Eye, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';

export const PlacementCandidateMatching = () => {
  const { addToast } = useToast();

  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [skillsList, setSkillsList] = useState([]);

  // Filter Panel States (Part 31 Requirement)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrainerTrack, setSelectedTrainerTrack] = useState('ALL');
  const [filterSkill, setFilterSkill] = useState('');
  const [filterLevel, setFilterLevel] = useState('1');
  const [filterReadiness, setFilterReadiness] = useState('ALL');

  const [selectedJobId, setSelectedJobId] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDrawerStudentId, setActiveDrawerStudentId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [associating, setAssociating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stRes, jobRes, skillRes] = await Promise.all([
        api.get('/students?limit=100'),
        api.get('/jobs'),
        api.get('/skills'),
      ]);

      if (stRes.data.success) setStudents(stRes.data.data);
      if (jobRes.data.success && jobRes.data.data.length > 0) {
        setJobs(jobRes.data.data);
        setSelectedJobId(jobRes.data.data[0]._id);
      }
      if (skillRes.data.success) setSkillsList(skillRes.data.data);
    } catch (err) {
      console.error('[Fetch Intelligence Data Error]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDrawer = (studentId) => {
    setActiveDrawerStudentId(studentId);
    setDrawerOpen(true);
  };

  const handleAssociateCandidate = async (studentId) => {
    if (!studentId || !selectedJobId) return;
    try {
      setAssociating(true);
      const res = await api.post('/associations', {
        studentId,
        jobId: selectedJobId,
      });

      if (res.data.success) {
        addToast('Candidate successfully associated with company job posting!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Association failed', 'error');
    } finally {
      setAssociating(false);
    }
  };

  // Filter candidates locally for real-time responsiveness
  const filteredStudents = students.filter((st) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const nameMatch = st.userId?.name?.toLowerCase().includes(term);
      const emailMatch = st.userId?.email?.toLowerCase().includes(term);
      if (!nameMatch && !emailMatch) return false;
    }
    if (selectedTrainerTrack !== 'ALL') {
      if (!st.course?.toUpperCase().includes(selectedTrainerTrack)) return false;
    }
    return true;
  });

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Title Header (Part 30 Requirement) */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">Talent Intelligence Center</span>
          <h1 className="text-2xl font-black text-white">CANDIDATE INTELLIGENCE</h1>
          <p className="text-xs text-slate-400 mt-1">
            Find the strongest candidates for every job using verified skills and intelligent matching.
          </p>
        </div>
      </div>

      {/* Select Job Bar (Part 32 Requirement) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Target Job Opening</label>
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

      {/* Filter Panel (Part 31 Requirement) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>CANDIDATE FILTER PANEL</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Search Candidate</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-white"
              placeholder="Search name or email..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Trainer Track</label>
            <select
              value={selectedTrainerTrack}
              onChange={(e) => setSelectedTrainerTrack(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white"
            >
              <option value="ALL">All Trainer Tracks</option>
              <option value="MERN">MERN STACK</option>
              <option value="JAVA">JAVA FULL STACK</option>
              <option value="PYTHON">PYTHON STACK</option>
              <option value="DATA SCIENCE">DATA SCIENCE</option>
              <option value="DATA ANALYST">DATA ANALYST</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Skill Filter</label>
            <select
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white"
            >
              <option value="">All Skills</option>
              {skillsList.map((sk) => (
                <option key={sk._id} value={sk.name}>{sk.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTrainerTrack('ALL');
                setFilterSkill('');
              }}
              className="w-full py-2 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Candidate List (Displays ALL candidates from MongoDB initially per Part 30) */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-white flex items-center justify-between">
          <span>ALL CANDIDATES FROM MONGODB ({filteredStudents.length})</span>
        </h3>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading candidates...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((cand, idx) => (
              <div key={cand._id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold text-indigo-400">Candidate #{idx + 1}</span>
                      <h4 className="text-lg font-black text-white">{cand.userId?.name}</h4>
                      <span className="text-xs text-slate-400">{cand.course}</span>
                    </div>

                    <span className="text-sm font-black text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/30">
                      {cand.overallRating}/5 Rating
                    </span>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-bold">Verified Skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(cand.skills || []).map((sk) => (
                        <span key={sk._id} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 text-xs border border-slate-800">
                          {sk.skillId?.name}: <strong className="text-indigo-400">{sk.proficiencyLevel}/5</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex gap-2">
                  <button
                    onClick={() => handleOpenDrawer(cand._id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> Profile Drawer
                  </button>
                  <button
                    onClick={() => handleAssociateCandidate(cand._id)}
                    disabled={associating}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30"
                  >
                    <UserCheck className="w-3.5 h-3.5" /> Associate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Candidate Profile Drawer */}
      <CandidateDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        studentId={activeDrawerStudentId}
        selectedJobId={selectedJobId}
      />
    </div>
  );
};

export default PlacementCandidateMatching;
