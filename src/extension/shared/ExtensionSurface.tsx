import React from 'react';

interface ExtensionSurfaceProps {
  /** Dense popup and side panel use "compact"; Options pages keep the default. */
  density?: 'compact' | 'default';
  children: React.ReactNode;
}

/**
 * Root of every extension page. Design-system utilities are scoped to .sb-extension
 * (tailwind.extension.config.cjs), so everything inside picks them up. display: contents
 * keeps this wrapper out of the layout.
 */
export const ExtensionSurface: React.FC<ExtensionSurfaceProps> = ({ density = 'default', children }) => (
  <div
    className="sb-extension"
    data-density={density === 'compact' ? 'compact' : undefined}
    style={{ display: 'contents' }}
  >
    {children}
  </div>
);
