import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL || "https://affinityaiims.in";

  const routes = [
    "",
    "/events",
    "/schedule",
    "/sports",
    "/heritage",
    "/gallery",
    "/previous-editions",
    "/about",
    "/sponsors",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
    "/login",
    "/register",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  return routes;
}
