"use client"

import type React from "react"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface SortToolbarProps {
  onSortChange: (sortBy: string) => void
  onViewChange: (view: "grid" | "list") => void
  viewMode: "grid" | "list"
  resultsCount: number
}

const SortToolbar: React.FC<SortToolbarProps> = ({ onSortChange, onViewChange, viewMode, resultsCount }) => {
  const [sortOpen, setSortOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState("relevant")

  const sortOptions = [
    { value: "relevant", label: "Most Relevant" },
    { value: "newest", label: "Newest First" },
    { value: "title-asc", label: "Title (A-Z)" },
    { value: "title-desc", label: "Title (Z-A)" },
    { value: "author", label: "Author" },
    { value: "popular", label: "Most Popular" },
  ]

  const handleSort = (value: string) => {
    setSelectedSort(value)
    onSortChange(value)
    setSortOpen(false)
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-sm text-gray-600">
        Showing <span className="font-semibold text-[#8B2635]">{resultsCount}</span> results
      </p>

      <div className="flex items-center gap-4">
        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-[#E5E3E0] text-gray-700 rounded-lg hover:bg-[#E8D4A0] transition-colors"
          >
            Sort: {sortOptions.find((opt) => opt.value === selectedSort)?.label}
            <ChevronDown size={18} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
          </button>
          {sortOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E5E3E0] z-10">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSort(option.value)}
                  className={`w-full text-left px-4 py-2 hover:bg-[#F8F6F3] transition-colors ${
                    selectedSort === option.value ? "bg-[#E8D4A0] text-[#8B2635] font-semibold" : "text-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SortToolbar
