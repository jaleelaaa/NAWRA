"use client"

import type React from "react"
import { useState } from "react"
import { Calendar } from "lucide-react"
import ReservationCard from "@/components/reservation-card"
import BookDetailsModal from "@/components/book-details-modal"

interface Reservation {
  id: number
  memberName: string
  bookTitle: string
  reservedDate: string
  dueDate: string
  status: string
  daysLeft?: number
}

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

const ReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 1,
      memberName: "Fatima Al-Lawati",
      bookTitle: "Digital Transformation Guide",
      reservedDate: "2024-01-15",
      dueDate: "2024-01-20",
      status: "Pending",
      daysLeft: 2,
    },
    {
      id: 2,
      memberName: "Ahmed Al-Abri",
      bookTitle: "Islamic Architecture",
      reservedDate: "2024-01-16",
      dueDate: "2024-01-22",
      status: "Ready for Pickup",
      daysLeft: 5,
    },
    {
      id: 3,
      memberName: "Noor Al-Hashmi",
      bookTitle: "Modern Arabic Literature",
      reservedDate: "2024-01-14",
      dueDate: "2024-01-18",
      status: "Completed",
    },
    {
      id: 4,
      memberName: "Mohammed Al-Zadjali",
      bookTitle: "Omani Heritage and Culture",
      reservedDate: "2024-01-17",
      dueDate: "2024-01-25",
      status: "Pending",
      daysLeft: 7,
    },
  ])

  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isBookModalOpen, setIsBookModalOpen] = useState(false)

  const bookDetailsMap: { [key: string]: Book } = {
    "Digital Transformation Guide": {
      id: 1,
      title: "Digital Transformation Guide",
      author: "Mohammed Al-Zadjali",
      isbn: "978-3-16-148410-0",
      category: "Technology",
      status: "Borrowed",
      year: 2023,
      description:
        "A comprehensive guide to digital transformation covering cloud computing, AI, and modern infrastructure. Ideal for IT professionals and business leaders looking to modernize their operations.",
      pages: 456,
      language: "English",
      publisher: "Tech Publishing House",
      rating: 4.5,
      reviews: 128,
    },
    "Islamic Architecture": {
      id: 2,
      title: "Islamic Architecture",
      author: "Dr. Saif Al-Hashmi",
      isbn: "978-3-16-148410-1",
      category: "Architecture",
      status: "Available",
      year: 2022,
      description:
        "Explores the rich history and evolution of Islamic architectural styles across the Middle East and North Africa. Featuring detailed illustrations and historical analysis.",
      pages: 389,
      language: "English",
      publisher: "Architecture Press",
      rating: 4.8,
      reviews: 95,
    },
  }

  const handleApprove = (id: number) => {
    setReservations(reservations.map((res) => (res.id === id ? { ...res, status: "Ready for Pickup" } : res)))
  }

  const handleReject = (id: number) => {
    setReservations(reservations.filter((res) => res.id !== id))
  }

  const handleReserve = (bookId: number) => {
    setIsBookModalOpen(false)
    // Add reservation logic here
  }

  const handleViewDetails = (bookTitle: string) => {
    const book = bookDetailsMap[bookTitle]
    if (book) {
      setSelectedBook(book)
      setIsBookModalOpen(true)
    }
  }

  const pendingReservations = reservations.filter((r) => r.status === "Pending")
  const readyReservations = reservations.filter((r) => r.status === "Ready for Pickup")
  const completedReservations = reservations.filter((r) => r.status === "Completed")

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="geometric-pattern rounded-xl p-8 shadow-md">
        <h2 className="text-3xl font-bold text-[#8B2635] mb-2">Book Reservations & Details</h2>
        <p className="text-gray-600">Track reservations and view detailed book information</p>
      </div>

      {/* Reservation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-[#E5E3E0]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
              <p className="text-3xl font-bold text-[#D4AF37]">{pendingReservations.length}</p>
            </div>
            <Calendar className="text-[#D4AF37]" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-[#E5E3E0]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ready for Pickup</p>
              <p className="text-3xl font-bold text-[#2D7A5B]">{readyReservations.length}</p>
            </div>
            <CheckCircle className="text-[#2D7A5B]" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-[#E5E3E0]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-[#1B8B9E]">{completedReservations.length}</p>
            </div>
            <CheckCircle className="text-[#1B8B9E]" size={32} />
          </div>
        </div>
      </div>

      {/* Pending Reservations */}
      {pendingReservations.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-[#8B2635] mb-6">Pending Approvals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        </div>
      )}

      {/* Ready for Pickup */}
      {readyReservations.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-[#8B2635] mb-6">Ready for Pickup</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {readyReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completedReservations.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-[#8B2635] mb-6">Completed Reservations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        </div>
      )}

      {/* Book Details Modal */}
      <BookDetailsModal
        book={selectedBook}
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onReserve={handleReserve}
      />
    </div>
  )
}

export default ReservationsPage

import { CheckCircle } from "lucide-react"
