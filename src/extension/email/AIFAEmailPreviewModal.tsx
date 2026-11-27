import React from 'react';
import { Mail, CheckCircle2, Clock, ExternalLink, ShieldCheck } from 'lucide-react';
import { Alert, Badge, Button, Card, Dialog, Icon } from '@sebenarnya/design-system';
import { useAifa } from '../../context/AifaContext';
import { useBrowser } from '../../context/BrowserContext';
import { ExtensionSurface } from '../shared/ExtensionSurface';

export const AIFAEmailPreviewModal: React.FC = () => {
  const { emailPreviewRequest, closeEmailPreview } = useAifa();
  const { navigate } = useBrowser();

  const handleOpenDashboard = () => {
    closeEmailPreview();
    navigate({
      pathname: '/sebenarnya-dashboard',
      title: 'Sebenarnya.my — AIFA Fact-Checking User Dashboard',
      platform: 'dashboard',
      customUrl: 'https://sebenarnya-dashboard.example/',
    });
  };

  const isCompleted = emailPreviewRequest?.status === 'Completed';

  const headers = emailPreviewRequest
    ? [
        { label: 'From:', value: 'Sebenarnya.my AIFA Service <no-reply@sebenarnya.my>', strong: true },
        { label: 'To:', value: 'AIFA Demo User <demo@example.com>' },
        {
          label: 'Subject:',
          value: `[AIFA Fact-Check] Status Update: ${emailPreviewRequest.referenceNumber} (${emailPreviewRequest.status})`,
          strong: true,
        },
        { label: 'Date:', value: emailPreviewRequest.lastUpdated || 'Just now' },
      ]
    : [];

  return (
    <ExtensionSurface>
      <Dialog
        open={!!emailPreviewRequest}
        onOpenChange={(open) => !open && closeEmailPreview()}
        // The original modal did not close on a backdrop click.
        dismissible={false}
        // base.css gives a real page Manrope on <body>; here the dialog sits inside the simulated browser.
        className="font-sans"
        icon={<Icon icon={Mail} size="lg" />}
        title="Simulated Email Notification Preview"
        footer={
          <Button variant="outline" onClick={closeEmailPreview}>
            Close Preview
          </Button>
        }
      >
        {emailPreviewRequest && (
          <div className="flex flex-col gap-group text-body-sm text-text-secondary">
            {/* Email header details */}
            <Card size="sm">
              <dl className="flex flex-col gap-4">
                {headers.map((h) => (
                  <div key={h.label} className="flex items-baseline gap-12">
                    <dt className="w-64 shrink-0 text-caption text-muted-foreground">{h.label}</dt>
                    <dd className={h.strong ? 'text-label-sm text-foreground' : 'text-body-sm text-text-secondary'}>{h.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            {/* Sebenarnya.my header */}
            <div className="flex flex-wrap items-center justify-between gap-12 pb-16 border-b border-border">
              <div className="flex items-center gap-inline">
                <img
                  src={`${import.meta.env.BASE_URL}images/sebenarnya-icon.png`}
                  alt=""
                  className="size-avatar object-contain"
                  draggable={false}
                />
                <div>
                  <div className="text-label-sm text-foreground">SEBENARNYA.MY</div>
                  <div className="text-caption text-muted-foreground">Official Verification Portal</div>
                </div>
              </div>

              <Badge className="self-center" variant={isCompleted ? 'muted' : 'outline'} icon={isCompleted ? CheckCircle2 : Clock}>
                {isCompleted ? 'Fact-Check Completed' : 'Under Review'}
              </Badge>
            </div>

            <div className="flex flex-col gap-text">
              <p className="text-body text-foreground">
                Dear <strong>AIFA Demo User</strong>,
              </p>
              <p>
                {isCompleted
                  ? 'Our editorial and verification team at Sebenarnya.my has concluded the investigation for your submitted claim inquiry.'
                  : 'Your fact-check request has been assigned to an editorial researcher and is currently undergoing verification against official government gazettes and ministry records.'}
              </p>
            </div>

            {/* Claim box */}
            <Card size="sm" className="flex flex-col gap-text">
              <div className="flex items-center justify-between gap-inline">
                <span className="text-label-sm text-foreground">Submitted Claim Details</span>
                <span className="text-label-sm text-foreground">{emailPreviewRequest.referenceNumber}</span>
              </div>
              <p className="p-12 rounded-media bg-card text-body-sm font-medium text-foreground italic">
                "{emailPreviewRequest.claimText}"
              </p>
              <p className="text-caption text-muted-foreground">
                Source: <span className="text-foreground">{emailPreviewRequest.title}</span> (
                {emailPreviewRequest.sourcePlatform})
              </p>
            </Card>

            {/* Review conclusion if completed */}
            {isCompleted && (
              <Alert icon={ShieldCheck} title="Sebenarnya.my Verification Finding: FALSE CLAIM">
                <p>
                  The Ministry of Finance and Prime Minister's Department have confirmed that no such mandatory annual
                  RM500 administrative contribution has ever been legislated or planned. Circulating forwards stem from
                  altered graphics and unverified community chat chains.
                </p>
                <p className="mt-4 text-caption">Official ref: SEB-2026-NOV-8842</p>
              </Alert>
            )}

            <div className="flex justify-center">
              <Button iconEnd={ExternalLink} onClick={handleOpenDashboard}>
                View Full Report on Sebenarnya.my Dashboard
              </Button>
            </div>

            <p className="pt-12 border-t border-border text-center text-caption text-muted-foreground">
              Simulated demonstration email preview. No actual emails are dispatched.
            </p>
          </div>
        )}
      </Dialog>
    </ExtensionSurface>
  );
};
