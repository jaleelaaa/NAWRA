"use client"

import type React from "react"
import { ChevronDown, X } from "lucide-react"
import { useState } from "react"

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void
}

interface FilterState {
  categories: string[]
  status: string[]
  priceRange: [number, number]
  year: number
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    status: [],
    priceRange: [0, 100],
    year: 0,
  })
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    status: true,
    price: false,
    year: false,
  })

  const categories = ["History", "Literature", "Technology", "Architecture", "Science", "Religion"]
  const statuses = ["Available", "Borrowed", "Reserved"]

  const toggleExpand = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleCategoryChange = (category: string) => {
    const updated = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category]
    setFilters({ ...filters, categories: updated })
    onFilterChange({ ...filters, categories: updated })
  }

  const handleStatusChange = (status: string) => {
    const updated = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status]
    setFilters({ ...filters, status: updated })
    onFilterChange({ ...filters, status: updated })
  }

  const resetFilters = () => {
    const reset = { categories: [], status: [], priceRange: [0, 100], year: 0 }
    setFilters(reset)
    onFilterChange(reset)
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-[#E5E3E0] p-6 h-fit sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#8B2635]">Filters</h3>
        <button onClick={resetFilters} className="text-xs text-[#8B2635] hover:underline font-medium">
          Reset
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6 pb-6 border-b border-[#E5E3E0]">
        <button onClick={() => toggleExpand("category")} className="flex items-center justify-between w-full mb-4">
          <h4 className="font-semibold text-gray-700">Category</h4>
          <ChevronDown size={18} className={`transition-transform ${expandedSections.category ? "rotate-180" : ""}`} />
        </button>
        {expandedSections.category && (
          <div className="space-y-3">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                  className="w-4 h-4 accent-[#8B2635]"
                />
                <span className="text-sm text-gray-700">{cat}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Status Filter */}
      <div className="mb-6 pb-6 border-b border-[#E5E3E0]">
        <button onClick={() => toggleExpand("status")} className="flex items-center justify-between w-full mb-4">
          <h4 className="font-semibold text-gray-700">Status</h4>
          <ChevronDown size={18} className={`transition-transform ${expandedSections.status ? "rotate-180" : ""}`} />
        </button>
        {expandedSections.status && (
          <div className="space-y-3">
            {statuses.map((status) => (
              <label key={status} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={() => handleStatusChange(status)}
                  className="w-4 h-4 accent-[#8B2635]"
                />
                <span className="text-sm text-gray-700">{status}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters */}
      {(filters.categories.length > 0 || filters.status.length > 0) && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-600 uppercase">Active Filters</p>
          <div className="flex flex-wrap gap-2">
            {[...filters.categories, ...filters.status].map((filter) => (
              <div
                key={filter}
                className="bg-[#E8D4A0] text-[#8B2635] text-xs px-3 py-1 rounded-full flex items-center gap-2"
              >
                {filter}
                <button
                  onClick={() => {
                    if (filters.categories.includes(filter)) {
                      handleCategoryChange(filter)
                    } else {
                      handleStatusChange(filter)
                    }
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterSidebar
