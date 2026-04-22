import Image from "next/image";

type PancakeLogoProps = {
  className?: string;
  "aria-hidden"?: boolean;
};

/**
 * The mark is sized slightly taller than the wordmark box so the circle
 * breaks above the cap-line of "P" (and a touch past the "Panca" baseline).
 * `items-center` keeps the mark visually balanced on the wordmark's axis.
 */
export function PancakeLogo({ className, ...props }: PancakeLogoProps) {
  return (
    <div
      className={`inline-flex items-center gap-[10px] sm:gap-3 ${className ?? ""}`}
      {...props}
    >
      <Image
        src="/pancake-mark.png"
        alt=""
        width={512}
        height={512}
        quality={100}
        priority
        className="h-[34px] w-[34px] shrink-0 sm:h-[38px] sm:w-[38px]"
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
