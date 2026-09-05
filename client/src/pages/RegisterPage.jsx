import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BrainCircuit, Lock, Mail, User, Phone, BookOpen, Building, GraduationCap, MapPin, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    course: 'Full Stack Software Engineering',
    department: 'Computer Science & Engineering',
    batch: '2022-2026',
    location: 'Bangalore, India',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, phone, course, department, batch, location } = formData;

    if (!name || !email || !password || !confirmPassword) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    if (password.length < 6) {
      addToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    try {
      setLoading(true);
      await register({
        name,
        email,
        password,
        role: 'STUDENT',
        phone,
        course,
        department,
        batch,
        location,
      });

      addToast('Registration successful! Please log in to your account.', 'success');
      navigate('/login');
    } catch (err) {
      addToast(err.response?.data?.message || err.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors duration-200">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl bg-surface border border-sb-default rounded-3xl shadow-xl p-6 sm:p-8 z-10 my-8 transition-colors duration-200">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/25 mb-3">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-sb-main">Create Student Account</h1>
          <p className="text-xs text-sb-sec font-medium mt-1">
            Join Inaivazhi to analyze your skill gaps & boost placement readiness
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-sb-main mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-sb-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Arun Kumar"
                  className="w-full bg-surface-sec border border-sb-default rounded-xl py-2.5 pl-10 pr-4 text-sm text-sb-main placeholder-sb-muted focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-sb-main mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-sb-muted absolute left-3.5 top-3" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="arun@skillbridge.com"
                  className="w-full bg-surface-sec border border-sb-default rounded-xl py-2.5 pl-10 pr-4 text-sm text-sb-main placeholder-sb-muted focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-sb-main mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-sb-muted absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-surface-sec border border-sb-default rounded-xl py-2.5 pl-10 pr-10 text-sm text-sb-main placeholder-sb-muted focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-sb-muted hover:text-sb-main"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-sb-main mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-sb-muted absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full bg-surface-sec border border-sb-default rounded-xl py-2.5 pl-10 pr-4 text-sm text-sb-main placeholder-sb-muted focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-sb-main mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-sb-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full bg-surface-sec border border-sb-default rounded-xl py-2.5 pl-10 pr-4 text-sm text-sb-main placeholder-sb-muted focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-sb-main mb-1">Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-sb-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Bangalore, India"
                  className="w-full bg-surface-sec border border-sb-default rounded-xl py-2.5 pl-10 pr-4 text-sm text-sb-main placeholder-sb-muted focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Course */}
            <div>
              <label className="block text-xs font-bold text-sb-main mb-1">Course Track</label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full bg-surface-sec border border-sb-default rounded-xl py-2.5 px-3 text-xs text-sb-main focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Full Stack Software Engineering">Full Stack Engineering</option>
                <option value="Java Full Stack Engineering">Java Full Stack</option>
                <option value="Python Stack Development">Python Stack</option>
                <option value="Data Science & AI">Data Science & AI</option>
                <option value="Business Analytics">Data Analyst</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-sb-main mb-1">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full bg-surface-sec border border-sb-default rounded-xl py-2.5 px-3 text-xs text-sb-main focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Batch */}
            <div>
              <label className="block text-xs font-bold text-sb-main mb-1">Batch</label>
              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className="w-full bg-surface-sec border border-sb-default rounded-xl py-2.5 px-3 text-xs text-sb-main focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Account...' : 'Register Student Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-sb-default text-center flex items-center justify-between text-xs">
          <span className="text-sb-muted">Already registered?</span>
          <Link to="/login" className="text-indigo-600 font-bold hover:underline">
            Sign In to Existing Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
