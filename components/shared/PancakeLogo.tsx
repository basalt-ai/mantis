import Image from "next/image";

type PancakeLogoProps = {
  className?: string;
  "aria-hidden"?: boolean;
};

export function PancakeLogo({ className, ...props }: PancakeLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`} {...props}>
      <Image
        src="/pancake-icon.jpg"
        alt="Pancake icon"
        width={32}
        height={32}
        style={{ flexShrink: 0, objectFit: "contain", borderRadius: "4px" }}
      />
      <span
        style={{
          fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: "1.1rem",
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
