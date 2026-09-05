import React, { useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import MatchScore from '../components/MatchScore';
import { Search, Sparkles, UserCheck, CheckCircle2, ArrowRight, BrainCircuit, MessageSquare } from 'lucide-react';

export const TrainerAICandidateSearch = () => {
  const { addToast } = useToast();

  const [naturalQuery, setNaturalQuery] = useState(
    'Find students who know HTML at Advanced level, JavaScript at Intermediate level and React at Beginner level.'
  );

  const [candidateResults, setCandidateResults] = useState(null);
  const [aiExplanation, setAiExplanation] = useState(null);
  const [searching, setSearching] = useState(false);

  const handleSearchCandidates = async (e) => {
    e?.preventDefault();
    try {
      setSearching(true);
      const res = await api.post('/trainers/filter-students', {
        naturalQuery,
      });

      if (res.data.success) {
        setCandidateResults(res.data.data);
        addToast(`AI Natural Language Search matched ${res.data.count} candidates from MongoDB`, 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Candidate matching failed', 'error');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">Natural Language Intelligence</span>
          <h1 className="text-2xl font-black text-white">AI NATURAL LANGUAGE CANDIDATE SEARCH</h1>
          <p className="text-xs text-slate-400 mt-1">
            Type conversational recruitment requirements. AI normalizes skill aliases and queries real MongoDB candidate records.
          </p>
        </div>
      </div>

      {/* Natural Language Prompt Form (Part 24 Requirement) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <span>TYPE CONVERSATIONAL SEARCH QUERY</span>
        </div>

        <form onSubmit={handleSearchCandidates} className="space-y-4">
          <textarea
            value={naturalQuery}
            onChange={(e) => setNaturalQuery(e.target.value)}
            rows="3"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white font-medium focus:outline-none focus:border-indigo-500"
            placeholder="e.g. Find candidates with Java at Advanced level and React at Intermediate level..."
          />

          <button
            type="submit"
            disabled={searching}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${searching ? 'animate-spin' : ''}`} />
            {searching ? 'Parsing & Querying MongoDB...' : 'Run Natural Language AI Search'}
          </button>
        </form>
      </div>

      {/* Candidate Search Results */}
      {candidateResults && (
        <div className="space-y-6">
          <h3 className="text-lg font-black text-white flex items-center justify-between">
            <span>RETRIEVED CANDIDATES FROM MONGODB</span>
            <span className="text-xs text-indigo-400 font-bold bg-indigo-950 px-3 py-1 rounded-full border border-indigo-500/30">
              {candidateResults.length} Candidates Matched
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {candidateResults.map((st, idx) => (
              <div key={st._id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold text-indigo-400">Match Rank #{idx + 1}</span>
                      <h4 className="text-lg font-black text-white">{st.userId?.name}</h4>
                      <span className="text-xs text-slate-400">{st.course}</span>
                    </div>
                    <span className="text-sm font-black text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/30">
                      {st.overallRating}/5 Rating
                    </span>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Skill Verification</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(st.skills || []).map((sk) => (
                        <span key={sk._id} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 text-xs border border-slate-800">
                          {sk.skillId?.name}: <strong className="text-indigo-400">{sk.proficiencyLevel}/5</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerAICandidateSearch;
