"use client"

import type React from "react"
import { useState } from "react"
import { Search, Plus } from "lucide-react"
import MemberStatistics from "@/components/member-statistics"
import MemberFilters from "@/components/member-filters"
import MemberDetailsModal from "@/components/member-details-modal"

interface Member {
  id: number
  name: string
  email: string
  phone: string
  memberSince: string
  status: string
  booksIssued: number
}

const MembersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedMembership, setSelectedMembership] = useState("all")
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const allMembers: Member[] = [
    {
      id: 1,
      name: "Fatima Al-Lawati",
      email: "fatima@example.com",
      phone: "+968 9123 4567",
      memberSince: "2023-01-15",
      status: "Active",
      booksIssued: 5,
    },
    {
      id: 2,
      name: "Ahmed Al-Abri",
      email: "ahmed@example.com",
      phone: "+968 9234 5678",
      memberSince: "2023-03-20",
      status: "Active",
      booksIssued: 3,
    },
    {
      id: 3,
      name: "Noor Al-Hashmi",
      email: "noor@example.com",
      phone: "+968 9345 6789",
      memberSince: "2023-06-10",
      status: "Inactive",
      booksIssued: 0,
    },
    {
      id: 4,
      name: "Mohammed Al-Zadjali",
      email: "mohammed@example.com",
      phone: "+968 9456 7890",
      memberSince: "2024-01-05",
      status: "Active",
      booksIssued: 8,
    },
    {
      id: 5,
      name: "Layla Al-Mazrouei",
      email: "layla@example.com",
      phone: "+968 9567 8901",
      memberSince: "2024-02-10",
      status: "Active",
      booksIssued: 2,
    },
    {
      id: 6,
      name: "Saif Al-Hashmi",
      email: "saif@example.com",
      phone: "+968 9678 9012",
      memberSince: "2023-09-22",
      status: "Inactive",
      booksIssued: 1,
    },
  ]

  const filteredMembers = allMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || member.status.toLowerCase() === selectedStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (member: Member) => {
    setSelectedMember(member)
    setIsModalOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="geometric-pattern rounded-xl p-8 shadow-md">
        <h2 className="text-3xl font-bold text-[#8B2635] mb-2">Member Management</h2>
        <p className="text-gray-600">Manage library members and their activities</p>
      </div>

      {/* Statistics */}
      <MemberStatistics />

      {/* Search and Add */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 pr-12 border-2 border-[#E5E3E0] rounded-lg focus:border-[#8B2635] focus:outline-none"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <button className="px-8 py-3 bg-gradient-to-r from-[#8B2635] to-[#6B1F2E] text-white rounded-lg hover:shadow-lg transition-shadow font-medium flex items-center gap-2 w-full md:w-auto justify-center">
          <Plus size={20} />
          Add Member
        </button>
      </div>

      {/* Filters */}
      <MemberFilters onStatusChange={setSelectedStatus} onMembershipChange={setSelectedMembership} />

      {/* Members Table */}
      <div className="bg-white rounded-lg shadow-md border border-[#E5E3E0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#8B2635] to-[#6B1F2E] text-white">
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">Phone</th>
                <th className="px-6 py-4 text-left font-semibold">Member Since</th>
                <th className="px-6 py-4 text-left font-semibold">Books Issued</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, index) => (
                <tr
                  key={member.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-[#F8F6F3]"
                  } hover:bg-[#E8D4A0] transition-colors border-t border-[#E5E3E0]`}
                >
                  <td className="px-6 py-4 font-medium text-[#8B2635]">{member.name}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{member.email}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{member.phone}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(member.memberSince).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-[#E8D4A0] text-[#8B2635] px-3 py-1 rounded-full font-semibold text-sm">
                      {member.booksIssued}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full font-semibold text-sm ${
                        member.status === "Active" ? "bg-[#2D7A5B] text-white" : "bg-[#E5E3E0] text-gray-700"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDetails(member)}
                      className="text-[#8B2635] hover:text-[#D4AF37] font-medium text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Details Modal */}
      <MemberDetailsModal member={selectedMember} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default MembersPage
