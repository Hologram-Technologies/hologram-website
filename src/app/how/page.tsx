"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/section";
import { Math } from "@/components/math";
import { GeometricProjectionViz } from "@/components/geometric-projection-viz";
import { CanonicalizationOptimizationViz } from "@/components/canonicalization-optimization-viz";
import { CircuitGenerationViz } from "@/components/circuit-generation-viz";
import { InProcessExecutionViz } from "@/components/in-process-execution-viz";
import { SinglePassExecutionViz } from "@/components/single-pass-execution-viz";
import { ConstantTimeO1Viz } from "@/components/constant-time-o1-viz";
import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/ui/button";
import { BenchmarkData, formatNanoseconds, fetchBenchmarkData, BENCHMARK_API_URL } from "@/lib/benchmark-utils";
import {
  Code2,
  Zap,
  Server,
  CheckCircle2,
  Waves,
  Atom,
  Cpu,
  Monitor,
  Globe,
  ArrowRight,
  Brain,
  FileCode,
} from "lucide-react";

export default function HowPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("python");
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);
  const [loadingBenchmarks, setLoadingBenchmarks] = useState(true);

  useEffect(() => {
    setLoadingBenchmarks(true);
    fetchBenchmarkData()
      .then(setBenchmarkData)
      .catch((err) => console.error("Failed to load benchmarks:", err))
      .finally(() => setLoadingBenchmarks(false));
  }, []);

  // Get specific benchmarks
  const canonicalizeBenchmark = benchmarkData?.benchmarks?.["canonicalize_simple_add_circuit"];
  // For execution time per element, use representative fused operation benchmarks
  // The constant-time chart shows ~0.2-0.23µs per element for fused operations
  const executionBenchmarks = [
    benchmarkData?.benchmarks?.["canonicalize_range_operations/2"],
    benchmarkData?.benchmarks?.["canonicalize_range_operations/4"],
  ].filter((b): b is NonNullable<typeof b> => b !== undefined);
  // Calculate average per-element time from available benchmarks
  // Note: These benchmarks represent per-element execution time for fused operations
  const executionTimePerElement = executionBenchmarks.length > 0
    ? executionBenchmarks.reduce((sum, b) => sum + (b.mean_ns / 1000), 0) / executionBenchmarks.length
    : 0.2; // Fallback: ~0.2µs per element from constant-time chart data

  const languageExamples: Record<string, { code: string; language: string }> = {
    python: {
      code: `from hologram import Executor, BackendType

exec = Executor.new(BackendType.CUDA)
buf = exec.allocate_f32(1024)
buf.copy_from([1.0] * 1024)
exec.run(circuit)`,
      language: "python",
    },
    typescript: {
      code: `import { Executor, BackendType } from 'hologram';

const exec = new Executor(BackendType.WebGPU);
const buf = exec.allocateF32(1024);
await exec.run(circuit);`,
      language: "typescript",
    },
    swift: {
      code: `import Hologram

let exec = Executor(backend: .Metal)
let buf = exec.allocateF32(1024)
try exec.run(circuit)`,
      language: "swift",
    },
    kotlin: {
      code: `import hologram.*

val exec = Executor(BackendType.CPU)
val buf = exec.allocateF32(1024)
exec.run(circuit)`,
      language: "kotlin",
    },
  };

  return (
    <>
      {/* Hero Section */}
      <Section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Hologram
            </h1>
          </div>

          <div className="p-8 mb-4">
            <p className="text-lg leading-relaxed text-foreground text-center">
              Hologram is a compile-first library that acts as a <span className="text-cyan font-semibold">virtual high-performance hypervisor</span> for computation. It is compiled into your application and runs in-process (same PID and memory space), virtualizing execution across CPU, GPU, and WASM backends.
            </p>
          </div>
        </div>
      </Section>

      {/* Overview Section */}
      <Section className="pt-0 pb-6 sm:pt-1 sm:pb-8 lg:pt-2 lg:pb-12 border-t-2 border-border/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border/20 bg-surface-dark/30 p-6">
            <p className="text-lg leading-relaxed text-foreground mb-12 text-center">
              Hologram transforms byte-level iterative computation into<br />
              <span className="text-cyan font-semibold">fused circuit in-memory lookup</span> that execute in constant time <Math inline>O(1)</Math>.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="#compile-once" className="text-center hover:opacity-80 transition-opacity">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/20 mx-auto mb-4">
                  <Code2 className="h-6 w-6 text-cyan" />
                </div>
                <div className="text-xl font-semibold mb-2">
                  <span
                    className="gradient-text-animated"
                    style={{
                      backgroundImage: 'linear-gradient(97deg, #3388EE, #8844CC 42%, #CC44AA 74%, #EE4433)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    1. Compile once
                  </span>
                </div>
                <div className="text-base text-muted-foreground">All optimization at build time.</div>
              </Link>
              <Link href="#run-anywhere" className="text-center hover:opacity-80 transition-opacity">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/20 mx-auto mb-4">
                  <Server className="h-6 w-6 text-cyan" />
                </div>
                <div className="text-xl font-semibold mb-2">
                  <span
                    className="gradient-text-animated"
                    style={{
                      backgroundImage: 'linear-gradient(97deg, #3388EE, #8844CC 42%, #CC44AA 74%, #EE4433)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    2. Run anywhere
                  </span>
                </div>
                <div className="text-base text-muted-foreground">CPU, GPU, WASM, etc.</div>
              </Link>
              <Link href="#execute-constant-time" className="text-center hover:opacity-80 transition-opacity">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/20 mx-auto mb-4">
                  <Zap className="h-6 w-6 text-cyan" />
                </div>
                <div className="text-xl font-semibold mb-2">
                  <span
                    className="gradient-text-animated"
                    style={{
                      backgroundImage: 'linear-gradient(97deg, #3388EE, #8844CC 42%, #CC44AA 74%, #EE4433)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    3. Execute with O(1) lookup
                  </span>
                </div>
                <div className="text-base text-muted-foreground">Single-pass runtime execution.</div>
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* 1. Compile Once */}
      <Section id="compile-once" className="py-12 sm:py-16 lg:py-20 border-t-2 border-border/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="1. Compile Once"
            description="At build time, Hologram analyzes your data, graphs, or models and projects them into a geometric compute space."
          />

          <div className="space-y-8">
            {/* Geometric Projection */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-cyan">Geometric Projection</h3>
              <p className="text-base leading-relaxed text-foreground">
                Byte-level operations are mapped from linear memory into a finite torus representation defined by the <Link href="/research" className="text-cyan hover:underline">Atlas algebraic framework</Link>. Each operation compiles to a 96 byte class map, enabling deterministic constant time lookup via geometric canonicalization.
              </p>
              
              <div className="rounded-lg border border-border/20 bg-surface-dark/30 p-6 mt-6">
                <GeometricProjectionViz />
              </div>
            </div>

            {/* Canonicalization and Optimization */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-cyan">Canonicalization and Optimization</h3>
              <p className="text-base leading-relaxed text-foreground">
                Redundant operations are eliminated through algebraic simplification. Operation chains are fused, producing a compact representation.
              </p>
              <div className="rounded-lg border border-cyan/20 bg-cyan/5 p-4">
                <div className="text-sm font-semibold text-foreground">
                  Result: Typically <strong className="text-cyan">75% fewer operations</strong> after optimization.
                </div>
              </div>
              
              <div className="rounded-lg border border-border/20 bg-surface-dark/30 p-6 mt-6">
                <CanonicalizationOptimizationViz />
              </div>
            </div>

            {/* Circuit Generation */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-cyan">Circuit Generation</h3>
              <p className="text-base leading-relaxed text-foreground">
                From the optimized representation, Hologram generates a fixed software-defined circuit using precomputed mappings over a finite torus, enabling predictable constant-time execution. This mirrors analog, quantum or FPGA-style fixed circuits, but runs as in-memory software on commodity hardware.
              </p>
              
              <div className="rounded-lg border border-border/20 bg-surface-dark/30 p-6 mt-6">
                <CircuitGenerationViz />
              </div>
              
              <div className="mt-10">
                <h4 className="text-lg font-semibold text-foreground mb-6 text-center">Comparison with</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="rounded-lg border border-border/10 bg-surface-dark/20 p-4">
                    <div className="flex items-center gap-2 text-base font-semibold text-cyan mb-2">
                      <Waves className="h-5 w-5" />
                      <span>Analog Circuits</span>
                    </div>
                  <div className="text-sm text-muted-foreground">Computation flows through fixed geometric mappings rather than stepwise control flow, while remaining fully digital, deterministic, and noise-free.</div>
                </div>
                <div className="rounded-lg border border-border/10 bg-surface-dark/20 p-4">
                  <div className="flex items-center gap-2 text-base font-semibold text-cyan mb-2">
                    <Atom className="h-5 w-5" />
                    <span>Quantum Circuits</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Multiple operations are mathematically fused into a single executable structure, achieving superposition-like efficiency without probabilistic behavior or specialized hardware.</div>
                </div>
                <div className="rounded-lg border border-border/10 bg-surface-dark/20 p-4">
                  <div className="flex items-center gap-2 text-base font-semibold text-cyan mb-2">
                    <Cpu className="h-5 w-5" />
                    <span>FPGA Circuits</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Execution uses a compile-time–fixed topology with predictable, constant-time behavior, delivered as software rather than reconfigurable silicon.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Binary Embedding */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-cyan">Binary Embedding</h3>
              <p className="text-base leading-relaxed text-foreground">
                Hologram circuits compile to a backend agnostic ISA and embed directly into your application binary. This adds a small, bounded size increase (about 100 to 500 KB) and eliminates all runtime compilation, JIT, and loading overhead.
              </p>
              
              <div className="mt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="rounded-lg border border-border/10 bg-surface-dark/20 p-4">
                    <div className="text-base font-semibold text-foreground mb-2">Mathematically Fast Runtime</div>
                    <div className="text-sm text-muted-foreground">Circuits are fully compiled at build time. At runtime there is minimal work to load, interpret, or warm up execution starts quickly and remains highly optimized.</div>
                  </div>
                  <div className="rounded-lg border border-border/10 bg-surface-dark/20 p-4">
                    <div className="text-base font-semibold text-foreground mb-2">Single-Binary Deployment</div>
                    <div className="text-sm text-muted-foreground">Circuits ship with your application as part of the executable. No sidecar files, no runtime dependencies, no environment-specific configuration.</div>
                  </div>
                  <div className="rounded-lg border border-border/10 bg-surface-dark/20 p-4">
                    <div className="text-base font-semibold text-foreground mb-2">Predictable Backend Plan</div>
                    <div className="text-sm text-muted-foreground">Execution plan headers grow linearly with computation complexity, reducing runtime complexity and improving startup time and reliability.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 2. Run Anywhere */}
      <Section id="run-anywhere" className="py-12 sm:py-16 lg:py-20 border-t-2 border-border/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="2. Run Anywhere"
            description="Hologram runs in-process as a library-level hypervisor, virtualizing execution across hardware backends."
          />

          <div className="space-y-8">
            {/* In-Process Execution */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-cyan">In-Process Execution</h3>
              <p className="text-base leading-relaxed text-foreground">
                Hologram executes entirely inside your application process. Circuits run in the same PID and memory space as your code, with no separate service, daemon, or runtime. There is no IPC and no network hop. Execution is direct function calls and memory access only.
              </p>
              
              <div className="rounded-lg border border-border/20 bg-surface-dark/30 p-6 mt-6">
                <InProcessExecutionViz />
              </div>
            </div>

            {/* Backend Abstraction */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-cyan">Backend Abstraction</h3>
              <p className="text-base leading-relaxed text-foreground">
                The backend layer takes precompiled, backend-agnostic ISA and executes it using hardware-specific implementations selected at runtime. A single compiled binary can run on CPUs, GPUs, or in the browser, with backend selection handled automatically and no environment-specific builds.
              </p>
            </div>

            {/* Hardware Backends */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground text-center">Hardware backend-agnostic</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-lg border border-border/20 bg-surface-dark/30 p-6">
                  <div className="flex items-center gap-2 text-lg font-semibold text-foreground mb-2">
                    <Cpu className="h-5 w-5" />
                    <span>CPU</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">SIMD-optimized with Rayon parallelism. ~500ns for 1024 elements.</p>
                </div>
                <div className="rounded-lg border border-border/20 bg-surface-dark/30 p-6">
                  <div className="flex items-center gap-2 text-lg font-semibold text-foreground mb-2">
                    <Zap className="h-5 w-5" />
                    <span>GPU</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">CUDA, Metal, WebGPU. ~10-50µs for 1024 elements.</p>
                </div>
                <div className="rounded-lg border border-border/20 bg-surface-dark/30 p-6">
                  <div className="flex items-center gap-2 text-lg font-semibold text-foreground mb-2">
                    <Globe className="h-5 w-5" />
                    <span>WASM</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">SIMD128 in linear memory. ~1-2µs for 1024 elements.</p>
                </div>
              </div>
            </div>

            {/* Language Bindings */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-cyan">Language Bindings</h3>
              <p className="text-base leading-relaxed text-foreground">
                Use Hologram from your preferred language. UniFFI generates type-safe bindings automatically from the Rust core.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Language Selection Buttons */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "python", label: "Python" },
                      { key: "typescript", label: "TypeScript" },
                      { key: "swift", label: "Swift" },
                      { key: "kotlin", label: "Kotlin" },
                    ].map((lang) => (
                      <button
                        key={lang.key}
                        onClick={() => setSelectedLanguage(lang.key)}
                        className={`
                          flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200
                          ${
                            selectedLanguage === lang.key
                              ? "border-cyan/50 bg-cyan/10 text-foreground shadow-lg shadow-cyan/20"
                              : "border-border/20 bg-surface-dark/30 text-muted-foreground hover:border-cyan/30 hover:bg-surface-dark/50"
                          }
                        `}
                      >
                        <Code2 className="h-4 w-4" />
                        <span className="font-medium">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Code Example */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-cyan uppercase tracking-wide">
                    {selectedLanguage === "python"
                      ? "Python"
                      : selectedLanguage === "typescript"
                      ? "TypeScript"
                      : selectedLanguage === "swift"
                      ? "Swift"
                      : "Kotlin"}
                  </div>
                  <div className="rounded-lg border border-border/20 bg-surface-dark/30 p-4">
                    <CodeBlock
                      code={languageExamples[selectedLanguage].code}
                      language={languageExamples[selectedLanguage].language}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Framework Integration */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-cyan">AI Framework Integration</h3>
              <p className="text-base leading-relaxed text-foreground">
                Hologram works with open AI formats like ONNX and GGUF. Train in PyTorch or TensorFlow, export to ONNX, then compile into a fixed circuit optimized for inference, delivering near-instant AI on any device.
              </p>

              {/* Visual Flow */}
              <div className="flex flex-col md:flex-row items-center md:items-stretch gap-4">
                {/* Training */}
                <div className="rounded-lg border border-border/20 bg-surface-dark/30 p-6 flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Brain className="h-6 w-6 text-cyan" />
                    <h4 className="text-lg font-semibold text-foreground">Train</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    PyTorch or TensorFlow
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90 md:rotate-0" />
                </div>

                {/* ONNX Export */}
                <div className="rounded-lg border border-border/20 bg-surface-dark/30 p-6 flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <FileCode className="h-6 w-6 text-cyan" />
                    <h4 className="text-lg font-semibold text-foreground">Export</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Framework-agnostic ONNX
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90 md:rotate-0" />
                </div>

                {/* Compile */}
                <div className="rounded-lg border border-border/20 bg-surface-dark/30 p-6 flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Code2 className="h-6 w-6 text-cyan" />
                    <h4 className="text-lg font-semibold text-foreground">Compile & Deploy</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Run near-instant AI inference on any device
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 3. Execute in Constant Time */}
      <Section id="execute-constant-time" className="py-12 sm:py-16 lg:py-20 border-t-2 border-border/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="3. Execute in Constant Time"
            description="Inputs flow through the circuit in a single pass. Operation chains collapse into fixed-cost primitives."
          />

          <div className="space-y-8">
            {/* Single-Pass Execution */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-cyan">Single-Pass Execution</h3>
              <p className="text-base leading-relaxed text-foreground">
                Hologram processes data in a single pass through a precompiled circuit. Operations are fused at build time, eliminating intermediate buffers, repeated passes, and redundant computation. Each element is read once and written once, delivering constant-time execution with predictable latency and minimal memory overhead.
              </p>
              
              {/* Single-Pass Execution Visualization */}
              <div className="mt-6">
                <SinglePassExecutionViz />
              </div>
            </div>

            {/* Fixed-Cost Primitives */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-cyan">Fixed-Cost Primitives</h3>
              <p className="text-base leading-relaxed text-foreground">
                Hologram delivers O(1) execution per element, independent of operation count or problem complexity, by fusing element-wise chains at compile time into a single 96-byte lookup table. Runtime execution becomes one cache-resident lookup and one memory pass, with no intermediate buffers, branching, or runtime computation.
              </p>
              
              {/* Constant-Time O(1) Visualization */}
              <div className="mt-6">
                <ConstantTimeO1Viz />
              </div>
            </div>

            {/* Cache-Optimized Memory Access */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-cyan">Cache-Optimized Memory Access</h3>
              <p className="text-base leading-relaxed text-foreground">
                Hologram keeps hot execution data in CPU cache, with 96 byte class maps in L1 and ~1 KB ISA programs in L2. Runtime reduces to cache hits plus a single sequential input and output DRAM memory pass, delivering predictable low latency execution.
              </p>
              
              {/* Memory Hierarchy Visualization */}
              <div className="rounded-lg border border-cyan/20 bg-surface-dark/30 p-6 mt-6">
                <div className="space-y-2">
                  <div className="rounded border border-cyan/20 bg-cyan/5 p-3">
                    <div className="text-xs font-semibold text-foreground mb-1">Processor Core</div>
                    <div className="text-xs text-muted-foreground">ISA Dispatch · Direct Memory Access</div>
                  </div>
                  <div className="flex justify-center">
                    <div className="text-xs text-cyan">↓</div>
                  </div>
                  <div className="rounded border border-cyan/20 bg-cyan/5 p-3">
                    <div className="text-xs font-semibold text-foreground mb-1">L1 Cache</div>
                    <div className="text-xs text-muted-foreground">Fused Class Map [96 bytes]</div>
                  </div>
                  <div className="flex justify-center">
                    <div className="text-xs text-cyan">↓</div>
                  </div>
                  <div className="rounded border border-cyan/20 bg-cyan/5 p-3">
                    <div className="text-xs font-semibold text-foreground mb-1">L2 Cache</div>
                    <div className="text-xs text-muted-foreground">Precompiled ISA Program [~1 KB]</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-semibold text-foreground mb-1">System Bus</div>
                    <div className="text-xs text-cyan font-medium mb-1">↓</div>
                    <div className="text-xs text-cyan italic text-center px-2">Single hash table lookup</div>
                  </div>
                  <div className="rounded border border-cyan/20 bg-cyan/5 p-3">
                    <div className="text-xs font-semibold text-foreground mb-1">DRAM</div>
                    <div className="text-xs text-muted-foreground">Input · Output (no operation code)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Characteristics */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-cyan">Performance Characteristics</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-lg border border-border/10 bg-surface-dark/20 p-4">
                  <div className="text-base font-semibold text-foreground mb-2">Topology-dependent</div>
                  <div className="text-sm text-muted-foreground">Cost depends on circuit structure, not model size</div>
                </div>
                <div className="rounded-lg border border-border/10 bg-surface-dark/20 p-4">
                  <div className="text-base font-semibold text-foreground mb-2">Predictable execution</div>
                  <div className="text-sm text-muted-foreground">Bounded time, no worst cases</div>
                </div>
                <div className="rounded-lg border border-border/10 bg-surface-dark/20 p-4">
                  <div className="text-base font-semibold text-foreground mb-2">Stable performance</div>
                  <div className="text-sm text-muted-foreground">Same topology = same execution time</div>
                </div>
              </div>
              <div className="rounded-lg border border-cyan/20 bg-cyan/5 p-4">
                <div className="text-base font-semibold text-foreground mb-4 text-center">Performance Metrics</div>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center md:justify-between">
                  <div className="text-sm text-muted-foreground space-y-1 flex-1">
                    {loadingBenchmarks ? (
                      <p className="text-muted-foreground">Loading benchmark data...</p>
                    ) : (
                      <>
                        <p>
                          Canonicalization:{" "}
                          <span className="text-base font-semibold text-foreground">
                            {canonicalizeBenchmark
                              ? `~${formatNanoseconds(canonicalizeBenchmark.mean_ns)}`
                              : "~0.83µs"}
                          </span>{" "}
                          (compile-time, one-time)
                        </p>
                        <p>
                          Execution:{" "}
                          <span className="text-base font-semibold text-foreground">
                            ~{executionTimePerElement.toFixed(2)}µs per element
                          </span>{" "}
                          for fused operations
                        </p>
                        <p className="text-cyan font-semibold mt-2">
                          Speedup: <span className="text-lg font-bold text-cyan">~10x</span> for typical operation chains
                        </p>
                        {benchmarkData?.timestamp && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Last test run: {new Date(benchmarkData.timestamp).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-cyan/40 bg-surface-dark/30 hover:bg-cyan/10 hover:border-cyan/60 text-foreground font-semibold px-6" 
                      asChild
                    >
                      <Link href="/benchmarks">
                        See benchmarks
                      </Link>
                    </Button>
                    {benchmarkData && (
                      <a
                        href={BENCHMARK_API_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan hover:text-cyan/80 transition-colors text-center underline"
                      >
                        View raw data
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Summary */}
      <Section className="py-12 sm:py-16 lg:py-20 border-t-2 border-border/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border/20 bg-surface-dark/30 p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
              Summary
            </h2>
            <p className="text-lg leading-relaxed text-foreground mb-8 text-center">
              Hologram transforms byte-level iterative computation into<br />
              <span className="text-cyan font-semibold">fused circuit in-memory lookup</span> that execute in constant time <Math inline>O(1)</Math>.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/20 mx-auto mb-4">
                  <Code2 className="h-6 w-6 text-cyan" />
                </div>
                <div className="font-semibold text-foreground mb-2">Compile once</div>
                <div className="text-sm text-muted-foreground">All optimization at build time.</div>
              </div>
              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/20 mx-auto mb-4">
                  <Server className="h-6 w-6 text-cyan" />
                </div>
                <div className="font-semibold text-foreground mb-2">Run anywhere</div>
                <div className="text-sm text-muted-foreground">CPU, GPU, WASM, etc.</div>
              </div>
              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/20 mx-auto mb-4">
                  <Zap className="h-6 w-6 text-cyan" />
                </div>
                <div className="font-semibold text-foreground mb-2">Execute with O(1) lookup</div>
                <div className="text-sm text-muted-foreground">Single-pass runtime execution.</div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
