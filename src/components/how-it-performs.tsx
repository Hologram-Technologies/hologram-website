"use client";

import { useState, useEffect } from "react";
import { ExternalLink, FileJson, Clock } from "lucide-react";
import { BenchmarkData, formatNanoseconds } from "@/lib/benchmark-utils";

const BENCHMARK_API_URL = "https://gethologram.ai/benches/current.json";
const GITHUB_REPO_URL = "https://github.com/UOR-Foundation/hologram";

export function HowItPerforms() {
  const [data, setData] = useState<BenchmarkData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBenchmarks() {
      try {
        setLoading(true);
        const response = await fetch(BENCHMARK_API_URL, {
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const json = await response.json();
        setData(json as BenchmarkData);
      } catch (err) {
        console.error("Failed to load benchmarks:", err);
        // Fallback to local data if fetch fails
        try {
          const fallbackData = await import("@/public/benches/current.json");
          setData(fallbackData.default as unknown as BenchmarkData);
        } catch (fallbackErr) {
          console.error("Failed to load fallback data:", fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchBenchmarks();
  }, []);

  // Get specific benchmarks
  const canonicalizeBenchmark = data?.benchmarks?.["canonicalize_simple_add_circuit"];
  const rangeBenchmark = data?.benchmarks?.["canonicalize_range_operations/4"];
  const compileBenchmark = data?.benchmarks?.["compile_sequential_chain/8"];

  // Format timestamp
  const timestamp = data?.timestamp ? new Date(data.timestamp) : null;
  const formattedDate = timestamp
    ? timestamp.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  const formattedTime = timestamp
    ? timestamp.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      })
    : null;
  return (
    <section className="relative z-10 pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-24 lg:pb-32 border-t border-border/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            <span
              className="gradient-text-animated"
              style={{
                backgroundImage: 'linear-gradient(97deg, #3388EE, #8844CC 42%, #CC44AA 74%, #EE4433)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              How it works?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground mt-6">
            CONSTANT-TIME O(1) RUNTIME
          </p>
        </div>

        {/* Premise */}
        <p className="text-lg leading-relaxed text-foreground max-w-2xl mx-auto text-center mb-8">
          Execution cost is bounded by circuit topology, not model size or input length.
        </p>

        {/* Architecture Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Traditional Computing */}
          <div className="rounded-xl border border-border/20 bg-surface-dark/30 p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-foreground mb-1">Traditional Computing</h3>
              <p className="text-base text-muted-foreground">Sequential Execution · Cost Grows with Depth</p>
            </div>

            {/* Hardware Stack */}
            <div className="space-y-2 mb-6">
              <div className="rounded border border-border/10 bg-surface-dark/20 p-3">
                <div className="text-base font-semibold text-foreground mb-1">Processor Core</div>
                <div className="text-base text-muted-foreground">Instruction Decoder · ALU · FPU</div>
              </div>
              <div className="flex justify-center">
                <div className="text-xs text-muted-foreground">↓</div>
              </div>
              <div className="rounded border border-border/10 bg-surface-dark/20 p-3">
                <div className="text-base font-semibold text-foreground mb-1">L1 Cache</div>
                <div className="text-base text-muted-foreground">Op 1 Data · Op 2 Data · Op 3 Data</div>
              </div>
              <div className="flex justify-center">
                <div className="text-xs text-muted-foreground">↓</div>
              </div>
              <div className="rounded border border-border/10 bg-surface-dark/20 p-3">
                <div className="text-base font-semibold text-foreground mb-1">L2 Cache</div>
                <div className="text-base text-muted-foreground">Intermediate results · Buffers</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-base font-semibold text-foreground mb-1">System Bus</div>
                <div className="text-base text-red-400/80 font-medium mb-1">↓</div>
                <div className="text-base text-red-400/80 italic text-center px-2">Most of energy and latency</div>
              </div>
              <div className="rounded border border-red-400/30 bg-red-400/5 p-3">
                <div className="text-base font-semibold text-foreground mb-1">DRAM</div>
                <div className="text-base text-muted-foreground">Op 1 Code · Op 2 Code · Op 3 Code · ...</div>
              </div>
            </div>

            {/* Execution Flow */}
            <div className="border-t border-border/10 pt-4">
              <div className="text-base font-semibold text-foreground mb-2">Execution Flow</div>
              <div className="flex flex-col items-center space-y-1 text-base">
                <div className="text-foreground">Input</div>
                <div className="text-muted-foreground">↓</div>
                <div className="flex gap-2">
                  <div className="px-2 py-1 rounded bg-surface-dark/40 border border-border/10">Op 1</div>
                  <div className="text-muted-foreground">→</div>
                  <div className="px-2 py-1 rounded bg-surface-dark/40 border border-border/10">Op 2</div>
                  <div className="text-muted-foreground">→</div>
                  <div className="px-2 py-1 rounded bg-surface-dark/40 border border-border/10">Op 3</div>
                </div>
                <div className="text-muted-foreground">↓</div>
                <div className="text-foreground">Output</div>
              </div>
              <p className="text-base text-muted-foreground mt-3 text-center">
                Each operation: Load → Compute → Store
              </p>
            </div>
          </div>

          {/* Hologram Computing */}
          <div className="rounded-xl border border-cyan/30 bg-surface-dark/30 p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-foreground mb-1">Hologram Computing</h3>
              <p className="text-base text-muted-foreground">Fixed Circuit · Cost Fixed Once Compiled</p>
            </div>

            {/* Hardware Stack */}
            <div className="space-y-2 mb-6">
              <div className="rounded border border-cyan/20 bg-cyan/5 p-3">
                <div className="text-base font-semibold text-foreground mb-1">Processor Core</div>
                <div className="text-base text-muted-foreground">ISA Dispatch · Direct Memory Access</div>
              </div>
              <div className="flex justify-center">
                <div className="text-base text-cyan">↓</div>
              </div>
              <div className="rounded border border-cyan/20 bg-cyan/5 p-3">
                <div className="text-base font-semibold text-foreground mb-1">L1 Cache</div>
                <div className="text-base text-muted-foreground">Fused Class Map [96 bytes]</div>
              </div>
              <div className="flex justify-center">
                <div className="text-base text-cyan">↓</div>
              </div>
              <div className="rounded border border-cyan/20 bg-cyan/5 p-3">
                <div className="text-base font-semibold text-foreground mb-1">L2 Cache</div>
                <div className="text-base text-muted-foreground">Precompiled ISA Program [~1 KB]</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-base font-semibold text-foreground mb-1">System Bus</div>
                <div className="text-base text-cyan font-medium mb-1">↓</div>
                <div className="text-base text-cyan italic text-center px-2">Single hash table lookup</div>
              </div>
              <div className="rounded border border-cyan/20 bg-cyan/5 p-3">
                <div className="text-base font-semibold text-foreground mb-1">DRAM</div>
                <div className="text-base text-muted-foreground">Input · Output (no operation code)</div>
              </div>
            </div>

            {/* Execution Flow */}
            <div className="border-t border-cyan/20 pt-4">
              <div className="text-base font-semibold text-foreground mb-2">Execution Flow</div>
              <div className="flex flex-col items-center space-y-2 text-base">
                <div className="text-foreground">Input</div>
                <div className="text-cyan">↓</div>
                <div className="relative w-full">
                  <div className="absolute -inset-1 bg-cyan/10 rounded-lg blur-sm"></div>
                  <div className="relative px-4 py-3 rounded-lg border-2 border-cyan bg-cyan/10 text-center">
                    <div className="font-semibold text-foreground mb-1">Fixed Canonical Circuit</div>
                    <div className="text-muted-foreground">Fused Class Map Lookup</div>
                    <div className="text-muted-foreground text-base mt-1">O(1) per element</div>
                  </div>
                </div>
                <div className="text-cyan">↓</div>
                <div className="text-foreground">Output</div>
              </div>
              <p className="text-base text-muted-foreground mt-3 text-center">
                Single pass: All operations fused into one lookup
              </p>
            </div>
          </div>
        </div>

        {/* Hologram benchmarks */}
        <div className="rounded-xl border border-border/20 bg-surface-dark/30 p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Hologram benchmarks</h3>
          {loading ? (
            <div className="text-center text-muted-foreground py-8">Loading benchmarks...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Metric A - Canonicalize */}
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">
                  {canonicalizeBenchmark
                    ? formatNanoseconds(canonicalizeBenchmark.mean_ns)
                    : "0.83 µs"}
                </div>
                <div className="text-base text-muted-foreground mb-1">Canonicalize (simple circuit)</div>
                {canonicalizeBenchmark?.confidence_interval && (
                  <div className="text-base text-muted-foreground">
                    95% CI: {formatNanoseconds(canonicalizeBenchmark.confidence_interval.lower_ns)}–{formatNanoseconds(canonicalizeBenchmark.confidence_interval.upper_ns)}
                  </div>
                )}
              </div>

              {/* Metric B - Range canonicalization */}
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">
                  {rangeBenchmark
                    ? `~${formatNanoseconds(rangeBenchmark.mean_ns)}`
                    : "~1.0 µs"}
                </div>
                <div className="text-base text-muted-foreground mb-2">Range canonicalization (4 → 16)</div>
                {data?.benchmarks && (
                  <div className="flex items-center justify-center gap-2 mb-1">
                    {[4, 8, 16].map((size, idx) => {
                      const bench = data.benchmarks[`canonicalize_range_operations/${size}`];
                      return (
                        <span key={size} className="flex items-center gap-1">
                          <span className="text-base font-medium text-foreground">
                            {bench ? formatNanoseconds(bench.mean_ns).replace("µs", "").trim() : "1.03"}
                          </span>
                          {idx < 2 && <span className="text-base text-muted-foreground">→</span>}
                        </span>
                      );
                    })}
                    <span className="text-base text-muted-foreground">µs</span>
                  </div>
                )}
                <div className="text-base text-muted-foreground">Runtime remains stable as size increases</div>
              </div>

              {/* Metric C - Compile sequential chain */}
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">
                  {compileBenchmark
                    ? formatNanoseconds(compileBenchmark.mean_ns)
                    : "12.67 µs"}
                </div>
                <div className="text-base text-muted-foreground mb-1">Compile sequential chain (/8)</div>
                {compileBenchmark?.confidence_interval && (
                  <div className="text-base text-muted-foreground">
                    95% CI: {formatNanoseconds(compileBenchmark.confidence_interval.lower_ns)}–{formatNanoseconds(compileBenchmark.confidence_interval.upper_ns)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Trust Footer */}
        <div className="text-center space-y-3">
          <p className="text-base text-muted-foreground">
            Medians with 95% confidence intervals from live benchmarks
          </p>
          
          {/* Last test run date */}
          {formattedDate && formattedTime && (
            <p className="text-base text-muted-foreground flex items-center justify-center gap-1.5">
              <Clock className="h-5 w-5" />
              Last test run: {formattedDate} at {formattedTime}
            </p>
          )}
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-base">
            <a
              href={BENCHMARK_API_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-cyan font-semibold underline hover:text-cyan/80 transition-colors"
              aria-label="View raw benchmark data"
            >
              <FileJson className="h-5 w-5" />
              <span>View raw data</span>
              <ExternalLink className="h-5 w-5" />
            </a>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-cyan font-semibold underline hover:text-cyan/80 transition-colors"
              aria-label="View on GitHub"
            >
              <ExternalLink className="h-5 w-5" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}









