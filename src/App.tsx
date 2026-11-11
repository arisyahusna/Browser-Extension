import React from 'react';
import { BrowserProvider } from './context/BrowserContext';
import { BrowserShell } from './components/browser/BrowserShell';

export const App: React.FC = () => {
  return (
    <BrowserProvider>
      <BrowserShell />
    </BrowserProvider>
  );
};

export default App;
