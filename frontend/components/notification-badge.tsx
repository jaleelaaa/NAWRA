"use client"

import React from "react"
import { Bell } from "lucide-react"
import { useState } from "react"

interface NotificationBadgeProps {
  count: number
  onClick: () => void
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, onClick }) => {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleCountChange = () => {
    if (count > 0) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 600)
      return () => clearTimeout(timer)
    }
  }

  React.useEffect(handleCountChange, [count])

  return (
    <button
      onClick={onClick}
      className="relative p-3 text-[#8B2635] hover:bg-[#E8D4A0] rounded-xl transition-all duration-300 hover:scale-110 group"
    >
      <Bell size={24} className="group-hover:rotate-12 transition-transform duration-300" />
      {count > 0 && (
        <span
          className={`absolute -top-2 -right-2 h-7 w-7 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg ${
            isAnimating ? "animate-pulse scale-110" : ""
          } transition-transform duration-300`}
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  )
}

export default NotificationBadge
