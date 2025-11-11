"use client"

import type React from "react"
import { useState } from "react"
import { X, Star, BookOpen, Heart } from "lucide-react"

interface Book {
  id: number
  title: string
  author: string
  isbn: string
  category: string
  status: string
  year: number
  description: string
  pages: number
  language: string
  publisher: string
  rating: number
  reviews: number
}

interface BookDetailsModalProps {
  book: Book | null
  isOpen: boolean
  onClose: () => void
  onReserve: (bookId: number) => void
}

const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ book, isOpen, onClose, onReserve }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [quantity, setQuantity] = useState(1)

  if (!isOpen || !book) return null

  const reviews = [
    { author: "Dr. Ahmed", rating: 5, text: "Excellent resource for library management!" },
    { author: "Fatima", rating: 4, text: "Very helpful and well-organized." },
    { author: "Mohammed", rating: 5, text: "Highly recommended for anyone interested in this topic." },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-[#E5E3E0] bg-white">
          <h2 className="text-2xl font-bold text-[#8B2635]">Book Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#E8D4A0] rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Book Cover */}
            <div className="md:col-span-1">
              <div className="bg-gradient-to-br from-[#E8D4A0] to-[#F8F6F3] rounded-lg h-64 flex items-center justify-center mb-4">
                <BookOpen size={64} className="text-[#8B2635]" />
              </div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  isFavorite ? "bg-red-100 text-red-700" : "bg-[#E5E3E0] text-gray-700 hover:bg-[#E8D4A0]"
                }`}
              >
                <Heart className="inline mr-2" size={18} fill={isFavorite ? "currentColor" : "none"} />
                {isFavorite ? "Favorited" : "Add to Favorites"}
              </button>
            </div>

            {/* Book Info */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-[#8B2635]">{book.title}</h3>
                <p className="text-gray-600 text-lg">by {book.author}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(book.rating) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {book.rating} ({book.reviews} reviews)
                </span>
              </div>

              {/* Book Details Grid */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#E5E3E0]">
                <div>
                  <p className="text-xs text-gray-600 mb-1">ISBN</p>
                  <p className="font-semibold text-gray-800">{book.isbn}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Category</p>
                  <p className="font-semibold text-gray-800">{book.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Pages</p>
                  <p className="font-semibold text-gray-800">{book.pages}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Published Year</p>
                  <p className="font-semibold text-gray-800">{book.year}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Language</p>
                  <p className="font-semibold text-gray-800">{book.language}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Publisher</p>
                  <p className="font-semibold text-gray-800">{book.publisher}</p>
                </div>
              </div>

              {/* Status and Action */}
              <div className="flex items-center gap-4">
                <span
                  className={`px-4 py-2 rounded-full font-semibold text-sm ${
                    book.status === "Available" ? "bg-[#2D7A5B] text-white" : "bg-[#D4AF37] text-[#8B2635]"
                  }`}
                >
                  {book.status}
                </span>
                {book.status === "Available" && (
                  <button
                    onClick={() => onReserve(book.id)}
                    className="px-6 py-2 bg-[#8B2635] text-white rounded-lg hover:bg-[#6B1F2E] transition-colors font-medium"
                  >
                    Borrow Book
                  </button>
                )}
                {book.status === "Borrowed" && (
                  <button
                    onClick={() => onReserve(book.id)}
                    className="px-6 py-2 bg-[#1B8B9E] text-white rounded-lg hover:bg-[#166B7D] transition-colors font-medium"
                  >
                    Reserve
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-[#E5E3E0] pt-6">
            <h4 className="font-semibold text-[#8B2635] mb-2">Description</h4>
            <p className="text-gray-700 line-clamp-3">{book.description}</p>
          </div>

          {/* Reviews */}
          <div className="border-t border-[#E5E3E0] pt-6">
            <h4 className="font-semibold text-[#8B2635] mb-4">Recent Reviews</h4>
            <div className="space-y-3">
              {reviews.map((review, index) => (
                <div key={index} className="p-3 bg-[#F8F6F3] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-800">{review.author}</p>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < review.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetailsModal
