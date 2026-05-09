import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.getpancake.ai", lastModified: new Date(), priority: 1.0 },
    { url: "https://www.getpancake.ai/pricing", lastModified: new Date(), priority: 0.8 },
    { url: "https://www.getpancake.ai/signup", lastModified: new Date(), priority: 0.9 },
    { url: "https://www.getpancake.ai/build-in-public", lastModified: new Date(), priority: 0.7 },
    { url: "https://www.getpancake.ai/privacy", lastModified: new Date(), priority: 0.3 },
    { url: "https://www.getpancake.ai/terms", lastModified: new Date(), priority: 0.3 },
  ];
}
