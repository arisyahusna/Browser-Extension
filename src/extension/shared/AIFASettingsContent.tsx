import React, { useState } from 'react';
import { RotateCcw, BookOpen, Info, LogOut, LogIn } from 'lucide-react';
import { Alert, Avatar, Button, ButtonGroup, Card, Icon, Separator, Switch } from '@sebenarnya/design-system';
import { useAifa } from '../../context/AifaContext';

const sectionTitle = 'text-label text-foreground';

interface AIFASettingsContentProps {
  /** Open the user guide (as a modal, or as a view inside the popup). */
  onOpenGuide: () => void;
  /** Start connecting a disconnected account. */
  onConnect: () => void;
}

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

/** Settings sections shared by the Settings modal and the toolbar popup's Settings view. */
export const AIFASettingsContent: React.FC<AIFASettingsContentProps> = ({ onOpenGuide, onConnect }) => {
  const {
    userProfile,
    disconnectAccount,
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
    <div className="flex flex-col gap-block text-body-sm text-text-secondary">
      {/* Connected account */}
      <section className="flex flex-col gap-text">
        <h3 className={sectionTitle}>Connected Account</h3>
        {/* Details on top, the Disconnect / Connect button at the bottom (the Card's default column). */}
        <Card variant="raised" size="sm">
          <div className="flex items-center gap-12 min-w-0">
            <Avatar alt={userProfile.name} fallback={userProfile.avatar || '👤'} />
            <div className="min-w-0">
              <div className="text-label-sm text-foreground truncate">{userProfile.name}</div>
              <div className="text-caption text-muted-foreground truncate">{userProfile.email}</div>
              <div className="flex items-center gap-inline-tight">
                <span
                  className={`size-dot rounded-full shrink-0 ${
                    userProfile.isConnected ? 'bg-success' : 'bg-muted-foreground'
                  }`}
                />
                <span className="text-caption text-text-secondary truncate">
                  {userProfile.isConnected ? 'Connected to Sebenarnya.my' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>

          {userProfile.isConnected ? (
            <Button variant="outline" size="sm" icon={LogOut} onClick={disconnectAccount} className="w-full">
              Disconnect
            </Button>
          ) : (
            <Button size="sm" icon={LogIn} onClick={onConnect} className="w-full">
              Connect
            </Button>
          )}
        </Card>
      </section>

      {/* Notification preferences: they apply at once, so they are switches */}
      <section className="flex flex-col gap-text">
        <h3 className={sectionTitle}>Notification Preferences</h3>
        <Card variant="raised" size="sm" className="flex flex-col gap-group">
          <Switch
            label="Browser In-App Alerts"
            hint="Display toast banner when a fact-check review status changes"
            checked={notificationPreferences.browserNotifications}
            onCheckedChange={(checked) => updateNotificationPreferences({ browserNotifications: checked })}
          />
          <Separator />
          <Switch
            label="Simulated Email Notifications"
            hint="Allow viewing email updates from no-reply@sebenarnya.my"
            checked={notificationPreferences.emailNotifications}
            onCheckedChange={(checked) => updateNotificationPreferences({ emailNotifications: checked })}
          />
        </Card>
      </section>

      {/* User guide */}
      <section className="flex flex-col gap-text">
        <h3 className={sectionTitle}>User Guide</h3>
        <Card variant="raised" size="sm">
          <SettingRow
            title="AIFA User Guide"
            description="Revisit the 3-step feature walkthrough"
            action={
              <Button variant="outline" size="sm" icon={BookOpen} onClick={onOpenGuide}>
                Replay
              </Button>
            }
          />
        </Card>
      </section>

      {/* Demo data */}
      <section className="flex flex-col gap-text">
        <h3 className={sectionTitle}>Demo Data & Storage</h3>
        <Card variant="raised" size="sm" className="flex flex-col gap-group">
          <SettingRow
            title="Clear Verification History"
            description="Removes all locally saved verified claim records"
            action={
              <Button variant="outline" size="sm" onClick={clearHistory}>
                Clear
              </Button>
            }
          />
          <Separator />
          <SettingRow
            title="Clear Submitted Requests"
            description="Removes custom requests and reverts to sample"
            action={
              <Button variant="outline" size="sm" onClick={clearDemoRequests}>
                Clear
              </Button>
            }
          />
          <Separator />
          {confirmReset ? (
            <Alert
              variant="destructive"
              title="Reset all demo state to defaults?"
              action={
                <ButtonGroup>
                  <Button size="sm" onClick={handleResetData}>
                    Yes, reset everything
                  </Button>
                  <Button variant="quiet" size="sm" onClick={() => setConfirmReset(false)}>
                    Cancel
                  </Button>
                </ButtonGroup>
              }
            >
              This will reset history, notifications, and request status to initial demo data.
            </Alert>
          ) : (
            <Button variant="outline" icon={RotateCcw} onClick={() => setConfirmReset(true)} className="w-full">
              Reset All Demonstration Data
            </Button>
          )}
        </Card>
      </section>

      {saveToast && <Alert variant="success">Demo state reset to initial defaults.</Alert>}

      {/* About */}
      <div className="flex items-start gap-inline pt-12 border-t border-border text-caption text-muted-foreground">
        <Icon icon={Info} className="shrink-0" />
        <span>
          AIFA Browser Extension Demonstration Mockup. Associated with Sebenarnya.my. All analysis results and
          reviewer submissions are for client visualization only.
        </span>
      </div>
    </div>
  );
};
