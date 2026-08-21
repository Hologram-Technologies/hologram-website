import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/product")({
  head: () => ({
    meta: [
      { title: "Product, Hologram virtual compute control plane" },
      {
        name: "description",
        content:
          "A virtual compute overlay on the hardware you already run, with machines, models and agents as one workload priced per core.",
      },
      { property: "og:title", content: "Product, Hologram control plane" },
      {
        property: "og:description",
        content: "A virtual compute overlay on the hardware you already run.",
      },
    ],
  }),
  component: Product,
});

function Product() {
  return (
    <section className="mx-auto flex h-full w-full max-w-[1400px] items-center px-6 py-16 sm:px-6 sm:py-20 md:px-10">
      <h1 className="max-w-[22ch] text-[clamp(2rem,4.2vw,3.6rem)] font-normal leading-[1.12] tracking-[-0.02em]">
        We run models, machines and agents as one workload on hardware you already own.
      </h1>
    </section>
  );
}
