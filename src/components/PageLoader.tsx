"use client";

import { useEffect, useState } from "react";

/**
 * Curtain reveal — slides upward off screen on page load.
 * Matches hero background (#ede8e0) for a seamless reveal.
 * prefers-reduced-motion: instant removal.
 */
export function PageLoader() {
  const [state, setState] = useState<"visible" | "leaving" | "gone">("visible");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("gone");
      return;
    }

    let goneTimeout: ReturnType<typeof setTimeout>;
    let started = false;

    const startLeave = () => {
      if (started) return;
      started = true;
      setState("leaving");
      // Remove from DOM after slide completes
      goneTimeout = setTimeout(() => setState("gone"), 1000);
    };

    if (document.readyState === "complete") {
      startLeave();
      return () => clearTimeout(goneTimeout);
    }

    const maxTimeout = setTimeout(startLeave, 1500);
    window.addEventListener("load", startLeave, { once: true });

    return () => {
      clearTimeout(maxTimeout);
      clearTimeout(goneTimeout);
      window.removeEventListener("load", startLeave);
    };
  }, []);

  if (state === "gone") return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[99] bg-[#ede8e0]"
      style={{
        transform: state === "leaving" ? "translateY(-100%)" : "translateY(0%)",
        transition:
          state === "leaving"
            ? "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)"
            : "none",
      }}
    />
  );
}
