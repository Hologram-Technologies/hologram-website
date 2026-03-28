// Benchmark data types and utilities

// --- Raw JSON types (actual format from benchmark runner) ---

export interface RawJsonBenchmark {
  name: string;
  mean_ns: number;
  median_ns: number;
  std_dev_ns: number;
}

export interface RawJsonData {
  sha: string;
  timestamp: string;
  benchmarks: RawJsonBenchmark[];
}

// --- Internal processed types ---

export interface ConfidenceInterval {
  lower_ns: number;
  upper_ns: number;
  confidence_level: number;
}

export interface Throughput {
  Elements?: number;
  Bytes?: number;
}

export interface RawBenchmark {
  category: string;
  mean_ns: number;
  median_ns: number;
  std_dev_ns: number;
  slope_ns: number | null;
  confidence_interval: ConfidenceInterval;
  throughput?: Throughput;
  full_id: string;
}

export interface CategoryInfo {
  description: string;
  benchmarks: string[];
  count: number;
}

export interface BenchmarkData {
  timestamp: string;
  commit: string;
  commit_short: string;
  benchmark_count: number;
  categories: Record<string, CategoryInfo>;
  benchmarks: Record<string, RawBenchmark>;
}

export interface ProcessedBenchmark extends RawBenchmark {
  id: string;
  displayName: string;
}

export interface ProcessedCategory {
  id: string;
  description: string;
  benchmarks: ProcessedBenchmark[];
  count: number;
  avgTime: number;
  fastestTime: number;
}

// --- Platform comparison types ---

export interface PlatformBenchmark {
  time_ns: number;
  time_ms: number;
  stddev_ns: number;
  stddev_ms: number;
}

export interface PlatformData {
  timestamp: string;
  date: string;
  architecture: string;
  os: string;
  rust_version: string;
  commit_sha: string;
  commit_ref: string;
  benchmarks: Record<string, PlatformBenchmark>;
}

export interface PlatformComparison {
  timestamp: string;
  architectures: string[];
  results: Record<string, PlatformData>;
}

// --- Category prefix mapping ---

const CATEGORY_PREFIX_MAP: Record<string, string> = {
  // Activation
  activation: "activation",
  activation_lookup: "activation",
  sigmoid_comparison: "activation",
  sigmoid_1024_scalars: "activation",

  // Arithmetic
  arith: "arithmetic",
  arith_q1_vs_q0: "arithmetic",
  q0: "arithmetic",
  q1_batch: "arithmetic",
  q1_vs_q0_vs_f64: "arithmetic",
  triple_ring: "arithmetic",

  // Compilation
  compile: "compilation",
  sync_compile_10nodes: "compilation",
  async_compile_10nodes: "compilation",
  precision_pass_101_nodes: "compilation",

  // Execution
  exec: "execution",
  sync_execute_10nodes: "execution",
  async_execute_10nodes: "execution",
  batch_execute_20nodes: "execution",
  stream_execute_20nodes: "execution",

  // Pipeline
  full_pipeline: "pipeline",

  // Fusion
  fusion: "fusion",
  epilogue_fusion: "fusion",
  lut_composition: "fusion",

  // I/O & Serialization
  graph_io: "io",
  archive: "io",
  encoding_roundtrip: "io",

  // KV Dispatch
  kv: "kv_dispatch",
  kv_dispatch_lut_ops: "kv_dispatch",

  // Quantization & GEMM
  lut_gemm_q4: "quantization",
  lut_gemm_q8: "quantization",
  naive_matmul: "quantization",
  quantize_q4: "quantization",
  quantize_q8: "quantization",
  matmul_sweep: "quantization",

  // Memory & Workspace
  memory_budget: "memory",
  workspace: "memory",
  liveness: "memory",

  // Primitives
  nda: "primitives",
  group: "primitives",
  prim: "primitives",
  tape: "primitives",
  transformer: "primitives",
  softmax_decode: "primitives",

  // View
  view: "view",
  view16: "view",
  view_compose: "view",

  // FFI
  ffi: "ffi",
};

// Category display names, descriptions, and sort order
const CATEGORY_DISPLAY: Record<string, { name: string; order: number; description: string }> = {
  activation: { name: "Activation", order: 1, description: "Activation functions and lookup tables" },
  arithmetic: { name: "Arithmetic", order: 2, description: "Arithmetic operations across precision types and ring structures" },
  compilation: { name: "Compilation", order: 3, description: "Circuit compilation, canonicalization, and precision passes" },
  execution: { name: "Execution", order: 4, description: "Synchronous, async, batch, and streaming execution pipelines" },
  pipeline: { name: "Pipeline", order: 5, description: "Full end-to-end pipeline benchmarks" },
  fusion: { name: "Fusion", order: 6, description: "Operator fusion, epilogue fusion, and LUT composition" },
  io: { name: "I/O & Serialization", order: 7, description: "Graph I/O, archival, and encoding roundtrips" },
  kv_dispatch: { name: "KV Dispatch", order: 8, description: "Key-value dispatch and LUT operation routing" },
  quantization: { name: "Quantization & GEMM", order: 9, description: "Quantized matrix multiplication and LUT-based GEMM operations" },
  memory: { name: "Memory & Workspace", order: 10, description: "Memory budgeting, workspace allocation, and liveness analysis" },
  primitives: { name: "Primitives", order: 11, description: "Core primitive operations, tape, transformer, and softmax decode" },
  view: { name: "View", order: 12, description: "View operations, composition, and serialization" },
  ffi: { name: "FFI", order: 13, description: "Foreign function interface benchmarks" },
  other: { name: "Other", order: 99, description: "Uncategorized benchmarks" },
};

/**
 * Extract category prefix from a benchmark name.
 * Handles separators: "::", "/", and "(" for parameterized names.
 */
export function extractCategoryPrefix(name: string): string {
  // Try :: separator first (e.g., "activation::sigmoid_lut(128)")
  const doubleColonIdx = name.indexOf("::");
  if (doubleColonIdx > 0) {
    return name.slice(0, doubleColonIdx);
  }

  // Try / separator (e.g., "activation_lookup/abs")
  const slashIdx = name.indexOf("/");
  if (slashIdx > 0) {
    return name.slice(0, slashIdx);
  }

  // Try ( separator for parameterized standalone names (e.g., "lut_gemm_q4(1x16x16)")
  const parenIdx = name.indexOf("(");
  if (parenIdx > 0) {
    return name.slice(0, parenIdx);
  }

  // No separator — return full name
  return name;
}

/**
 * Transform raw JSON data from the benchmark runner into the internal BenchmarkData format.
 */
export function transformRawData(raw: RawJsonData): BenchmarkData {
  const commit = raw.sha;
  const commit_short = raw.sha.slice(0, 7);

  const benchmarks: Record<string, RawBenchmark> = {};
  const categoryBenchmarkIds: Record<string, string[]> = {};

  for (const bench of raw.benchmarks) {
    const prefix = extractCategoryPrefix(bench.name);
    const category = CATEGORY_PREFIX_MAP[prefix] ?? "other";

    benchmarks[bench.name] = {
      category,
      mean_ns: bench.mean_ns,
      median_ns: bench.median_ns,
      std_dev_ns: bench.std_dev_ns,
      slope_ns: null,
      confidence_interval: {
        lower_ns: Math.max(0, bench.mean_ns - 2 * bench.std_dev_ns),
        upper_ns: bench.mean_ns + 2 * bench.std_dev_ns,
        confidence_level: 0.95,
      },
      throughput: undefined,
      full_id: bench.name,
    };

    if (!categoryBenchmarkIds[category]) {
      categoryBenchmarkIds[category] = [];
    }
    categoryBenchmarkIds[category].push(bench.name);
  }

  const categories: Record<string, CategoryInfo> = {};
  for (const [catId, ids] of Object.entries(categoryBenchmarkIds)) {
    const display = CATEGORY_DISPLAY[catId];
    categories[catId] = {
      description: display?.description ?? catId,
      benchmarks: ids,
      count: ids.length,
    };
  }

  return {
    timestamp: raw.timestamp,
    commit,
    commit_short,
    benchmark_count: raw.benchmarks.length,
    categories,
    benchmarks,
  };
}

// --- Format utilities ---

export function formatNanoseconds(ns: number): string {
  if (ns < 1000) {
    return `${ns.toFixed(1)} ns`;
  } else if (ns < 1_000_000) {
    return `${(ns / 1000).toFixed(2)} μs`;
  } else {
    return `${(ns / 1_000_000).toFixed(2)} ms`;
  }
}

export function formatNanosecondsCompact(ns: number): { value: string; unit: string } {
  if (ns < 1000) {
    return { value: ns.toFixed(0), unit: "ns" };
  } else if (ns < 1_000_000) {
    return { value: (ns / 1000).toFixed(1), unit: "μs" };
  } else {
    return { value: (ns / 1_000_000).toFixed(2), unit: "ms" };
  }
}

export function formatThroughput(value: number, type: "elements" | "bytes"): string {
  if (type === "bytes") {
    if (value < 1024) {
      return `${value} B`;
    } else if (value < 1024 * 1024) {
      return `${(value / 1024).toFixed(1)} KB`;
    } else if (value < 1024 * 1024 * 1024) {
      return `${(value / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      return `${(value / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  } else {
    if (value < 1000) {
      return `${value}`;
    } else if (value < 1_000_000) {
      return `${(value / 1000).toFixed(1)}K`;
    } else {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }
  }
}

// --- Display name utilities ---

export function getBenchmarkDisplayName(id: string): string {
  // Handle :: separator (e.g., "activation::sigmoid_lut(128)" → "Sigmoid Lut (128)")
  const doubleColonIdx = id.indexOf("::");
  if (doubleColonIdx > 0) {
    const after = id.slice(doubleColonIdx + 2);
    const parenIdx = after.indexOf("(");
    if (parenIdx > 0) {
      const baseName = after.slice(0, parenIdx);
      const param = after.slice(parenIdx + 1, -1);
      const titleCase = baseName
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return `${titleCase} (${param})`;
    }
    const titleCase = after
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return titleCase;
  }

  // Handle / separator
  const parts = id.split("/");
  const baseName = parts[0];
  const param = parts.slice(1).join("/");

  // Handle ( in base name
  const parenIdx = baseName.indexOf("(");
  if (parenIdx > 0) {
    const name = baseName.slice(0, parenIdx);
    const paramInParen = baseName.slice(parenIdx + 1, -1);
    const titleCase = name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return `${titleCase} (${paramInParen})`;
  }

  const titleCase = baseName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return param ? `${titleCase} (${param})` : titleCase;
}

export function getCategoryDisplayName(categoryId: string): string {
  return CATEGORY_DISPLAY[categoryId]?.name || categoryId;
}

export function getCategoryDescription(categoryId: string): string {
  return CATEGORY_DISPLAY[categoryId]?.description || "";
}

export function getPlatformDisplayName(arch: string): string {
  const names: Record<string, string> = {
    "x86_64-linux": "Linux x86_64",
    "x86_64-windows": "Windows x86_64",
    "aarch64-macos": "macOS ARM64",
  };
  return names[arch] ?? arch;
}

// --- Data processing ---

export function categorizeBenchmarks(data: BenchmarkData): {
  categories: ProcessedCategory[];
  all: ProcessedBenchmark[];
  byCategory: Record<string, ProcessedBenchmark[]>;
} {
  const processedBenchmarks: ProcessedBenchmark[] = Object.entries(data.benchmarks).map(
    ([id, benchmark]) => ({
      ...benchmark,
      id,
      displayName: getBenchmarkDisplayName(id),
    })
  );

  // Group by category
  const byCategory: Record<string, ProcessedBenchmark[]> = {};
  for (const benchmark of processedBenchmarks) {
    const cat = benchmark.category;
    if (!byCategory[cat]) {
      byCategory[cat] = [];
    }
    byCategory[cat].push(benchmark);
  }

  // Sort benchmarks within each category by mean time
  for (const cat of Object.keys(byCategory)) {
    byCategory[cat].sort((a, b) => a.mean_ns - b.mean_ns);
  }

  // Build processed categories
  const categories: ProcessedCategory[] = Object.entries(data.categories)
    .map(([id, info]) => {
      const benchmarks = byCategory[id] || [];
      const avgTime = benchmarks.length > 0
        ? benchmarks.reduce((sum, b) => sum + b.mean_ns, 0) / benchmarks.length
        : 0;
      const fastestTime = benchmarks.length > 0
        ? Math.min(...benchmarks.map((b) => b.mean_ns))
        : 0;

      return {
        id,
        description: info.description,
        benchmarks,
        count: info.count,
        avgTime,
        fastestTime,
      };
    })
    .sort((a, b) => {
      const orderA = CATEGORY_DISPLAY[a.id]?.order ?? 99;
      const orderB = CATEGORY_DISPLAY[b.id]?.order ?? 99;
      return orderA - orderB;
    });

  // All benchmarks sorted by mean time
  const all = processedBenchmarks.sort((a, b) => a.mean_ns - b.mean_ns);

  return { categories, all, byCategory };
}

export function getCompilerBenchmarks(byCategory: Record<string, ProcessedBenchmark[]>): {
  canonicalize: ProcessedBenchmark[];
  compile: ProcessedBenchmark[];
} {
  const compilerBenchmarks = byCategory["compilation"] || [];

  return {
    canonicalize: compilerBenchmarks.filter(
      (b) => b.id.startsWith("canonicalize") || b.id.startsWith("verify_canonicalization")
    ),
    compile: compilerBenchmarks.filter(
      (b) => b.id.startsWith("compile")
    ),
  };
}

export function calculateAverage(benchmarks: ProcessedBenchmark[]): number {
  if (benchmarks.length === 0) return 0;
  const sum = benchmarks.reduce((acc, b) => acc + b.mean_ns, 0);
  return sum / benchmarks.length;
}

export function findFastest(benchmarks: ProcessedBenchmark[]): ProcessedBenchmark | null {
  if (benchmarks.length === 0) return null;
  return benchmarks.reduce((min, b) => (b.mean_ns < min.mean_ns ? b : min));
}

export function findSlowest(benchmarks: ProcessedBenchmark[]): ProcessedBenchmark | null {
  if (benchmarks.length === 0) return null;
  return benchmarks.reduce((max, b) => (b.mean_ns > max.mean_ns ? b : max));
}

// --- Speed comparison data ---

export interface SpeedComparison {
  name: string;
  time_ns: number;
  description: string;
  isHologram?: boolean;
}

export const TECHNICAL_COMPARISONS: SpeedComparison[] = [
  { name: "L1 Cache", time_ns: 1, description: "CPU L1 cache access" },
  { name: "L3 Cache", time_ns: 40, description: "CPU L3 cache access" },
  { name: "RAM Access", time_ns: 100, description: "Main memory access" },
  { name: "SSD Read", time_ns: 100_000, description: "SSD random read" },
  { name: "Network RTT", time_ns: 100_000_000, description: "Network round-trip" },
];

export function getRelatableComparisons(fastestNs: number, avgCompileNs: number) {
  const blinkMs = 300;
  const thoughtMs = 13;
  const heartbeatMs = 50;
  const lightSpeedMperNs = 0.3;

  return {
    fasterThanThought: Math.round(thoughtMs * 1_000_000 / fastestNs),
    executionsPerBlink: Math.round(blinkMs * 1_000_000 / avgCompileNs),
    circuitsPerHeartbeat: Math.round(heartbeatMs * 1_000_000 / avgCompileNs),
    lightTravelMeters: (avgCompileNs * lightSpeedMperNs).toFixed(1),
  };
}

// --- Shared data fetching ---

export const BENCHMARK_API_URL = "https://gethologram.ai/benches/current.json";
export const PLATFORM_API_URL = "/benches/hologram-backend/current.json";
export const GITHUB_REPO_URL = "https://github.com/UOR-Foundation/hologram";

/**
 * Detect whether JSON is the raw flat format or already in BenchmarkData format,
 * and return a normalized BenchmarkData.
 */
export function normalizeBenchmarkJson(json: unknown): BenchmarkData {
  const obj = json as Record<string, unknown>;
  // Raw format has "sha" and "benchmarks" as an array
  if (typeof obj.sha === "string" && Array.isArray(obj.benchmarks)) {
    return transformRawData(obj as unknown as RawJsonData);
  }
  // Already in BenchmarkData format
  return obj as unknown as BenchmarkData;
}

/**
 * Fetch benchmark data from the API and local bundled data, returning whichever is newer.
 */
export async function fetchBenchmarkData(): Promise<BenchmarkData> {
  // Fetch both sources in parallel
  const [apiResult, localResult] = await Promise.allSettled([
    fetch(BENCHMARK_API_URL, { cache: "no-store" }).then(async (r) => {
      if (!r.ok) throw new Error(`API ${r.status}`);
      return normalizeBenchmarkJson(await r.json());
    }),
    fetch("/benches/current.json", { cache: "no-store" }).then(async (r) => {
      if (!r.ok) throw new Error(`Local ${r.status}`);
      return normalizeBenchmarkJson(await r.json());
    }),
  ]);

  const apiData = apiResult.status === "fulfilled" ? apiResult.value : null;
  const localData = localResult.status === "fulfilled" ? localResult.value : null;

  if (apiData && localData) {
    const apiTime = new Date(apiData.timestamp).getTime();
    const localTime = new Date(localData.timestamp).getTime();
    return localTime > apiTime ? localData : apiData;
  }

  const data = apiData ?? localData;
  if (!data) throw new Error("No benchmark data available");
  return data;
}
