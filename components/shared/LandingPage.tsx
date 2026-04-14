import { FinalCTA } from "./FinalCTA";
import { Hero } from "./Hero";
import { Nav } from "./Nav";
import { OrgChart } from "./OrgChart";
import { SafeCompliant } from "./SafeCompliant";
import { SlackUI } from "./SlackUI";
import { StackIntegrations } from "./StackIntegrations";

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
