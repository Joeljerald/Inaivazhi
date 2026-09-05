import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import InterviewTimeline from '../components/InterviewTimeline';
import { Briefcase, Building2, Calendar, FileText } from 'lucide-react';

export const StudentApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [associations, setAssociations] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, assocRes, intRes] = await Promise.all([
          api.get('/applications'),
          api.get('/associations'),
          api.get('/interviews'),
        ]);

        if (appRes.data.success) setApplications(appRes.data.data);
        if (assocRes.data.success) setAssociations(assocRes.data.data);
        if (intRes.data.success) setInterviews(intRes.data.data);
      } catch (err) {
        console.error('[Student Applications Error]', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading placement records...</div>;
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="border-b border-slate-800 pb-5">
        <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">Placement Tracking</span>
        <h1 className="text-2xl font-black text-white">APPLICATIONS, COMPANIES & INTERVIEWS</h1>
        <p className="text-xs text-slate-400 mt-1">
          Track real-time candidate associations, job applications, and interview round status updates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Applications & Associated Companies */}
        <div className="lg:col-span-2 space-y-8">
          {/* Applications Table */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Submitted Applications</span>
            </h3>

            {applications.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No job applications submitted yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/70 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Job Opening</th>
                      <th className="p-3">Company</th>
                      <th className="p-3">Match Score</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Applied Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {applications.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-bold text-white">{app.jobId?.title || 'Job Posting'}</td>
                        <td className="p-3 text-slate-300">{app.companyId?.name || 'Company'}</td>
                        <td className="p-3 font-bold text-indigo-400">{app.matchPercent}%</td>
                        <td className="p-3"><StatusBadge status={app.status} /></td>
                        <td className="p-3 text-slate-400">{new Date(app.appliedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Associated Companies */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>Associated Placement Drives</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {associations.map((assoc) => (
                <div key={assoc._id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Confirmed Drive</span>
                  <h4 className="text-base font-bold text-white">{assoc.companyId?.name}</h4>
                  <p className="text-xs text-slate-400">Position: {assoc.jobId?.title}</p>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                    <span className="text-slate-400">Skill Match</span>
                    <span className="font-bold text-indigo-400">{assoc.matchPercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interview Timeline */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <span>Interview Round Timeline</span>
            </h3>

            <InterviewTimeline interviews={interviews} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentApplications;
