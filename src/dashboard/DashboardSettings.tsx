import React, { useState } from 'react';
import { RotateCcw, BookOpen, LogOut, LogIn } from 'lucide-react';
import { Alert, Avatar, Button, ButtonGroup, Card, Separator, Switch } from '@sebenarnya/design-system';
import { useAifa } from '../context/AifaContext';
import { DASHBOARD_SECTION_IDS } from './dashboardTypes';

const cardTitleClass = 'text-label text-foreground';

/** A row with a title, a description and one action on the right. */
const SettingRow: React.FC<{ title: string; description: string; action: React.ReactNode }> = ({
  title,
  description,
  action,
}) => (
  <div className="flex items-center justify-between gap-group">
    <div className="min-w-0 flex flex-col">
      <span className="text-label-sm text-foreground">{title}</span>
      <span className="text-caption text-muted-foreground">{description}</span>
    </div>
    {action}
  </div>
);

export const DashboardSettings: React.FC = () => {
  const {
    userProfile,
    disconnectAccount,
    setSignInModalOpen,
    openOnboarding,
    notificationPreferences,
    updateNotificationPreferences,
    clearHistory,
    clearDemoRequests,
    resetAllDemoData,
  } = useAifa();

  const [confirmReset, setConfirmReset] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const handleResetData = () => {
    resetAllDemoData();
    setConfirmReset(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="flex flex-col gap-cards max-w-dialog-lg mx-auto">
      <div className="pt-8 pb-4 flex flex-col gap-text">
        <h1 className="text-heading-lg text-foreground">Account & Extension Preferences</h1>
        <p className="text-body text-muted-foreground">
          Configure notification preferences, manage account connectivity, and control client simulation state.
        </p>
      </div>

      {/* Profile Card */}
      <Card id={DASHBOARD_SECTION_IDS.account} variant="raised" className="scroll-mt-24">
        <h2 className={cardTitleClass}>Connected Profile</h2>
        <Card size="sm" className="flex-row sm:flex-col items-center sm:items-start justify-between gap-group">
          <div className="flex items-center gap-12">
            <Avatar alt={userProfile.name} fallback={userProfile.avatar || '👤'} />
            <div>
              <div className="text-label-sm text-foreground">{userProfile.name}</div>
              <div className="text-caption text-muted-foreground">{userProfile.email}</div>
              <div className="flex items-center gap-6">
                <span className={`size-dot rounded-full ${userProfile.isConnected ? 'bg-success' : 'bg-muted-foreground'}`} />
                <span className="text-caption text-text-secondary">
                  {userProfile.isConnected ? 'Connected to Sebenarnya.my Cloud Archive' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>

          {userProfile.isConnected ? (
            <Button variant="outline" size="sm" icon={LogOut} onClick={disconnectAccount}>
              Disconnect
            </Button>
          ) : (
            <Button size="sm" icon={LogIn} onClick={() => setSignInModalOpen(true)}>
              Connect Account
            </Button>
          )}
        </Card>
      </Card>

      {/* Notification Preferences: they apply at once, so they are switches */}
      <Card id={DASHBOARD_SECTION_IDS.preferences} variant="raised" className="scroll-mt-24">
        <h2 className={cardTitleClass}>Notification Preferences</h2>
        <Card size="sm">
          <Switch
            label="In-Browser Status Alerts"
            hint="Display floating toast notifications when fact-check reviews are published"
            checked={notificationPreferences.browserNotifications}
            onCheckedChange={(checked) => updateNotificationPreferences({ browserNotifications: checked })}
          />
          <Separator />
          <Switch
            label="Simulated Email Updates"
            hint="Enable interactive email previews dispatched by no-reply@sebenarnya.my"
            checked={notificationPreferences.emailNotifications}
            onCheckedChange={(checked) => updateNotificationPreferences({ emailNotifications: checked })}
          />
        </Card>
      </Card>

      {/* Onboarding Guide */}
      <Card variant="raised">
        <h2 className={cardTitleClass}>Tutorial & Help</h2>
        <Card size="sm">
          <SettingRow
            title="AIFA Browser Assistant Tour"
            description="Launch the interactive 3-step walkthrough guide"
            action={
              <Button variant="outline" size="sm" icon={BookOpen} onClick={openOnboarding}>
                Replay Tour
              </Button>
            }
          />
        </Card>
      </Card>

      {/* Demo Controls & Data Reset */}
      <Card variant="raised">
        <h2 className={cardTitleClass}>Demo State Management</h2>
        <Card size="sm">
          <SettingRow
            title="Clear Verification History"
            description="Removes all stored verification findings"
            action={
              <Button variant="outline" size="sm" onClick={clearHistory}>
                Clear History
              </Button>
            }
          />
          <Separator />
          <SettingRow
            title="Clear Demo Requests"
            description="Reverts inquiries to initial sample inquiry"
            action={
              <Button variant="outline" size="sm" onClick={clearDemoRequests}>
                Clear Requests
              </Button>
            }
          />
          <Separator />
          {confirmReset ? (
            <Alert
              variant="destructive"
              title="Reset all simulation data to initial state?"
              action={
                <ButtonGroup>
                  <Button size="sm" onClick={handleResetData}>
                    Confirm Reset
                  </Button>
                  <Button variant="quiet" size="sm" onClick={() => setConfirmReset(false)}>
                    Cancel
                  </Button>
                </ButtonGroup>
              }
            >
              This will reset all history records, requests, and notifications to default sample values.
            </Alert>
          ) : (
            <Button variant="outline" icon={RotateCcw} onClick={() => setConfirmReset(true)} className="w-full">
              Reset All Demo Data to Defaults
            </Button>
          )}
        </Card>

        {saveToast && <Alert variant="success">Demo state restored to original defaults.</Alert>}
      </Card>
    </div>
  );
};
