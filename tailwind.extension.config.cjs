/**
 * Tailwind config for the design-system areas: the AIFA extension UI (src/extension) and the
 * Sebenarnya dashboard (src/dashboard),
 * following DM3F/sebenarnya.my docs/adopting-extension.md: the design system preset,
 * no theme.extend.
 *
 * This mockup renders the extension inside a simulated browser and news site that keep
 * the default Tailwind scale (tailwind.config.js). `important` scopes every preset
 * utility to .sb-extension (see src/extension/shared/ExtensionSurface.tsx) so the two
 * class sets never collide in the same document.
 */
module.exports = {
  presets: [require('@sebenarnya/design-system/tailwind-preset')],
  content: ['./src/extension/**/*.{ts,tsx,html}', './src/dashboard/**/*.{ts,tsx,html}'],
  important: '.sb-extension',
};
