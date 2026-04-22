import Image from "next/image";

type PancakeLogoProps = {
  className?: string;
  "aria-hidden"?: boolean;
};

/**
 * Mark is sized to match the wordmark's cap height
 * (P letter ≈ 49% of the wordmark image height — 32px → ~16px, 36px → ~18px).
 */
export function PancakeLogo({ className, ...props }: PancakeLogoProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-2.5 ${className ?? ""}`}
      {...props}
    >
      <Image
        src="/pancake-mark.png"
        alt=""
        width={512}
        height={512}
        quality={100}
        priority
        className="h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]"
      />
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
