import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { ThesisOverlay } from "@/components/thesis-overlay";
import earthPoster from "@/assets/earth-poster.jpg";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hologram, fast energy efficient verifiable compute" },
      {
        name: "description",
        content:
          "Hologram is a universal lossless runtime. Every byte gets one self verified address, so computation becomes a fast, energy efficient, verifiable lookup.",
      },
      { property: "og:title", content: "Hologram, verifiable virtual compute" },
      {
        property: "og:description",
        content: "One verified address per byte. Repeat AI work collapses into lookups.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [thesisOpen, setThesisOpen] = useState(false);

  return (
    <section className="relative flex h-full w-full items-end overflow-hidden pt-16 pb-8 sm:items-center sm:py-20">
      {/* Earth footage */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-full overflow-hidden bg-cover bg-[55%_30%] bg-no-repeat md:w-[64%] md:bg-[28%_center]"
        style={{ backgroundImage: `url(${earthPoster})` }}
      >
        <video
          className="h-full w-full scale-[1.08] object-cover object-[55%_30%] md:scale-100 md:object-[28%_center]"
          src="/earth.mp4"
          poster={earthPoster}
          autoPlay
          muted
          loop
          playsInline
        />
        {/* horizontal fade (tablet and up) */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            backgroundImage:
              "linear-gradient(90deg, var(--background) 0%, var(--background) 14%, oklch(0.19 0.004 60 / 0.72) 34%, transparent 66%)",
          }}
        />
        {/* diagonal fade (mobile: keeps headline legible while showing the planet) */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            backgroundImage:
              "linear-gradient(30deg, var(--background) 0%, var(--background) 24%, oklch(0.19 0.004 60 / 0.85) 40%, oklch(0.19 0.004 60 / 0.48) 60%, oklch(0.19 0.004 60 / 0.18) 80%, oklch(0.19 0.004 60 / 0.05) 94%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, oklch(0.19 0.004 60 / 0.6) 0%, transparent 24%, transparent 76%, oklch(0.19 0.004 60 / 0.7) 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto mt-4 flex w-full max-w-[1400px] flex-col items-start px-5 sm:px-6 md:mt-8 md:px-10">
        <h1 className="max-w-[16ch] text-[clamp(2.5rem,10.5vw,5rem)] font-bold leading-[1.06] tracking-[-0.03em] sm:max-w-[28ch] sm:leading-[1.02] md:text-[clamp(2.5rem,5.8vw,5rem)]">
          <span style={{ color: "#E93B01" }}>Reimagining compute</span>
          <br className="hidden sm:block" />{" "}
          for fast, energy-efficient
          <br className="hidden sm:block" />{" "}
          and verifiable AI.
        </h1>

        <button
          type="button"
          onClick={() => setThesisOpen(true)}
          className="mt-8 inline-flex min-h-11 items-center gap-3 border border-white/30 px-6 py-3 text-[18px] text-white transition-colors hover:bg-white/10 sm:px-7 sm:py-3.5 sm:text-[20px] md:mt-12"
        >
          OUR THESIS
          <ArrowRight size={18} strokeWidth={1.5} />
        </button>
      </div>


      <ThesisOverlay open={thesisOpen} onClose={() => setThesisOpen(false)} />
    </section>
  );
}
