"use client"

import type React from "react"
import { useState } from "react"
import { AlertCircle, CheckCircle, Info, Trash2, Filter } from "lucide-react"
import NotificationPreferences from "@/components/notification-preferences"
import ActivityTimeline from "@/components/activity-timeline"

interface Notification {
  id: number
  type: string
  title: string
  message: string
  timestamp: string
  read: boolean
  category: string
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "info",
      title: "New Member Registration",
      message: "Mohammed Al-Zadjali has registered as a new member",
      timestamp: "2 hours ago",
      read: false,
      category: "member",
    },
    {
      id: 2,
      type: "alert",
      title: "Book Due Soon",
      message: "5 members have books due within the next 3 days",
      timestamp: "4 hours ago",
      read: false,
      category: "due",
    },
    {
      id: 3,
      type: "success",
      title: "Book Returned",
      message: 'Fatima Al-Lawati has returned "Omani Heritage and Culture"',
      timestamp: "6 hours ago",
      read: true,
      category: "return",
    },
    {
      id: 4,
      type: "info",
      title: "Reservation Ready",
      message: 'Ahmed Al-Abri\'s reservation for "Islamic Architecture" is ready for pickup',
      timestamp: "1 day ago",
      read: true,
      category: "reservation",
    },
    {
      id: 5,
      type: "alert",
      title: "Overdue Books",
      message: "3 books are now overdue and require follow-up",
      timestamp: "2 days ago",
      read: true,
      category: "overdue",
    },
  ])

  const [selectedFilter, setSelectedFilter] = useState("all")
  const [showPreferences, setShowPreferences] = useState(false)

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertCircle size={24} className="text-[#D4AF37]" />
      case "success":
        return <CheckCircle size={24} className="text-[#2D7A5B]" />
      default:
        return <Info size={24} className="text-[#1B8B9E]" />
    }
  }

  const getStyleClass = (type: string) => {
    switch (type) {
      case "alert":
        return "border-l-4 border-[#D4AF37] bg-[#FFF8DC]/50"
      case "success":
        return "border-l-4 border-[#2D7A5B] bg-[#E5F5E0]/50"
      default:
        return "border-l-4 border-[#1B8B9E] bg-[#E0F7F4]/50"
    }
  }

  const filteredNotifications =
    selectedFilter === "all" ? notifications : notifications.filter((n) => n.category === selectedFilter)
  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const handlePreferencesSave = (preferences: any) => {
    console.log("Save preferences:", preferences)
    setShowPreferences(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6F3] via-white to-[#F8F6F3]">
      {/* Header Section */}
      <div className="px-6 pt-8 pb-12">
        <div className="geometric-pattern rounded-2xl p-12 shadow-sm border border-[#E5E3E0]/50 animate-fade-in">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h2 className="text-4xl font-bold text-[#8B2635] mb-3">Notifications & Activity</h2>
              <p className="text-lg text-gray-600">Stay updated with all library activities and events</p>
            </div>
            {unreadCount > 0 && (
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg animate-pulse">
                {unreadCount} Unread
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-12 space-y-12">
        {/* Notification Stats - More Spacious */}
        <section className="animate-slide-in-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-[#E5E3E0]/50 card-hover">
              <p className="text-sm text-gray-600 mb-3 font-medium">Total Notifications</p>
              <p className="text-4xl font-bold text-[#8B2635]">{notifications.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-8 border border-[#E5E3E0]/50 card-hover">
              <p className="text-sm text-gray-600 mb-3 font-medium">Unread</p>
              <p className="text-4xl font-bold text-red-600">{unreadCount}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-8 border border-[#E5E3E0]/50 card-hover">
              <p className="text-sm text-gray-600 mb-3 font-medium">Read</p>
              <p className="text-4xl font-bold text-[#2D7A5B]">{notifications.length - unreadCount}</p>
            </div>
          </div>
        </section>

        {/* Tab Toggle - Better Styling */}
        <section className="animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex gap-4 bg-white rounded-xl shadow-sm p-2 border border-[#E5E3E0]/50 w-fit">
            <button
              onClick={() => setShowPreferences(false)}
              className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 text-base ${
                !showPreferences
                  ? "bg-gradient-to-r from-[#8B2635] to-[#6B1F2E] text-white shadow-md"
                  : "text-gray-700 hover:text-[#8B2635]"
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setShowPreferences(true)}
              className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 text-base ${
                showPreferences
                  ? "bg-gradient-to-r from-[#8B2635] to-[#6B1F2E] text-white shadow-md"
                  : "text-gray-700 hover:text-[#8B2635]"
              }`}
            >
              Preferences
            </button>
          </div>
        </section>

        {!showPreferences ? (
          <>
            {/* Filter Buttons - Better Spacing */}
            <section className="animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex gap-3 flex-wrap">
                {[
                  { value: "all", label: "All" },
                  { value: "member", label: "Members" },
                  { value: "due", label: "Due Soon" },
                  { value: "return", label: "Returns" },
                  { value: "reservation", label: "Reservations" },
                  { value: "overdue", label: "Overdue" },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedFilter(filter.value)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                      selectedFilter === filter.value
                        ? "bg-gradient-to-r from-[#8B2635] to-[#6B1F2E] text-white shadow-md"
                        : "bg-[#F8F6F3] text-gray-700 hover:bg-[#E8D4A0] border border-[#E5E3E0]"
                    }`}
                  >
                    <Filter size={18} />
                    {filter.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Action Buttons */}
            <section className="animate-slide-in-up" style={{ animationDelay: "0.25s" }}>
              <div className="flex gap-4">
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-8 py-4 bg-gradient-to-r from-[#8B2635] to-[#6B1F2E] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold text-base"
                >
                  Mark All as Read
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-8 py-4 bg-[#F8F6F3] text-gray-700 rounded-xl hover:bg-[#E8D4A0] border border-[#E5E3E0] transition-all duration-300 font-semibold text-base"
                >
                  Clear All
                </button>
              </div>
            </section>

            {/* Notifications List - Better Spacing and Interactivity */}
            <section className="animate-slide-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="space-y-6">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      className={`bg-white rounded-xl p-8 shadow-sm hover:shadow-lg hover:scale-102 transition-all duration-300 border ${getStyleClass(
                        notification.type,
                      )} ${!notification.read ? "border-r-4 border-r-[#8B2635]" : "border-[#E5E3E0]/50"} group cursor-pointer animate-fade-in`}
                      style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                    >
                      <div className="flex gap-6 items-start">
                        <div className="flex-shrink-0 p-3 bg-[#F8F6F3] rounded-lg group-hover:scale-110 transition-transform duration-300">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-bold text-[#8B2635] mb-2 text-lg">{notification.title}</h3>
                              <p className="text-gray-600 text-base mb-3">{notification.message}</p>
                              <p className="text-sm text-gray-400">{notification.timestamp}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="flex-shrink-0 p-3 text-gray-400 hover:text-[#8B2635] hover:bg-[#E8D4A0]/30 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-16 text-center border border-[#E5E3E0]/50">
                    <p className="text-gray-600 text-lg">No notifications in this category</p>
                  </div>
                )}
              </div>
            </section>

            {/* Activity Timeline */}
            <section className="animate-slide-in-up" style={{ animationDelay: "0.4s" }}>
              <ActivityTimeline />
            </section>
          </>
        ) : (
          <div className="animate-fade-in">
            <NotificationPreferences onSave={handlePreferencesSave} />
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationsPage
