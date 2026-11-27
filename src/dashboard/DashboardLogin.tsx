import React from 'react';
import { AIFASignInForm } from '../extension/shared/AIFASignInForm';
import { ExtensionSurface } from '../extension/shared/ExtensionSurface';

/** Full-page sign-in shown by the dashboard until the user signs in. */
export const DashboardLogin: React.FC = () => (
  <ExtensionSurface>
    <div className="h-full min-h-0 overflow-y-auto bg-muted font-sans text-foreground">
      <div className="min-h-full flex p-16">
        <main className="flex-1 min-w-0 flex items-center justify-center py-40">
          <div className="w-full max-w-dialog-sm flex flex-col gap-block">
            <img
              src={`${import.meta.env.BASE_URL}images/sebenarnya-logo.png`}
              alt="Sebenarnya.my"
              className="h-40 w-auto self-start select-none"
              draggable={false}
            />

            <div className="flex flex-col gap-text">
              <h1 className="text-heading-lg text-foreground">Sign in to your dashboard</h1>
              <p className="text-body text-muted-foreground">Use the account linked to your AIFA browser extension.</p>
            </div>

            <AIFASignInForm />
          </div>
        </main>
      </div>
    </div>
  </ExtensionSurface>
);
