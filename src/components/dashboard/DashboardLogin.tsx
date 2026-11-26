import React from 'react';
import { AIFASignInForm } from '../aifa/AIFASignInForm';

/** Full-page sign-in shown by the dashboard until the user signs in. */
export const DashboardLogin: React.FC = () => (
  <div className="h-full min-h-0 overflow-y-auto bg-[#eeeff3] text-[#2A2A2A] font-['Montserrat',sans-serif] antialiased">
    <div className="min-h-full flex p-3 sm:p-4">
      <main className="flex-1 min-w-0 flex items-center justify-center py-10">
        <div className="w-full max-w-[400px]">
          <img
            src={`${import.meta.env.BASE_URL}images/sebenarnya-logo.png`}
            alt="Sebenarnya.my"
            className="h-10 w-auto select-none"
            draggable={false}
          />

          <h1 className="mt-8 text-[28px] font-bold tracking-tight leading-tight">Sign in to your dashboard</h1>
          <p className="mt-2 text-sm text-[#6F6D69] leading-relaxed">
            Use the account linked to your AIFA browser extension.
          </p>

          <div className="mt-8">
            <AIFASignInForm />
          </div>
        </div>
      </main>
    </div>
  </div>
);
