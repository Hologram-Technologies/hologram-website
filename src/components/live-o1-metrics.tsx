"use client";

import { useState, useEffect } from "react";
import { ExternalLink, FileJson, GitCommit, Clock } from "lucide-react";
import { BenchmarkData, RawBenchmark, fetchBenchmarkData, BENCHMARK_API_URL, GITHUB_REPO_URL } from "@/lib/benchmark-utils";

const GITHUB_COMMIT_URL_BASE = `${GITHUB_REPO_URL}/commit/`;

interface MetricData {
  median: number;
  lowerCI: number;
  upperCI: number;
}

interface StabilityData {
  medians: { value: number; label: string }[];
  spread: number;
  avgMedian: number;
}

/**
 * Format nanoseconds to readable unit
 */
function formatTime(ns: number): string {
  if (ns < 1000) {
    return `${Math.round(ns)} ns`;
  } else if (ns < 1_000_000) {
    return `${(ns / 1000).toFixed(2)} μs`;
  } else {
    return `${(ns / 1_000_000).toFixed(2)} ms`;
  }
}

/**
 * Format CI range
 */
function formatCIRange(lower: number, upper: number): string {
  return `${formatTime(lower)}–${formatTime(upper)}`;
}

export function LiveO1Metrics() {
  const [data, setData] = useState<BenchmarkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchBenchmarkData()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load benchmarks"))
      .finally(() => setLoading(false));
  }, []);

  // Extract metrics
  const getMetric = (id: string): MetricData | null => {
    if (!data?.benchmarks?.[id]) return null;
    const bench = data.benchmarks[id];
    if (bench.confidence_interval.confidence_level !== 0.95) return null;
    return {
      median: bench.median_ns,
      lowerCI: bench.confidence_interval.lower_ns,
      upperCI: bench.confidence_interval.upper_ns,
    };
  };

  const heroMetric = getMetric("canonicalize_simple_add_circuit");
  const stability4 = getMetric("canonicalize_range_operations/4");
  const stability8 = getMetric("canonicalize_range_operations/8");
  const stability16 = getMetric("canonicalize_range_operations/16");
  const heavierMetric = getMetric("compile_sequential_chain/8");

  // Compute stability data
  const stabilityData: StabilityData | null = 
    stability4 && stability8 && stability16
      ? {
          medians: [
            { value: stability4.median, label: "4" },
            { value: stability8.median, label: "8" },
            { value: stability16.median, label: "16" },
          ],
          avgMedian: (stability4.median + stability8.median + stability16.median) / 3,
          spread: Math.max(stability4.median, stability8.median, stability16.median) -
                  Math.min(stability4.median, stability8.median, stability16.median),
        }
      : null;

  // Format timestamp
  const formatTimestamp = (ts: string): string => {
    try {
      const date = new Date(ts);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return ts;
    }
  };

  if (loading) {
    return (
      <div className="mt-6 pt-6 border-t border-border/20">
        <div className="mb-4">
          <p className="text-xs font-bold text-cyan/60 uppercase tracking-wider mb-1">LIVE O(1) METRICS</p>
          <p className="text-xs text-muted-foreground">From current benchmark run · median + 95% CI</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-border/10 bg-surface-dark/20 p-4 animate-pulse">
              <div className="h-8 bg-muted/20 rounded mb-2" />
              <div className="h-4 bg-muted/20 rounded mb-1" />
              <div className="h-3 bg-muted/20 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mt-6 pt-6 border-t border-border/20">
        <div className="rounded-lg border border-border/20 bg-surface-dark/20 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Unable to load live benchmarks
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-6 border-t border-border/20">
      <div className="mb-4">
        <p className="text-xs font-bold text-cyan/60 uppercase tracking-wider mb-1">LIVE O(1) METRICS</p>
        <p className="text-xs text-muted-foreground">From current benchmark run · median + 95% CI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Hero Metric */}
        <div className="rounded-lg border border-cyan/20 bg-surface-dark/20 p-4">
          {heroMetric ? (
            <>
              <div className="text-2xl font-bold text-foreground mb-1">
                {formatTime(heroMetric.median)}
              </div>
              <div className="text-sm font-medium text-foreground mb-1">
                Canonicalize (simple circuit)
              </div>
              <div className="text-xs text-muted-foreground">
                95% CI: {formatCIRange(heroMetric.lowerCI, heroMetric.upperCI)}
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">Metric unavailable</div>
          )}
        </div>

        {/* Stability Metric */}
        <div className="rounded-lg border border-cyan/20 bg-surface-dark/20 p-4">
          {stabilityData ? (
            <>
              <div className="text-2xl font-bold text-foreground mb-1">
                ~{formatTime(stabilityData.avgMedian)}
              </div>
              <div className="text-sm font-medium text-foreground mb-1">
                Range canonicalize (4→16)
              </div>
              <div className="text-xs text-muted-foreground mb-1">
                {stabilityData.medians.map((m, i) => (
                  <span key={i}>
                    {formatTime(m.value)}
                    {i < stabilityData.medians.length - 1 ? " → " : ""}
                  </span>
                ))}
                {" · "}
                spread {formatTime(stabilityData.spread)}
              </div>
              <div className="text-xs text-muted-foreground">
                95% CI shown
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">Metric unavailable</div>
          )}
        </div>

        {/* Heavier Metric */}
        <div className="rounded-lg border border-cyan/20 bg-surface-dark/20 p-4">
          {heavierMetric ? (
            <>
              <div className="text-2xl font-bold text-foreground mb-1">
                {formatTime(heavierMetric.median)}
              </div>
              <div className="text-sm font-medium text-foreground mb-1">
                Compile chain (/8)
              </div>
              <div className="text-xs text-muted-foreground">
                95% CI: {formatCIRange(heavierMetric.lowerCI, heavierMetric.upperCI)}
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">Metric unavailable</div>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-3">
        Execution cost is bounded by circuit topology; these metrics show stable microsecond-scale primitives.
      </p>

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/10">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          <span>Measured: {formatTimestamp(data.timestamp)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <GitCommit className="h-3 w-3" />
          <span>Commit: {data.commit_short}</span>
        </div>
        <a
          href={BENCHMARK_API_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-cyan transition-colors"
          aria-label="View raw benchmark data"
        >
          <FileJson className="h-3 w-3" />
          <span>View raw data</span>
          <ExternalLink className="h-3 w-3" />
        </a>
        <a
          href={`${GITHUB_COMMIT_URL_BASE}${data.commit}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-cyan transition-colors"
          aria-label="View commit on GitHub"
        >
          <ExternalLink className="h-3 w-3" />
          <span>View on GitHub</span>
        </a>
      </div>
    </div>
  );
}









