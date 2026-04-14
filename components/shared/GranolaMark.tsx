import Image from "next/image";

/**
 * Official Granola mark from https://www.granola.so/favicon/favicon-96x96.png
 * (same source as their site favicon; not in react-icons Simple Icons).
 */
export function GranolaMark({ className }: { className?: string }) {
  return (
    <Image
      src="/granola-icon.png"
      alt=""
      width={24}
      height={24}
      className={`h-6 w-6 object-contain ${className ?? ""}`}
    />
  );
}
