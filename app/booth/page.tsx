import QRCode from "qrcode";
import Image from "next/image";
import { BasaltOfficialLogo } from "@/components/shared/BasaltOfficialLogo";
import { getBoothQrEmailDisplay, getBoothQrPayload } from "@/lib/booth-url";

const CREAM = "#fffef8";
const PINK = "#FF7B9C";
const BOOTH_W = 1920;
const BOOTH_H = 1080;
const STRIP_H = 64;

const H1_PX = 88;
const H1_ASTERISK = {
  color: PINK,
  fontSize: `${H1_PX * 0.4}px`,
  verticalAlign: "super" as const,
  lineHeight: 0,
  position: "relative" as const,
  top: "-0.28em",
};

export default async function BoothPage() {
  const qrPayload = getBoothQrPayload();
  const qrEmailDisplay = getBoothQrEmailDisplay();

  const qrDataUrl = await QRCode.toDataURL(qrPayload, {
    width: 240,
    margin: 1,
    color: { dark: "#0a0a0a", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });

  const contentH = BOOTH_H - STRIP_H;

  return (
    <div
      className="flex shrink-0 flex-col overflow-hidden border-[6px] border-black"
      style={{
        width: BOOTH_W,
        height: BOOTH_H,
        backgroundColor: CREAM,
        boxShadow: "8px 8px 0 0 #0a0a0a",
      }}
    >
      <div
        className="flex min-h-0 flex-1 flex-row items-stretch"
        style={{ height: contentH }}
      >
        {/* LEFT 60% — logo fixed top-left; copy vertically centered in full panel height (aligns with right) */}
        <div
          className="relative flex h-full min-h-0 flex-col border-black font-medium"
          style={{
            width: "60%",
            borderRightWidth: 6,
            fontFamily: 'var(--font-body), "DM Sans", system-ui, sans-serif',
          }}
        >
          <div className="absolute left-14 top-10 z-10">
            <BasaltOfficialLogo className="h-[56px] w-auto max-w-[min(100%,360px)] text-black" />
          </div>
          <div className="flex h-full min-h-0 w-full flex-col justify-center pl-14 pr-10">
            <h1
              className="font-display font-bold leading-[1.06] tracking-tight text-black"
              style={{
                fontSize: H1_PX,
                fontFamily: 'var(--font-display), "Space Grotesk", system-ui, sans-serif',
              }}
            >
              Let OpenClaw run your
              <br />
              <span style={{ color: PINK }} className="font-inherit">
                autonomous
              </span>
              <span style={H1_ASTERISK} className="font-display font-bold not-italic">
                *
              </span>{" "}
              company.
            </h1>

            <p
              className="mt-5 text-[26px] font-medium leading-snug text-[#666666]"
              style={{ fontFamily: 'var(--font-body), "DM Sans", system-ui, sans-serif' }}
            >
              <span style={{ color: PINK, fontSize: 26 }} className="font-display not-italic">
                *
              </span>{" "}
              <span className="italic">Human board. AI execution.</span>
            </p>

            <p
              className="mt-10 max-w-[42rem] font-bold leading-[1.38] text-[#1a1a1a]"
              style={{
                fontFamily: 'var(--font-body), "DM Sans", system-ui, sans-serif',
                fontSize: "clamp(32px, 3.5vw, 56px)",
              }}
            >
              Instantly deploy an army of open source agents to run your company.
            </p>
          </div>
        </div>

        {/* RIGHT 40% — QR stack vertically centered (same full-height centering as left copy) */}
        <div
          className="flex h-full min-h-0 w-[40%] flex-col items-center justify-center gap-8 px-8"
        >
          <div
            className="text-center font-display font-bold leading-[1.15] text-black"
            style={{
              fontFamily: 'var(--font-display), "Space Grotesk", system-ui, sans-serif',
              fontSize: "clamp(34px, 2.4vw, 44px)",
            }}
          >
            Join the waitlist.
          </div>
          <div
            className="border-[8px] border-black bg-white p-2"
            style={{ boxShadow: "6px 6px 0 0 #0a0a0a" }}
          >
            <Image src={qrDataUrl} width={240} height={240} alt="" unoptimized />
          </div>
          <p
            className="text-center font-mono text-[22px] font-semibold text-black"
            style={{ fontFamily: 'var(--font-mono), "Space Mono", ui-monospace, monospace' }}
          >
            {qrEmailDisplay}
          </p>
          <div
            className="text-center font-display font-bold leading-[1.15] text-black"
            style={{
              fontFamily: 'var(--font-display), "Space Grotesk", system-ui, sans-serif',
              fontSize: "clamp(34px, 2.4vw, 44px)",
            }}
          >
            Get free credits.
          </div>
        </div>
      </div>

      <footer
        className="flex shrink-0 items-center justify-start border-t-[4px] border-black px-12 font-mono text-[18px] font-semibold text-black"
        style={{ height: STRIP_H, backgroundColor: CREAM }}
      >
        <span>Human X 2025</span>
      </footer>
    </div>
  );
}
