/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    const dead = [
      "neo-brutalism",
      "dark-mode",
      "bold-typography",
      "motion-design",
      "ai-native",
      "retrofuturism",
      "sustainable",
    ];
    return dead.map((path) => ({
      source: `/${path}`,
      destination: "/",
      permanent: true,
    }));
  },
};

export default nextConfig;
