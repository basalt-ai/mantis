import { FinalCTA } from "./FinalCTA";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { ItLearns } from "./ItLearns";
import { Nav } from "./Nav";
import { OrgChart } from "./OrgChart";
import { SafeCompliant } from "./SafeCompliant";
import { SlackUI } from "./SlackUI";
import { StackIntegrations } from "./StackIntegrations";
import { TalkToHuman } from "./TalkToHuman";

export function LandingPage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <div>
        <Hero />
        <OrgChart />
        <SlackUI />
        <ItLearns />
        <SafeCompliant />
        <StackIntegrations />
        <FinalCTA />
        <TalkToHuman />
      </div>
      <Footer />
    </main>
  );
}
