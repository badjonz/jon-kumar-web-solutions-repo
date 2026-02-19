'use client';

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="
        fixed top-4 left-4 z-50
        -translate-y-full opacity-0 pointer-events-none
        focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:pointer-events-auto
        bg-white text-slate-900 px-4 py-2 rounded shadow-lg whitespace-nowrap
      "
    >
      Skip to main content
    </a>
  );
}
