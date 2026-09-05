import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import { Briefcase, Plus, MapPin, DollarSign, Award, Layers } from 'lucide-react';

export const PlacementJobs = () => {
  const { addToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state for job creation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyId, setCompanyId] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Bangalore');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [description, setDescription] = useState('');
  const [salaryRange, setSalaryRange] = useState('8,50,000 - 13,00,000 INR per annum');
  const [submitting, setSubmitting] = useState(false);

  // Job Required Skills configuration inside modal
  const [jobReqSkills, setJobReqSkills] = useState([
    { skillId: '', requiredLevel: 4, mandatory: true, weight: 2 },
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobRes, compRes, skillRes] = await Promise.all([
        api.get('/jobs'),
        api.get('/companies'),
        api.get('/skills'),
      ]);

      if (jobRes.data.success) setJobs(jobRes.data.data);
      if (compRes.data.success) {
        setCompanies(compRes.data.data);
        if (compRes.data.data.length > 0) setCompanyId(compRes.data.data[0]._id);
      }
      if (skillRes.data.success) {
        setSkillsList(skillRes.data.data);
        if (skillRes.data.data.length > 0) {
          setJobReqSkills([
            { skillId: skillRes.data.data[0]._id, requiredLevel: 4, mandatory: true, weight: 2 },
          ]);
        }
      }
    } catch (err) {
      console.error('[Fetch Jobs Error]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSkillRow = () => {
    if (skillsList.length === 0) return;
    setJobReqSkills([
      ...jobReqSkills,
      { skillId: skillsList[0]._id, requiredLevel: 3, mandatory: false, weight: 1 },
    ]);
  };

  const handleRemoveSkillRow = (idx) => {
    setJobReqSkills(jobReqSkills.filter((_, i) => i !== idx));
  };

  const handleSkillChange = (idx, field, value) => {
    const updated = [...jobReqSkills];
    updated[idx][field] = value;
    setJobReqSkills(updated);
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        companyId,
        title,
        location,
        employmentType,
        description,
        salaryRange,
        requiredSkills: jobReqSkills,
      };

      const res = await api.post('/jobs', payload);
      if (res.data.success) {
        addToast(`Job opening '${title}' published successfully!`, 'success');
        setIsModalOpen(false);
        setTitle('');
        setDescription('');
        fetchData();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to publish job opening', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">Opportunity Management</span>
          <h1 className="text-2xl font-black text-white">JOB OPENINGS & WEIGHTED SKILL SPECS</h1>
          <p className="text-xs text-slate-400 mt-1">
            Define target job openings, mandatory requirements (level 1-5), and custom skill weights stored in MongoDB.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Job Opening
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div key={job._id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    {job.companyId?.name || 'Company'}
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">{job.title}</h3>
                  <span className="text-xs text-slate-400">{job.location} • {job.employmentType}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-950 text-indigo-300 text-xs font-bold border border-slate-800">
                  {job.applicationsCount || 0} Applicants
                </span>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2">{job.description}</p>

              {/* Required Skills Badges */}
              <div className="space-y-1.5 pt-3 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Required Skill Specifications</span>
                <div className="flex flex-wrap gap-1.5">
                  {(job.requiredSkills || []).map((reqSk, idx) => (
                    <span key={idx} className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      reqSk.mandatory ? 'bg-rose-950/60 border-rose-500/40 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}>
                      {reqSk.skillId?.name || 'Skill'}: <strong className="text-indigo-400">{reqSk.requiredLevel}/5</strong>
                      {reqSk.mandatory && <span className="ml-1 text-[9px] uppercase tracking-wider text-rose-400">(Req)</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Salary: <strong className="text-white">{job.salaryRange}</strong></span>
              <span>Published: {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Job Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Publish New Job Opening & Skill Specs" maxWidth="max-w-3xl">
        <form onSubmit={handleCreateJob} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Select Hiring Company</label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white font-semibold"
              >
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>{c.name} ({c.industry})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                placeholder="e.g. Java Full Stack Developer"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                placeholder="Bangalore, India"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Employment Type</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white font-semibold"
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Salary Range</label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                placeholder="8,50,000 - 13,00,000 INR"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Job Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
              placeholder="Provide role responsibilities..."
              required
            />
          </div>

          {/* Dynamic Required Skill Rows (Part 10 requirement) */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Configure Required Skills</label>
              <button
                type="button"
                onClick={handleAddSkillRow}
                className="text-xs text-indigo-400 hover:underline font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Skill Spec
              </button>
            </div>

            {jobReqSkills.map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="col-span-4">
                  <select
                    value={row.skillId}
                    onChange={(e) => handleSkillChange(idx, 'skillId', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  >
                    {skillsList.map((sk) => (
                      <option key={sk._id} value={sk._id}>{sk.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-3">
                  <select
                    value={row.requiredLevel}
                    onChange={(e) => handleSkillChange(idx, 'requiredLevel', parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="1">Level 1 (Beginner)</option>
                    <option value="2">Level 2 (Basic)</option>
                    <option value="3">Level 3 (Intermediate)</option>
                    <option value="4">Level 4 (Advanced)</option>
                    <option value="5">Level 5 (Expert)</option>
                  </select>
                </div>

                <div className="col-span-3 flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={row.mandatory}
                      onChange={(e) => handleSkillChange(idx, 'mandatory', e.target.checked)}
                      className="rounded accent-indigo-600"
                    />
                    <span>Mandatory</span>
                  </label>
                </div>

                <div className="col-span-2 text-right">
                  {jobReqSkills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSkillRow(idx)}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
            >
              {submitting ? 'Publishing...' : 'Publish Opening'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PlacementJobs;
