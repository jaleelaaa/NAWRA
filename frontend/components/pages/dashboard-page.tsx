"use client"

import type React from "react"
import { useState } from "react"
import { BookOpen, Users, TrendingUp, Activity, Search, Plus, ArrowRight } from "lucide-react"
import BookCard from "@/components/book-card"
import ActivityFeed from "@/components/activity-feed"
import QuickStats from "@/components/quick-stats"
import AnalyticsOverview from "@/components/analytics-overview"
import ChartStatCard from "@/components/chart-stat-card"
import { useLanguage } from "@/contexts/language-context"

const DashboardPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSections, setExpandedSections] = useState({
    recent: true,
    analytics: false,
  })
  const { t, isRTL } = useLanguage()

  const chartStats = [
    {
      title: "Total Books",
      value: "12,456",
      change: "+125",
      trend: "up" as const,
      icon: BookOpen,
      chart: {
        type: "line" as const,
        data: [
          { name: "Week 1", value: 100 },
          { name: "Week 2", value: 150 },
          { name: "Week 3", value: 120 },
          { name: "Week 4", value: 180 },
        ],
        color: "#8B2635",
      },
    },
    {
      title: "Active Members",
      value: "3,842",
      change: "+89",
      trend: "up" as const,
      icon: Users,
      chart: {
        type: "line" as const,
        data: [
          { name: "Week 1", value: 80 },
          { name: "Week 2", value: 110 },
          { name: "Week 3", value: 140 },
          { name: "Week 4", value: 160 },
        ],
        color: "#1B8B9E",
      },
    },
    {
      title: "Books Borrowed",
      value: "1,203",
      change: "+42",
      trend: "up" as const,
      icon: TrendingUp,
      chart: {
        type: "bar" as const,
        data: [
          { name: "Mon", value: 40 },
          { name: "Tue", value: 60 },
          { name: "Wed", value: 50 },
          { name: "Thu", value: 70 },
        ],
        color: "#D4AF37",
      },
    },
    {
      title: "Active Sessions",
      value: "287",
      change: "+15",
      trend: "up" as const,
      icon: Activity,
      chart: {
        type: "line" as const,
        data: [
          { name: "Time 1", value: 50 },
          { name: "Time 2", value: 70 },
          { name: "Time 3", value: 60 },
          { name: "Time 4", value: 80 },
        ],
        color: "#6B1F2E",
      },
    },
  ]

  const recentBooks = [
    {
      id: 1,
      title: "Omani Heritage and Culture",
      author: "Dr. Ahmed Al-Busaidi",
      category: "History",
      status: "Available",
      image: "/omani-heritage-book-cover.jpg",
    },
    {
      id: 2,
      title: "Modern Arabic Literature",
      author: "Fatima Al-Abri",
      category: "Literature",
      status: "Borrowed",
      image: "/arabic-literature-book-cover.jpg",
    },
    {
      id: 3,
      title: "Digital Transformation Guide",
      author: "Mohammed Al-Zadjali",
      category: "Technology",
      status: "Available",
      image: "/digital-transformation-book-cover.jpg",
    },
    {
      id: 4,
      title: "Islamic Architecture",
      author: "Dr. Saif Al-Hashmi",
      category: "Architecture",
      status: "Available",
      image: "/islamic-architecture-book-cover.jpg",
    },
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#F8F6F3] via-white to-[#F8F6F3] ${isRTL ? "rtl" : "ltr"}`}>
      <div className="px-6 pt-8 pb-12">
        <div
          className={`geometric-pattern rounded-2xl p-12 shadow-sm border border-[#E5E3E0]/50 animate-fade-in ${isRTL ? "text-right" : ""}`}
        >
          <h2 className="text-4xl font-bold text-[#8B2635] mb-3">{t("header.welcome")}</h2>
          <p className="text-lg text-gray-600">{t("header.subtitle")}</p>
        </div>
      </div>

      {/* Main Content with Better Spacing */}
      <div className="px-6 pb-12 space-y-12">
        {/* Quick Stats */}
        <section className="animate-slide-in-up">
          <QuickStats />
        </section>

        {/* Enhanced Stats with Charts */}
        <section className="animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {chartStats.map((stat, index) => (
              <div key={index} className="card-hover">
                <ChartStatCard {...stat} />
              </div>
            ))}
          </div>
        </section>

        {/* Search and Add Section */}
        <section className="animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
          <div className={`flex flex-col md:flex-row gap-6 ${isRTL ? "md:flex-row-reverse" : ""}`}>
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder={t("search.placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-6 py-4 text-lg border-2 border-[#E5E3E0] rounded-xl focus:border-[#8B2635] focus:outline-none text-gray-700 placeholder-gray-400 transition-all duration-300 shadow-sm group-hover:shadow-md ${isRTL ? "text-right" : ""}`}
              />
              <Search
                className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#8B2635] transition-colors pointer-events-none ${isRTL ? "left-6" : "right-6"}`}
                size={22}
              />
            </div>
            <button className="px-8 py-4 text-lg bg-gradient-to-r from-[#8B2635] to-[#6B1F2E] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold flex items-center gap-3 whitespace-nowrap">
              <Plus size={22} />
              {t("button.addBook")}
            </button>
          </div>
        </section>

        {/* Recent Additions */}
        <section className="animate-slide-in-up" style={{ animationDelay: "0.3s" }}>
          <button
            onClick={() => setExpandedSections({ ...expandedSections, recent: !expandedSections.recent })}
            className={`w-full flex items-center justify-between group mb-6 hover:opacity-80 transition-opacity ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <h3 className="text-2xl font-bold text-[#8B2635]">{t("dashboard.recent")}</h3>
            <ArrowRight
              size={24}
              className={`transform transition-transform duration-300 ${
                expandedSections.recent ? (isRTL ? "-rotate-90" : "rotate-90") : ""
              }`}
            />
          </button>

          {expandedSections.recent && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
              {recentBooks.map((book) => (
                <div key={book.id} className="card-hover">
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Activity and Status */}
        <section className="animate-slide-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 card-hover">
              <ActivityFeed />
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-[#E5E3E0]/50 card-hover">
              <h3 className="text-xl font-bold text-[#8B2635] mb-8">Library Status</h3>
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-[#FFF8DC] to-[#F8F6F3] rounded-xl border-l-4 border-[#D4AF37] hover:shadow-md transition-shadow">
                  <p className="text-sm text-gray-600 mb-2">Operating Hours</p>
                  <p className="font-semibold text-lg text-[#8B2635]">9:00 AM - 6:00 PM</p>
                </div>
                <div className="p-6 bg-gradient-to-r from-[#E0F7F4] to-[#F8F6F3] rounded-xl border-l-4 border-[#1B8B9E] hover:shadow-md transition-shadow">
                  <p className="text-sm text-gray-600 mb-2">System Status</p>
                  <p className="font-semibold text-lg text-[#1B8B9E]">All Systems Operational</p>
                </div>
                <div className="p-6 bg-gradient-to-r from-[#E5F5E0] to-[#F8F6F3] rounded-xl border-l-4 border-[#2D7A5B] hover:shadow-md transition-shadow">
                  <p className="text-sm text-gray-600 mb-2">Last Backup</p>
                  <p className="font-semibold text-lg text-[#2D7A5B]">Today at 02:30 AM</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Section - Expandable */}
        <section className="animate-slide-in-up" style={{ animationDelay: "0.5s" }}>
          <button
            onClick={() => setExpandedSections({ ...expandedSections, analytics: !expandedSections.analytics })}
            className="w-full flex items-center justify-between group mb-6 hover:opacity-80 transition-opacity"
          >
            <h3 className="text-2xl font-bold text-[#8B2635]">Analytics & Insights</h3>
            <ArrowRight
              size={24}
              className={`transform transition-transform duration-300 ${expandedSections.analytics ? "rotate-90" : ""}`}
            />
          </button>

          {expandedSections.analytics && (
            <div className="animate-fade-in">
              <AnalyticsOverview />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default DashboardPage
