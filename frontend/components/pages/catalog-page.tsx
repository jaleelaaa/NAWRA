"use client"

import type React from "react"
import { useState } from "react"
import { Search, Grid, List } from "lucide-react"
import BookCard from "@/components/book-card"
import FilterSidebar from "@/components/filter-sidebar"
import SortToolbar from "@/components/sort-toolbar"

const CatalogPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({ categories: [], status: [], priceRange: [0, 100], year: 0 })
  const [sortBy, setSortBy] = useState("relevant")

  const categories = ["All", "History", "Literature", "Technology", "Architecture", "Science", "Religion"]

  const allBooks = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    title: `Omani Book Collection ${i + 1}`,
    author: `Dr. Author ${i + 1}`,
    category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
    status: ["Available", "Borrowed", "Reserved"][Math.floor(Math.random() * 3)],
    image: `/placeholder.svg?height=300&width=200&query=book cover ${i + 1}`,
  }))

  const filteredBooks = allBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(book.category)
    const matchesStatus = filters.status.length === 0 || filters.status.includes(book.status)
    return matchesSearch && matchesCategory && matchesStatus
  })

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case "title-asc":
        return a.title.localeCompare(b.title)
      case "title-desc":
        return b.title.localeCompare(a.title)
      case "author":
        return a.author.localeCompare(b.author)
      default:
        return 0
    }
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="geometric-pattern rounded-xl p-8 shadow-md">
        <h2 className="text-3xl font-bold text-[#8B2635] mb-2">Book Catalog</h2>
        <p className="text-gray-600">Browse and manage our complete collection</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-[#E5E3E0]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 pr-12 border-2 border-[#E5E3E0] rounded-lg focus:border-[#8B2635] focus:outline-none"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div>
          <FilterSidebar onFilterChange={setFilters} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Sort Toolbar */}
          <div className="mb-6">
            <SortToolbar
              onSortChange={setSortBy}
              onViewChange={setViewMode}
              viewMode={viewMode}
              resultsCount={sortedBooks.length}
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-[#8B2635] text-white" : "bg-[#E5E3E0] text-gray-700 hover:bg-[#E8D4A0]"
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-[#8B2635] text-white" : "bg-[#E5E3E0] text-gray-700 hover:bg-[#E8D4A0]"
              }`}
            >
              <List size={20} />
            </button>
          </div>

          {/* Books Display */}
          {sortedBooks.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md border border-[#E5E3E0] overflow-hidden">
                {sortedBooks.map((book, index) => (
                  <div
                    key={book.id}
                    className={`flex gap-4 p-4 hover:bg-[#F8F6F3] transition-colors ${index !== sortedBooks.length - 1 ? "border-b border-[#E5E3E0]" : ""}`}
                  >
                    <img
                      src={book.image || "/placeholder.svg"}
                      alt={book.title}
                      className="w-20 h-28 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-[#8B2635] mb-1">{book.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-[#E5E3E0] px-3 py-1 rounded-full text-gray-700">
                          {book.category}
                        </span>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${book.status === "Available" ? "bg-[#2D7A5B] text-white" : "bg-[#D4AF37] text-[#8B2635]"}`}
                        >
                          {book.status}
                        </span>
                      </div>
                    </div>
                    <button className="px-6 py-2 bg-[#8B2635] text-white rounded-lg hover:bg-[#6B1F2E] transition-colors font-medium">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="bg-white rounded-lg shadow-md border border-[#E5E3E0] p-12 text-center">
              <p className="text-gray-600 mb-2">No books found</p>
              <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CatalogPage
