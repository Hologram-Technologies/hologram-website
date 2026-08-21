import { createFileRoute } from "@tanstack/react-router";

import { CareersOverlay } from "@/components/careers-overlay";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Careers at Hologram" },
      {
        name: "description",
        content:
          "Join Hologram. Build the geometric compute substrate that makes AI fast, energy efficient, and verifiable.",
      },
      { property: "og:title", content: "Careers at Hologram" },
      {
        property: "og:description",
        content:
          "Join Hologram. Build the geometric compute substrate that makes AI fast, energy efficient, and verifiable.",
      },
    ],
  }),
  component: Team,
});

function Team() {
  return <CareersOverlay />;
}
