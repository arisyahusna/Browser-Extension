import React from 'react';
import { ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { Avatar, Badge, Button, Card, Dialog, Icon } from '@sebenarnya/design-system';
import { useAifa } from '../../context/AifaContext';
import { ExtensionSurface } from '../shared/ExtensionSurface';

const FEATURES = [
  'Real-time claim verification on news articles and social media.',
  'Submit unverified claims for official Sebenarnya.my review.',
  'Personal dashboard with searchable history and status updates.',
];

/** Google "G" mark: a third-party logo, drawn in its own brand colours. */
const GoogleMark: React.FC = () => (
  <span className="size-badge rounded-full bg-card flex items-center justify-center shrink-0">
    <svg className="size-icon-sm" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  </span>
);

export const AIFASignInModal: React.FC = () => {
  const { isSignInModalOpen, setSignInModalOpen, connectAccount, isConnectingAccount } = useAifa();

  return (
    <ExtensionSurface>
      <Dialog
        open={isSignInModalOpen}
        onOpenChange={setSignInModalOpen}
        // The original modal did not close on a backdrop click.
        dismissible={false}
        // base.css gives a real extension page Manrope on <body>; here the dialog sits inside the simulated browser.
        className="font-sans"
        title="Connect AIFA Assistant"
        description="Link your browser extension to Sebenarnya.my to sync your verification history, track custom fact-check requests, and receive reviewer notifications."
        icon={
          <img
            src={`${import.meta.env.BASE_URL}images/sebenarnya-icon.png`}
            alt=""
            className="size-avatar-sm object-contain"
            draggable={false}
          />
        }
      >
        <div className="flex flex-col gap-group text-body-sm text-text-secondary">
          <p className="text-eyebrow uppercase text-muted-foreground">AIFA & Sebenarnya.my</p>

          {/* Features checklist */}
          <ul className="flex flex-col gap-text">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-inline">
                <Icon icon={CheckCircle2} className="text-success shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* Account picker simulation */}
          <div className="flex flex-col gap-stack">
            <p className="text-label-sm text-foreground">Select Demo Account</p>
            <Card size="sm" className="flex flex-row items-center gap-12">
              <Avatar alt="AIFA Demo User" fallback="👤" />
              <div className="flex-1 min-w-0">
                <div className="text-label-sm text-foreground truncate">AIFA Demo User</div>
                <div className="text-caption text-muted-foreground truncate">demo@example.com</div>
              </div>
              <Badge size="sm" variant="outline" className="self-center">
                Default
              </Badge>
            </Card>
          </div>

          <Button
            size="lg"
            onClick={connectAccount}
            disabled={isConnectingAccount}
            aria-busy={isConnectingAccount || undefined}
            icon={isConnectingAccount ? <Icon icon={Loader2} className="animate-spin" /> : <GoogleMark />}
            className="w-full"
          >
            {isConnectingAccount ? 'Connecting Sebenarnya.my...' : 'Continue as AIFA Demo User'}
          </Button>

          <p className="flex items-center justify-center gap-inline-tight text-caption text-muted-foreground">
            <Icon icon={ShieldCheck} size="sm" />
            <span>Interactive client demonstration — simulated connection only.</span>
          </p>
        </div>
      </Dialog>
    </ExtensionSurface>
  );
};
