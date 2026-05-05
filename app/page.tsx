import { HomeHero } from "@/components/sections/home/HomeHero";
import { HomeLandingBody } from "@/components/sections/home/HomeLandingBody";
import { HomeNav } from "@/components/sections/home/HomeNav";
import { Footer } from "@/components/shared/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HomeNav />
      <HomeHero />
      <HomeLandingBody />
      <Footer />
    </main>
  );
}
