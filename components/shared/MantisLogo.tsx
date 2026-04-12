type MantisLogoProps = {
  className?: string;
  "aria-hidden"?: boolean;
};

export function MantisLogo({ className, ...props }: MantisLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`} {...props}>
      {/* Mantis head icon — solid silhouette, no inner detail */}
      <svg
        width="36"
        height="40"
        viewBox="0 0 100 115"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        {/* Antennae — curved, rounded, same salmon color */}
        <path
          d="M42 32 Q36 16 28 8"
          stroke="#FF8FA3"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M58 32 Q64 16 72 8"
          stroke="#FF8FA3"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Head body — wide rounded top, tapers to a blunt point at bottom */}
        <path
          d="M50 28
             C33 28 18 38 16 54
             C14 66 20 80 32 90
             C40 97 50 100 50 100
             C50 100 60 97 68 90
             C80 80 86 66 84 54
             C82 38 67 28 50 28 Z"
          fill="#FF8FA3"
        />
      </svg>
      {/* Wordmark */}
      <span
        style={{
          fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: "1.35rem",
          letterSpacing: "-0.02em",
          color: "#1a1a1a",
          lineHeight: 1,
        }}
      >
        Mantis
      </span>
    </div>
  );
}
