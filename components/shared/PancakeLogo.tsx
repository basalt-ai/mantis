import Image from "next/image";

type PancakeLogoProps = {
  className?: string;
  "aria-hidden"?: boolean;
};

export function PancakeLogo({ className, ...props }: PancakeLogoProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 ${className ?? ""}`}
      {...props}
    >
      <Image
        src="/pancake-icon.jpg"
        alt=""
        width={96}
        height={96}
        quality={100}
        priority
        className="h-8 w-8 shrink-0 translate-y-0.5 object-contain object-left sm:h-9 sm:w-9"
        style={{ borderRadius: "6px" }}
      />
      <span
        className="-ml-px leading-none sm:-ml-0.5"
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
