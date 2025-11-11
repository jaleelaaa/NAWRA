"use client"

import type React from "react"
import { TrendingUp, BarChart3, PieChart, Users } from "lucide-react"

const AnalyticsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="geometric-pattern rounded-xl p-8 shadow-md">
        <h2 className="text-3xl font-bold text-[#8B2635] mb-2">Analytics & Reports</h2>
        <p className="text-gray-600">Monitor library performance and trends</p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Books Borrowed Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-[#E5E3E0]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#8B2635]">Books Borrowed (Last 30 Days)</h3>
            <TrendingUp className="text-[#D4AF37]" size={20} />
          </div>
          <div className="h-64 bg-gradient-to-br from-[#E8D4A0] to-[#F8F6F3] rounded-lg flex items-center justify-center text-gray-400">
            <BarChart3 size={40} />
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-[#E5E3E0]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#8B2635]">Books by Category</h3>
            <PieChart className="text-[#1B8B9E]" size={20} />
          </div>
          <div className="space-y-3">
            {["History", "Literature", "Technology", "Architecture", "Science"].map((cat, i) => (
              <div key={cat}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{cat}</span>
                  <span className="font-semibold text-[#8B2635]">{Math.floor(Math.random() * 30) + 10}%</span>
                </div>
                <div className="h-2 bg-[#E5E3E0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#8B2635] to-[#D4AF37]"
                    style={{ width: `${Math.floor(Math.random() * 30) + 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member Growth */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-[#E5E3E0]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#8B2635]">Member Growth</h3>
            <Users className="text-[#2D7A5B]" size={20} />
          </div>
          <div className="space-y-4">
            {["January", "February", "March", "April"].map((month) => (
              <div key={month}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{month}</span>
                  <span className="font-semibold text-[#8B2635]">{Math.floor(Math.random() * 500) + 500}</span>
                </div>
                <div className="h-2 bg-[#E5E3E0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#1B8B9E] to-[#2D7A5B]"
                    style={{ width: `${Math.floor(Math.random() * 80) + 20}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-[#E5E3E0]">
          <h3 className="font-bold text-[#8B2635] mb-4">Summary Statistics</h3>
          <div className="space-y-3">
            <div className="p-3 bg-[#F8F6F3] rounded-lg">
              <p className="text-sm text-gray-600">Average Books per Member</p>
              <p className="text-2xl font-bold text-[#8B2635]">3.2</p>
            </div>
            <div className="p-3 bg-[#E8D4A0] rounded-lg">
              <p className="text-sm text-gray-700">Books Added This Month</p>
              <p className="text-2xl font-bold text-[#8B2635]">145</p>
            </div>
            <div className="p-3 bg-[#F8F6F3] rounded-lg">
              <p className="text-sm text-gray-600">Active Reservations</p>
              <p className="text-2xl font-bold text-[#1B8B9E]">28</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
