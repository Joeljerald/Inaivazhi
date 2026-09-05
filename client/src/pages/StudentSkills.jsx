import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ProficiencyBadge from '../components/ProficiencyBadge';
import { Award, UserCheck, Calendar, Info } from 'lucide-react';

export const StudentSkills = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        if (user?.profile?._id) {
          const res = await api.get(`/students/${user.profile._id}/skills`);
          if (res.data.success) {
            setSkills(res.data.data);
          }
        }
      } catch (err) {
        console.error('[Student Skills Error]', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading student skills...</div>;
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">Evaluated Catalog</span>
          <h1 className="text-2xl font-black text-white">MY SKILLS & TRAINER RATINGS</h1>
          <p className="text-xs text-slate-400 mt-1">
            Ratings and feedback provided directly by assigned trainers (read-only for students).
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-xs text-indigo-300 font-semibold flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-400" />
          <span>Ratings locked by Trainer verification</span>
        </div>
      </div>

      {skills.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400">
          <Award className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-40" />
          <p className="text-base font-bold text-white">No Skills Evaluated Yet</p>
          <p className="text-xs mt-1">Assigned trainer evaluations will populate here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((sk) => (
            <div key={sk._id || sk.skillId} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-xl hover:border-slate-700 transition-all">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{sk.name}</h3>
                    <span className="text-xs text-slate-400">{sk.category}</span>
                  </div>
                  <ProficiencyBadge level={sk.proficiencyLevel} />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Trainer Rating
                    </span>
                    <span className="text-emerald-400 font-bold">{sk.trainerRating ? `${sk.trainerRating}/5` : 'Pending'}</span>
                  </div>
                  <p className="text-xs text-slate-300 italic pt-1 border-t border-slate-800/60">
                    "{sk.trainerFeedback || 'Good component understanding. Practice performance optimization.'}"
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" /> Evaluated Date
                </span>
                <span>{new Date(sk.lastEvaluatedDate || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentSkills;
