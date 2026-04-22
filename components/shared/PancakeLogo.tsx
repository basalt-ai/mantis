import Image from "next/image";

type PancakeLogoProps = {
  className?: string;
  "aria-hidden"?: boolean;
};

/**
 * Mark spans from the top of the "k" ascender to the baseline of "Panca"
 * (ignoring the "k" descender). K top ≈ top of the wordmark image and the
 * baseline sits at ~86% of the image height (251/291). At rendered h-8 /
 * sm:h-9, that translates to 28 / 31 px tall. `items-start` anchors both
 * tops, so the mark top aligns with the k-ascender.
 */
export function PancakeLogo({ className, ...props }: PancakeLogoProps) {
  return (
    <div
      className={`inline-flex items-start gap-[6px] sm:gap-2 ${className ?? ""}`}
      {...props}
    >
      <Image
        src="/pancake-mark.png"
        alt=""
        width={512}
        height={512}
        quality={100}
        priority
        className="h-[28px] w-[28px] shrink-0 sm:h-[31px] sm:w-[31px]"
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
