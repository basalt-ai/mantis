import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Basalt — Human X",
  description: "Trade show booth display",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: 1920,
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function BoothLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-neo-brutalism min-h-screen bg-[#fffef8] text-[#0a0a0a]">
      {children}
    </div>
  );
}
