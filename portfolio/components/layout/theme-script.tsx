import Script from "next/script";

// Light is the default for every first-time visitor, regardless of OS
// preference — that default is the whole point of this design (see
// site brief: "MOST IMPORTANT DESIGN DIRECTION"). Dark mode only ever
// applies once someone explicitly picks it via the toggle, from then on
// persisted in localStorage.
const THEME_SCRIPT = `
(function () {
  try {
    var theme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    if (theme === 'dark') document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = theme;
  } catch (e) {}
})();
`;

/** Runs before hydration so the correct theme class is present on first paint. */
export function ThemeScript() {
  return (
    // beforeInteractive is valid in the App Router root layout; the lint rule
    // below only knows about the legacy pages/_document.js placement.
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script id="theme-init" strategy="beforeInteractive">
      {THEME_SCRIPT}
    </Script>
  );
}
