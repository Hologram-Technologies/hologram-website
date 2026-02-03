"use client";

import { useState, useEffect } from "react";
import { Section, SectionHeader } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BenchmarkBarChart,
  ExpandableCategory,
} from "@/components/benchmarks";
import {
  categorizeBenchmarks,
  calculateAverage,
  findFastest,
  formatNanoseconds,
  getCategoryDisplayName,
  BenchmarkData,
} from "@/lib/benchmark-utils";
import {
  Clock,
  GitCommit,
  ExternalLink,
  FileJson,
  Cpu,
  Workflow,
  Server,
  Zap,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

const BENCHMARK_API_URL = "https://gethologram.ai/benches/current.json";
const GITHUB_REPO_URL = "https://github.com/UOR-Foundation/hologram";

// Detailed descriptions and icons for each category
const CATEGORY_DETAILS: Record<
  string,
  { icon: typeof Cpu; description: string; measures: string }
> = {
  compiler: {
    icon: Workflow,
    description: "Circuit compilation and canonicalization",
    measures:
      "Measures time to normalize circuits via 96-class geometric system and compile them for execution.",
  },
  backends: {
    icon: Server,
    description: "Backend execution (ISA, Unit Group)",
    measures:
      "Measures Unit Group inverse/multiply operations across precision types (i8, f16, f32, f64) and ISA instruction execution.",
  },
  other: {
    icon: Zap,
    description: "Additional operations",
    measures:
      "Cache analysis, character products, orbit operations, address computation, and type dispatch benchmarks.",
  },
};

export default function BenchmarksPage() {
  const [data, setData] = useState<BenchmarkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBenchmarks() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(BENCHMARK_API_URL, {
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const json = await response.json();
        setData(json as BenchmarkData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load benchmarks");
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

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading benchmarks...</p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Failed to load benchmarks: {error}</p>
        </div>
      </main>
    );
  }

  // Process benchmark data
  const { categories, all, byCategory } = categorizeBenchmarks(data);

  // Get key category benchmarks
  const compilerBenchmarks = byCategory["compiler"] || [];
  const backendBenchmarks = byCategory["backends"] || [];

  // Calculate key metrics
  const avgCompiler = calculateAverage(compilerBenchmarks);
  const avgBackend = calculateAverage(backendBenchmarks);
  const fastest = findFastest(all);

  // Find the canonicalization benchmark
  const canonicalizeBenchmark = compilerBenchmarks.find(
    (b) => b.id === "canonicalize_simple_add_circuit"
  );
  const canonicalizeNs = canonicalizeBenchmark?.mean_ns || 734;

  // Format timestamp
  const timestamp = new Date(data.timestamp);
  const formattedDate = timestamp.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = timestamp.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return (
    <main className="min-h-screen">
      {/* Hero Section - Focused and Impactful */}
      <Section className="py-12 sm:py-16 lg:py-20 border-b border-border/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 text-foreground">
              Hologram Performance<br />
              <span className="block mt-2 sm:mt-3">Benchmarks</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Measured execution times across 55 live operations. All data is publicly verifiable and reproducible.
            </p>
          </div>

          {/* Key Metric - Single Focus */}
          <div className="max-w-3xl mx-auto mb-10 sm:mb-12">
            <Card className="border-2 border-purple-500/40 bg-surface-dark/40 relative overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-none">
              {/* Subtle speed indicator - subtle gradient border */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-transparent pointer-events-none" />
              <CardContent className="p-10 sm:p-16 relative">
                <div className="text-center">
                  {/* Main Metric - Maximum Impact */}
                  <div className="mb-8">
                    <div className="inline-block">
                      <div className="text-6xl sm:text-7xl lg:text-8xl font-bold text-foreground mb-2 font-mono tracking-tight leading-none">
                        {formatNanoseconds(fastest?.mean_ns || 0).split(' ')[0]}
                      </div>
                        <span className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-muted-foreground font-mono ml-2">
                          {formatNanoseconds(fastest?.mean_ns || 0).split(' ').slice(1).join(' ')}
                        </span>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                        Fastest Operation
                      </div>
                      {fastest?.confidence_interval && (
                        <div className="text-xs text-muted-foreground font-mono">
                          95% CI: {formatNanoseconds(fastest.confidence_interval.lower_ns)}–{formatNanoseconds(fastest.confidence_interval.upper_ns)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Secondary Metrics - Clear Hierarchy */}
                  <div className="pt-8 border-t-2 border-border/20">
                    <div className="grid grid-cols-2 gap-8 sm:gap-12">
                      <div className="text-left sm:text-center">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                          Compiler Average
                        </div>
                        <div className="text-3xl sm:text-4xl font-bold text-foreground font-mono mb-2">
                          {formatNanoseconds(avgCompiler).split(' ')[0]}
                        </div>
                        <div className="text-lg text-muted-foreground font-mono">
                          {formatNanoseconds(avgCompiler).split(' ').slice(1).join(' ')}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {compilerBenchmarks.length} benchmarks
                        </div>
                      </div>
                      <div className="text-right sm:text-center">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                          Backend Average
                        </div>
                        <div className="text-3xl sm:text-4xl font-bold text-foreground font-mono mb-2">
                          {formatNanoseconds(avgBackend).split(' ')[0]}
                        </div>
                        <div className="text-lg text-muted-foreground font-mono">
                          {formatNanoseconds(avgBackend).split(' ').slice(1).join(' ')}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {backendBenchmarks.length} benchmarks
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Methodology - Trust First */}
          <div className="max-w-3xl mx-auto">
            <div className="border border-border/20 bg-surface-dark/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Methodology</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                All benchmarks are run using <code className="px-1.5 py-0.5 bg-surface-dark/40 rounded text-xs font-mono">criterion.rs</code> with 100 sample iterations. 
                Warmup iterations are excluded from measurements. Results include 95% confidence intervals.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Test Date</span>
                  </div>
                  <div className="text-sm font-medium text-foreground">{formattedDate}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{formattedTime}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <GitCommit className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Git Commit</span>
                  </div>
                  <a
                    href={`${GITHUB_REPO_URL}/commit/${data.commit}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono text-foreground hover:underline block"
                  >
                    {data.commit_short}
                  </a>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileJson className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Raw Data</span>
                  </div>
                  <a
                    href={BENCHMARK_API_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground hover:underline block"
                  >
                    View JSON
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border/10">
                <Button variant="outline" size="sm" asChild className="border-border/20">
                  <a href={BENCHMARK_API_URL} target="_blank" rel="noopener noreferrer">
                    <FileJson className="w-4 h-4 mr-2" />
                    Download Raw Data
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild className="border-border/20">
                  <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Source Code
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Performance Overview - Data-Focused */}
      <Section className="border-b border-border/10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-3 text-cyan">
              Performance by Category
            </h2>
            <p className="text-muted-foreground">
              Execution times across operation categories. All times are median values with 95% confidence intervals.
            </p>
          </div>
          
          <div className="space-y-12 sm:space-y-14">
            {/* Compiler Operations */}
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded border border-border/20 bg-surface-dark/30">
                    <Workflow className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground">Compiler Operations</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Circuit canonicalization and compilation via the 96-class geometric system
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t-2 border-border/20">
                  <div className="flex items-end gap-8 sm:gap-12">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Average Time
                      </div>
                      <div className="flex items-baseline gap-1">
                        <div className="text-4xl sm:text-5xl font-bold text-foreground font-mono tracking-tight">
                          {formatNanoseconds(avgCompiler).split(' ')[0]}
                        </div>
                        <div className="text-xl sm:text-2xl font-semibold text-muted-foreground font-mono">
                          {formatNanoseconds(avgCompiler).split(' ').slice(1).join(' ')}
                        </div>
                      </div>
                    </div>
                    <div className="pb-1">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Benchmarks
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono">
                        {compilerBenchmarks.length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border border-border/20 bg-surface-dark/20 rounded-lg p-6">
                <BenchmarkBarChart
                  data={compilerBenchmarks.slice(0, 16)}
                  title="Compiler Benchmarks"
                />
              </div>
            </div>

            {/* Backend Execution */}
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded border border-border/20 bg-surface-dark/30">
                    <Server className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground">Backend Execution</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      ISA instruction execution and Unit Group operations across precision types (i8, f16, f32, f64)
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t-2 border-border/20">
                  <div className="flex items-end gap-8 sm:gap-12">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Average Time
                      </div>
                      <div className="flex items-baseline gap-1">
                        <div className="text-4xl sm:text-5xl font-bold text-foreground font-mono tracking-tight">
                          {formatNanoseconds(avgBackend).split(' ')[0]}
                        </div>
                        <div className="text-xl sm:text-2xl font-semibold text-muted-foreground font-mono">
                          {formatNanoseconds(avgBackend).split(' ').slice(1).join(' ')}
                        </div>
                      </div>
                    </div>
                    <div className="pb-1">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Benchmarks
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono">
                        {backendBenchmarks.length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border border-border/20 bg-surface-dark/20 rounded-lg p-6">
                <BenchmarkBarChart
                  data={backendBenchmarks.slice(0, 16)}
                  title="Backend Benchmarks"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Category Overview - Minimal Cards */}
      <Section className="bg-surface-dark/10 border-b border-border/10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-3 text-cyan">
              All Categories
            </h2>
            <p className="text-muted-foreground">
              Comprehensive testing across all Hologram subsystems. Click any category to view detailed benchmarks.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const details = CATEGORY_DETAILS[category.id];
              const IconComponent = details?.icon || Cpu;
              return (
                <Card
                  key={category.id}
                  className="border border-border/20 bg-surface-dark/20 hover:border-border/30 hover:bg-surface-dark/30 transition-all"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-border/20 bg-surface-dark/40">
                        <IconComponent className="h-4 w-4 text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-foreground mb-1">
                          {getCategoryDisplayName(category.id)}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {category.count} {category.count === 1 ? 'benchmark' : 'benchmarks'}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                      {details?.measures || category.description}
                    </p>
                    <div className="pt-4 border-t-2 border-border/20">
                      <div>
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                          Fastest Operation
                        </div>
                        <div className="flex items-baseline gap-1">
                          <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono tracking-tight">
                            {formatNanoseconds(category.fastestTime).split(' ')[0]}
                          </div>
                          <div className="text-base sm:text-lg font-semibold text-muted-foreground font-mono">
                            {formatNanoseconds(category.fastestTime).split(' ').slice(1).join(' ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Detailed Benchmarks */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-3 text-cyan">
              Detailed Results
            </h2>
            <p className="text-muted-foreground">
              Complete benchmark data with confidence intervals and throughput metrics. 
              Expand any category to view all operations.
            </p>
          </div>

          <div className="space-y-16">
            {categories.map((category) => (
              <ExpandableCategory
                key={category.id}
                categoryId={category.id}
                description={category.description}
                benchmarks={category.benchmarks}
                initialDisplayCount={12}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section - Minimal */}
      <Section className="bg-surface-dark/10 border-t border-border/10">
        <div className="max-w-3xl mx-auto text-center py-10 sm:py-12">
          <h2 className="text-2xl font-semibold mb-3 text-foreground">
            Verify Independently
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            All benchmark data is publicly available. Clone the repository and run the tests yourself to verify these results.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" asChild className="border-border/20">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Source Code
              </a>
            </Button>
            <Button variant="outline" asChild className="border-border/20">
              <a href={BENCHMARK_API_URL} target="_blank" rel="noopener noreferrer">
                <FileJson className="w-4 h-4 mr-2" />
                Download Data
              </a>
            </Button>
            <Button variant="outline" asChild className="border-border/20">
              <a href="/how">
                Learn How It Works
              </a>
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
