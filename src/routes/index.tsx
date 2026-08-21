import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { ThesisOverlay } from "@/components/thesis-overlay";
import earthPoster from "@/assets/earth-poster.jpg";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hologram" },
      {
        name: "description",
        content: "Reimagining compute for fast, energy-efficient and verifiable AI.",
      },
      { property: "og:title", content: "Hologram" },
      {
        property: "og:description",
        content: "Reimagining compute for fast, energy-efficient and verifiable AI.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [thesisOpen, setThesisOpen] = useState(false);

  return (
    <section className="relative flex h-full w-full items-end overflow-hidden pt-16 pb-16 sm:items-center sm:py-20">
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

      <div className="relative mx-auto mt-6 flex w-full max-w-[1400px] flex-col items-start px-5 sm:mt-10 sm:px-6 md:mt-14 md:px-10">
        <h1 className="max-w-[16ch] text-[clamp(2.3rem,9.6vw,4.6rem)] font-bold leading-[1.06] tracking-[-0.03em] sm:max-w-[28ch] sm:leading-[1.02] md:text-[clamp(2.3rem,5.4vw,4.6rem)]">
          <span style={{ color: "#E93B01" }}>Reimagining compute</span>
          <br className="hidden sm:block" />{" "}
          for fast, energy-efficient
          <br className="hidden sm:block" />{" "}
          and verifiable AI.
        </h1>

        <button
          type="button"
          onClick={() => setThesisOpen(true)}
          className="mt-7 inline-flex min-h-11 items-center gap-3 border border-white/30 px-5 py-2.5 text-[16px] text-white transition-colors hover:bg-white/10 sm:px-6 sm:py-3 sm:text-[18px] md:mt-10"
        >
          OUR THESIS
          <ArrowRight size={16} strokeWidth={1.5} />
        </button>
      </div>


      <ThesisOverlay open={thesisOpen} onClose={() => setThesisOpen(false)} />
    </section>
  );
}
