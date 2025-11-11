"use client"

import type React from "react"
import { AlertCircle, CheckCircle, Clock, TrendingUp } from "lucide-react"

const QuickStats: React.FC = () => {
  const quickStats = [
    {
      label: "Books Due Today",
      value: "42",
      icon: Clock,
      bgColor: "bg-[#FFF8DC]",
      iconColor: "text-[#D4AF37]",
      borderColor: "border-l-4 border-[#D4AF37]",
    },
    {
      label: "Overdue Books",
      value: "8",
      icon: AlertCircle,
      bgColor: "bg-[#FFE5E5]",
      iconColor: "text-[#8B2635]",
      borderColor: "border-l-4 border-[#8B2635]",
    },
    {
      label: "Pending Returns",
      value: "156",
      icon: TrendingUp,
      bgColor: "bg-[#E0F7F4]",
      iconColor: "text-[#1B8B9E]",
      borderColor: "border-l-4 border-[#1B8B9E]",
    },
    {
      label: "Confirmed Returns",
      value: "234",
      icon: CheckCircle,
      bgColor: "bg-[#E5F5E0]",
      iconColor: "text-[#2D7A5B]",
      borderColor: "border-l-4 border-[#2D7A5B]",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {quickStats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className={`${stat.bgColor} rounded-xl p-8 ${stat.borderColor} border card-hover cursor-pointer group`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-[#8B2635] group-hover:scale-110 transition-transform duration-300 inline-block">
                  {stat.value}
                </p>
              </div>
              <Icon className={`${stat.iconColor} group-hover:scale-125 transition-transform duration-300`} size={32} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default QuickStats
