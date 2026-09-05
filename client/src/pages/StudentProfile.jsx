import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Phone, BookOpen, Building, MapPin, Calendar, Award } from 'lucide-react';

export const StudentProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.profile?._id) {
          const res = await api.get(`/students/${user.profile._id}`);
          if (res.data.success) {
            setProfile(res.data.data);
          }
        }
      } catch (err) {
        console.error('[Student Profile Error]', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading student profile...</div>;
  }

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center gap-6 shadow-2xl">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl">
          {user?.name?.charAt(0) || 'S'}
        </div>
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-extrabold tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Student Profile
          </span>
          <h1 className="text-2xl font-black text-white">{user?.name}</h1>
          <p className="text-sm text-slate-400">{profile?.course || 'Full Stack Software Engineering'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
            Personal Information
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" /> Email Address
              </span>
              <span className="font-semibold text-white">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400" /> Phone Number
              </span>
              <span className="font-semibold text-white">{user?.phone || '+91 98765 10001'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" /> Location
              </span>
              <span className="font-semibold text-white">{profile?.location || 'Bangalore, India'}</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
            Academic Information
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-400" /> Department
              </span>
              <span className="font-semibold text-white">{profile?.department || 'Computer Science'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" /> Degree / Education
              </span>
              <span className="font-semibold text-white">{profile?.education || 'B.Tech Computer Science'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" /> Batch
              </span>
              <span className="font-semibold text-white">{profile?.batch || '2022-2026'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
