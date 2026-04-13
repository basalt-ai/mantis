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

    </div>
  );
}
