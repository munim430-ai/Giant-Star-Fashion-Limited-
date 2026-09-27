import type { MetadataRoute } from "next";
import { company } from "@/data/factoryData";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: company.name,
    short_name: company.acronym,
    description: company.summary,
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F4",
    theme_color: "#021129",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
