import { HomeHero } from "@/components/sections/home/HomeHero";
import { HomeNav } from "@/components/sections/home/HomeNav";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HomeNav />
      <HomeHero />
    </main>
  );
}
