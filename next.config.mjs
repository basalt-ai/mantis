/** @type {import('next').NextConfig} */
const nextConfig = {
  /** In dev, disable webpack filesystem cache — reduces stale chunk manifest mismatches. */
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    /** Same as Vite `?raw` — used by `PancakeMonster` SVG morph sources. */
    config.module.rules.push({
      test: /\.svg$/i,
      resourceQuery: /raw/,
      type: "asset/source",
    });
    return config;
  },
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
