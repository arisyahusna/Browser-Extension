import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// After index.css: the design system's ui.css must follow the simulated site's Tailwind base.
import './extension/extension.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

