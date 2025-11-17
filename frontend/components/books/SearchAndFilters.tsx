"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid3x3, List, X } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import type { CategoryWithCount } from "@/lib/types/books"

interface SearchAndFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  selectedStatus: string | null
  onStatusChange: (status: string | null) => void
  categories: CategoryWithCount[]
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
}

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  categories,
  viewMode,
  onViewModeChange,
}: SearchAndFiltersProps) {
  const t = useTranslations("books")
  const tFilters = useTranslations("books.filters")
  const tStatus = useTranslations("books.status")
  const locale = useLocale()
  const isRTL = locale === 'ar'

  const hasActiveFilters = searchTerm !== "" || selectedCategory !== null || selectedStatus !== null

  return (
    <div className="space-y-5">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors">
          <Search className="h-5 w-5 text-primary/60" />
        </div>
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 h-11 bg-gradient-to-r from-white to-slate-50 border-border/50 rounded-lg shadow-sm focus:shadow-md transition-all focus:border-primary/50 font-medium"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Category Filter */}
        <Select value={selectedCategory || "all"} onValueChange={(v) => onCategoryChange(v === "all" ? null : v)}>
          <SelectTrigger className="w-auto min-w-48 h-10 bg-gradient-to-r from-white to-slate-50 border-border/50 rounded-lg shadow-sm hover:shadow-md transition-all font-medium">
            <SelectValue placeholder={tFilters("allCategories")} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">{tFilters("allCategories")}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {isRTL ? cat.name_ar || cat.name : cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={selectedStatus || "all"} onValueChange={(v) => onStatusChange(v === "all" ? null : v)}>
          <SelectTrigger className="w-auto min-w-48 h-10 bg-gradient-to-r from-white to-slate-50 border-border/50 rounded-lg shadow-sm hover:shadow-md transition-all font-medium">
            <SelectValue placeholder={tFilters("allStatus")} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">{tFilters("allStatus")}</SelectItem>
            <SelectItem value="available">{tStatus("available")}</SelectItem>
            <SelectItem value="borrowed">{tStatus("borrowed")}</SelectItem>
            <SelectItem value="reserved">{tStatus("reserved")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            onClick={() => {
              onSearchChange("")
              onCategoryChange(null)
              onStatusChange(null)
            }}
            variant="ghost"
            size="sm"
            className="h-10 gap-2 text-muted-foreground hover:text-foreground hover:bg-destructive/10 transition-all rounded-lg"
          >
            <X className="h-4 w-4" />
            {tFilters("clear")}
          </Button>
        )}

        {/* View Mode Toggle */}
        <div className="ml-auto flex items-center gap-2 bg-gradient-to-r from-white to-slate-50 rounded-lg border border-border/50 p-1 shadow-sm">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => onViewModeChange("grid")}
            className={`h-8 w-8 rounded-md transition-all ${
              viewMode === "grid"
                ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            title="Grid view"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => onViewModeChange("list")}
            className={`h-8 w-8 rounded-md transition-all ${
              viewMode === "list"
                ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            title="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
