"use client"

import type React from "react"
import DashboardPage from "./pages/dashboard-page"
import CatalogPage from "./pages/catalog-page"
import ReservationsPage from "./pages/reservations-page"
import MembersPage from "./pages/members-page"
import AnalyticsPage from "./pages/analytics-page"
import NotificationsPage from "./pages/notifications-page"
import SettingsPage from "./pages/settings-page"

interface DashboardProps {
  currentPage: string
}

const Dashboard: React.FC<DashboardProps> = ({ currentPage }) => {
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />
      case "catalog":
        return <CatalogPage />
      case "reservations":
        return <ReservationsPage />
      case "members":
        return <MembersPage />
      case "analytics":
        return <AnalyticsPage />
      case "notifications":
        return <NotificationsPage />
      case "settings":
        return <SettingsPage />
      default:
        return <DashboardPage />
    }
  }

  return <div>{renderPage()}</div>
}

export default Dashboard
