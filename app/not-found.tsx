/**
 * Explicit 404 — avoids dev edge cases where the default not-found chunk fails to resolve.
 */
export default function NotFound() {
  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: "2rem",
        textAlign: "center",
        maxWidth: "28rem",
        margin: "4rem auto",
      }}
    >
      <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Page not found</h1>
      <p style={{ marginTop: "0.75rem", color: "#555", fontSize: "0.875rem" }}>
        The page you requested does not exist.
      </p>
    </div>
  );
}
