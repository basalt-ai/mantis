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
        alt=""
        width={96}
        height={96}
        quality={100}
        priority
        className="h-10 w-10 shrink-0 object-contain"
        style={{ borderRadius: "6px" }}
      />
      <span
        style={{
          fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: "1.5rem",
          letterSpacing: "-0.02em",
          color: "#1a1a1a",
          lineHeight: 1,
        }}
      >
        pancake
      </span>

    </div>
  );
}
