"use client"

import type React from "react"
import { useState } from "react"
import { BookOpen, Eye, Download, ArrowRight } from "lucide-react"

interface BookCardProps {
  book: {
    id: number
    title: string
    author: string
    category: string
    status: string
    image: string
  }
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [isHovered, setIsHovered] = useState(false)

  const statusColor = {
    Available: "bg-[#2D7A5B] text-white",
    Borrowed: "bg-[#D4AF37] text-[#8B2635]",
    Reserved: "bg-[#1B8B9E] text-white",
  }

  return (
    <div
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#E5E3E0]/50 hover:shadow-lg transition-all duration-300 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-52 bg-gradient-to-br from-[#E8D4A0] to-[#F8F6F3] overflow-hidden">
        <img
          src={book.image || "/placeholder.svg"}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/50 backdrop-blur-sm transition-all animate-fade-in">
            <button className="p-3 bg-[#8B2635] text-white rounded-lg hover:bg-[#6B1F2E] transition-all duration-300 hover:scale-110 shadow-lg">
              <Eye size={22} />
            </button>
            <button className="p-3 bg-[#1B8B9E] text-white rounded-lg hover:bg-[#1B6B7A] transition-all duration-300 hover:scale-110 shadow-lg">
              <Download size={22} />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <BookOpen size={18} className="text-[#D4AF37] mt-0.5 flex-shrink-0" />
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{book.category}</span>
        </div>
        <h4 className="font-bold text-[#8B2635] mb-2 line-clamp-2 text-lg group-hover:text-[#D4AF37] transition-colors">
          {book.title}
        </h4>
        <p className="text-sm text-gray-600 mb-4">{book.author}</p>
        <div className="flex items-center justify-between pt-4 border-t border-[#E5E3E0]">
          <span
            className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${statusColor[book.status as keyof typeof statusColor] || "bg-gray-300"}`}
          >
            {book.status}
          </span>
          <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#E8D4A0] rounded-lg">
            <ArrowRight size={18} className="text-[#8B2635]" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookCard
