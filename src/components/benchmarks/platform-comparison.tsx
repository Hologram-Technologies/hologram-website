"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Monitor, Apple, Server } from "lucide-react";
import {
  PlatformComparison as PlatformComparisonData,
  PlatformData,
  getPlatformDisplayName,
  formatNanoseconds,
} from "@/lib/benchmark-utils";

const PLATFORM_COLORS: Record<string, { bar: string; text: string; icon: typeof Server }> = {
  "x86_64-linux": { bar: "bg-cyan/70", text: "text-cyan", icon: Server },
  "x86_64-windows": { bar: "bg-purple-400/70", text: "text-purple-400", icon: Monitor },
  "aarch64-macos": { bar: "bg-orange-400/70", text: "text-orange-400", icon: Apple },
};

interface PlatformComparisonProps {
  data: PlatformComparisonData;
}

export function PlatformComparison({ data }: PlatformComparisonProps) {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const platforms = data.architectures;
  const platformResults = data.results;

  // Find benchmarks present in all platforms
  const sharedBenchmarks = useMemo(() => {
    const allKeys = platforms.map((p) => {
      const pd = platformResults[p];
      return pd ? new Set(Object.keys(pd.benchmarks)) : new Set<string>();
    });
    if (allKeys.length === 0) return [];

    const shared = [...allKeys[0]].filter((key) =>
      allKeys.every((s) => s.has(key))
    );

    return shared.sort((a, b) => {
      const aMin = Math.min(
        ...platforms.map((p) => platformResults[p]?.benchmarks[a]?.time_ns ?? Infinity)
      );
      const bMin = Math.min(
        ...platforms.map((p) => platformResults[p]?.benchmarks[b]?.time_ns ?? Infinity)
      );
      return aMin - bMin;
    });
  }, [platforms, platformResults]);

  const displayedBenchmarks = expanded
    ? sharedBenchmarks
    : sharedBenchmarks.slice(0, 12);

  const maxTime = useMemo(() => {
    let max = 0;
    for (const name of displayedBenchmarks) {
      for (const arch of platforms) {
        const val = platformResults[arch]?.benchmarks[name]?.time_ns ?? 0;
        if (val > max) max = val;
      }
    }
    return max;
  }, [displayedBenchmarks, platforms, platformResults]);

  if (sharedBenchmarks.length === 0) return null;

  return (
    <div ref={containerRef}>
      {/* Platform metadata */}
      <div className="flex flex-wrap gap-3 mb-6">
        {platforms.map((arch) => {
          const pd: PlatformData | undefined = platformResults[arch];
          const colors = PLATFORM_COLORS[arch] ?? { bar: "bg-muted", text: "text-muted-foreground", icon: Server };
          const Icon = colors.icon;
          return (
            <Card key={arch} className="border border-border/20 bg-surface-dark/20 flex-1 min-w-[200px]">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${colors.text}`} />
                  <span className={`text-sm font-semibold ${colors.text}`}>
                    {getPlatformDisplayName(arch)}
                  </span>
                </div>
                {pd && (
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>OS: {pd.os}</div>
                    <div>Rust: {pd.rust_version.replace("rustc ", "")}</div>
                    <div className="font-mono">{pd.commit_sha.slice(0, 7)}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Grouped bar chart */}
      <div className="space-y-3">
        {displayedBenchmarks.map((name, idx) => {
          const fastest = Math.min(
            ...platforms.map((p) => platformResults[p]?.benchmarks[name]?.time_ns ?? Infinity)
          );

          return (
            <div
              key={name}
              className="border border-border/10 rounded-lg p-3 bg-surface-dark/10"
              style={{ "--bar-delay": `${idx * 30}ms` } as React.CSSProperties}
            >
              <div className="text-xs font-mono text-muted-foreground mb-2 truncate" title={name}>
                {name}
              </div>
              <div className="space-y-1.5">
                {platforms.map((arch) => {
                  const bench = platformResults[arch]?.benchmarks[name];
                  if (!bench) return null;
                  const widthPct = maxTime > 0 ? (bench.time_ns / maxTime) * 100 : 0;
                  const isFastest = bench.time_ns === fastest;
                  const colors = PLATFORM_COLORS[arch] ?? { bar: "bg-muted", text: "text-muted-foreground" };

                  return (
                    <div key={arch} className="flex items-center gap-2">
                      <div className="w-16 text-[10px] text-muted-foreground shrink-0 truncate">
                        {getPlatformDisplayName(arch).split(" ")[0]}
                      </div>
                      <div className="flex-1 h-5 bg-surface-dark/30 rounded overflow-hidden">
                        <div
                          className={`h-full rounded ${colors.bar} transition-all duration-700 ease-out ${isFastest ? "ring-1 ring-white/20" : ""}`}
                          style={{
                            width: isVisible ? `${Math.max(widthPct, 1)}%` : "0%",
                            transitionDelay: `${idx * 30}ms`,
                          }}
                        />
                      </div>
                      <div className="w-20 text-right shrink-0">
                        <span className={`text-xs font-mono ${isFastest ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                          {formatNanoseconds(bench.time_ns)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expand/collapse */}
      {sharedBenchmarks.length > 12 && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground hover:text-foreground"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Show fewer
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Show all {sharedBenchmarks.length} benchmarks
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
