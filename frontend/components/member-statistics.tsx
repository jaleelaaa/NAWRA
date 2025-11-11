"use client"

import type React from "react"
import { Users, TrendingUp, Award, AlertCircle } from "lucide-react"

const MemberStatistics: React.FC = () => {
  const stats = [
    {
      label: "Total Members",
      value: "1,245",
      change: "+12%",
      icon: Users,
      color: "from-[#8B2635] to-[#6B1F2E]",
    },
    {
      label: "Active Members",
      value: "987",
      change: "+8%",
      icon: TrendingUp,
      color: "from-[#2D7A5B] to-[#1B8B9E]",
    },
    {
      label: "Inactive Members",
      value: "258",
      change: "+2%",
      icon: AlertCircle,
      color: "from-[#D4AF37] to-[#E8D4A0]",
    },
    {
      label: "Premium Members",
      value: "156",
      change: "+5%",
      icon: Award,
      color: "from-[#6B1F2E] to-[#8B2635]",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-[#E5E3E0]">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <Icon className="text-white" size={24} />
              </div>
              <span className="text-sm font-semibold text-[#2D7A5B]">{stat.change}</span>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-[#8B2635]">{stat.value}</p>
          </div>
        )
      })}
    </div>
  )
}

export default MemberStatistics
