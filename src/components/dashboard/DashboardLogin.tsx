import React, { useId, useRef, useState } from 'react';
import { ArrowRight, CircleAlert, Eye, EyeOff, Info, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAifa } from '../../context/AifaContext';

const DEMO_EMAIL = 'demo@example.com';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldShell = 'flex items-center gap-2.5 h-12 px-4 rounded-full bg-white border transition-colors';
// An invalid field stays red while focused, so the error isn't hidden by the focus color.
const fieldState = (hasError: boolean) =>
  hasError
    ? 'border-[#C8343F] focus-within:ring-2 focus-within:ring-[#C8343F]/20'
    : 'border-[#E0DED9] focus-within:border-[#5774BC] focus-within:ring-2 focus-within:ring-[#5774BC]/20';

export const DashboardLogin: React.FC = () => {
  const { signInToDashboard, isSigningInToDashboard } = useAifa();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showResetNote, setShowResetNote] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const ids = { email: useId(), password: useId(), emailErr: useId(), passwordErr: useId(), remember: useId() };

  const validate = () => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = 'Enter your email address.';
    else if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Enter an email like name@example.com.';
    if (!password) next.password = 'Enter your password.';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters.';
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSigningInToDashboard) return;
    const next = validate();
    setErrors(next);
    if (next.email) return emailRef.current?.focus();
    if (next.password) return passwordRef.current?.focus();
    signInToDashboard(email, remember);
  };

  const signInWithDemo = () => {
    if (isSigningInToDashboard) return;
    setEmail(DEMO_EMAIL);
    setPassword('demo-password');
    setErrors({});
    signInToDashboard(DEMO_EMAIL, remember);
  };

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-[#eeeff3] text-[#2A2A2A] font-['Montserrat',sans-serif] antialiased">
      <div className="min-h-full flex p-3 sm:p-4">
        {/* Form */}
        <main className="flex-1 min-w-0 flex items-center justify-center py-10">
          <div className="w-full max-w-[400px]">
            <img
              src="/images/sebenarnya-logo.png"
              alt="Sebenarnya.my"
              className="h-10 w-auto select-none"
              draggable={false}
            />

            <h1 className="mt-8 text-[28px] font-bold tracking-tight leading-tight">Sign in to your dashboard</h1>
            <p className="mt-2 text-sm text-[#6F6D69] leading-relaxed">
              Use the account linked to your AIFA browser extension.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
              {/* Email */}
              <div>
                <label htmlFor={ids.email} className="block text-[13px] font-semibold mb-1.5 px-1">
                  Email
                </label>
                <div className={`${fieldShell} ${fieldState(!!errors.email)}`}>
                  <Mail className="w-4 h-4 text-[#6F6D69] shrink-0" aria-hidden="true" />
                  <input
                    ref={emailRef}
                    id={ids.email}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    spellCheck={false}
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? ids.emailErr : undefined}
                    className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-[#A3A19B]"
                  />
                </div>
                {errors.email && (
                  <p id={ids.emailErr} className="mt-1.5 px-1 flex items-center gap-1.5 text-xs text-[#9B3D36]">
                    <CircleAlert className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-baseline justify-between mb-1.5 px-1">
                  <label htmlFor={ids.password} className="text-[13px] font-semibold">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowResetNote((v) => !v)}
                    aria-expanded={showResetNote}
                    className="text-xs font-semibold text-[#3F5C9E] hover:underline cursor-pointer focus:outline-none focus-visible:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className={`${fieldShell} pr-1.5 ${fieldState(!!errors.password)}`}>
                  <Lock className="w-4 h-4 text-[#6F6D69] shrink-0" aria-hidden="true" />
                  <input
                    ref={passwordRef}
                    id={ids.password}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? ids.passwordErr : undefined}
                    className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-[#A3A19B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-[#6F6D69] hover:bg-[#E2E4EA] hover:text-[#2A2A2A] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5774BC]/40"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p id={ids.passwordErr} className="mt-1.5 px-1 flex items-center gap-1.5 text-xs text-[#9B3D36]">
                    <CircleAlert className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    {errors.password}
                  </p>
                )}
                {showResetNote && (
                  <p
                    role="status"
                    className="mt-2 flex items-start gap-2 rounded-2xl bg-[#DFE6F5] px-3.5 py-2.5 text-xs text-[#3F5C9E] leading-relaxed"
                  >
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                    Password reset isn't available in this demo. Any password of 6 or more characters works.
                  </p>
                )}
              </div>

              {/* Remember me */}
              <label
                htmlFor={ids.remember}
                className="flex items-center gap-2.5 px-1 text-sm text-[#5C5A56] cursor-pointer select-none w-fit"
              >
                <input
                  id={ids.remember}
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#2A2A2A] cursor-pointer"
                />
                Keep me signed in
              </label>

              <button
                type="submit"
                disabled={isSigningInToDashboard}
                className="w-full h-12 mt-2 rounded-full bg-[#2A2A2A] hover:bg-black text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#eeeff3] focus-visible:ring-[#5774BC]/60"
              >
                {isSigningInToDashboard ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-[#6F6D69]" aria-hidden="true">
              <span className="h-px flex-1 bg-[#E0DED9]" />
              or
              <span className="h-px flex-1 bg-[#E0DED9]" />
            </div>

            <button
              type="button"
              onClick={signInWithDemo}
              disabled={isSigningInToDashboard}
              className="w-full h-12 rounded-full bg-white border border-[#E0DED9] hover:border-[#2A2A2A]/30 text-sm font-semibold text-[#2A2A2A] flex items-center justify-center gap-2.5 transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5774BC]/40"
            >
              <span className="w-6 h-6 rounded-full bg-[#DFE6F5] flex items-center justify-center text-xs" aria-hidden="true">
                👤
              </span>
              <span>Continue with demo account</span>
            </button>

            <p className="mt-8 flex items-center justify-center gap-1.5 text-[11px] text-[#6F6D69]">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              Simulated sign-in for client demonstration
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};
