"use client"

import type React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const AnalyticsOverview: React.FC = () => {
  const borrowingData = [
    { month: "Jan", books: 420, returns: 380 },
    { month: "Feb", books: 530, returns: 490 },
    { month: "Mar", books: 640, returns: 620 },
    { month: "Apr", books: 580, returns: 550 },
    { month: "May", books: 720, returns: 710 },
    { month: "Jun", books: 890, returns: 850 },
  ]

  const categoryData = [
    { name: "Literature", value: 35, fill: "#8B2635" },
    { name: "History", value: 25, fill: "#1B8B9E" },
    { name: "Science", value: 20, fill: "#2D7A5B" },
    { name: "Technology", value: 15, fill: "#D4AF37" },
    { name: "Other", value: 5, fill: "#E8D4A0" },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Borrowing Trends */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-[#E5E3E0]">
        <h3 className="text-lg font-bold text-[#8B2635] mb-6">Borrowing Trends</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={borrowingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E3E0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: "#F8F6F3", border: "1px solid #E5E3E0" }} />
              <Legend />
              <Bar dataKey="books" fill="#8B2635" radius={[4, 4, 0, 0]} name="Books Borrowed" />
              <Bar dataKey="returns" fill="#2D7A5B" radius={[4, 4, 0, 0]} name="Books Returned" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-[#E5E3E0]">
        <h3 className="text-lg font-bold text-[#8B2635] mb-6">Collection by Category</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value}%)`}
                outerRadius={80}
                fill="#8B2635"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#F8F6F3", border: "1px solid #E5E3E0" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsOverview
