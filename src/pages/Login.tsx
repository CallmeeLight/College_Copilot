// =============================================
// College Copilot — Login Screen
// True Transparent Glassmorphism Authentication
// =============================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Loader2,
  Sparkles, CheckCircle2, AlertCircle, X, ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthBackground from '../components/auth/AuthBackground';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, resetPassword, demoLogin, isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forgot Password Modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);

    if (error) {
      setErrorMsg(error.message || 'Failed to sign in. Please verify your credentials.');
      toast.error(error.message || 'Failed to sign in');
    } else {
      toast.success('Welcome back to College Copilot!');
      navigate('/');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    setGoogleLoading(false);

    if (error) {
      setErrorMsg(error.message || 'Google sign-in could not be completed.');
      toast.error(error.message || 'Google sign-in error');
    } else if (!isConfigured) {
      toast.success('Logged in as demo student!');
      navigate('/');
    }
  };

  const handleDemoSignIn = () => {
    demoLogin('Arjun Sharma', 'SRM University', '1st Semester');
    toast.success('Logged in with Demo Workspace!');
    navigate('/');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (!resetEmail.trim()) {
      setResetError('Please enter your email address');
      return;
    }

    setResetLoading(true);
    const { error } = await resetPassword(resetEmail.trim());
    setResetLoading(false);

    if (error) {
      setResetError(error.message || 'Failed to send password reset email.');
    } else {
      setResetSuccess(true);
      toast.success('Password reset link sent to your email!');
    }
  };

  return (
    <AuthBackground>
      <div className="w-full max-w-[440px] animate-fade-in">
        {/* Transparent Glass Authentication Card */}
        <div className="glass-card !p-8 sm:!p-10 relative overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-[3px] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          {/* Top light reflection bar */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400/20 via-teal-500/20 to-sky-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-bold text-lg shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                CC
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
              Welcome back <span className="animate-bounce inline-block">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-[320px] mx-auto leading-relaxed">
              Sign in to continue to your student workspace.
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
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Mail size={13} className="text-emerald-400" /> Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  required
                  disabled={loading}
                  autoComplete="email"
                  className="glass-input !bg-black/20 !border-white/10 focus:!border-emerald-400 focus:!shadow-[0_0_15px_rgba(16,185,129,0.2)] placeholder:text-slate-600 text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Lock size={13} className="text-emerald-400" /> Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setShowForgotModal(true);
                    setResetSuccess(false);
                    setResetError(null);
                  }}
                  className="text-xs text-emerald-400/90 hover:text-emerald-300 hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  autoComplete="current-password"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full glass-button glass-button-primary !py-3 !text-sm font-semibold !rounded-xl !bg-emerald-500/20 hover:!bg-emerald-500/30 !border-emerald-500/40 text-emerald-300 shadow-[0_4px_20px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2 group transition-all"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Social / Alternative divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <span className="relative px-3 text-[0.7rem] uppercase tracking-wider text-slate-500 bg-[#020810]/60 backdrop-blur-sm">
              or continue with
            </span>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full glass-button glass-button-secondary !py-2.5 !text-xs sm:!text-sm font-medium !rounded-xl !bg-white/[0.02] hover:!bg-white/[0.05] !border-white/10 hover:!border-white/20 text-slate-200 flex items-center justify-center gap-3 transition-all"
          >
            {googleLoading ? (
              <Loader2 size={16} className="animate-spin text-slate-400" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.4 0-.8.1-1.6.4-2.4L1.9 7C.7 9.4 0 12 0 14.7s.7 5.3 1.9 7.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16.4C3.7 20.2 7.5 23.5 12 23.5z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Quick Demo Mode Badge / Button (Useful when exploring offline) */}
          {!isConfigured && (
            <div className="mt-4 p-2.5 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-emerald-400" />
                <span className="text-[0.7rem] text-slate-300">Test Demo Workspace:</span>
              </div>
              <button
                type="button"
                onClick={handleDemoSignIn}
                className="text-[0.7rem] font-semibold text-emerald-400 hover:text-emerald-300 underline"
              >
                Instant Enter →
              </button>
            </div>
          )}

          {/* Bottom Switch Link */}
          <div className="mt-8 text-center pt-4 border-t border-white/5">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline transition-colors ml-1"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Transparent Glass Modal */}
      {showForgotModal && (
        <div className="modal-overlay">
          <div className="modal-content !max-w-[420px] !p-6 sm:!p-8 !bg-[#060d1c]/80 !backdrop-blur-[8px] !border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert size={18} className="text-emerald-400" /> Reset Password
              </h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="glass-button-ghost p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {resetSuccess ? (
              <div className="text-center py-4 space-y-4">
                <CheckCircle2 size={42} className="text-emerald-400 mx-auto animate-bounce" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Reset Link Sent</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    If an account exists for <span className="text-emerald-300 font-medium">{resetEmail}</span>, you will receive password reset instructions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full glass-button glass-button-primary !py-2.5 text-xs font-semibold"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your registered email address to receive password recovery instructions.
                </p>

                {resetError && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                    {resetError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    placeholder="name@university.edu"
                    required
                    disabled={resetLoading}
                    className="glass-input !bg-black/20 text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 glass-button glass-button-secondary !py-2 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 glass-button glass-button-primary !py-2 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    {resetLoading ? <Loader2 size={14} className="animate-spin" /> : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AuthBackground>
  );
}
