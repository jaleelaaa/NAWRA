"use client"

import type React from "react"
import type { LucideIcon } from "lucide-react"
import { ArrowUpRight } from "lucide-react"

interface StatCardProps {
  stat: {
    title: string
    value: string
    change: string
    icon: LucideIcon
    color: string
  }
}

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const Icon = stat.icon

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-[#E5E3E0] hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
          <Icon className="text-white" size={24} />
        </div>
        <div className="flex items-center gap-1 text-[#2D7A5B]">
          <ArrowUpRight size={16} />
          <span className="text-sm font-semibold">{stat.change}</span>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-2">{stat.title}</p>
      <p className="text-3xl font-bold text-[#8B2635]">{stat.value}</p>
    </div>
  )
}

export default StatCard
