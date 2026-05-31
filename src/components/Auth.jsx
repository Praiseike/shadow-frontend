import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { isDisposableEmail } from '../utils/disposableEmails';
import OTPVerification from './auth/OTPVerification';

const Auth = ({ onLogin }) => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0); // 0 = Login, 1 = Signup
  const [showPassword, setShowPassword] = useState(false);

  // OTP verification state
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otp, setOtp] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [isNewUser, setIsNewUser] = useState(false); // track whether we redirect to onboarding

  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendingOTP, setResendingOTP] = useState(false);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  // ── Google SSO (mock) ──────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.googleAuth({
        idToken: 'mock-google-token',
        googleId: 'google-mock-id-' + Math.floor(Math.random() * 100000),
        email: 'demo-google@postnexus.com',
        name: 'Demo Google User',
        avatar: null,
      });
      localStorage.setItem('token', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      onLogin(response.user);
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // ── Email Auth (Login / Sign Up) ───────────────────────────────────────────
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (tabValue === 0) {
        // ── LOGIN ──
        const response = await apiService.login({
          email: formData.email,
          password: formData.password,
        });

        if (response.requiresVerification) {
          // Unverified account: show OTP screen without a token yet
          setPendingEmail(formData.email);
          setIsNewUser(false);
          setShowOTPVerification(true);
          setSuccess('A verification code has been sent to your email.');
          return;
        }

        // Verified login — persist session
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        onLogin(response.user);
        navigate('/user/dashboard');

      } else {
        // ── SIGN UP ──
        if (!formData.email || !formData.password || !formData.name) {
          throw new Error('All fields are required');
        }

        if (isDisposableEmail(formData.email)) {
          throw new Error('Temporary or disposable email addresses are not allowed. Please use a permanent email address.');
        }

        const response = await apiService.register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });

        if (response.requiresVerification) {
          // Show OTP screen — no token yet
          setPendingEmail(formData.email);
          setIsNewUser(true);
          setShowOTPVerification(true);
          setSuccess('Check your email for a verification code to activate your account.');
          return;
        }

        // Edge case: registration returned a token immediately
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          onLogin(response.user);
          navigate('/onboarding');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // ── OTP Verification ───────────────────────────────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError('Please enter the verification code');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await apiService.verifyOTP(pendingEmail, otp);

      // verifyOTP returns { message, user, token }
      localStorage.setItem('token', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      onLogin(response.user);

      // New users → onboarding; returning users → dashboard
      navigate(isNewUser ? '/onboarding' : '/user/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid or expired verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendingOTP(true);
    setError('');
    setSuccess('');
    try {
      await apiService.sendOTP(pendingEmail);
      setSuccess('A new code has been sent to your email.');
    } catch (err) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setResendingOTP(false);
    }
  };

  // ── OTP Screen ─────────────────────────────────────────────────────────────
  if (showOTPVerification) {
    return (
      <OTPVerification
        showOTPVerification={showOTPVerification}
        pendingEmail={pendingEmail}
        otp={otp}
        setOtp={setOtp}
        error={error}
        success={success}
        loading={loading}
        resendingOTP={resendingOTP}
        handleVerifyOTP={handleVerifyOTP}
        handleResendOTP={handleResendOTP}
        onCancel={() => {
          setShowOTPVerification(false);
          setOtp('');
          setError('');
          setSuccess('');
        }}
      />
    );
  }


  // ── Login / Sign Up Screen ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Brand Logo & Heading */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-4 justify-center">
            <svg className="w-10 h-10 text-indigo-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">PostNexus</span>
          </div>
          <h2 className="text-xl font-bold text-slate-950">
            {tabValue === 0 ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            {tabValue === 0
              ? 'Enter your credentials to access your dashboard'
              : 'Start your 14-day free trial, no credit card required'}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => { setTabValue(0); setError(''); setSuccess(''); }}
            className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-150 ${
              tabValue === 0 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setTabValue(1); setError(''); setSuccess(''); }}
            className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-150 ${
              tabValue === 1 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {/* Full Name (Sign Up only) */}
            {tabValue === 1 && (
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.0" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    placeholder="Jane Doe"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.0" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="jane@example.com"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.0" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.0" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.0" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.0" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 transition-all duration-150 mt-6"
            >
              {loading ? 'Please wait...' : tabValue === 0 ? 'Log in' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Footer Subtext */}
        <div className="text-center pt-2">
          {tabValue === 0 ? (
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                className="font-bold text-indigo-600 hover:text-indigo-700"
                onClick={() => setTabValue(1)}
              >
                Sign up free
              </button>
            </p>
          ) : (
          <p className="text-xs text-slate-400">
              ✓ No credit card required  •  ✓ 14-day free trial
          </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;