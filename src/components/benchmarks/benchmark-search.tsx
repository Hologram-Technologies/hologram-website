"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export type SortOption = "time_asc" | "time_desc" | "name_asc" | "name_desc" | "stddev";

interface BenchmarkSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedCategory: string | null;
  onCategoryChange: (cat: string | null) => void;
  categories: { id: string; name: string }[];
  resultCount: number;
  totalCount: number;
}

export function BenchmarkSearch({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedCategory,
  onCategoryChange,
  categories,
  resultCount,
  totalCount,
}: BenchmarkSearchProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border border-border/20 rounded-lg p-4 mb-8">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search benchmarks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-surface-dark/20 border-border/20"
          />
        </div>
        <div className="flex gap-3">
          <Select
            value={selectedCategory ?? "all"}
            onValueChange={(v) => onCategoryChange(v === "all" ? null : v)}
          >
            <SelectTrigger className="w-[180px] bg-surface-dark/20 border-border/20">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sortBy}
            onValueChange={(v) => onSortChange(v as SortOption)}
          >
            <SelectTrigger className="w-[160px] bg-surface-dark/20 border-border/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time_asc">Fastest first</SelectItem>
              <SelectItem value="time_desc">Slowest first</SelectItem>
              <SelectItem value="name_asc">A &rarr; Z</SelectItem>
              <SelectItem value="name_desc">Z &rarr; A</SelectItem>
              <SelectItem value="stddev">Most stable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        Showing {resultCount} of {totalCount} benchmarks
      </div>
    </div>
  );
}
