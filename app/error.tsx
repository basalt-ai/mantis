"use client";

import { useEffect } from "react";

/**
 * Keep this file dependency-light (inline styles only) so the error chunk always
 * loads in dev — Tailwind/custom classes here can contribute to
 * “missing required error components, refreshing…”.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "50vh",
        maxWidth: "32rem",
        margin: "0 auto",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "2rem 1rem",
        textAlign: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#0a0a0a" }}>Something went wrong</h1>
      <p style={{ fontSize: "0.875rem", color: "#404040" }}>
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        style={{
          border: "3px solid #0a0a0a",
          background: "#FF8FA3",
          padding: "0.75rem 1.5rem",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: "0.875rem",
        }}
      >
        Try again
      </button>
    </div>
  );
}
