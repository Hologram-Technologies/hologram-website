import { useEffect, useRef, useState } from "react";

import { OverlayBar } from "@/components/site-chrome";



type Role = {
  title: string;
  slug: string;
  about: string;
  role: string;
  responsibilities: string[];
  skills: string[];
  niceToHave?: string[];
  compensation: string[];
};

const roles: Role[] = [
  {
    title: "Runtime Engineer",
    slug: "runtime-engineer",
    about:
      "AI is becoming infrastructure, and the infrastructure we have is not built for it. Hologram is building a software-defined geometric computing substrate: a content-addressed virtual machine that turns repetition into lookup, on hardware the world already owns. We are creating the open, vendor-neutral standard for fast, energy-efficient and verifiable AI inference from the edge to the cloud.",
    role:
      "We are searching for a Runtime Engineer to own the execution layer that makes Hologram feel instantaneous. You will build the low-level systems that load .holo programs, schedule content-addressed operations, manage memory, and keep inference latency minimal across x86, ARM and WebAssembly. This is a hands-on systems role at the center of our stack: the runtime you build will become the default substrate for geometric AI inference everywhere.",
    responsibilities: [
      "Own the execution engine: design and implement the runtime that loads, caches, and executes content-addressed operations with minimal overhead and predictable latency",
      "Cross-platform portability: ensure the same .holo artifact runs unchanged and efficiently on x86, ARM and WebAssembly, with automatic SIMD and kernel selection where it helps",
      "Memory and scheduling: build lazy materialization, reference counting, and cache eviction policies that respect the memory wall rather than hide it",
      "Profile and optimize: establish benchmarks, flame graphs, and regression guards that measure real inference latency and throughput, not just micro-benchmarks",
      "Collaborate across the stack: work with compiler, cryptography, and distributed systems engineers to define how operations are named, verified, and executed",
    ],
    skills: [
      "Strong systems programming background in Rust, C++, or a similarly performant language with a safety-conscious style",
      "Deep understanding of memory models, cache hierarchies, concurrency, and the cost of data movement",
      "Experience with low-level runtimes, virtual machines, interpreters, or execution engines shipping to production",
      "Comfortable reading and reasoning about assembly, calling conventions, and cross-platform ABI differences",
      "Habit of writing reproducible benchmarks and profiling tools that catch regressions before they ship",
      "Excellent written communication; you can explain a subtle trade-off to both engineers and non-engineers",
    ],
    niceToHave: [
      "Experience with compiler IRs, ML runtimes, or graph execution frameworks",
      "Background in WebAssembly runtimes, WASI, or portable sandboxing technologies",
      "Knowledge of SIMD intrinsics, kernel fusion, or accelerator programming",
      "Contributions to open-source systems software or performance tooling",
    ],
    compensation: [
      "Competitive salary based on experience and location",
      "Meaningful equity ownership in a mission-driven company",
      "Flexible working arrangements with a high-trust, low-meeting culture",
      "Top-tier health, dental, and retirement benefits",
    ],
  },
  {
    title: "AI Researcher",
    slug: "ai-researcher",
    about:
      "AI is becoming infrastructure, and the infrastructure we have is not built for it. Hologram is building a software-defined geometric computing substrate: a content-addressed virtual machine that turns repetition into lookup, on hardware the world already owns. We are creating the open, vendor-neutral standard for fast, energy-efficient and verifiable AI inference from the edge to the cloud.",
    role:
      "We are searching for an AI Researcher to push the boundaries of what geometric computing can do for AI. You will explore how content-addressing, hyperdimensional computing, and vector-symbolic architectures can replace or augment traditional matrix multiplication, making inference cheaper, faster and more verifiable on commodity hardware. Your work will directly shape our research roadmap and the open work we publish.",
    responsibilities: [
      "Design novel algorithms: invent and prototype geometric and content-addressed methods for inference, activation functions, and attention-like computation",
      "Benchmark rigorously: compare new approaches against standard baselines for accuracy, latency, energy, and memory, with clean, reproducible experiments",
      "Publish and present: write papers, posts, and talks that explain geometric intelligence clearly to the research and engineering community",
      "Bridge research and product: work closely with runtime and compiler engineers to turn promising ideas into shippable primitives",
      "Track the frontier: stay current on deep learning, efficient inference, quantization, and alternative computing paradigms, and bring relevant insights back to the team",
    ],
    skills: [
      "Strong research background in machine learning, deep learning, or a related computational field",
      "Fluency in linear algebra, probability, and optimization, with a taste for geometric or algebraic perspectives",
      "Track record of published research, open-source projects, or other public evidence of independent thinking",
      "Proficiency in Python and at least one ML framework, with the ability to write efficient experimental code",
      "Experimental rigor: you know how to design controls, measure variance, and avoid fooling yourself with a promising-looking chart",
      "Clear scientific writing and presentation skills; you can make a complex idea feel inevitable",
    ],
    niceToHave: [
      "Experience with hyperdimensional computing, vector-symbolic architectures, or associative memory",
      "Background in transformerless architectures, sparse methods, or quantization",
      "Knowledge of formal methods, proof systems, or verifiable computation",
      "Previous work at the intersection of ML systems and hardware efficiency",
    ],
    compensation: [
      "Competitive salary based on experience and location",
      "Meaningful equity ownership in a mission-driven company",
      "Flexible working arrangements with a high-trust, low-meeting culture",
      "Top-tier health, dental, and retirement benefits",
    ],
  },
  {
    title: "DevRel / SDK Engineer",
    slug: "devrel-sdk-engineer",
    about:
      "AI is becoming infrastructure, and the infrastructure we have is not built for it. Hologram is building a software-defined geometric computing substrate: a content-addressed virtual machine that turns repetition into lookup, on hardware the world already owns. We are creating the open, vendor-neutral standard for fast, energy-efficient and verifiable AI inference from the edge to the cloud.",
    role:
      "We are searching for a DevRel / SDK Engineer to make Hologram effortless to adopt. You will design the public-facing APIs, SDKs, examples, and documentation that turn our geometric computing substrate into something developers can pick up and ship with in an afternoon. You are the bridge between the core team and the open-source community, and your job is to make that community productive, informed, and excited.",
    responsibilities: [
      "Own the SDK surface: design, build, and maintain ergonomic client libraries and command-line tools that expose Hologram's power without exposing its complexity",
      "Build the onboarding path: create example projects, integration guides, tutorials, and starter templates that get developers to their first meaningful result quickly",
      "Engage the community: answer questions, triage issues, gather feedback, and turn that feedback into clear, actionable input for the engineering team",
      "Create clear documentation: write API references, conceptual guides, and troubleshooting docs that engineers actually trust",
      "Show, not just tell: produce demos, blog posts, conference talks, and videos that explain what Hologram does and why it matters",
      "Shape the public API: advocate for backwards compatibility, naming consistency, and developer ergonomics in every new primitive we expose",
    ],
    skills: [
      "Strong software engineering background with experience in multiple languages such as Python, Rust, TypeScript, or Go",
      "Proven ability to design clean, versioned APIs and command-line interfaces that developers love",
      "Excellent technical writing and public communication; you can explain a hard idea to a tired engineer at 5pm",
      "Genuine empathy for developers and a track record of helping them succeed, whether in support, advocacy, or open-source maintenance",
      "Comfortable presenting at meetups, conferences, or in live streams and recorded demos",
      "Ability to read core systems code and translate internal details into accurate external guidance",
    ],
    niceToHave: [
      "Experience in developer relations, technical advocacy, or SDK engineering at a developer-tools or infrastructure company",
      "Background in AI/ML frameworks, model formats, or inference deployment",
      "Content creation skills: screencasts, documentation systems, or interactive playgrounds",
      "Open-source maintenance experience with a meaningful community footprint",
    ],
    compensation: [
      "Competitive salary based on experience and location",
      "Meaningful equity ownership in a mission-driven company",
      "Flexible working arrangements with a high-trust, low-meeting culture",
      "Top-tier health, dental, and retirement benefits",
    ],
  },
  {
    title: "Technical Product Manager / Engineer",
    slug: "technical-product-manager-engineer",
    about:
      "AI is becoming infrastructure, and the infrastructure we have is not built for it. Hologram is building a software-defined geometric computing substrate: a content-addressed virtual machine that turns repetition into lookup, on hardware the world already owns. We are creating the open, vendor-neutral standard for fast, energy-efficient and verifiable AI inference from the edge to the cloud.",
    role:
      "We are searching for a Technical Product Manager / Engineer to turn our geometric computing research into a roadmap the whole team can execute. You will sit between engineering, research, and the users we serve, translating technical possibility into product decisions, sequencing bets, and making sure we ship the right things in the right order. You are technical enough to read the code, reason about the architecture, and write prototypes when that is the fastest way to learn.",
    responsibilities: [
      "Own the roadmap: define quarterly and annual priorities, write clear PRDs, and sequence work so the highest-leverage bets ship first",
      "Bridge research and engineering: work with AI researchers, runtime engineers, and cryptographers to turn ideas into milestones and milestones into shipped features",
      "Validate with users: run interviews, prototype reviews, and usage studies with developers and partners to separate real needs from interesting ideas",
      "Make trade-offs explicit: translate technical constraints into decisions about scope, timing, and quality, and communicate those decisions clearly to the team",
      "Coordinate launches: plan releases, documentation updates, and go-to-market messaging so new capabilities land with impact",
      "Stay hands-on: read diffs, run experiments, and build small prototypes or scripts when that is the fastest way to reduce uncertainty",
    ],
    skills: [
      "Technical product management experience at a developer-tools, infrastructure, or AI company, with shipped products to show for it",
      "Strong engineering foundation: you can read and write code in at least one systems or ML-adjacent language",
      "Systems thinking: you understand how a decision in one layer of the stack ripples into others",
      "Excellent written and verbal communication, with a habit of producing concise, decision-ready documents",
      "Data-driven prioritization and a track record of saying no to good ideas so great ones can ship",
      "Ability to lead without authority and align cross-functional teams around a shared goal",
    ],
    niceToHave: [
      "Background in AI/ML infrastructure, compilers, runtimes, or distributed systems",
      "Experience managing open-source products or developer-facing platforms",
      "Familiarity with geometric computing, content-addressed systems, or hardware-software co-design",
      "Experience with growth, partnerships, or ecosystem strategy for technical products",
    ],
    compensation: [
      "Competitive salary based on experience and location",
      "Meaningful equity ownership in a mission-driven company",
      "Flexible working arrangements with a high-trust, low-meeting culture",
      "Top-tier health, dental, and retirement benefits",
    ],
  },
  {
    title: "Frontend Experience Engineer",
    slug: "frontend-experience-engineer",
    about:
      "AI is becoming infrastructure, and the infrastructure we have is not built for it. Hologram is building a software-defined geometric computing substrate: a content-addressed virtual machine that turns repetition into lookup, on hardware the world already owns. We are creating the open, vendor-neutral standard for fast, energy-efficient and verifiable AI inference from the edge to the cloud.",
    role:
      "We are searching for a Frontend Experience Engineer to build the interfaces that make Hologram visible, understandable, and delightful to use. You will own our marketing site, documentation, developer dashboards, and any interactive tools that let users explore geometric compute. This is a frontend role with a heavy emphasis on craft, performance, and clear communication.",
    responsibilities: [
      "Own the public surfaces: build and maintain our marketing site, documentation platform, and developer dashboards with attention to performance, accessibility, and responsive design",
      "Create interactive experiences: design and implement demos, visualizations, and playgrounds that make geometric computing tangible to visitors",
      "Set frontend standards: establish the design system, component library, and build tooling that keeps the team's UI consistent and fast",
      "Collaborate across functions: work closely with design, marketing, and engineering to ship pages and tools that look sharp and behave correctly",
      "Performance and accessibility: ensure every surface loads quickly, works on every device, and meets high standards of usability and inclusivity",
      "Prototype rapidly: turn vague ideas into clickable interfaces quickly so the team can learn what resonates before over-investing",
    ],
    skills: [
      "Strong track record shipping modern web interfaces with React, TypeScript, and current build tooling",
      "Deep CSS and layout skills, including responsive design, animation, and attention to typography and visual hierarchy",
      "Experience with performance optimization, accessibility standards, and frontend testing",
      "Design sensibility: you can work from a Figma file, spot where it breaks, and improve it in code",
      "Ability to write clear technical copy and structure documentation that developers actually read",
      "Comfortable owning the full frontend lifecycle from build pipeline to deployment and monitoring",
    ],
    niceToHave: [
      "Experience with WebGL, Three.js, Canvas, or data visualization for technical concepts",
      "Background in documentation platforms such as Docusaurus, MDX, or custom content systems",
      "Knowledge of design systems, component libraries, or design-engineering hybrid roles",
      "Interest in AI/ML infrastructure and a desire to explain it through interaction",
    ],
    compensation: [
      "Competitive salary based on experience and location",
      "Meaningful equity ownership in a mission-driven company",
      "Flexible working arrangements with a high-trust, low-meeting culture",
      "Top-tier health, dental, and retirement benefits",
    ],
  },
];

const meta: Record<string, { team: string; location: string }> = {
  "runtime-engineer": { team: "Core Technology", location: "San Francisco, US" },
  "ai-researcher": { team: "Core Technology", location: "San Francisco, US" },
  "devrel-sdk-engineer": { team: "Engineering", location: "San Francisco, US" },
  "technical-product-manager-engineer": { team: "Product", location: "San Francisco, US" },
  "frontend-experience-engineer": { team: "Engineering", location: "San Francisco, US" },
};

const benefits: { group: string; items: { title: string; body: string }[] }[] = [
  {
    group: "Financial",
    items: [
      { title: "Benchmark leading base salary", body: "Set against your experience and the market." },
      { title: "Meaningful equity", body: "You share directly in what we build." },
      { title: "Pension and retirement", body: "Employer contribution from day one." },
    ],
  },
  {
    group: "Health and wellbeing",
    items: [
      { title: "Comprehensive medical", body: "Full cover for you and your dependents." },
      { title: "Dental and vision", body: "Included as standard, no waiting period." },
      { title: "Life assurance", body: "Automatic cover for every employee." },
    ],
  },
  {
    group: "Time and workplace",
    items: [
      { title: "25 days holiday", body: "Plus public holidays. Fully paid." },
      { title: "High performance hardware", body: "The machine you need, upgraded when you need it." },
      { title: "Built for deep focus", body: "Low meeting culture and long uninterrupted blocks." },
    ],
  },
  {
    group: "Relocation and mobility",
    items: [
      { title: "Visa sponsorship", body: "Support where it is needed." },
      { title: "Relocation package", body: "We help you land, not just arrive." },
      { title: "International tax support", body: "Advisory costs covered if you moved to be here." },
    ],
  },
];

const teams = ["Core Technology", "Engineering", "Product"];

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mb-10">
      <h3 className="mb-3 text-[1.125rem] font-semibold leading-[1.3] text-[#0A0A0A]">{title}</h3>
      <ul className="list-disc space-y-2 pl-5 text-[1.0625rem] leading-[1.6] tracking-[0.01em] text-[#1A1A1A] sm:text-[1.1875rem]">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function CareersOverlay() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const active = roles.find((r) => r.slug === openSlug) ?? null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (openSlug) setOpenSlug(null);
      else window.history.back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSlug]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [openSlug]);

  return (
    <div
      className="fixed inset-0 z-50 bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="Careers at Hologram"
    >
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
      >
        <OverlayBar scrollRef={scrollRef} heroRef={heroRef} closeTo="/" />

        {active ? (
          <>
            <header
              ref={heroRef}
              className="bg-[#0A0A0A] px-5 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-16 md:px-0 md:pb-28 md:pt-20"
            >
              <div className="mx-auto w-full max-w-[640px]">
                <button
                  type="button"
                  onClick={() => setOpenSlug(null)}
                  className="mb-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium uppercase tracking-[0.12em] text-[#E93B01] transition-opacity hover:opacity-70"
                >
                  <span aria-hidden>&larr;</span> All open roles
                </button>
                <h1 className="font-sans text-[clamp(1.75rem,6vw,3.25rem)] font-semibold leading-[1.14] tracking-[-0.01em] text-white">
                  {active.title}
                </h1>
                <p className="mt-5 text-[1rem] text-white/60">
                  {meta[active.slug]?.team} &nbsp;/&nbsp; {meta[active.slug]?.location}
                </p>
              </div>
            </header>

            <article className="mx-auto w-full max-w-[640px] px-5 pb-24 pt-12 sm:px-6 sm:pt-16 md:px-0 md:pb-32 md:pt-20">
              <div className="mb-10">
                <h3 className="mb-3 text-[1.125rem] font-semibold leading-[1.3] text-[#0A0A0A]">
                  About Hologram
                </h3>
                <p className="text-[1.0625rem] leading-[1.65] tracking-[0.01em] text-[#1A1A1A] sm:text-[1.1875rem]">
                  {active.about}
                </p>
              </div>
              <div className="mb-10">
                <h3 className="mb-3 text-[1.125rem] font-semibold leading-[1.3] text-[#0A0A0A]">
                  The Role
                </h3>
                <p className="text-[1.0625rem] leading-[1.65] tracking-[0.01em] text-[#1A1A1A] sm:text-[1.1875rem]">
                  {active.role}
                </p>
              </div>
              <Section title="Responsibilities" items={active.responsibilities} />
              <Section title="Skills and Experience" items={active.skills} />
              {active.niceToHave && <Section title="Nice to Have" items={active.niceToHave} />}
              <Section title="Compensation and Equity" items={active.compensation} />
              <div className="mt-12">
                <a
                  href={`mailto:careers@gethologram.ai?subject=Application for Hologram ${active.title}`}
                  className="inline-flex items-center justify-center border border-[#0A0A0A] px-6 py-3 text-[0.9375rem] font-medium uppercase tracking-[0.08em] text-[#0A0A0A] transition-colors hover:bg-[#0A0A0A] hover:text-white"
                >
                  Apply for this role
                </a>
              </div>
            </article>
          </>
        ) : (
          <>
            <header
              ref={heroRef}
              className="bg-[#0A0A0A] px-5 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16 md:px-0 md:pb-32 md:pt-24"
            >
              <div className="mx-auto w-full max-w-[860px] md:px-8">
                <p className="mb-4 text-[0.9375rem] font-medium uppercase tracking-[0.12em] text-[#E93B01] sm:text-[1rem]">
                  Join the team
                </p>
                <h1 className="max-w-[16ch] font-sans text-[clamp(1.875rem,7vw,4rem)] font-semibold leading-[1.12] tracking-[-0.015em] text-white">
                  The future of compute is here.
                  <br />
                  Be the one who creates it.
                </h1>
                <div className="mt-10 flex flex-wrap gap-3">
                  <a
                    href="#open-roles"
                    className="inline-flex items-center gap-2 border border-white px-6 py-3 text-[0.9375rem] font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-white hover:text-[#0A0A0A]"
                  >
                    View open roles <span aria-hidden>&rarr;</span>
                  </a>
                  <a
                    href="#benefits"
                    className="inline-flex items-center gap-2 border border-white/25 px-6 py-3 text-[0.9375rem] font-medium uppercase tracking-[0.08em] text-white/70 transition-colors hover:border-white/60 hover:text-white"
                  >
                    Benefits
                  </a>
                </div>
              </div>
            </header>

            <section id="benefits" className="px-5 py-20 sm:px-6 md:py-28">
              <div className="mx-auto w-full max-w-[860px] md:px-8">
                <p className="mb-3 text-[0.8125rem] font-medium uppercase tracking-[0.16em] text-[#8A8A8A]">
                  Working at Hologram
                </p>
                <h2 className="mb-14 text-[clamp(1.625rem,4vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.015em] text-[#0A0A0A]">
                  We invest in the people building Hologram.
                </h2>

                <div className="space-y-12">
                  {benefits.map((group) => (
                    <div key={group.group} className="border-t border-[#E6E6E6] pt-8 md:grid md:grid-cols-[200px_1fr] md:gap-10">
                      <h3 className="mb-6 text-[0.8125rem] font-medium uppercase tracking-[0.16em] text-[#8A8A8A] md:mb-0">
                        {group.group}
                      </h3>
                      <div className="grid gap-8 sm:grid-cols-2">
                        {group.items.map((item) => (
                          <div key={item.title}>
                            <p className="text-[1.0625rem] font-semibold leading-[1.35] text-[#0A0A0A]">
                              {item.title}
                            </p>
                            <p className="mt-1.5 text-[0.9875rem] leading-[1.55] text-[#5A5A5A]">
                              {item.body}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="open-roles" className="bg-[#F7F7F5] px-5 py-20 sm:px-6 md:py-28">
              <div className="mx-auto w-full max-w-[860px] md:px-8">
                <div className="mb-12 flex items-baseline gap-4">
                  <h2 className="text-[clamp(1.625rem,4vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.015em] text-[#0A0A0A]">
                    Open roles
                  </h2>
                  <span className="text-[1rem] text-[#8A8A8A]">{roles.length}</span>
                </div>

                {teams.map((team) => {
                  const teamRoles = roles.filter((r) => meta[r.slug]?.team === team);
                  if (teamRoles.length === 0) return null;
                  return (
                    <div key={team} className="mb-12 last:mb-0">
                      <h3 className="mb-4 text-[0.8125rem] font-medium uppercase tracking-[0.16em] text-[#8A8A8A]">
                        {team}
                      </h3>
                      <ul className="border-t border-[#DEDEDA]">
                        {teamRoles.map((r) => (
                          <li key={r.slug} className="border-b border-[#DEDEDA]">
                            <button
                              type="button"
                              onClick={() => setOpenSlug(r.slug)}
                              className="group flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:bg-white/70"
                            >
                              <span className="text-[1.125rem] font-medium leading-[1.3] text-[#0A0A0A] sm:text-[1.25rem]">
                                {r.title}
                              </span>
                              <span className="flex shrink-0 items-center gap-4">
                                <span className="hidden text-[0.9375rem] text-[#6A6A6A] sm:inline">
                                  {meta[r.slug]?.location}
                                </span>
                                <span
                                  aria-hidden
                                  className="text-[#E93B01] transition-transform duration-200 group-hover:translate-x-1"
                                >
                                  &rarr;
                                </span>
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}

                <p className="mt-14 text-[1.0625rem] leading-[1.6] text-[#5A5A5A]">
                  Do not see your role? Write to us at{" "}
                  <a
                    href="mailto:careers@gethologram.ai"
                    className="font-medium text-[#0A0A0A] underline underline-offset-[3px]"
                  >
                    careers@gethologram.ai
                  </a>
                  .
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
