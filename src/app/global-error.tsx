"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Application Error</title>
      </head>
      <body style={{ fontFamily: "sans-serif", textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "5rem 1rem",
          }}
        >
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "1rem" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#6b7280", maxWidth: "28rem", marginBottom: "2rem" }}>
            A critical error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => reset()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: "500",
              backgroundColor: "#f97316",
              color: "#ffffff",
              minHeight: "2.75rem",
              height: "2.5rem",
              padding: "0 1.5rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
