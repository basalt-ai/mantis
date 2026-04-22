import Image from "next/image";

type PancakeLogoProps = {
  className?: string;
  "aria-hidden"?: boolean;
};

/**
 * Mark is sized to cap-height of the wordmark (top of "P" to baseline of
 * "Panca", ignoring the "k" descender). P letter spans y=109→251 of the 291-
 * tall wordmark image (≈49%), so at rendered h-8/sm:h-9 that's 16/18 px.
 * The wordmark's geometric center sits above the baseline because of the
 * tall "k" ascender, so the mark is nudged down by ~4 px via translate-y to
 * snap its top to the cap line.
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
        className="h-4 w-4 shrink-0 translate-y-[4px] sm:h-[18px] sm:w-[18px]"
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
