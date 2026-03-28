"use client";

import { useState, useEffect, useMemo } from "react";
import { Section } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BenchmarkBarChart,
  ExpandableCategory,
} from "@/components/benchmarks";
import { BenchmarkSearch, SortOption } from "@/components/benchmarks/benchmark-search";
import { PlatformComparison } from "@/components/benchmarks/platform-comparison";
import {
  categorizeBenchmarks,
  findFastest,
  formatNanoseconds,
  getCategoryDisplayName,
  fetchBenchmarkData,
  BenchmarkData,
  PlatformComparison as PlatformComparisonData,
  BENCHMARK_API_URL,
  PLATFORM_API_URL,
  GITHUB_REPO_URL,
  ProcessedCategory,
} from "@/lib/benchmark-utils";
import {
  Clock,
  GitCommit,
  ExternalLink,
  FileJson,
  Cpu,
  Globe,
} from "lucide-react";

export default function BenchmarksPage() {
  const [data, setData] = useState<BenchmarkData | null>(null);
  const [platformData, setPlatformData] = useState<PlatformComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("time_asc");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const benchmarkData = await fetchBenchmarkData();
        setData(benchmarkData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load benchmarks");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Fetch platform data separately
  useEffect(() => {
    async function loadPlatform() {
      try {
        const response = await fetch(PLATFORM_API_URL, { cache: "no-store" });
        if (response.ok) {
          const json = await response.json();
          setPlatformData(json as PlatformComparisonData);
        }
      } catch {
        // Platform data is optional — silently ignore
      }
    }
    loadPlatform();
  }, []);

  const processed = useMemo(() => {
    if (!data) return null;
    return categorizeBenchmarks(data);
  }, [data]);

  const fastest = useMemo(() => {
    if (!processed) return null;
    return findFastest(processed.all);
  }, [processed]);

  // Top 4 categories by benchmark count for the overview charts
  const topCategories = useMemo(() => {
    if (!processed) return [];
    return [...processed.categories]
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [processed]);

  // Category list for search dropdown
  const categoryOptions = useMemo(() => {
    if (!processed) return [];
    return processed.categories.map((c) => ({
      id: c.id,
      name: getCategoryDisplayName(c.id),
    }));
  }, [processed]);

  // Filtered & sorted categories for detailed results
  const filteredCategories = useMemo(() => {
    if (!processed) return [];
    let result: ProcessedCategory[] = processed.categories;

    if (selectedCategory) {
      result = result.filter((c) => c.id === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result
        .map((cat) => ({
          ...cat,
          benchmarks: cat.benchmarks.filter(
            (b) =>
              b.id.toLowerCase().includes(q) ||
              b.displayName.toLowerCase().includes(q)
          ),
        }))
        .filter((cat) => cat.benchmarks.length > 0);
    }

    // Sort benchmarks within categories
    const sortFns: Record<SortOption, (a: { mean_ns: number; std_dev_ns: number; displayName: string }, b: { mean_ns: number; std_dev_ns: number; displayName: string }) => number> = {
      time_asc: (a, b) => a.mean_ns - b.mean_ns,
      time_desc: (a, b) => b.mean_ns - a.mean_ns,
      name_asc: (a, b) => a.displayName.localeCompare(b.displayName),
      name_desc: (a, b) => b.displayName.localeCompare(a.displayName),
      stddev: (a, b) => a.std_dev_ns - b.std_dev_ns,
    };

    result = result.map((cat) => ({
      ...cat,
      benchmarks: [...cat.benchmarks].sort(sortFns[sortBy]),
    }));

    return result;
  }, [processed, searchQuery, selectedCategory, sortBy]);

  const filteredBenchmarkCount = useMemo(() => {
    return filteredCategories.reduce((sum, c) => sum + c.benchmarks.length, 0);
  }, [filteredCategories]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading benchmarks...</p>
        </div>
      </main>
    );
  }

  if (!data || !processed) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Failed to load benchmarks: {error}</p>
        </div>
      </main>
    );
  }

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
      {/* Hero Section */}
      <Section className="py-12 sm:py-16 lg:py-20 border-b border-border/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 text-foreground">
              Hologram Performance<br />
              <span className="block mt-2 sm:mt-3">Benchmarks</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Measured execution times across {data.benchmark_count} live operations.
              All data is publicly verifiable and reproducible.
            </p>
          </div>

          {/* Key Metric */}
          <div className="max-w-3xl mx-auto mb-10 sm:mb-12">
            <Card className="border-2 border-purple-500/40 bg-surface-dark/40 relative overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-none">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-transparent pointer-events-none" />
              <CardContent className="p-10 sm:p-16 relative">
                <div className="text-center">
                  <div className="mb-8">
                    <div className="inline-block">
                      <div className="text-6xl sm:text-7xl lg:text-8xl font-bold text-foreground mb-2 font-mono tracking-tight leading-none">
                        {formatNanoseconds(fastest?.mean_ns || 0).split(" ")[0]}
                      </div>
                      <span className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-muted-foreground font-mono ml-2">
                        {formatNanoseconds(fastest?.mean_ns || 0).split(" ").slice(1).join(" ")}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                        Fastest Operation
                      </div>
                      {fastest?.confidence_interval && (
                        <div className="text-xs text-muted-foreground font-mono">
                          95% CI: {formatNanoseconds(fastest.confidence_interval.lower_ns)}&ndash;{formatNanoseconds(fastest.confidence_interval.upper_ns)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category averages - dynamic top 3 */}
                  <div className="pt-8 border-t-2 border-border/20">
                    <div className="grid grid-cols-3 gap-6 sm:gap-10">
                      {topCategories.slice(0, 3).map((cat) => (
                        <div key={cat.id} className="text-center">
                          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                            {getCategoryDisplayName(cat.id)} Avg
                          </div>
                          <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono mb-1">
                            {formatNanoseconds(cat.avgTime).split(" ")[0]}
                          </div>
                          <div className="text-sm text-muted-foreground font-mono">
                            {formatNanoseconds(cat.avgTime).split(" ").slice(1).join(" ")}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {cat.count} benchmarks
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Methodology */}
          <div className="max-w-3xl mx-auto">
            <div className="border border-border/20 bg-surface-dark/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Methodology</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                All benchmarks are run using{" "}
                <code className="px-1.5 py-0.5 bg-surface-dark/40 rounded text-xs font-mono">
                  criterion.rs
                </code>{" "}
                with 100 sample iterations. Warmup iterations are excluded from
                measurements. Confidence intervals are estimated from standard deviation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Test Date
                    </span>
                  </div>
                  <div className="text-sm font-medium text-foreground">{formattedDate}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{formattedTime}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <GitCommit className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Git Commit
                    </span>
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
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Raw Data
                    </span>
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

      {/* Performance by Category - Dynamic top categories */}
      <Section className="border-b border-border/10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-3 text-cyan">
              Performance by Category
            </h2>
            <p className="text-muted-foreground">
              Execution times across top operation categories. All times are mean values
              with standard deviation indicators.
            </p>
          </div>

          <div className="space-y-12 sm:space-y-14">
            {topCategories.map((category) => (
              <div key={category.id}>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded border border-border/20 bg-surface-dark/30">
                      <Cpu className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground">
                        {getCategoryDisplayName(category.id)}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.description}
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
                            {formatNanoseconds(category.avgTime).split(" ")[0]}
                          </div>
                          <div className="text-xl sm:text-2xl font-semibold text-muted-foreground font-mono">
                            {formatNanoseconds(category.avgTime).split(" ").slice(1).join(" ")}
                          </div>
                        </div>
                      </div>
                      <div className="pb-1">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                          Fastest
                        </div>
                        <div className="flex items-baseline gap-1">
                          <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono">
                            {formatNanoseconds(category.fastestTime).split(" ")[0]}
                          </div>
                          <div className="text-sm text-muted-foreground font-mono">
                            {formatNanoseconds(category.fastestTime).split(" ").slice(1).join(" ")}
                          </div>
                        </div>
                      </div>
                      <div className="pb-1">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                          Benchmarks
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono">
                          {category.count}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border border-border/20 bg-surface-dark/20 rounded-lg p-6">
                  <BenchmarkBarChart
                    data={category.benchmarks.slice(0, 16)}
                    title={`${getCategoryDisplayName(category.id)} Benchmarks`}
                    showStdDev
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Category Overview Cards */}
      <Section className="bg-surface-dark/10 border-b border-border/10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-3 text-cyan">
              All Categories
            </h2>
            <p className="text-muted-foreground">
              Comprehensive testing across all {processed.categories.length} Hologram
              subsystems.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {processed.categories.map((category) => (
              <Card
                key={category.id}
                className="border border-border/20 bg-surface-dark/20 hover:border-border/30 hover:bg-surface-dark/30 transition-all cursor-pointer"
                onClick={() => {
                  setSelectedCategory(category.id);
                  document.getElementById("detailed-results")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-border/20 bg-surface-dark/40">
                      <Cpu className="h-4 w-4 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base text-foreground mb-1">
                        {getCategoryDisplayName(category.id)}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {category.count} {category.count === 1 ? "benchmark" : "benchmarks"}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  <div className="pt-4 border-t-2 border-border/20">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                          Fastest
                        </div>
                        <div className="flex items-baseline gap-1">
                          <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono tracking-tight">
                            {formatNanoseconds(category.fastestTime).split(" ")[0]}
                          </div>
                          <div className="text-base sm:text-lg font-semibold text-muted-foreground font-mono">
                            {formatNanoseconds(category.fastestTime).split(" ").slice(1).join(" ")}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                          Average
                        </div>
                        <div className="text-sm font-mono text-muted-foreground">
                          {formatNanoseconds(category.avgTime)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Platform Comparison */}
      {platformData && (
        <Section className="border-b border-border/10">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 sm:mb-10">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-6 h-6 text-cyan" />
                <h2 className="text-3xl font-bold tracking-tight text-cyan">
                  Cross-Platform Performance
                </h2>
              </div>
              <p className="text-muted-foreground">
                Backend benchmarks compared across {platformData.architectures.length} platforms.
                Bars show relative execution time — shorter is faster.
              </p>
            </div>
            <PlatformComparison data={platformData} />
          </div>
        </Section>
      )}

      {/* Detailed Benchmarks with Search */}
      <Section id="detailed-results">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-3 text-cyan">
              Detailed Results
            </h2>
            <p className="text-muted-foreground">
              Complete benchmark data with confidence intervals. Search, filter,
              and sort to find specific operations.
            </p>
          </div>

          <BenchmarkSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categoryOptions}
            resultCount={filteredBenchmarkCount}
            totalCount={data.benchmark_count}
          />

          <div className="space-y-16">
            {filteredCategories.map((category) => (
              <ExpandableCategory
                key={category.id}
                categoryId={category.id}
                description={category.description}
                benchmarks={category.benchmarks}
                initialDisplayCount={12}
              />
            ))}
            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No benchmarks match your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-surface-dark/10 border-t border-border/10">
        <div className="max-w-3xl mx-auto text-center py-10 sm:py-12">
          <h2 className="text-2xl font-semibold mb-3 text-foreground">
            Verify Independently
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            All benchmark data is publicly available. Clone the repository and
            run the tests yourself to verify these results.
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
              <a href="/how">Learn How It Works</a>
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
