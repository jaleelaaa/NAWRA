"use client"

import type React from "react"
import { BookOpen, User, CheckCircle, Clock, Plus } from "lucide-react"

const ActivityFeed: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: "borrow",
      user: "Fatima Al-Lawati",
      action: "borrowed",
      book: "Omani Heritage and Culture",
      time: "2 hours ago",
      icon: BookOpen,
    },
    {
      id: 2,
      type: "return",
      user: "Ahmed Al-Abri",
      action: "returned",
      book: "Modern Arabic Literature",
      time: "4 hours ago",
      icon: CheckCircle,
    },
    {
      id: 3,
      type: "new_member",
      user: "Mohammed Al-Zadjali",
      action: "joined as new member",
      book: "",
      time: "6 hours ago",
      icon: User,
    },
    {
      id: 4,
      type: "reservation",
      user: "Noor Al-Hashmi",
      action: "reserved",
      book: "Digital Transformation Guide",
      time: "8 hours ago",
      icon: Clock,
    },
    {
      id: 5,
      type: "addition",
      user: "Admin",
      action: "added new book",
      book: "Islamic Architecture",
      time: "1 day ago",
      icon: Plus,
    },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-[#E5E3E0]/50 card-hover">
      <h3 className="text-2xl font-bold text-[#8B2635] mb-8">Recent Activity</h3>
      <div className="space-y-6">
        {activities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <div
              key={activity.id}
              className="flex gap-6 p-6 bg-[#F8F6F3] rounded-xl hover:bg-[#E8D4A0] transition-all duration-300 cursor-pointer group border border-transparent hover:border-[#D4AF37]"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-[#8B2635] to-[#6B1F2E] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <Icon size={22} className="text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-[#8B2635]">
                  {activity.user} <span className="font-normal text-gray-600">{activity.action}</span>
                </p>
                {activity.book && (
                  <p className="text-base text-gray-700 mt-2">
                    <span className="font-medium italic">"{activity.book}"</span>
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-3 font-medium">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ActivityFeed
