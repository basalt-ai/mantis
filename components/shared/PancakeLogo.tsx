import Image from "next/image";

type PancakeLogoProps = {
  className?: string;
  "aria-hidden"?: boolean;
};

/**
 * The wordmark's tall "k" ascender pushes the letters' optical center below
 * the image's geometric center (~12% of the image height, ≈ 3–4 px at the
 * rendered sizes), so the mark is nudged down to sit on the letters' center.
 */
export function PancakeLogo({ className, ...props }: PancakeLogoProps) {
  return (
    <div
      className={`inline-flex items-center gap-1 sm:gap-[5px] ${className ?? ""}`}
      {...props}
    >
      <Image
        src="/pancake-mark.png"
        alt=""
        width={512}
        height={512}
        quality={100}
        priority
        className="h-8 w-8 shrink-0 translate-y-[3px] sm:h-9 sm:w-9 sm:translate-y-[4px]"
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
