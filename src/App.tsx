import React from 'react';
import { BrowserProvider } from './context/BrowserContext';
import { AifaProvider } from './context/AifaContext';
import { BrowserShell } from './components/browser/BrowserShell';

export const App: React.FC = () => {
  return (
    <BrowserProvider>
      <AifaProvider>
        <BrowserShell />
      </AifaProvider>
    </BrowserProvider>
  );
};

export default App;
