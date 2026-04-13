import Image from "next/image";

type PancakeLogoProps = {
  className?: string;
  "aria-hidden"?: boolean;
};

export function PancakeLogo({ className, ...props }: PancakeLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`} {...props}>
      <Image
        src="/pancake-logo.jpg"
        alt="Pancake logo"
        width={36}
        height={40}
        style={{ flexShrink: 0, objectFit: "contain" }}
      />
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
        Pancake
      </span>
    </div>
  );
}
