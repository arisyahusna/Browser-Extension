import React, { useId, useState } from 'react';
import { ArrowRight, CircleAlert, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { Alert, Button, Checkbox, Field, Icon, IconButton, Input, Separator } from '@sebenarnya/design-system';
import { useAifa } from '../../context/AifaContext';
import { ExtensionSurface } from './ExtensionSurface';

const DEMO_EMAIL = 'demo@example.com';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface AIFASignInFormProps {
  /** Tighter sizing for the 340px extension popup. */
  compact?: boolean;
  /** Open the onboarding modal after a first sign-in. The popup passes false and shows its own guide. */
  openOnboarding?: boolean;
}

/**
 * Simulated sign-in form shared by the dashboard login page and the extension popup.
 * Any well-formed email with a password of 6+ characters signs in.
 */
export const AIFASignInForm: React.FC<AIFASignInFormProps> = ({ compact = false, openOnboarding = true }) => {
  const { signIn, isSigningIn } = useAifa();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showResetNote, setShowResetNote] = useState(false);

  const ids = { email: useId(), password: useId(), passwordErr: useId() };
  // The design-system Input does not forward refs, so fields are focused by id.
  const focusField = (id: string) => document.getElementById(id)?.focus();

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
    if (isSigningIn) return;
    const next = validate();
    setErrors(next);
    if (next.email) return focusField(ids.email);
    if (next.password) return focusField(ids.password);
    signIn(email, remember, { openOnboarding });
  };

  const signInWithDemo = () => {
    if (isSigningIn) return;
    setEmail(DEMO_EMAIL);
    setPassword('demo-password');
    setErrors({});
    signIn(DEMO_EMAIL, remember, { openOnboarding });
  };

  return (
    // Carries its own design-system scope: the dashboard login page renders it outside the extension.
    <ExtensionSurface density={compact ? 'compact' : 'default'}>
      <div className="flex flex-col gap-group font-sans text-body-sm text-foreground">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-group">
          <Field label="Email" error={errors.email}>
            <Input
              id={ids.email}
              icon={Mail}
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
            />
          </Field>

          {/* Password: label row with "Forgot password?", and a show/hide toggle beside the field */}
          <div className="flex flex-col gap-stack">
            <div className="flex items-center justify-between gap-inline">
              <label htmlFor={ids.password} className="text-label-sm text-foreground">
                Password
              </label>
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowResetNote((v) => !v)}
                aria-expanded={showResetNote}
              >
                Forgot password?
              </Button>
            </div>
            <div className="flex items-center gap-inline">
              <div className="flex-1 min-w-0">
                <Input
                  id={ids.password}
                  icon={Lock}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  aria-invalid={errors.password ? true : undefined}
                  aria-describedby={errors.password ? ids.passwordErr : undefined}
                />
              </div>
              <IconButton
                icon={showPassword ? EyeOff : Eye}
                label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                variant="quiet"
                onClick={() => setShowPassword((v) => !v)}
              />
            </div>
            {errors.password && (
              <p id={ids.passwordErr} className="flex items-center gap-inline-tight text-body-sm font-medium text-destructive">
                <Icon icon={CircleAlert} size="sm" />
                {errors.password}
              </p>
            )}
            {showResetNote && (
              <Alert>Password reset isn't available in this demo. Any password of 6 or more characters works.</Alert>
            )}
          </div>

          <Checkbox
            label="Keep me signed in"
            checked={remember}
            onCheckedChange={setRemember}
          />

          <Button
            type="submit"
            size={compact ? 'default' : 'lg'}
            disabled={isSigningIn}
            aria-busy={isSigningIn || undefined}
            icon={isSigningIn ? <Icon icon={Loader2} className="animate-spin" /> : undefined}
            iconEnd={isSigningIn ? undefined : ArrowRight}
            className="w-full"
          >
            {isSigningIn ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div className="flex items-center gap-inline text-caption text-muted-foreground" aria-hidden="true">
          <Separator className="flex-1" />
          or
          <Separator className="flex-1" />
        </div>

        <Button
          variant="outline"
          size={compact ? 'default' : 'lg'}
          onClick={signInWithDemo}
          disabled={isSigningIn}
          icon={UserRound}
          className="w-full"
        >
          Continue with demo account
        </Button>

        <p className="flex items-center justify-center gap-inline-tight text-caption text-muted-foreground">
          <Icon icon={ShieldCheck} size="sm" />
          Simulated sign-in for client demonstration
        </p>
      </div>
    </ExtensionSurface>
  );
};
