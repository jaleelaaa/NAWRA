"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface MemberFiltersProps {
  onStatusChange: (status: string) => void
  onMembershipChange: (membership: string) => void
}

const MemberFilters: React.FC<MemberFiltersProps> = ({ onStatusChange, onMembershipChange }) => {
  const [statusOpen, setStatusOpen] = useState(false)
  const [membershipOpen, setMembershipOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedMembership, setSelectedMembership] = useState("all")

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "suspended", label: "Suspended" },
  ]

  const memberships = [
    { value: "all", label: "All Memberships" },
    { value: "standard", label: "Standard" },
    { value: "premium", label: "Premium" },
    { value: "vip", label: "VIP" },
  ]

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
    onStatusChange(value)
    setStatusOpen(false)
  }

  const handleMembershipChange = (value: string) => {
    setSelectedMembership(value)
    onMembershipChange(value)
    setMembershipOpen(false)
  }

  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      {/* Status Filter */}
      <div className="relative">
        <button
          onClick={() => setStatusOpen(!statusOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-[#E5E3E0] text-gray-700 rounded-lg hover:bg-[#E8D4A0] transition-colors"
        >
          {statuses.find((s) => s.value === selectedStatus)?.label}
          <ChevronDown size={18} className={`transition-transform ${statusOpen ? "rotate-180" : ""}`} />
        </button>
        {statusOpen && (
          <div className="absolute top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-[#E5E3E0] z-10">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => handleStatusChange(status.value)}
                className={`w-full text-left px-4 py-2 hover:bg-[#F8F6F3] transition-colors ${
                  selectedStatus === status.value ? "bg-[#E8D4A0] text-[#8B2635] font-semibold" : "text-gray-700"
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Membership Filter */}
      <div className="relative">
        <button
          onClick={() => setMembershipOpen(!membershipOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-[#E5E3E0] text-gray-700 rounded-lg hover:bg-[#E8D4A0] transition-colors"
        >
          {memberships.find((m) => m.value === selectedMembership)?.label}
          <ChevronDown size={18} className={`transition-transform ${membershipOpen ? "rotate-180" : ""}`} />
        </button>
        {membershipOpen && (
          <div className="absolute top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-[#E5E3E0] z-10">
            {memberships.map((membership) => (
              <button
                key={membership.value}
                onClick={() => handleMembershipChange(membership.value)}
                className={`w-full text-left px-4 py-2 hover:bg-[#F8F6F3] transition-colors ${
                  selectedMembership === membership.value
                    ? "bg-[#E8D4A0] text-[#8B2635] font-semibold"
                    : "text-gray-700"
                }`}
              >
                {membership.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MemberFilters
