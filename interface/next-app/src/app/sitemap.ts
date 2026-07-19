import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://atomautomation.in";
  const currentDate = new Date();

  // Public marketing & legal pages only
  const routes = [
    { path: "", changeFrequency: "daily" as const, priority: 1.0 },
    { path: "/about", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/support", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/security", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/legal/terms", changeFrequency: "monthly" as const, priority: 0.4 },
    { path: "/legal/privacy", changeFrequency: "monthly" as const, priority: 0.4 },
    { path: "/legal/data-deletion", changeFrequency: "monthly" as const, priority: 0.4 },
    { path: "/legal/data-deletion-status", changeFrequency: "monthly" as const, priority: 0.4 },
    { path: "/legal/disclaimer", changeFrequency: "monthly" as const, priority: 0.4 },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
