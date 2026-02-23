"use client";

import { useRef, useState, useLayoutEffect, useEffect } from "react";
import { motion } from "framer-motion";

const EASE_ARRAY = [0.22, 1, 0.36, 1] as const;

interface SplitLinesProps {
  text: string;
  isActive: boolean;
  noMotion: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Delay before the first line starts (seconds) */
  delayStart?: number;
  /** Additional delay per line (seconds) */
  lineDelay?: number;
  /** Animation duration per line (seconds) */
  duration?: number;
}

/**
 * Splits text into visually rendered lines at runtime, then animates each
 * line up from behind an overflow:hidden barrier — matching Yucca's technique.
 *
 * Inactive: each line-inner sits at translateY(100%) — hidden below clip.
 * Active:   each line-inner transitions to translateY(0%) with per-line stagger.
 */
export function SplitLines({
  text,
  isActive,
  noMotion,
  className,
  style,
  delayStart = 0,
  lineDelay = 0.04,
  duration = 0.4,
}: SplitLinesProps) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);

  // Measure line breaks from the rendered DOM
  useLayoutEffect(() => {
    if (lines !== null) return; // already measured
    if (!measureRef.current) return;

    const spans = Array.from(
      measureRef.current.querySelectorAll("[data-word]")
    ) as HTMLElement[];
    if (spans.length === 0) return;

    const words = text.split(" ");
    const lineGroups: string[][] = [];
    let currentY: number | null = null;
    let currentLine: string[] = [];

    spans.forEach((span, idx) => {
      const y = Math.round(span.getBoundingClientRect().top);
      if (currentY === null) currentY = y;
      if (Math.abs(y - currentY) > 2) {
        lineGroups.push([...currentLine]);
        currentLine = [];
        currentY = y;
      }
      currentLine.push(words[idx]);
    });
    if (currentLine.length > 0) lineGroups.push(currentLine);

    setLines(lineGroups.map((g) => g.join(" ")));
  }, [lines, text]);

  // Re-measure on window resize
  useEffect(() => {
    const handle = () => setLines(null);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  if (noMotion) {
    return (
      <div className={className} style={style}>
        {text}
      </div>
    );
  }

  // Measurement phase — invisible render so we can read line break positions
  if (lines === null) {
    const words = text.split(" ");
    return (
      <div
        ref={measureRef}
        className={className}
        style={{ ...style, visibility: "hidden" }}
        aria-hidden="true"
      >
        {words.map((word, i) => (
          <span key={i} data-word={word} style={{ display: "inline" }}>
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    );
  }

  // Animated phase — one clipped block per visual line
  return (
    <div className={className} style={style}>
      {lines.map((line, i) => (
        <div key={i} style={{ overflow: "hidden" }}>
          <motion.div
            animate={{ y: isActive ? "0%" : "100%" }}
            transition={{
              duration,
              ease: EASE_ARRAY,
              delay: isActive ? delayStart + i * lineDelay : 0,
            }}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
