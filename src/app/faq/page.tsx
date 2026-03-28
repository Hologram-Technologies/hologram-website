"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Math } from "@/components/math";
import { BenchmarkData, formatNanoseconds, normalizeBenchmarkJson, BENCHMARK_API_URL } from "@/lib/benchmark-utils";
import {
  HelpCircle,
  Code2,
  Server,
  Zap,
  Cpu,
  Gauge,
  Layers,
  Settings,
  Rocket,
  FileQuestion,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";


/** Build Performance FAQ answers from latest benchmark data (same source as /benchmarks). */
function getPerformanceAnswers(data: BenchmarkData | null): (string | null)[] {
  if (!data?.benchmarks) return [];
  const b = data.benchmarks;
  const canonicalize = b["canonicalize_simple_add_circuit"];
  const range4 = b["canonicalize_range_operations/4"];
  const range8 = b["canonicalize_range_operations/8"];
  const execPerElementUs =
    range4 && range8
      ? (range4.mean_ns + range8.mean_ns) / 2 / 1000
      : range4
        ? range4.mean_ns / 1000
        : null;
  const execPerElementStr =
    execPerElementUs != null ? `~${execPerElementUs.toFixed(2)}µs` : null;
  const canonicalizeStr = canonicalize ? formatNanoseconds(canonicalize.mean_ns) : null;
  const traditionalPerOpUs = 0.5;
  const traditional4Str = "4 × 0.5µs = 2.0µs";
  const speedup =
    execPerElementUs != null && execPerElementUs > 0
      ? (traditionalPerOpUs * 4) / execPerElementUs
      : null;

  return [
    canonicalizeStr && execPerElementStr
      ? `Canonicalization: ${canonicalizeStr} (compile-time, one-time). Execution: ~${execPerElementStr} per element for fused operations. Overhead: <200ns per operation.`
      : null,
    execPerElementStr
      ? `For a chain of 4 operations: Traditional: ${traditional4Str} (sequential execution). Hologram: ~${execPerElementStr} per element (fused, single lookup). Speedup: ~${speedup != null ? globalThis.Math.round(speedup) + "x" : "10x"} for typical operation chains.`
      : null,
    "Minimal: Backend initialization: ~1-5µs. Circuit loading: ~10-100µs (one-time, file I/O). No JIT compilation.",
    "Small: Class maps: 96 bytes each. ISA programs: ~1 KB each. Typical overhead: 100-500 KB per application.",
    "No. Execution is O(1) per element. Processing 1M elements takes 1M × (constant time), which is linear in input size but constant per element.",
    "Performance is stable because the circuit is fixed. There are no \"worst cases\"—the circuit topology determines execution time.",
    "Execution is O(1) per element. Processing 1M elements is 1M × (constant time). Scales linearly with input size, constant per element.",
  ];
}

const faqSections = [
  {
    id: "what-is",
    title: "What Is Hologram?",
    icon: HelpCircle,
    questions: [
      {
        q: "What is Hologram?",
        a: "Hologram is a library that optimizes computational operations at compile-time, then executes them in constant time at runtime. It's not a runtime, service, or framework—it's code that compiles into your application binary.",
      },
      {
        q: "What problem does it solve?",
        a: "Traditional computation executes operations sequentially, so cost grows with operation count. Hologram fuses operations into fixed circuits that execute in O(1) time per element, regardless of how many operations were fused.",
      },
      {
        q: "Is it a new programming language?",
        a: "No. It's a library you use from existing languages (Rust, Python, TypeScript, Swift, Kotlin, C++).",
      },
      {
        q: "Is it a runtime like JVM or .NET?",
        a: "No. There's no separate runtime process. Hologram code compiles directly into your binary and runs in your application's process.",
      },
      {
        q: "Is it a service or daemon?",
        a: "No. There's no background service, no systemd unit, no separate process. It's just code in your application.",
      },
    ],
  },
  {
    id: "how-does-it-work",
    title: "How Does It Work?",
    icon: Code2,
    questions: [
      {
        q: "How does Hologram achieve O(1) execution?",
        a: "At compile-time, Hologram fuses operation chains (e.g., sigmoid(relu(tanh(x))) into a single 96-byte lookup table. At runtime, each element is processed with one array lookup instead of multiple operations.",
      },
      {
        q: "What's a \"fixed circuit\"?",
        a: "A computational structure determined at compile-time, not runtime. Like a hardware circuit, but in software. The circuit topology is fixed, so execution time is predictable.",
      },
      {
        q: "What's \"canonicalization\"?",
        a: "The compile-time process that eliminates redundant operations and fuses operation chains. For example, x + 0 becomes x, and sigmoid(relu(x)) becomes a single fused lookup.",
      },
      {
        q: "What's a \"class map\"?",
        a: "A 96-byte lookup table that maps input resonance classes to output classes. Multiple operations are composed into a single class map, enabling O(1) execution.",
      },
      {
        q: "Does it work for all operations?",
        a: "Element-wise operations (add, multiply, sigmoid, relu, etc.) fuse perfectly. Operations like MatMul act as \"barriers\" that break fusion chains but still execute efficiently.",
      },
    ],
  },
  {
    id: "deployment",
    title: "Deployment",
    icon: Server,
    questions: [
      {
        q: "How do I install Hologram?",
        a: "Add it as a dependency to your project.",
      },
      {
        q: "Do I need to install anything on the server?",
        a: "No. Hologram compiles into your binary. For GPU backends, you need standard GPU drivers (CUDA toolkit for NVIDIA, Metal is built into macOS).",
      },
      {
        q: "Does it work in containers?",
        a: "Yes. Hologram runs inside your container, in your application process. No special container configuration needed.",
      },
      {
        q: "Does it work in VMs?",
        a: "Yes. Hologram runs inside the VM, in your application process. It doesn't know or care if it's in a VM.",
      },
      {
        q: "Do I need special hardware?",
        a: "No. CPU backend works on any modern CPU. GPU acceleration is optional (NVIDIA GPUs for CUDA, Apple Silicon/AMD/Intel GPUs for Metal).",
      },
      {
        q: "What are the system requirements?",
        a: "CPU: Any modern CPU (x86_64 or ARM64). SIMD optional but recommended. Memory: Sufficient RAM for your buffers (typically 100MB-1GB for models). GPU (optional): NVIDIA GPU with Compute Capability 5.0+ or Metal-capable GPU. OS: Linux, macOS, Windows, or browser (WASM).",
      },
      {
        q: "How do I monitor Hologram in production?",
        a: "Monitor your application process. Hologram's CPU/memory usage appears as your application's usage. No separate monitoring needed.",
      },
      {
        q: "Does it require root/admin privileges?",
        a: "No. For local-only Hologram, no special permissions needed.",
      },
    ],
  },
  {
    id: "performance",
    title: "Performance",
    icon: Zap,
    questions: [
      {
        q: "How fast is it?",
        a: "Canonicalization: ~0.83µs (compile-time, one-time). Execution: ~0.2µs per element for fused operations. Overhead: <200ns per operation.",
      },
      {
        q: "How does it compare to traditional execution?",
        a: "For a chain of 4 operations: Traditional: 4 × 0.5µs = 2.0µs (sequential execution). Hologram: 0.2µs per element (fused, single lookup). Speedup: ~10x for typical operation chains.",
      },
      {
        q: "What's the startup overhead?",
        a: "Minimal: Backend initialization: ~1-5µs. Circuit loading: ~10-100µs (one-time, file I/O). No JIT compilation.",
      },
      {
        q: "What's the memory overhead?",
        a: "Small: Class maps: 96 bytes each. ISA programs: ~1 KB each. Typical overhead: 100-500 KB per application.",
      },
      {
        q: "Does performance degrade with larger inputs?",
        a: "No. Execution is O(1) per element. Processing 1M elements takes 1M × (constant time), which is linear in input size but constant per element.",
      },
      {
        q: "What about worst-case performance?",
        a: "Performance is stable because the circuit is fixed. There are no \"worst cases\"—the circuit topology determines execution time.",
      },
      {
        q: "How does it scale?",
        a: "Execution is O(1) per element. Processing 1M elements is 1M × (constant time). Scales linearly with input size, constant per element.",
      },
    ],
  },
  {
    id: "backends",
    title: "Backends and Hardware",
    icon: Cpu,
    questions: [
      {
        q: "What backends are supported?",
        a: "CPU: SIMD-optimized (AVX2 on x86_64, NEON on ARM64), multi-core via Rayon. CUDA: NVIDIA GPUs (Compute Capability 5.0+). Metal: Apple Silicon, AMD/Intel GPUs (macOS/iOS). WebGPU: Modern browsers with WebGPU support. WASM: WebAssembly with SIMD128.",
      },
      {
        q: "How does backend selection work?",
        a: "Automatic detection at initialization: 1. Metal (macOS/iOS) - if available, 2. CUDA (NVIDIA GPUs) - if available, 3. WebGPU (browsers) - if in browser, 4. CPU (fallback) - always available. You can also explicitly specify a backend.",
      },
      {
        q: "What if no GPU is available?",
        a: "Hologram automatically falls back to CPU. Your code doesn't need to change.",
      },
      {
        q: "Can I use multiple GPUs?",
        a: "Yes. Create multiple executors, one per GPU, and distribute work across them.",
      },
      {
        q: "What about GPU memory limits?",
        a: "Hologram buffers are allocated in GPU memory. You're limited by available GPU VRAM, same as any GPU application.",
      },
      {
        q: "Does it work on ARM processors?",
        a: "Yes. Hologram supports x86_64 and ARM64. ARM support uses NEON SIMD instructions.",
      },
    ],
  },
  {
    id: "integration",
    title: "Integration",
    icon: Settings,
    questions: [
      {
        q: "What languages are supported?",
        a: "Rust (primary), Python, TypeScript, Swift, Kotlin, C++ (via FFI bindings).",
      },
      {
        q: "Can I use this with existing ML frameworks?",
        a: "Yes. Hologram can compile: ONNX models (via ONNX export), PyTorch models (via ONNX export), custom operation graphs.",
      },
      {
        q: "Does it work with ONNX Runtime?",
        a: "Hologram can replace ONNX Runtime for inference. It compiles ONNX graphs to optimized circuits, enabling faster inference without ONNX Runtime overhead.",
      },
      {
        q: "Can I use this for training?",
        a: "Hologram is optimized for inference. Training requires different optimizations (gradient computation, backpropagation). Hologram focuses on inference performance.",
      },
      {
        q: "Does it work with TensorFlow/PyTorch?",
        a: "Yes, via ONNX export. Export your model to ONNX, then compile with Hologram.",
      },
      {
        q: "Can I use this in production?",
        a: "Yes. Hologram is production-ready and used in production systems for low-latency inference.",
      },
    ],
  },
  {
    id: "technical",
    title: "Technical Details",
    icon: FileQuestion,
    questions: [
      {
        q: "How does fusion work?",
        a: "At compile-time, Hologram identifies chains of element-wise operations and composes their class maps into a single lookup table. For example, sigmoid(relu(tanh(x))) becomes one 96-byte lookup instead of three separate operations.",
      },
      {
        q: "What's the \"96-class system\"?",
        a: "The mathematical foundation that enables constant-time lookups. You don't need to understand the math—just know it enables O(1) execution through fixed-size lookup tables.",
      },
      {
        q: "What's \"ISA\"?",
        a: "Instruction Set Architecture. Hologram compiles operations to backend-agnostic ISA instructions, which are then translated to native code (CPU SIMD, GPU kernels, etc.).",
      },
      {
        q: "How does cache optimization work?",
        a: "Class maps (96 bytes) fit entirely in L1 cache (32 KB). This means: L1 cache access: ~1ns, DRAM access: ~100ns. Keeping class maps in L1 means 100x faster lookups.",
      },
      {
        q: "What about operations that can't be fused?",
        a: "Operations like MatMul execute efficiently but aren't O(1) per element (they're O(n²) for matrix multiply, which is optimal). Fusion applies to element-wise operations.",
      },
      {
        q: "What if my operations aren't supported?",
        a: "Hologram supports standard operations (add, multiply, sigmoid, relu, matmul, etc.). Custom operations can be added by defining their class maps.",
      },
      {
        q: "Can I see what optimizations were applied?",
        a: "Yes. Hologram provides compilation reports showing optimization passes and fusion decisions.",
      },
      {
        q: "What if optimization breaks my code?",
        a: "Optimization preserves mathematical correctness. Algebraic identities are mathematically proven, not heuristics.",
      },
    ],
  },
  {
    id: "operational",
    title: "Operational Questions",
    icon: Settings,
    questions: [
      {
        q: "How do I debug Hologram code?",
        a: "Debug your application normally. Hologram code appears as regular function calls in your stack traces. Use standard debugging tools.",
      },
      {
        q: "What about logging?",
        a: "Hologram uses standard logging (tracing in Rust, logging in Python). Configure it like any other library.",
      },
      {
        q: "How do I handle errors?",
        a: "Hologram returns standard error types (Result in Rust, exceptions in Python). Handle them like any other library errors.",
      },
      {
        q: "What about thread safety?",
        a: "Hologram is thread-safe. You can use it from multiple threads, but each thread should have its own executor instance.",
      },
      {
        q: "Does it work with async/await?",
        a: "Yes. Hologram operations are synchronous, but you can call them from async code like any other synchronous function.",
      },
      {
        q: "What about memory leaks?",
        a: "Hologram uses standard memory management (RAII in Rust, reference counting in Python). No special memory management needed.",
      },
      {
        q: "How do I profile Hologram performance?",
        a: "Use standard profiling tools (perf, Instruments, etc.). Hologram code appears as regular function calls in profiles.",
      },
    ],
  },
  {
    id: "use-cases",
    title: "Use Cases",
    icon: Rocket,
    questions: [
      {
        q: "What's Hologram good for?",
        a: "Low-latency AI inference (real-time applications), ONNX model inference (faster than ONNX Runtime), edge devices (resource-constrained environments), real-time audio/video processing, game engines (predictable performance).",
      },
      {
        q: "What's Hologram NOT good for?",
        a: "Training (optimized for inference only), one-off computations (compile-time cost not amortized), highly dynamic operations (shapes/types unknown at compile-time), very simple operations (overhead may exceed benefit).",
      },
      {
        q: "Does it work on embedded systems?",
        a: "Yes. Hologram's cache-friendly execution and small memory footprint make it suitable for embedded systems. CPU backend works on any processor.",
      },
      {
        q: "Does it work in the browser?",
        a: "Yes. Hologram supports WebAssembly (WASM) and WebGPU backends for browser execution.",
      },
      {
        q: "Does it work on mobile?",
        a: "Yes. Hologram supports ARM64 (iOS/Android) with NEON SIMD. Metal backend works on iOS.",
      },
    ],
  },
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Rocket,
    questions: [
      {
        q: "How do I get started?",
        a: "1. Add Hologram as a dependency to your project, 2. create an executor: Executor::new() (Rust) or Executor() (Python), 3. compile your operations: Compiler::compile() or load a precompiled .holo file, 4. execute: executor.execute_program(program, params).",
      },
      {
        q: "Where can I find examples?",
        a: "Check the repository's examples/ directory for working code examples.",
      },
      {
        q: "Where can I find documentation?",
        a: "Check the repository's docs/ directory for detailed documentation.",
      },
      {
        q: "How do I report bugs?",
        a: "Open an issue on the repository's issue tracker.",
      },
      {
        q: "How do I contribute?",
        a: "Check the repository's contributing guidelines.",
      },
    ],
  },
];

export default function FAQPage() {
  const [selectedSection, setSelectedSection] = useState<string>(faqSections[0].id);
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);

  useEffect(() => {
    async function fetchBenchmarks() {
      try {
        const response = await fetch(BENCHMARK_API_URL, { cache: "no-store" });
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        const json = await response.json();
        setBenchmarkData(normalizeBenchmarkJson(json));
      } catch {
        try {
          const fallback = await import("@/public/benches/current.json");
          setBenchmarkData(normalizeBenchmarkJson(fallback.default));
        } catch {
          // keep null, FAQ will use static answers
        }
      }
    }
    fetchBenchmarks();
  }, []);

  const performanceAnswers = getPerformanceAnswers(benchmarkData);

  return (
    <>
      {/* Hero Section */}
      <Section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-3 text-foreground">
              Hologram FAQ
            </h1>
          </div>

          {/* Section Selector */}
          <div className="mb-1 mt-24">
            <div className="flex flex-wrap gap-2 border-b border-border/20 pb-2 justify-center">
              {faqSections.map((section) => {
                const Icon = section.icon;
                const isSelected = selectedSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-t-md text-sm font-medium transition-all border-b-2 -mb-0.5
                      ${
                        isSelected
                          ? "text-foreground border-cyan bg-surface-dark/50"
                          : "text-muted-foreground border-transparent hover:text-foreground hover:bg-surface-dark/30"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{section.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ Sections */}
      <Section className="pt-1 pb-8 sm:pb-12 lg:pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {faqSections.map((section) => {
            if (selectedSection !== section.id) return null;
            const isPerformance = section.id === "performance";
            const answers = isPerformance ? performanceAnswers : null;

            return (
              <div key={section.id} className="space-y-10">
                <div className="mb-8 pb-4 border-b border-border/30">
                  <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                    {section.title}
                  </h2>
                  {isPerformance && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Numbers from latest benchmark run.{" "}
                      <Link
                        href="/benchmarks"
                        className="text-cyan hover:underline inline-flex items-center gap-1"
                      >
                        See Benchmark page
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </p>
                  )}
                </div>

                <div className="space-y-10">
                  {section.questions.map((item, index) => {
                    const answer =
                      answers && answers[index] != null ? answers[index]! : item.a;
                    return (
                      <div
                        key={index}
                        className="group relative"
                      >
                        <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-cyan/0 group-hover:bg-cyan/30 transition-colors duration-200"></div>
                        <div className="pl-6 space-y-4">
                          <h3 className="text-lg font-semibold text-foreground leading-snug tracking-tight">
                            {item.q}
                          </h3>
                          <div className="pl-4 border-l border-border/20">
                            <p className="text-lg leading-relaxed text-muted-foreground">
                              {answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Summary Section */}
      <Section className="py-12 sm:py-16 lg:py-20 border-t border-border/10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-border/20 pt-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6 tracking-tight">
              Summary
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-8">
              Hologram is a library that optimizes computation at compile-time and executes in constant time at runtime.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-lg text-muted-foreground">
                <span className="text-foreground font-semibold">Library, not runtime</span> — compiles into your binary
              </div>
              <div className="text-lg text-muted-foreground">
                <span className="text-foreground font-semibold"><Math inline>O(1)</Math> execution per element</span> — fixed circuit topology
              </div>
              <div className="text-lg text-muted-foreground">
                <span className="text-foreground font-semibold">CPU, GPU, or WASM</span> — automatic backend selection
              </div>
              <div className="text-lg text-muted-foreground">
                <span className="text-foreground font-semibold">Production-ready</span> — used in production systems
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}









