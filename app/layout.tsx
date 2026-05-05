import type { Metadata } from "next";
import localFont from "next/font/local";
import { Lato } from "next/font/google";
import "./globals.css";
import "./_styles/components.css";

/**
 * Lato — Slack's UI typeface (SIL Open Font License, served via next/font/google).
 * Exposed as `--font-lato` and used inline by `<SlackUI />` to keep the fake
 * Slack panel visually faithful without leaking Lato into the rest of the page.
 */
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

const aeonik = localFont({
  src: [
    { path: "./fonts/aeonik/AeonikTRIAL-Air.otf", weight: "100", style: "normal" },
    { path: "./fonts/aeonik/AeonikTRIAL-AirItalic.otf", weight: "100", style: "italic" },
    { path: "./fonts/aeonik/AeonikTRIAL-Thin.otf", weight: "200", style: "normal" },
    { path: "./fonts/aeonik/AeonikTRIAL-ThinItalic.otf", weight: "200", style: "italic" },
    { path: "./fonts/aeonik/AeonikTRIAL-Light.otf", weight: "300", style: "normal" },
    { path: "./fonts/aeonik/AeonikTRIAL-LightItalic.otf", weight: "300", style: "italic" },
    { path: "./fonts/aeonik/AeonikTRIAL-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/aeonik/AeonikTRIAL-RegularItalic.otf", weight: "400", style: "italic" },
    { path: "./fonts/aeonik/AeonikTRIAL-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/aeonik/AeonikTRIAL-MediumItalic.otf", weight: "500", style: "italic" },
    { path: "./fonts/aeonik/AeonikTRIAL-SemiBold.otf", weight: "600", style: "normal" },
    { path: "./fonts/aeonik/AeonikTRIAL-SemiBoldItalic.otf", weight: "600", style: "italic" },
    { path: "./fonts/aeonik/AeonikTRIAL-Bold.otf", weight: "700", style: "normal" },
    { path: "./fonts/aeonik/AeonikTRIAL-BoldItalic.otf", weight: "700", style: "italic" },
    { path: "./fonts/aeonik/AeonikTRIAL-Black.otf", weight: "900", style: "normal" },
    { path: "./fonts/aeonik/AeonikTRIAL-BlackItalic.otf", weight: "900", style: "italic" },
  ],
  variable: "--font-aeonik",
  display: "swap",
});

const aeonikFono = localFont({
  src: [
    { path: "./fonts/aeonik-fono/AeonikFonoTRIAL-Air.otf", weight: "100", style: "normal" },
    { path: "./fonts/aeonik-fono/AeonikFonoTRIAL-Thin.otf", weight: "200", style: "normal" },
    { path: "./fonts/aeonik-fono/AeonikFonoTRIAL-Light.otf", weight: "300", style: "normal" },
    { path: "./fonts/aeonik-fono/AeonikFonoTRIAL-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/aeonik-fono/AeonikFonoTRIAL-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/aeonik-fono/AeonikFonoTRIAL-SemiBold.otf", weight: "600", style: "normal" },
    { path: "./fonts/aeonik-fono/AeonikFonoTRIAL-Bold.otf", weight: "700", style: "normal" },
    { path: "./fonts/aeonik-fono/AeonikFonoTRIAL-Black.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-aeonik-fono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pancake",
  description: "Let OpenClaw run your autonomous company.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${aeonik.variable} ${aeonikFono.variable} ${lato.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M37BB9RG');`,
          }}
        />
      </head>
      <body
        style={{
          margin: 0,
          backgroundColor: "var(--surface)",
          color: "var(--text)",
        }}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M37BB9RG"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
