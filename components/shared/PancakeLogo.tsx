import Image from "next/image";

type PancakeLogoProps = {
  className?: string;
  "aria-hidden"?: boolean;
};

export function PancakeLogo({ className, ...props }: PancakeLogoProps) {
  return (
    <div
      className={`inline-flex items-center ${className ?? ""}`}
      {...props}
    >
      <Image
        src="/pancake-wordmark.png"
        alt=""
        width={739}
        height={291}
        quality={100}
        priority
        className="h-8 w-auto object-contain object-left sm:h-9"
      />
    </div>
  );
}
