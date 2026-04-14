"use client";

/**
 * Root-level error UI (replaces root layout when the error bubbles here).
 * Keeps dependencies minimal so this chunk always loads.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#fafafa", color: "#0a0a0a" }}>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            maxWidth: "28rem",
            margin: "0 auto",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "2rem 1rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Something went wrong</h1>
          <p style={{ fontSize: "0.875rem", color: "#404040" }}>{error.message || "Unexpected error."}</p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              border: "2px solid #0a0a0a",
              background: "#FF8FA3",
              padding: "0.5rem 1rem",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
