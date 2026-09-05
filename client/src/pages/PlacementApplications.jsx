import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { APPLICATION_STATUSES, INTERVIEW_STATUSES } from '../../../server/config/constants.js';
import { FileCheck, Calendar, Edit3, Plus, UserCheck } from 'lucide-react';

export const PlacementApplications = () => {
  const { addToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('Shortlisted');
  const [statusRemarks, setStatusRemarks] = useState('');

  // Schedule Interview Modal State
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [roundName, setRoundName] = useState('Round 1 Completed');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().slice(0, 16));
  const [interviewRemarks, setInterviewRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/applications');
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error('[Fetch Applications Error]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleOpenStatusModal = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setStatusModalOpen(true);
  };

  const handleOpenInterviewModal = (app) => {
    setSelectedApp(app);
    setInterviewModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      setSubmitting(true);
      const res = await api.put(`/applications/${selectedApp._id}`, {
        status: newStatus,
        remarks: statusRemarks,
      });

      if (res.data.success) {
        addToast(`Application status updated to '${newStatus}'!`, 'success');
        setStatusModalOpen(false);
        setStatusRemarks('');
        fetchApplications();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Status update failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      setSubmitting(true);
      const res = await api.post('/interviews', {
        studentId: selectedApp.studentId?._id,
        companyId: selectedApp.companyId?._id,
        jobId: selectedApp.jobId?._id,
        applicationId: selectedApp._id,
        roundName,
        scheduledDate,
        remarks: interviewRemarks,
      });

      if (res.data.success) {
        addToast(`Interview round '${roundName}' scheduled successfully!`, 'success');
        setInterviewModalOpen(false);
        setInterviewRemarks('');
        fetchApplications();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to schedule interview', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="border-b border-slate-800 pb-5">
        <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">Recruitment Funnel</span>
        <h1 className="text-2xl font-black text-white">PLACEMENT APPLICATIONS & INTERVIEW MANAGEMENT</h1>
        <p className="text-xs text-slate-400 mt-1">
          Control placement workflows, advance candidate interview rounds, and save status timeline history in MongoDB.
        </p>
      </div>

      {/* Applications Roster */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-lg font-black text-white">All Candidate Applications</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Candidate</th>
                <th className="p-3">Company</th>
                <th className="p-3">Job Opening</th>
                <th className="p-3">Match Score</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-white">{app.studentId?.userId?.name || 'Candidate'}</td>
                  <td className="p-3 text-slate-300">{app.companyId?.name || 'Company'}</td>
                  <td className="p-3 text-slate-300 font-medium">{app.jobId?.title || 'Job'}</td>
                  <td className="p-3 font-bold text-indigo-400">{app.matchPercent}%</td>
                  <td className="p-3"><StatusBadge status={app.status} /></td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenStatusModal(app)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold hover:bg-indigo-600 hover:text-white transition-all border border-indigo-500/30"
                    >
                      Update Status
                    </button>
                    <button
                      onClick={() => handleOpenInterviewModal(app)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all border border-slate-700"
                    >
                      Schedule Round
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Application Status Modal */}
      <Modal isOpen={statusModalOpen} onClose={() => setStatusModalOpen(false)} title={`Update Status for ${selectedApp?.studentId?.userId?.name}`}>
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">New Placement Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white font-semibold"
            >
              {APPLICATION_STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Remarks / Feedback</label>
            <textarea
              value={statusRemarks}
              onChange={(e) => setStatusRemarks(e.target.value)}
              rows="3"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
              placeholder="e.g. Candidate cleared Round 1 technical interview."
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setStatusModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
            >
              {submitting ? 'Updating...' : 'Save Status'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Schedule Interview Modal */}
      <Modal isOpen={interviewModalOpen} onClose={() => setInterviewModalOpen(false)} title={`Schedule Interview Round: ${selectedApp?.studentId?.userId?.name}`}>
        <form onSubmit={handleScheduleInterview} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Round Name</label>
            <input
              type="text"
              value={roundName}
              onChange={(e) => setRoundName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white font-semibold"
              placeholder="e.g. Round 1 Completed / Technical Interview"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Scheduled Date & Time</label>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Interview Remarks</label>
            <textarea
              value={interviewRemarks}
              onChange={(e) => setInterviewRemarks(e.target.value)}
              rows="3"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
              placeholder="e.g. Candidate cleared technical screening with distinction."
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setInterviewModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
            >
              {submitting ? 'Scheduling...' : 'Save Interview Round'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PlacementApplications;
