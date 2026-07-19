import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://atomautomation.in";
  const currentDate = new Date();

  // Define static routes with their specific config
  const routes = [
    { path: "", changeFrequency: "daily" as const, priority: 1.0 },
    { path: "/about", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/support", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/security", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/login", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/signup", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/legal/terms", changeFrequency: "monthly" as const, priority: 0.4 },
    { path: "/legal/privacy", changeFrequency: "monthly" as const, priority: 0.4 },
    { path: "/legal/data-deletion", changeFrequency: "monthly" as const, priority: 0.4 },
    { path: "/legal/data-deletion-status", changeFrequency: "monthly" as const, priority: 0.4 },
    { path: "/legal/disclaimer", changeFrequency: "monthly" as const, priority: 0.4 },
    { path: "/dashboard", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/dashboard/activity", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/dashboard/automations", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/dashboard/connect", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/dashboard/connection", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/dashboard/messages", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/dashboard/permissions", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/dashboard/settings", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/dashboard/support", changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
