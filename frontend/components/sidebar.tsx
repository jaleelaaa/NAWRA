"use client"

import type React from "react"
import { Home, Book, Users, Settings, BarChart3, Bookmark, Bell, LogOut, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (page: string) => void
  currentPage: string
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate, currentPage }) => {
  const { t, isRTL } = useLanguage()

  const menuItems = [
    { id: "dashboard", label: t("nav.dashboard"), icon: Home },
    { id: "catalog", label: t("nav.catalog"), icon: Book },
    { id: "reservations", label: t("nav.reservations"), icon: Bookmark },
    { id: "members", label: t("nav.members"), icon: Users },
    { id: "analytics", label: t("nav.analytics"), icon: BarChart3 },
    { id: "notifications", label: t("nav.notifications"), icon: Bell },
    { id: "settings", label: t("nav.settings"), icon: Settings },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 lg:hidden z-30 animate-fade-in transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Enhanced with bilingual support */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"
        } fixed lg:relative lg:translate-x-0 ${isRTL ? "right-0" : "left-0"} top-0 h-screen w-72 bg-white shadow-xl transition-transform duration-300 z-30 overflow-y-auto flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className={`geometric-pattern px-8 py-10 border-b-2 border-[#E5E3E0] ${isRTL ? "text-right" : ""}`}>
          <h2 className="text-xs font-bold text-gray-600 uppercase tracking-widest">{t("nav.navigation")}</h2>
        </div>

        {/* Menu Items - Better Spacing */}
        <nav className="px-4 py-8 space-y-3 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id)
                  onClose()
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-[#8B2635] to-[#6B1F2E] text-white shadow-lg"
                    : "text-gray-700 hover:bg-[#F8F6F3] hover:text-[#8B2635]"
                } ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <Icon size={22} />
                <span className="font-semibold flex-1 text-left text-base">{item.label}</span>
                {isActive && <ChevronRight size={20} className="animate-slide-in-left" />}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className={`p-6 border-t border-[#E5E3E0] ${isRTL ? "text-right" : ""}`}>
          <button
            className={`w-full flex items-center gap-3 px-5 py-4 text-[#8B2635] hover:bg-[#F8F6F3] rounded-xl transition-all duration-200 font-semibold ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <LogOut size={20} />
            <span>{t("nav.logout")}</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
