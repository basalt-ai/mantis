import dynamic from "next/dynamic";

import { FinalCTA } from "./FinalCTA";
import { Hero } from "./Hero";
import { Nav } from "./Nav";
import { SafeCompliant } from "./SafeCompliant";
import { StackIntegrations } from "./StackIntegrations";

const OrgChart = dynamic(
  () => import("./OrgChart").then((m) => ({ default: m.OrgChart })),
  {
    ssr: true,
    loading: () => (
      <div
        className="min-h-[28rem] w-full bg-[#fffef8]"
        aria-hidden
      />
    ),
  },
);

const SlackUI = dynamic(
  () => import("./SlackUI").then((m) => ({ default: m.SlackUI })),
  {
    ssr: true,
    loading: () => (
      <div
        className="min-h-[32rem] w-full bg-[#fffef8]"
        aria-hidden
      />
    ),
  },
);

export function LandingPage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <div>
        <Hero />
        <OrgChart />
        <SlackUI />
        <SafeCompliant />
        <StackIntegrations />
        <FinalCTA />
      </div>
    </main>
  );
}
