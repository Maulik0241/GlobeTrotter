import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Lock, User as UserIcon, Phone, MapPin, Globe, FileText, Camera, AlertCircle, CheckCircle2, Upload, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const getInitials = (firstName: string, lastName: string): string | null => {
  const f = firstName.trim().substring(0, 1).toUpperCase();
  const l = lastName.trim().substring(0, 1).toUpperCase();
  if (f && l) return `${f}${l}`;
  if (f) return f;
  return null;
};

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, authMode, setAuthMode, login, signup } = useAuth();

  // Login fields
  const [username, setUsername] = useState('alex.traveler@globetrotter.io');
  const [password, setPassword] = useState('demoPass123');

  // Registration fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) setPhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (authMode === 'login') {
        await login(username, password);
      } else if (authMode === 'signup') {
        if (!firstName || !lastName || !emailAddress || !password) {
          throw new Error('Please fill in required fields (First Name, Last Name, Email, Password).');
        }
        await signup({
          email: emailAddress,
          pass: password,
          firstName,
          lastName,
          phoneNumber,
          city,
          country,
          additionalInfo,
          avatarUrl: photoUrl,
        });
      } else if (authMode === 'forgot') {
        setSuccessMsg(`Password reset link sent to ${username || 'your email'}.`);
        setIsSubmitting(false);
        return;
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = () => {
    if (authMode === 'login') {
      setUsername('alex.traveler@globetrotter.io');
      setPassword('demoPass123');
    } else {
      setFirstName('Maulik');
      setLastName('Parmar');
      setEmailAddress('maulik.parmar@globetrotter.io');
      setPhoneNumber('+1 (555) 234-5678');
      setCity('San Francisco');
      setCountry('United States');
      setAdditionalInfo('Passionate about multi-city European trips and food tours!');
      setPhotoUrl('');
    }
  };

  const userInitials = getInitials(firstName, lastName);

  const modalContent = (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full min-h-screen z-[9999] bg-slate-950/80 dark:bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className={`relative w-full ${authMode === 'signup' ? 'max-w-2xl' : 'max-w-md'} bg-white dark:bg-[#12181F] border border-[#DDE5E8] dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 transition-all my-auto text-[#1A2B32] dark:text-[#F8FAFC]`}>
        
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2.5 text-theme-muted hover:text-theme-main rounded-full hover:bg-theme-subtle transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Avatar & Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative group cursor-pointer mb-3">
            <label className="relative block group cursor-pointer" title="Optional profile photo">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Profile Avatar"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-[#007A87]/30 dark:ring-[#00E5FF]/30 shadow-xl group-hover:opacity-85 transition-all"
                />
              ) : userInitials ? (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#007A87] via-[#00E5FF] to-[#0052CC] text-white flex items-center justify-center font-black text-2xl tracking-wider ring-4 ring-[#007A87]/30 dark:ring-[#00E5FF]/30 shadow-xl group-hover:brightness-110 transition-all">
                  {userInitials}
                </div>
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#007A87] via-[#00E5FF] to-[#0052CC] text-white flex items-center justify-center ring-4 ring-[#007A87]/30 dark:ring-[#00E5FF]/30 shadow-xl group-hover:brightness-110 transition-all">
                  <UserIcon className="w-10 h-10 text-white" />
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </label>
          </div>

          <h2 className="text-2xl font-black text-theme-main font-header">
            {authMode === 'login' && 'Welcome Back'}
            {authMode === 'signup' && 'Create Your Account'}
            {authMode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-theme-muted mt-1">
            {authMode === 'login' && 'Sign in to manage your itineraries and trips.'}
            {authMode === 'signup' && 'Join GlobeTrotter to plan personalized journeys.'}
            {authMode === 'forgot' && 'Enter your email to receive recovery instructions.'}
          </p>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {authMode === 'login' && (
            <>
              <div>
                <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Email or Username</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-theme-muted" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter email or username"
                    className="w-full pl-10 pr-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main text-sm focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-theme-main font-header">Password</label>
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-xs text-[#007A87] dark:text-[#00E5FF] font-bold hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-theme-muted" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main text-sm focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-cta w-full py-3.5 px-4 rounded-2xl text-sm font-black shadow-lg cursor-pointer"
                >
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </>
          )}

          {authMode === 'signup' && (
            <>
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="w-full px-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main text-sm focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="w-full px-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main text-sm focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              {/* Email Address & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-theme-muted" />
                    <input
                      type="email"
                      required
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main text-sm focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-theme-muted" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-10 pr-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main text-sm focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
                    />
                  </div>
                </div>
              </div>

              {/* City & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-theme-muted" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. San Francisco"
                      className="w-full pl-10 pr-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main text-sm focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Country</label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-theme-muted" />
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United States"
                      className="w-full pl-10 pr-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main text-sm focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-theme-muted" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main text-sm focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              {/* Optional Profile Photo Upload & URL */}
              <div>
                <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Profile Photo (Optional):</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="Paste Image URL or select file (Optional)"
                    className="flex-1 px-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main text-xs focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
                  />
                  <label className="px-4 py-3 bg-theme-subtle hover:brightness-95 border border-theme rounded-2xl text-xs font-bold text-theme-main cursor-pointer shrink-0 flex items-center gap-1.5 shadow-sm">
                    <Upload className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />
                  </label>
                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="p-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl hover:bg-rose-500/20 transition-colors"
                      title="Clear photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Additional Information</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-theme-muted" />
                  <textarea
                    rows={3}
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Share travel goals or travel preferences..."
                    className="w-full pl-10 pr-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main text-sm focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              {/* Register Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-cta w-full py-3.5 px-4 rounded-2xl text-sm font-black shadow-lg cursor-pointer"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </>
          )}

        </form>

        {/* Demo Auto-fill Helper */}
        <div className="mt-5 p-3.5 bg-theme-subtle rounded-2xl border border-theme flex items-center justify-between text-xs text-theme-muted">
          <span>Demo mode testing?</span>
          <button
            type="button"
            onClick={fillDemoAccount}
            className="text-[#007A87] dark:text-[#00E5FF] font-bold hover:underline cursor-pointer"
          >
            Auto-fill Credentials
          </button>
        </div>

        {/* Switch mode links */}
        <div className="mt-6 text-center text-xs text-theme-muted">
          {authMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setAuthMode('signup')} className="text-[#007A87] dark:text-[#00E5FF] font-bold hover:underline cursor-pointer">
                Create an Account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => setAuthMode('login')} className="text-[#007A87] dark:text-[#00E5FF] font-bold hover:underline cursor-pointer">
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
