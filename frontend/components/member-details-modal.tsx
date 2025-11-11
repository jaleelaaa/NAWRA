"use client"

import type React from "react"
import { X, Mail, Phone, Calendar, BookOpen } from "lucide-react"

interface Member {
  id: number
  name: string
  email: string
  phone: string
  memberSince: string
  status: string
  booksIssued: number
}

interface MemberDetailsModalProps {
  member: Member | null
  isOpen: boolean
  onClose: () => void
}

const MemberDetailsModal: React.FC<MemberDetailsModalProps> = ({ member, isOpen, onClose }) => {
  if (!isOpen || !member) return null

  const borrowingHistory = [
    { book: "Omani Heritage", date: "2024-01-10", dueDate: "2024-02-10" },
    { book: "Modern Arabic Literature", date: "2024-01-05", dueDate: "2024-02-05" },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-[#E5E3E0] bg-white">
          <h2 className="text-2xl font-bold text-[#8B2635]">Member Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#E8D4A0] rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Member Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Full Name</p>
              <p className="text-lg font-semibold text-[#8B2635]">{member.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
                  member.status === "Active" ? "bg-[#2D7A5B] text-white" : "bg-[#E5E3E0] text-gray-700"
                }`}
              >
                {member.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-[#8B2635]" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-800">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={18} className="text-[#8B2635]" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-gray-800">{member.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-[#8B2635]" />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-gray-800">{new Date(member.memberSince).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-[#8B2635]" />
              <div>
                <p className="text-sm text-gray-600">Books Issued</p>
                <p className="text-gray-800 font-semibold">{member.booksIssued}</p>
              </div>
            </div>
          </div>

          {/* Borrowing History */}
          <div className="border-t border-[#E5E3E0] pt-6">
            <h3 className="font-semibold text-[#8B2635] mb-4">Recent Borrowing History</h3>
            <div className="space-y-3">
              {borrowingHistory.map((item, index) => (
                <div key={index} className="p-4 bg-[#F8F6F3] rounded-lg">
                  <p className="font-medium text-gray-800">{item.book}</p>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Issued: {new Date(item.date).toLocaleDateString()}</span>
                    <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 border-t border-[#E5E3E0] pt-6">
            <button className="flex-1 px-4 py-2 bg-[#8B2635] text-white rounded-lg hover:bg-[#6B1F2E] transition-colors font-medium">
              Edit Member
            </button>
            <button className="flex-1 px-4 py-2 bg-[#E5E3E0] text-gray-700 rounded-lg hover:bg-[#E8D4A0] transition-colors font-medium">
              Suspend Member
            </button>
            <button className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium">
              Deactivate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberDetailsModal
