import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ProficiencyBadge from '../components/ProficiencyBadge';
import { Award, UserCheck, ShieldCheck, User, Calendar, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

export const StudentSkillPassport = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPassport = async () => {
      try {
        if (user?.profile?._id) {
          const res = await api.get(`/students/${user.profile._id}`);
          if (res.data.success) {
            setProfile(res.data.data);
          }
        }
      } catch (err) {
        console.error('[Skill Passport Error]', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPassport();
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Digital Skill Passport...</div>;
  }

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Passport Hero Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/40 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white text-2xl font-black shadow-xl">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Verified Skill Passport
              </span>
              <h1 className="text-2xl font-black text-white mt-1">{user?.name}</h1>
              <p className="text-xs text-slate-300">{profile?.targetRole || 'Full Stack Software Engineer'} • Batch {profile?.batch}</p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Trainer Verified Digital Identity</span>
          </div>
        </div>
      </div>

      {/* Self Assessment vs Trainer Evaluation (Part 11 Requirement) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <span>SKILL VERIFICATION PASSPORT</span>
          </h3>
          <span className="text-xs text-slate-400">Comparing Student Self-Assessment vs. Trainer Rating</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(profile?.skills || []).map((sk) => {
            const selfLevel = sk.selfProficiencyLevel || 4;
            const trainerLevel = sk.proficiencyLevel || 2;
            const hasDiff = selfLevel !== trainerLevel;

            return (
              <div key={sk._id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{sk.skillId?.name}</h4>
                    <span className="text-xs text-slate-400">{sk.skillId?.category}</span>
                  </div>

                  <ProficiencyBadge level={trainerLevel} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Student Says</span>
                    <span className="text-sm font-extrabold text-sky-400 mt-0.5 block">{selfLevel}/5</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Trainer Verified</span>
                    <span className={`text-sm font-extrabold mt-0.5 block ${hasDiff ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {trainerLevel}/5
                    </span>
                  </div>
                </div>

                {hasDiff && (
                  <p className="text-[11px] text-amber-300/90 italic bg-amber-950/30 p-2 rounded border border-amber-500/20">
                    "Self-assessed level {selfLevel}/5 vs verified level {trainerLevel}/5. Focus on performance optimizations."
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentSkillPassport;
