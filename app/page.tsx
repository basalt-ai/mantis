import { HomeHero } from "@/components/sections/home/HomeHero";
import { HomeLandingBody } from "@/components/sections/home/HomeLandingBody";
import { HomeNav } from "@/components/sections/home/HomeNav";
import { Footer } from "@/components/shared/Footer";

export default function Home() {
  return (
    <main className="min-h-screen min-w-0 max-w-full overflow-x-clip">
      <HomeNav />
      <HomeHero />
      <HomeLandingBody />
      <Footer />
    </main>
  );
}
