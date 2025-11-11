"use client"

import type React from "react"
import { Calendar, User, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface ReservationCardProps {
  reservation: {
    id: number
    memberName: string
    bookTitle: string
    reservedDate: string
    dueDate: string
    status: string
    daysLeft?: number
  }
  onApprove: (id: number) => void
  onReject: (id: number) => void
}

const ReservationCard: React.FC<ReservationCardProps> = ({ reservation, onApprove, onReject }) => {
  const statusConfig = {
    Pending: { bg: "bg-[#D4AF37]", text: "text-[#8B2635]", icon: AlertCircle },
    "Ready for Pickup": { bg: "bg-[#2D7A5B]", text: "text-white", icon: CheckCircle },
    Completed: { bg: "bg-[#1B8B9E]", text: "text-white", icon: CheckCircle },
  }

  const config = statusConfig[reservation.status as keyof typeof statusConfig]
  const StatusIcon = config.icon

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#D4AF37] hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-[#8B2635] mb-1">{reservation.bookTitle}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <User size={14} />
            {reservation.memberName}
          </p>
        </div>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${config.bg} ${config.text}`}
        >
          <StatusIcon size={14} />
          {reservation.status}
        </span>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={14} />
          <span>Reserved: {new Date(reservation.reservedDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock size={14} />
          <span>Due: {new Date(reservation.dueDate).toLocaleDateString()}</span>
        </div>
        {reservation.daysLeft !== undefined && (
          <div className={`flex items-center gap-2 ${reservation.daysLeft < 3 ? "text-red-600" : "text-[#2D7A5B]"}`}>
            <AlertCircle size={14} />
            <span>{reservation.daysLeft} days remaining</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onApprove(reservation.id)}
          className="flex-1 px-4 py-2 bg-[#8B2635] text-white rounded-lg hover:bg-[#6B1F2E] transition-colors font-medium text-sm"
        >
          Approve
        </button>
        <button
          onClick={() => onReject(reservation.id)}
          className="flex-1 px-4 py-2 bg-[#E5E3E0] text-gray-700 rounded-lg hover:bg-[#D4AF37] transition-colors font-medium text-sm"
        >
          Reject
        </button>
      </div>
    </div>
  )
}

export default ReservationCard
