"use client";

import { ReactLenis } from "lenis/react";
import { useState, useEffect } from "react";

type LenisProviderProps = {
  children: React.ReactNode;
};

/**
 * Wraps the app with Lenis smooth scrolling.
 *
 * Config values match the Yucca.co.za reference implementation:
 * - duration 1.2s gives a weighted, unhurried feel
 * - syncTouch: false is critical — native touch momentum must be preserved on iOS/Android
 * - Lenis is disabled entirely when prefers-reduced-motion is set
 */
export function LenisProvider({ children }: LenisProviderProps) {
  // Start enabled to match SSR output, then correct after mount
  const [lenisEnabled, setLenisEnabled] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setLenisEnabled(!mq.matches);

    const onChange = (e: MediaQueryListEvent) => setLenisEnabled(!e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!lenisEnabled) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 1.0,
      }}
    >
      {children}
    </ReactLenis>
  );
}
