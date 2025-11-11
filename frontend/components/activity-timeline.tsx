"use client"

import type React from "react"
import { BookOpen, User, CheckCircle, Clock, Plus, AlertCircle } from "lucide-react"

interface ActivityEvent {
  id: number
  type: string
  title: string
  description: string
  timestamp: string
  icon: React.ReactNode
  color: string
}

const ActivityTimeline: React.FC = () => {
  const activities: ActivityEvent[] = [
    {
      id: 1,
      type: "borrow",
      title: "Book Borrowed",
      description: "Fatima Al-Lawati borrowed 'Omani Heritage and Culture'",
      timestamp: "2 hours ago",
      icon: <BookOpen size={20} />,
      color: "bg-[#8B2635]",
    },
    {
      id: 2,
      type: "return",
      title: "Book Returned",
      description: "Ahmed Al-Abri returned 'Modern Arabic Literature'",
      timestamp: "4 hours ago",
      icon: <CheckCircle size={20} />,
      color: "bg-[#2D7A5B]",
    },
    {
      id: 3,
      type: "member",
      title: "New Member",
      description: "Mohammed Al-Zadjali joined the library",
      timestamp: "6 hours ago",
      icon: <User size={20} />,
      color: "bg-[#1B8B9E]",
    },
    {
      id: 4,
      type: "reservation",
      title: "Book Reserved",
      description: "Noor Al-Hashmi reserved 'Digital Transformation Guide'",
      timestamp: "8 hours ago",
      icon: <Clock size={20} />,
      color: "bg-[#D4AF37]",
    },
    {
      id: 5,
      type: "addition",
      title: "Book Added",
      description: "5 new books added to collection",
      timestamp: "1 day ago",
      icon: <Plus size={20} />,
      color: "bg-[#6B1F2E]",
    },
    {
      id: 6,
      type: "alert",
      title: "Overdue Alert",
      description: "2 books overdue from member Saif Al-Hashmi",
      timestamp: "1 day ago",
      icon: <AlertCircle size={20} />,
      color: "bg-red-600",
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-[#E5E3E0]">
      <h3 className="text-xl font-bold text-[#8B2635] mb-6">Activity Timeline</h3>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex gap-4">
            {/* Timeline Line and Icon */}
            <div className="flex flex-col items-center">
              <div className={`${activity.color} text-white p-3 rounded-full`}>{activity.icon}</div>
              {index !== activities.length - 1 && (
                <div className="w-1 h-12 bg-gradient-to-b from-[#E5E3E0] to-transparent mt-2" />
              )}
            </div>

            {/* Activity Content */}
            <div className="pb-4 flex-1">
              <h4 className="font-semibold text-[#8B2635]">{activity.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              <p className="text-xs text-gray-400 mt-2">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivityTimeline
