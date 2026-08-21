import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/technology")({
  head: () => ({
    meta: [
      { title: "Technology, Hologram universal runtime" },
      {
        name: "description",
        content:
          "Hologram computes naming, meaning and proof as one operation, turning computation into verifiable lookups on any hardware.",
      },
      { property: "og:title", content: "Technology, Hologram universal runtime" },
      {
        property: "og:description",
        content: "Naming, meaning and proof computed together. One algebra, any hardware.",
      },
    ],
  }),
  component: Technology,
});

function Technology() {
  return (
    <section className="mx-auto flex h-full w-full max-w-[1400px] items-center px-6 py-16 sm:px-6 sm:py-20 md:px-10">
      <h1 className="max-w-[22ch] text-[clamp(2rem,4.2vw,3.6rem)] font-normal leading-[1.12] tracking-[-0.02em]">
        We make naming, meaning and proof a single operation.
      </h1>
    </section>
  );
}
