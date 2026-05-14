import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PayGent – Auto-Biller AI",
    short_name: "PayGent",
    description:
      "Asisten penagihan berbasis AI. Ketik perintah, dapat payment link.",
    start_url: "/",
    display: "standalone",
    background_color: "#0F172A",
    theme_color: "#2563EB",
    orientation: "portrait-primary",
    categories: ["finance", "productivity", "utilities"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/desktop.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "PayGent Desktop View",
      },
      {
        src: "/screenshots/mobile.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "PayGent Mobile View",
      },
    ],
  };
}
