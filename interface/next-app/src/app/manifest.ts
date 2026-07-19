import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Atom Automation",
    short_name: "Atom Automation",
    description: "WhatsApp Automation That Works While You Don't",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F8FF",
    theme_color: "#010203",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
