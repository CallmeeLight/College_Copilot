// =============================================
// College Copilot — Sign Up Screen
// True Transparent Glassmorphism Authentication
// =============================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Lock, Eye, EyeOff, GraduationCap,
  BookOpen, ArrowRight, Loader2, AlertCircle, X, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthBackground from '../components/auth/AuthBackground';
import toast from 'react-hot-toast';

const SEMESTER_OPTIONS = [
  '1st Semester',
  '2nd Semester',
  '3rd Semester',
  '4th Semester',
  '5th Semester',
  '6th Semester',
  '7th Semester',
  '8th Semester',
  'Graduate / Postgrad',
];

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [semester, setSemester] = useState('1st Semester');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Form Validations
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    if (!collegeName.trim()) {
      setErrorMsg('Please enter your college or university name');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email.trim(), password, {
      fullName: fullName.trim(),
      collegeName: collegeName.trim(),
      semester,
    });
    setLoading(false);

    if (error) {
      setErrorMsg(error.message || 'Failed to create account. Please try again.');
      toast.error(error.message || 'Registration failed');
    } else {
      toast.success('Account created successfully! Welcome to College Copilot.');
      navigate('/');
    }
  };

  return (
    <AuthBackground>
      <div className="w-full max-w-[560px] animate-fade-in my-4">
        {/* Transparent Glass Sign Up Panel */}
        <div className="glass-card !p-8 sm:!p-10 relative overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-[3px] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          {/* Top light reflection bar */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400/20 via-teal-500/20 to-sky-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-bold text-lg shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                CC
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Create your account
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-[340px] mx-auto leading-relaxed">
              Set up your personal student workspace.
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-3 animate-slide-up">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-xs text-red-200 leading-relaxed">
                {errorMsg}
              </div>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="text-red-400 hover:text-red-300"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Grid for Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <User size={13} className="text-emerald-400" /> Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Arjun Sharma"
                  required
                  disabled={loading}
                  autoComplete="name"
                  className="glass-input !bg-black/20 !border-white/10 focus:!border-emerald-400 focus:!shadow-[0_0_15px_rgba(16,185,129,0.2)] placeholder:text-slate-600 text-sm"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Mail size={13} className="text-emerald-400" /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="arjun@university.edu"
                  required
                  disabled={loading}
                  autoComplete="email"
                  className="glass-input !bg-black/20 !border-white/10 focus:!border-emerald-400 focus:!shadow-[0_0_15px_rgba(16,185,129,0.2)] placeholder:text-slate-600 text-sm"
                />
              </div>
            </div>

            {/* Grid for College & Semester */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* College / University */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <GraduationCap size={13} className="text-emerald-400" /> College / University
                </label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={e => setCollegeName(e.target.value)}
                  placeholder="e.g. SRM University"
                  required
                  disabled={loading}
                  className="glass-input !bg-black/20 !border-white/10 focus:!border-emerald-400 focus:!shadow-[0_0_15px_rgba(16,185,129,0.2)] placeholder:text-slate-600 text-sm"
                />
              </div>

              {/* Semester */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <BookOpen size={13} className="text-emerald-400" /> Semester
                </label>
                <select
                  value={semester}
                  onChange={e => setSemester(e.target.value)}
                  disabled={loading}
                  className="glass-input !bg-[#060d1c] !border-white/10 focus:!border-emerald-400 focus:!shadow-[0_0_15px_rgba(16,185,129,0.2)] text-sm cursor-pointer"
                >
                  {SEMESTER_OPTIONS.map(opt => (
                    <option key={opt} value={opt} className="bg-[#060d1c] text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid for Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Lock size={13} className="text-emerald-400" /> Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    disabled={loading}
                    autoComplete="new-password"
                    className="glass-input !bg-black/20 !border-white/10 focus:!border-emerald-400 focus:!shadow-[0_0_15px_rgba(16,185,129,0.2)] placeholder:text-slate-600 text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-emerald-400" /> Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    disabled={loading}
                    autoComplete="new-password"
                    className="glass-input !bg-black/20 !border-white/10 focus:!border-emerald-400 focus:!shadow-[0_0_15px_rgba(16,185,129,0.2)] placeholder:text-slate-600 text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full glass-button glass-button-primary !py-3 !text-sm font-semibold !rounded-xl !bg-emerald-500/20 hover:!bg-emerald-500/30 !border-emerald-500/40 text-emerald-300 shadow-[0_4px_20px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2 group transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Setting Up Workspace...
                  </>
                ) : (
                  <>
                    Create Account <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Switch Link */}
          <div className="mt-8 text-center pt-4 border-t border-white/5">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline transition-colors ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthBackground>
  );
}
