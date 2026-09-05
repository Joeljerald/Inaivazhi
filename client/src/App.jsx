import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';

import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import StudentSkills from './pages/StudentSkills';
import StudentSkillPassport from './pages/StudentSkillPassport';
import StudentSkillGap from './pages/StudentSkillGap';
import StudentAIRoadmap from './pages/StudentAIRoadmap';
import StudentResumeBuilder from './pages/StudentResumeBuilder';
import StudentApplications from './pages/StudentApplications';

// Trainer Pages
import TrainerDashboard from './pages/TrainerDashboard';
import TrainerStudents from './pages/TrainerStudents';
import TrainerMostSuitable from './pages/TrainerMostSuitable';
import TrainerAICandidateSearch from './pages/TrainerAICandidateSearch';

// Placement Pages
import PlacementDashboard from './pages/PlacementDashboard';
import PlacementCompanies from './pages/PlacementCompanies';
import PlacementJobs from './pages/PlacementJobs';
import PlacementCandidateMatching from './pages/PlacementCandidateMatching';
import PlacementApplications from './pages/PlacementApplications';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading SkillBridge AI...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-app text-sb-main transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

// Root index redirect depending on role
const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading...</div>;
  if (!user) return <LandingPage />;

  if (user.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
  if (user.role === 'TRAINER') return <Navigate to="/trainer/dashboard" replace />;
  if (user.role === 'PLACEMENT') return <Navigate to="/placement/dashboard" replace />;
  if (user.role === 'SUPER_ADMIN') return <Navigate to="/admin/dashboard" replace />;

  return <LandingPage />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/landing" element={<LandingPage />} />

      {/* Student Portal Routes */}
      <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['STUDENT', 'SUPER_ADMIN']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/passport" element={<ProtectedRoute allowedRoles={['STUDENT', 'SUPER_ADMIN']}><StudentSkillPassport /></ProtectedRoute>} />
      <Route path="/student/resume-builder" element={<ProtectedRoute allowedRoles={['STUDENT', 'SUPER_ADMIN']}><StudentResumeBuilder /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['STUDENT', 'SUPER_ADMIN']}><StudentProfile /></ProtectedRoute>} />
      <Route path="/student/skills" element={<ProtectedRoute allowedRoles={['STUDENT', 'SUPER_ADMIN']}><StudentSkills /></ProtectedRoute>} />
      <Route path="/student/skill-gap" element={<ProtectedRoute allowedRoles={['STUDENT', 'SUPER_ADMIN']}><StudentSkillGap /></ProtectedRoute>} />
      <Route path="/student/roadmap" element={<ProtectedRoute allowedRoles={['STUDENT', 'SUPER_ADMIN']}><StudentAIRoadmap /></ProtectedRoute>} />
      <Route path="/student/applications" element={<ProtectedRoute allowedRoles={['STUDENT', 'SUPER_ADMIN']}><StudentApplications /></ProtectedRoute>} />

      {/* Trainer Portal Routes */}
      <Route path="/trainer/dashboard" element={<ProtectedRoute allowedRoles={['TRAINER', 'SUPER_ADMIN']}><TrainerDashboard /></ProtectedRoute>} />
      <Route path="/trainer/students" element={<ProtectedRoute allowedRoles={['TRAINER', 'PLACEMENT', 'SUPER_ADMIN']}><TrainerStudents /></ProtectedRoute>} />
      <Route path="/trainer/most-suitable" element={<ProtectedRoute allowedRoles={['TRAINER', 'PLACEMENT', 'SUPER_ADMIN']}><TrainerMostSuitable /></ProtectedRoute>} />
      <Route path="/trainer/candidate-matcher" element={<ProtectedRoute allowedRoles={['TRAINER', 'PLACEMENT', 'SUPER_ADMIN']}><TrainerAICandidateSearch /></ProtectedRoute>} />

      {/* Placement Portal Routes */}
      <Route path="/placement/dashboard" element={<ProtectedRoute allowedRoles={['PLACEMENT', 'SUPER_ADMIN']}><PlacementDashboard /></ProtectedRoute>} />
      <Route path="/placement/most-suitable" element={<ProtectedRoute allowedRoles={['PLACEMENT', 'TRAINER', 'SUPER_ADMIN']}><TrainerMostSuitable /></ProtectedRoute>} />
      <Route path="/placement/candidate-matcher" element={<ProtectedRoute allowedRoles={['PLACEMENT', 'TRAINER', 'SUPER_ADMIN']}><TrainerAICandidateSearch /></ProtectedRoute>} />
      <Route path="/placement/companies" element={<ProtectedRoute allowedRoles={['PLACEMENT', 'SUPER_ADMIN']}><PlacementCompanies /></ProtectedRoute>} />
      <Route path="/placement/jobs" element={<ProtectedRoute allowedRoles={['PLACEMENT', 'SUPER_ADMIN']}><PlacementJobs /></ProtectedRoute>} />
      <Route path="/placement/candidate-matching" element={<ProtectedRoute allowedRoles={['PLACEMENT', 'SUPER_ADMIN']}><PlacementCandidateMatching /></ProtectedRoute>} />
      <Route path="/placement/applications" element={<ProtectedRoute allowedRoles={['PLACEMENT', 'SUPER_ADMIN']}><PlacementApplications /></ProtectedRoute>} />

      {/* Super Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><AdminUsers /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
