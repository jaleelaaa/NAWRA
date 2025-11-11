"use client"

import type React from "react"
import { LineChart, Line, BarChart, Bar, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { LucideIcon } from "lucide-react"

interface ChartStatCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: LucideIcon
  chart: {
    type: "line" | "bar"
    data: Array<{ name: string; value: number }>
    color: string
  }
}

const ChartStatCard: React.FC<ChartStatCardProps> = ({ title, value, change, trend, icon: Icon, chart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-[#E5E3E0] p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-[#8B2635]">{value}</p>
            <span className={`text-xs font-semibold ${trend === "up" ? "text-[#2D7A5B]" : "text-[#8B2635]"}`}>
              {trend === "up" ? "↑" : "↓"} {change}
            </span>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-gradient-to-br from-[#8B2635] to-[#6B1F2E]">
          <Icon className="text-white" size={20} />
        </div>
      </div>

      {/* Mini Chart */}
      <div className="h-16 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          {chart.type === "line" ? (
            <LineChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E3E0" />
              <Tooltip contentStyle={{ backgroundColor: "#F8F6F3", border: "1px solid #E5E3E0" }} />
              <Line type="monotone" dataKey="value" stroke={chart.color} strokeWidth={2} dot={false} />
            </LineChart>
          ) : (
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E3E0" />
              <Tooltip contentStyle={{ backgroundColor: "#F8F6F3", border: "1px solid #E5E3E0" }} />
              <Bar dataKey="value" fill={chart.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ChartStatCard
