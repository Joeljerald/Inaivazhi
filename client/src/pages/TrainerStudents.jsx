import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import Modal from '../components/Modal';
import ProficiencyBadge from '../components/ProficiencyBadge';
import { Filter, Search, Award, Plus, CheckCircle2, UserCheck, Sparkles } from 'lucide-react';

export const TrainerStudents = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [students, setStudents] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Multi-Skill Filter inputs
  const [filterSkill1, setFilterSkill1] = useState('HTML');
  const [filterLevel1, setFilterLevel1] = useState('4');
  const [filterSkill2, setFilterSkill2] = useState('JavaScript');
  const [filterLevel2, setFilterLevel2] = useState('3');

  // Evaluation Modal State
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [evalSkillId, setEvalSkillId] = useState('');
  const [evalRating, setEvalRating] = useState('4');
  const [evalFeedback, setEvalFeedback] = useState('');
  const [evalStrength, setEvalStrength] = useState('');
  const [evalImprovement, setEvalImprovement] = useState('');
  const [submittingEval, setSubmittingEval] = useState(false);

  // Fetch initial assigned students and skills catalog
  const fetchStudents = async () => {
    try {
      setLoading(true);
      if (user?.profile?._id) {
        const res = await api.get(`/trainers/${user.profile._id}/students`);
        if (res.data.success) {
          setStudents(res.data.data);
        }
      }
      const skillsRes = await api.get('/skills');
      if (skillsRes.data.success) {
        setSkillsList(skillsRes.data.data);
        if (skillsRes.data.data.length > 0) setEvalSkillId(skillsRes.data.data[0]._id);
      }
    } catch (err) {
      console.error('[Trainer Students Error]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [user]);

  // Handle multi-skill filtering (Part 4 requirement: React >= 3 AND HTML >= 4)
  const handleApplyFilter = async () => {
    try {
      setLoading(true);
      const filterBody = {
        skillsFilter: [
          { skillName: filterSkill1, minLevel: parseInt(filterLevel1) },
          { skillName: filterSkill2, minLevel: parseInt(filterLevel2) },
        ],
      };

      const res = await api.post('/trainers/filter-students', filterBody);
      if (res.data.success) {
        setStudents(res.data.data);
        addToast(`Filtered ${res.data.count} candidates matching criteria`, 'success');
      }
    } catch (err) {
      addToast('Skill filtering failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEvalModal = (student) => {
    setSelectedStudent(student);
    setEvalModalOpen(true);
  };

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !evalSkillId) return;

    try {
      setSubmittingEval(true);
      const res = await api.post('/evaluations', {
        studentId: selectedStudent._id,
        skillId: evalSkillId,
        rating: parseInt(evalRating),
        feedback: evalFeedback,
        strength: evalStrength,
        improvementArea: evalImprovement,
      });

      if (res.data.success) {
        addToast(`Evaluation submitted for ${selectedStudent.userId?.name}!`, 'success');
        setEvalModalOpen(false);
        setEvalFeedback('');
        setEvalStrength('');
        setEvalImprovement('');
        fetchStudents(); // Refresh updated ratings
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Evaluation submission failed', 'error');
    } finally {
      setSubmittingEval(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">Trainer Portal</span>
          <h1 className="text-2xl font-black text-white">STUDENT EVALUATIONS & SKILL FILTERING</h1>
          <p className="text-xs text-slate-400 mt-1">
            Perform skill assessment evaluations and query candidates by dynamic multi-skill criteria.
          </p>
        </div>
      </div>

      {/* Multi-Skill Filter Bar (Part 4 Requirement) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>FILTER STUDENTS BY SKILLS (Queries Real Backend Data)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Skill 1</label>
            <select
              value={filterSkill1}
              onChange={(e) => setFilterSkill1(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white"
            >
              {skillsList.map((s) => (
                <option key={s._id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Min Level 1</label>
            <select
              value={filterLevel1}
              onChange={(e) => setFilterLevel1(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white"
            >
              {[1, 2, 3, 4, 5].map((lvl) => (
                <option key={lvl} value={lvl}>Level {lvl}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Skill 2</label>
            <select
              value={filterSkill2}
              onChange={(e) => setFilterSkill2(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white"
            >
              {skillsList.map((s) => (
                <option key={s._id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Min Level 2</label>
            <select
              value={filterLevel2}
              onChange={(e) => setFilterLevel2(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white"
            >
              {[1, 2, 3, 4, 5].map((lvl) => (
                <option key={lvl} value={lvl}>Level {lvl}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleApplyFilter}
              className="w-full py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              Apply Filter
            </button>
            <button
              onClick={fetchStudents}
              className="py-2 px-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Student List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((st) => (
          <div key={st._id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{st.userId?.name}</h3>
                  <span className="text-xs text-slate-400">{st.course}</span>
                </div>
                <span className="text-xs font-black text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/30">
                  {st.overallRating}/5 Rating
                </span>
              </div>

              {/* Evaluated Skills Badges */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Skills & Levels</span>
                <div className="flex flex-wrap gap-1.5">
                  {(st.skills || []).map((sk) => (
                    <span key={sk._id} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 text-xs border border-slate-800">
                      {sk.skillId?.name}: <strong className="text-indigo-400">{sk.proficiencyLevel}/5</strong>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleOpenEvalModal(st)}
              className="w-full mt-4 py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-indigo-300 font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              Evaluate Candidate
            </button>
          </div>
        ))}
      </div>

      {/* Evaluation Modal */}
      <Modal
        isOpen={evalModalOpen}
        onClose={() => setEvalModalOpen(false)}
        title={`Evaluate Candidate: ${selectedStudent?.userId?.name || 'Student'}`}
      >
        <form onSubmit={handleSubmitEvaluation} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Select Skill to Evaluate</label>
            <select
              value={evalSkillId}
              onChange={(e) => setEvalSkillId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white font-semibold"
            >
              {skillsList.map((sk) => (
                <option key={sk._id} value={sk._id}>{sk.name} ({sk.category})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Proficiency Rating (1-5)</label>
            <select
              value={evalRating}
              onChange={(e) => setEvalRating(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white font-semibold"
            >
              <option value="1">1 — Beginner</option>
              <option value="2">2 — Basic</option>
              <option value="3">3 — Intermediate</option>
              <option value="4">4 — Advanced</option>
              <option value="5">5 — Expert</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Trainer Feedback</label>
            <textarea
              value={evalFeedback}
              onChange={(e) => setEvalFeedback(e.target.value)}
              rows="3"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
              placeholder="e.g. Good understanding of component architecture. Needs improvement in performance optimization."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Key Strengths</label>
              <input
                type="text"
                value={evalStrength}
                onChange={(e) => setEvalStrength(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                placeholder="e.g. Clean code principles"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Improvement Area</label>
              <input
                type="text"
                value={evalImprovement}
                onChange={(e) => setEvalImprovement(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                placeholder="e.g. Hooks optimization"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEvalModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingEval}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
            >
              {submittingEval ? 'Submitting...' : 'Save Evaluation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TrainerStudents;
