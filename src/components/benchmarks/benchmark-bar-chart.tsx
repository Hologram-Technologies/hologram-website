"use client";

import { useEffect, useRef, useState } from "react";
import { ProcessedBenchmark, formatNanoseconds } from "@/lib/benchmark-utils";
import "./benchmark-bar-chart.css";

interface BenchmarkBarChartProps {
  data: ProcessedBenchmark[];
  title: string;
  className?: string;
  showStdDev?: boolean;
}

export function BenchmarkBarChart({
  data,
  title,
  className = "",
  showStdDev = false,
}: BenchmarkBarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Find max value for scaling
  const maxValue = Math.max(...data.map((d) => d.mean_ns));

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
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Use subtle color variation - cyan for fastest, muted for others
  const getBarColor = (value: number) => {
    const ratio = value / maxValue;
    // Only highlight the fastest operations with cyan, others use muted colors
    if (ratio < 0.25) return "bar-fast";
    return "bar-medium";
  };

  return (
    <div ref={containerRef} className={`bar-chart-container ${className}`}>
      <h4 className="bar-chart-title">{title}</h4>
      <div className="bar-chart-bars">
        {data.map((benchmark, index) => {
          const widthPercent = (benchmark.mean_ns / maxValue) * 100;
          const colorClass = getBarColor(benchmark.mean_ns);

          return (
            <div
              key={benchmark.id}
              className="bar-chart-row"
              style={{ "--bar-delay": `${index * 50}ms` } as React.CSSProperties}
            >
              <div className="bar-chart-label">
                <span className="bar-chart-name">{benchmark.displayName}</span>
              </div>
              <div className="bar-chart-track">
                <div
                  className={`bar-chart-bar ${colorClass} ${isVisible ? "bar-animated" : ""}`}
                  style={{ "--bar-width": `${widthPercent}%` } as React.CSSProperties}
                >
                  <div className="bar-chart-confidence" title="95% confidence interval">
                    <span className="bar-confidence-line" />
                  </div>
                </div>
                {showStdDev && benchmark.std_dev_ns > 0 && (
                  <div
                    className="bar-stddev-whisker"
                    style={{
                      left: `${Math.max(0, ((benchmark.mean_ns - benchmark.std_dev_ns) / maxValue) * 100)}%`,
                      width: `${Math.min(100, ((benchmark.std_dev_ns * 2) / maxValue) * 100)}%`,
                    }}
                    title={`±${formatNanoseconds(benchmark.std_dev_ns)} std dev`}
                  />
                )}
              </div>
              <div className="bar-chart-value">
                <div className="flex items-baseline justify-end gap-1">
                  <span className="bar-value-number">
                    {formatNanoseconds(benchmark.mean_ns).split(' ')[0]}
                  </span>
                  <span className="bar-value-unit">
                    {formatNanoseconds(benchmark.mean_ns).split(' ').slice(1).join(' ')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scale legend */}
      <div className="bar-chart-scale">
        <span>0</span>
        <span>{formatNanoseconds(maxValue / 2)}</span>
        <span>{formatNanoseconds(maxValue)}</span>
      </div>
    </div>
  );
}
