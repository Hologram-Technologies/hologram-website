import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import hiddenCostImage from "@/assets/hidden-cost-ai-inference.webp";
import thesisImage from "@/assets/manifesto-campus.png";
import vonNeumannBottleneckImage from "@/assets/von-neumann-bottleneck.png";
import geometricComputeImage from "@/assets/hologram-geometric-compute.png";
import metricsImage from "@/assets/hologram-metrics.png";
import { HologramMark } from "@/components/site-chrome";






type Props = {
  open: boolean;
  onClose: () => void;
};

function Ref({ n }: { n: number }) {
  return (
    <a
      href={`#note-${n}`}
      aria-label={`Note ${n}`}
      className="relative -top-[0.45em] ml-[0.5px] inline-block text-[0.62em] font-medium leading-none text-[#E93B01] no-underline hover:underline"
    >
      {n}
    </a>
  );
}

const notes: { n: number; text: string; source: string; url: string }[] = [
  {
    n: 1,

    text: "Data centres used about 415 TWh of electricity in 2024, roughly 1.5 percent of the world total, and the IEA expects that to more than double to about 945 TWh by 2030, more than Japan consumes today. A typical AI focused facility already draws what 100,000 households draw, and the largest now under construction will draw twenty times that.",
    source: "IEA, Energy and AI (2025)",
    url: "https://www.iea.org/reports/energy-and-ai/executive-summary",
  },
  {
    n: 2,
    text: "The AI inference market is forecast to grow from roughly $106 billion in 2025 to $255 billion by 2030.",
    source: "MarketsandMarkets, AI Inference Market",
    url: "https://www.marketsandmarkets.com/Market-Reports/ai-inference-market-189921964.html",
  },
  {
    n: 3,
    text: "Semiconductor spending tied to the AI build out is projected to approach $1.6 trillion by 2030.",
    source: "Goldman Sachs, Tracking the trillions behind the AI build out",
    url: "https://www.goldmansachs.com/insights/articles/tracking-trillions-the-assumptions-shaping-scale-of-the-ai-build-out",
  },
  {
    n: 4,
    text: "Articles 12 and 14 require record keeping and human oversight for high risk AI systems, with compliance dates attached.",
    source: "Regulation (EU) 2024/1689, the EU AI Act",
    url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
  },
  {
    n: 5,
    text: "At 45nm a 32 bit floating point add costs about 0.9 picojoules while reading those same 32 bits from DRAM costs about 640 picojoules, a factor of roughly 700.",
    source: "Horowitz, Computing's Energy Problem, reproduced in Han et al., EIE (ISCA 2016)",
    url: "https://www.cse.iitd.ac.in/~rijurekha/course/eie.pdf",
  },
  {
    n: 6,
    text: "Over the past two decades peak server FLOPS scaled about 3.0x every two years while DRAM bandwidth managed 1.6x and interconnect 1.4x.",
    source: "Gholami et al., AI and Memory Wall, IEEE Micro (2024)",
    url: "https://arxiv.org/abs/2403.14123",
  },
  {
    n: 7,
    text: "Gartner predicts that by 2030 inference on a model with one trillion parameters will cost providers over 90 percent less than in 2025.",
    source: "Gartner press release (2026)",
    url: "https://www.gartner.com/en/newsroom/press-releases/2026-03-25-gartner-predicts-that-by-2030-performing-inference-on-an-llm-with-1-trillion-parameters-will-cost-genai-providers-over-90-percent-less-than-in-2025",
  },
  {
    n: 8,
    text: "Hyperdimensional computing represents data as high-dimensional vectors and supports compositional, noise-tolerant operations; vector symbolic architectures extend this to structured reasoning and specialised, low-energy accelerators.",
    source: "Kanerva, Hyperdimensional Computing (Cognitive Computation 2009)",
    url: "https://link.springer.com/article/10.1007/s12559-009-9009-8",
  },
  {
    n: 9,
    text: "Algebraic vector-symbolic systems can bind and unbind symbols recursively, enabling reversible, multi-step reasoning chains without losing the compositional structure of the representation.",
    source: "Schlegel, Neubert & Protzel, A Comparison of Vector Symbolic Architectures (Artificial Intelligence Review 2022)",
    url: "https://link.springer.com/article/10.1007/s10462-022-10159-6",
  },
  {
    n: 10,
    text: "Content-addressed computation requires encoding an arbitrary operation and its operands into a deterministic, collision-resistant name that is cheaper to resolve than re-executing the operation, a property not provided by ordinary data hashing or caching.",
    source: "Hologram, open-source geometric computing repository",
    url: "https://github.com/Hologram-Technologies/hologram",
  },
  {
    n: 11,
    text: "Hologram MatMul is a geometric matrix multiplication engine that runs dense matmul far more efficiently on commodity CPUs and GPUs, cutting latency, energy and cost for both open and closed models.",
    source: "Hologram, uor-matmul",
    url: "https://github.com/UOR-Foundation/uor-matmul",
  },
  {
    n: 12,
    text: "Hologram Geometric Reasoning is an ongoing research program building a new kind of inference engine that does not rely on transformers or large matrix multiplies, running on a standard CPU.",
    source: "Hologram, uor-r4",
    url: "https://github.com/UOR-Foundation/uor-r4",
  },
];

const sections: {
  id: string;
  heading: string;
  shortHeading: string;
  paragraphs: ReactNode[];
  figure?: { src: string; alt: string };
}[] = [
  {
    id: "hidden-cost",
    heading: "The hidden cost of AI inference, paid twice",
    shortHeading: "Hidden cost",


    paragraphs: [
      <>
        Training is a project. Inference is a subscription. It runs every time anyone uses the system, which is why it already dominates compute spend in production AI and is projected to grow from roughly $106 billion in 2025 to $255 billion by 2030.<Ref n={2} /> That is not a market forecast. It is a recurring bill, landing on every company, hospital and government that decided intelligence is now part of how they operate.
      </>,
      <>
        Once a capability becomes infrastructure, the question stops being what it can do and becomes what it costs to keep it on, whether it stays on, and whether anyone can verify what it did. On all three counts the machine we are running is unfit. It was designed as a computer. We are asking it to behave like a civilisation.
      </>,
      <>
        Every request pays a toll at every layer of a stack the operator does not own: per-seat pricing, per-token charges, GPU rent, egress fees, scarcity premiums on silicon (semiconductor spending alone is projected near $1.6 trillion by 2030<Ref n={3} />), and megawatts at the wall. The bytes leave without privacy and return without proof. The CTO has become the CFO. Success is punished by the meter.
      </>,
      <>
        Regulators demanding traceability and human oversight are not expressing a preference. Under Articles 12 and 14 of the EU AI Act those are obligations with deadlines attached.<Ref n={4} /> What the operator can hand them is a black box running on another continent. Three liabilities, one root cause: the work is performed somewhere you cannot see, on data you no longer control, in a form that cannot prove itself.
      </>,
    ],
    figure: {
      src: hiddenCostImage,
      alt: "The Hidden Cost of AI Inference: a stack diagram from AI App down through API, Inference, Network, Chip and Energy, showing how every layer charges rent both ways.",
    },
  },
  {
    id: "compute-foundation",
    heading: "Our compute foundation is from 1945",
    shortHeading: "1945 foundation",


    paragraphs: [
      <>
        In 1945 von Neumann gave every byte an address based on where it sits, not on what it is. The choice was correct for a machine with one memory and one operator. It has become the most expensive architectural assumption still running at planetary scale.
      </>,
      <>
        Everything built since caches, memory tiers, replicas, CDNs, vector stores, checksums, signatures and attestation services is a local patch on the same global gap. Every patch is another layer that must itself be bought, operated and trusted.
      </>,
      <>
        Because no byte has an identity, identical work is recomputed forever. Because identity is positional, fetching a number costs far more than operating on it. Because no byte can prove itself, a tampered one passes as real. These three costs now bind the system.
      </>,
      <>
        Transport cost is the memory wall measured in energy. At 45 nm a 32 bit floating point add costs approximately 0.9 pJ. Reading those same 32 bits from memory costs approximately 640 pJ<Ref n={5} />, a factor of 700×. The gap continues to widen. Over the past two decades peak server throughput scaled about 3.0× every two years while memory bandwidth managed only 1.6×.
      </>,
      <>
        Identity cost is the power wall: the same work is repeated across fleets and continents that have no native way to recognise it has already been done. Trust cost is the governance gap: nothing in the result testifies to its own provenance or integrity. The end of Dennard scaling did not create these problems; it simply removed the growth that had been hiding them.
      </>,
    ],
    figure: {
      src: vonNeumannBottleneckImage,
      alt: "Diagram showing the von Neumann bottleneck: processors and memory separated by a bus that consumes far more energy than computation, alongside a memory hierarchy pyramid from fast CPU registers to slow distant storage.",
    },
  },
  {
    id: "gpus-faster-horse",
    heading: "GPUs are a faster horse, not a new road",
    shortHeading: "GPU limits",


    paragraphs: [
      <>
        GPUs eased the symptom. Massive parallelism, high bandwidth memory and careful caching hide the latency for a while. They do not remove the underlying gap. They accelerate it: the same repeated work simply happens faster, still unverified and still paid for again.
      </>,
      <>
        In AI inference the problem is worse than on a CPU. The same weights are read again and again for every token. The arithmetic is cheap. The movement is expensive. Repetition, not novelty, is the dominant cost, and a faster engine only makes the repetition more expensive in absolute terms.
      </>,
      <>
        New silicon promises relief. Cerebras, Groq and d-Matrix are building processors that sit closer to memory, flatten hierarchies and reduce the distance a bit must travel. They are genuine advances. They are also new machines.
      </>,
      <>
        Each one asks the world to buy proprietary hardware, join a separate supply chain and bet on a single vendor. The existing fleet, already paid for and already installed, is left out. The accelerators close the processor memory gap for those who can afford them. They do not close the repetition gap, the verification gap, or the inefficiency gap for everyone else.
      </>,
    ],
  },
  {
    id: "competition-cannot-fix",
    heading: "Competition cannot fix this",
    shortHeading: "Competition",


    paragraphs: [
      <>
        Prices will fall. Gartner expects inference on a one-trillion-parameter model to cost providers over 90 percent less in 2030 than in 2025.<Ref n={7} /> That cut is real and changes nothing structural. A cheaper redundant computation is still a redundant computation. Volume grows faster than unit price falls. A lower price per token reveals nothing about where data went or how a result can be verified. Cheaper repetition remains repetition.
      </>,
      <>
        Every layer of the stack extracts rent from the same gap: the layer below cannot tell the layer above that this exact work has already been done. The rent is structural.
      </>,
      <>
        Existing tools do not close it. Merkle trees, git, IPFS and prompt caching name content by hash, yet they address stored bytes, not computations. A cache key stays private to its process. A git object identifies a blob but says nothing about the operation that produced it. All sit on top of positional machines; none become the machine's native naming scheme.
      </>,
      <>
        Hyperdimensional computing and vector symbolic architectures offer high-dimensional representations, compositional operations, noise tolerance and specialised accelerators that cut energy and latency.<Ref n={8} /> Deterministic algebraic variants even support reversible multi-hop reasoning.<Ref n={9} /> These improve efficiency and interpretability, yet they still act on finished vectors or local caches. They do not produce a universal address for an arbitrary operation before the work is performed.
      </>,
      <>
        What is missing, and remains profoundly hard, is the ability to name a result before computing it: to derive the address of an operation from the operation itself and the addresses of its operands. Only then can anyone, anywhere, answer "has this already been done?" without asking a server.
      </>,
      <>
        This is the problem of universal lossless encoding of computation.<Ref n={10} /> No existing scheme is simultaneously deterministic across machines, collision-resistant, fully reconstructible and cheaper than recomputing. Hashing names finished data; live computation has no address until the work is done. Closing that gap without centralisation, loss or prohibitive overhead is the hard problem price competition cannot dissolve.
      </>,
    ],
  },
  {
    id: "content-addressing",
    heading: "Universal content-addressing turns any computation into O(1) lookup",
    shortHeading: "Content-addressing",


    paragraphs: [
      <>
        Hologram is the first software defined substrate for geometric intelligence. It does not need new silicon. It removes the physical limit of the Von Neumann architecture by replacing location with identity: a name computed from the bytes themselves, identical on every machine.
      </>,
      <>
        Content becomes the address, then the operation becomes the address too. In the old architecture, address leads to content and the same work is recomputed forever. In Hologram, content leads to address, and the second identical request resolves in a single O(1) lookup.
      </>,
      <>
        The consequences are immediate. Two machines that have never met agree on what a thing is without asking anyone. A result carries its own proof, so verification is a comparison, not a rerun. Work proven anywhere is available everywhere, at the cost of a read. Every computation added makes the next one cheaper, because every proof is shared. The network is the cache. Send a thirty two byte name instead of the gigabytes. Skip the recompute and keep the watts. Pay only for novel bytes, once.
      </>,
    ],
    figure: {
      src: geometricComputeImage,
      alt: "Hologram Geometric Compute: legacy addressing recomputes forever while content addressing lets a single processor resolve identity by an O(1) lookup.",
    },
  },
  {
    id: "speed-scale",
    heading: "Speed, scale, and attestable byte level compute",
    shortHeading: "Speed & scale",


    paragraphs: [
      <>
        Naming work is only half the win. The other half is how Hologram runs it. Because every operation is addressed by its content, the runtime can recognise an exact match before it executes. The second identical request is not just faster; it resolves as a single lookup with no recompute, no approximation, and no guess.
      </>,
      <>
        Common functions are stored as tiny lookup tables and dispatched in constant time. Intermediate results are merged together instead of being written back and forth to memory. On production workloads this collapses latency by orders of magnitude, and on repeat traffic the curve stays flat instead of climbing with model size.
      </>,
      <>
        Parallelism is structural, not forced. The same lattice that names the work also describes how it can be split across cores, browser tabs, or bare metal. A single archive runs unchanged on x86, ARM, and WebAssembly, so throughput scales with the hardware you already have, not the hardware a vendor wants you to buy.
      </>,
      <>
        Less work means less energy. Every skipped recompute, every avoided memory round trip, and every merged step removes watts that would otherwise move redundant bytes. The result is not only faster but cooler, which matters as much at the edge as it does in the data centre.
      </>,
      <>
        Every returned byte is checked against its name. Verification is not a separate audit; it is the same comparison that resolved the lookup. If the bytes do not match the name, the answer is rejected before it reaches your code. The proof is built in, and it travels with the result.
      </>,
      <figure className="mt-6 w-full">
        <img
          src={metricsImage}
          alt="Hologram performance: 30 times faster activations, 100 times lower latency, one runtime everywhere"
          className="w-full rounded-lg"
        />
      </figure>
    ],
  },
  {
    id: "ai-inference",
    heading: "What it means for AI inference",
    shortHeading: "AI inference",


    paragraphs: [
      <>
        The same idea shows up in two forms.
      </>,
      <>
        First, make the workhorse faster. Hologram MatMul runs dense matrix multiplication far more efficiently on the CPUs and GPUs already installed, cutting latency, energy and cost for both open and closed models.<Ref n={11} /> No new chips. No queue. Just better use of the fleet you already own.
      </>,
      <>
        Second, remove the workhorse entirely. Hologram Geometric Reasoning is an ongoing research program building a new kind of inference engine that does not rely on transformers or large matrix multiplies. It runs on a standard CPU, turning workloads that once demanded a cluster into something that fits on a laptop or edge device.<Ref n={12} />
      </>,
      <>
        One lowers the cost of running today's models. The other removes the assumption that tomorrow's models must look like today's. Hardware competes. Math compounds.
      </>,
    ],
  },
  {
    id: "time-to-build",
    heading: "Hologram is building a new Paradigm",
    shortHeading: "Time to build",


    paragraphs: [
      <>
        We are building a software-defined substrate for geometric intelligence that turns existing commodity hardware into a universal, efficient and secure virtual computer, free from the architectural constraints of the 1945 regime.
      </>,
      <>
        It is our belief that universal content-addressing can collapse the memory wall, remove the repetition tax on inference, and make computation reusable across machines without re-execution or vendor lock-in.
      </>,
      <>
        The Hologram Geometric Compute runtime is the first system architected to address computation by content. It delivers a step change in latency, energy and verifiability on the hardware already installed.
      </>,
      <>
        We are pioneering the age of geometric intelligence. Today.
      </>,
      <>Hologram.</>,
    ],
  },




];





export function ThesisOverlay({ open, onClose }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0A0A0A] pt-[env(safe-area-inset-top)]"
      role="dialog"
      aria-modal="true"
      aria-label="Compute Thesis: The Age of Geometric Intelligence"
    >
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
      >
        <header className="sticky top-0 z-50 flex items-center justify-between bg-[#0A0A0A] px-5 py-4 sm:px-6 md:px-10">
          <Link to="/" aria-label="Hologram" className="flex items-center gap-2 text-white">
            <HologramMark className="h-8 w-8 shrink-0 sm:h-10 sm:w-10" />
            <span className="truncate text-[18px] font-semibold tracking-[0.22em] sm:text-[24px] sm:tracking-[0.3em]">
              HOLOGRAM
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:h-11 sm:w-11"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </header>

        <header className="bg-[#0A0A0A] px-5 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-12 md:px-0 md:py-28">
          <h2 className="mx-auto w-full max-w-[640px] font-sans text-[clamp(1.875rem,7.5vw,4rem)] font-semibold leading-[1.14] tracking-[-0.01em] text-white md:px-0">
            <span className="text-[#E93B01]">Compute Thesis:</span>
            <br />
            The Age of Geometric Intelligence
          </h2>
        </header>

        <article className="mx-auto w-full max-w-[640px] px-5 pb-24 pt-10 sm:px-6 sm:pt-16 md:px-0 md:pb-32 md:pt-20">
          <p className="text-[1.0625rem] italic leading-[1.65] tracking-[0.01em] text-[#E5E5E5] sm:text-[1.1875rem]">
            tl;dr: AI inference is becoming a subscription that most organisations cannot afford to keep paying. The cost is not in the models but in the repeated recomputation of identical work, an architectural debt that traces back to the Von Neumann memory bottleneck. Hologram replaces positional addressing with content-addressed geometric computation, turning every repeat operation into a verifiable lookup and making efficient, private and governable AI possible on the hardware already owned.
          </p>

          <h2 className="mt-12 mb-4 text-[1.4375rem] font-semibold leading-[1.22] tracking-[-0.015em] text-white sm:mt-14 sm:mb-5 sm:text-[1.75rem]">
            Inference is now a unit economics problem
          </h2>

          <p className="text-[1.0625rem] leading-[1.65] tracking-[0.01em] text-[#E5E5E5] sm:text-[1.1875rem]">
            AI has moved from lab research to real-world deployment. What remains is scale: the same prompts, the same matrix multiplications, the same answers served millions of times, across every rack, every continent.
          </p>

          <p className="mt-6 text-[1.0625rem] leading-[1.65] tracking-[0.01em] text-[#E5E5E5] sm:text-[1.1875rem]">
            Every output is metered the same way: one inference call. In 2024 data centres used roughly 415 TWh about 1.5 % of global electricity. The IEA expects that figure to more than double to ~945 TWh by 2030, more than Japan consumes today. A typical AI facility already draws as much power as 100,000 homes; the largest now under construction will draw twenty times that.<Ref n={1} />
          </p>

          <p className="mt-6 text-[1.0625rem] leading-[1.65] tracking-[0.01em] text-[#E5E5E5] sm:text-[1.1875rem]">
            Capability sets the price the world will pay. Deployment asks a harder question: what does each answer cost to manufacture in watts, silicon and time at planetary scale? The data centre is no longer a research site. It is a factory. Factories are judged on unit economics.
          </p>

          <p className="mt-6 text-[1.0625rem] leading-[1.65] tracking-[0.01em] text-[#E5E5E5] sm:text-[1.1875rem]">
            Most of that power is not spent discovering new answers. It is spent answering the same questions again. The true cost of intelligence is not novelty. It is repetition.
          </p>

          <figure className="mt-10">
            <img
              src={thesisImage}
              alt="Aerial view of a data centre region at sunrise with $1.6T and the caption Projected 5-year AI inference spend overlaid in orange and white type."
              width={1920}
              height={1080}
              loading="lazy"
              className="w-full"
            />
          </figure>

          <div className="mt-10">
            {sections.map((s) => (
              <section key={s.id} id={s.id}>
                <h2 className="mt-12 mb-4 text-[1.4375rem] font-semibold leading-[1.22] tracking-[-0.015em] text-white sm:mt-14 sm:mb-5 sm:text-[1.75rem]">
                  {s.heading}
                </h2>
                <div>
                  {s.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className="mb-6 text-[1.0625rem] leading-[1.65] tracking-[0.01em] text-[#E5E5E5] last:mb-0 sm:text-[1.1875rem]"
                    >
                      {p}
                    </p>
                  ))}
                </div>
                {s.figure && (
                  <figure className="mt-8">
                    <img
                      src={s.figure.src}
                      alt={s.figure.alt}
                      width={1920}
                      height={1080}
                      loading="lazy"
                      className="w-full"
                    />
                  </figure>
                )}
              </section>
            ))}
          </div>

          <section className="mt-24 border-t border-[#E3DCD7] pt-10">
            <h2 className="text-[1.25rem] font-semibold leading-[1.25] tracking-[-0.01em] text-white">
              Join our team
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-[1.65] tracking-[0.01em] text-[#E5E5E5] sm:text-[1.1875rem]">
              We are building a new paradigm for compute. If this resonates, we would love to hear from you.
            </p>
            <Link
              to="/team"
              className="mt-6 inline-flex min-h-11 items-center gap-3 bg-[#0A0A0A] px-6 py-3 text-[18px] font-medium text-white transition-colors hover:bg-[#1A1A1A] sm:px-7 sm:py-3.5 sm:text-[20px]"
            >
              Explore now
              <ArrowRight size={18} strokeWidth={1.5} />
            </Link>
          </section>

          <section className="mt-24 border-t border-[#E3DCD7] pt-10">
            <h2 className="text-[1.25rem] font-semibold leading-[1.25] tracking-[-0.01em] text-white">
              Notes and sources
            </h2>
            <ol className="mt-6">
              {notes.map((note) => (
                <li
                  key={note.n}
                  id={`note-${note.n}`}
                  className="mb-5 text-[0.9375rem] leading-[1.6] tracking-[0.01em] text-[#5C4438] last:mb-0"
                >
                  <span className="mr-2 font-semibold text-white">{note.n}.</span>
                  {note.text}{" "}
                  <a
                    href={note.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E93B01] underline underline-offset-2"
                  >
                    {note.source}
                  </a>
                </li>
              ))}
            </ol>
          </section>
        </article>
      </div>
    </div>
  );
}


