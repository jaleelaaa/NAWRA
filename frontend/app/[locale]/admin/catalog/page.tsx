"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Download } from "lucide-react"
import { StatsCards } from "@/components/books/StatsCards"
import { SearchAndFilters } from "@/components/books/SearchAndFilters"
import { BookCard } from "@/components/books/BookCard"
import { OMANI_BOOKS, getCategories, getBooksStats, filterBooks } from "@/lib/data/books"
import AdminLayout from "@/components/AdminLayout"
import { Pagination } from "@/components/Pagination"

export default function CatalogPage() {
  const t = useTranslations("books")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

  // Get statistics
  const stats = getBooksStats()

  // Get unique categories
  const categories = getCategories()

  // Filter books based on search and filters
  const filteredBooks = useMemo(() => {
    return filterBooks(OMANI_BOOKS, searchTerm, selectedCategory, selectedStatus)
  }, [searchTerm, selectedCategory, selectedStatus])

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, selectedStatus, itemsPerPage])

  // Calculate pagination
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex)

  // Handle page change with scroll to top
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle items per page change
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items)
    setCurrentPage(1)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {t("title")}
              </h1>
              <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="gap-2 border-border/50 hover:bg-accent hover:border-primary/50 transition-all"
              >
                <Upload className="h-4 w-4" />
                {t("import")}
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-border/50 hover:bg-accent hover:border-primary/50 transition-all"
              >
                <Download className="h-4 w-4" />
                {t("export")}
              </Button>
              <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-md hover:shadow-lg transition-all">
                <Plus className="h-4 w-4" />
                {t("addBook")}
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8">
          <StatsCards stats={stats} />
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            categories={categories}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground font-medium">
            {t("showingBooks", { count: filteredBooks.length, total: OMANI_BOOKS.length })}
          </p>
        </div>

        {/* Books Grid/List */}
        {filteredBooks.length > 0 ? (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "flex flex-col gap-4"
              }
            >
              {paginatedBooks.map((book) => (
                <BookCard key={book.id} book={book} viewMode={viewMode} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredBooks.length}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                itemType="books"
              />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
              <svg
                className="h-12 w-12 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">{t("noBooks")}</h3>
            <p className="text-sm text-muted-foreground">{t("tryAdjusting")}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
