"use client"

import type React from "react"
import { useState } from "react"
import { Save, Lock, Shield, Users, SettingsIcon } from "lucide-react"
import AdminUsersTable from "@/components/admin-users-table"
import LibraryPreferences from "@/components/library-preferences"
import SystemLogs from "@/components/system-logs"

interface AdminUser {
  id: number
  name: string
  email: string
  role: string
  status: string
  lastActive: string
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general")
  const [formData, setFormData] = useState({
    libraryName: "Oman Ministry Library",
    description: "Digital Collection Management System",
    email: "admin@omanlibrary.om",
    phone: "+968 1234 5678",
    address: "Ministry Building, Muscat, Oman",
    openingHours: "9:00 AM - 6:00 PM",
  })

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    {
      id: 1,
      name: "Admin User",
      email: "admin@omanlibrary.om",
      role: "Super Admin",
      status: "Active",
      lastActive: "2024-01-18 14:30",
    },
    {
      id: 2,
      name: "Library Manager",
      email: "manager@omanlibrary.om",
      role: "Manager",
      status: "Active",
      lastActive: "2024-01-18 12:45",
    },
    {
      id: 3,
      name: "Staff Member",
      email: "staff@omanlibrary.om",
      role: "Staff",
      status: "Active",
      lastActive: "2024-01-17 09:15",
    },
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEditUser = (user: AdminUser) => {
    console.log("Edit user:", user)
  }

  const handleDeleteUser = (id: number) => {
    setAdminUsers(adminUsers.filter((u) => u.id !== id))
  }

  const handleToggleStatus = (id: number) => {
    setAdminUsers(
      adminUsers.map((u) => (u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u)),
    )
  }

  const handleAddUser = () => {
    console.log("Add new user")
  }

  const handlePreferencesSave = (preferences: any) => {
    console.log("Save preferences:", preferences)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="geometric-pattern rounded-xl p-8 shadow-md">
        <h2 className="text-3xl font-bold text-[#8B2635] mb-2">System Settings</h2>
        <p className="text-gray-600">Manage library configuration, users, and system preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md border border-[#E5E3E0] overflow-hidden">
        <div className="flex flex-wrap border-b border-[#E5E3E0]">
          {[
            { id: "general", label: "General", icon: SettingsIcon },
            { id: "users", label: "Admin Users", icon: Users },
            { id: "preferences", label: "Preferences", icon: Shield },
            { id: "logs", label: "Activity Logs", icon: SettingsIcon },
          ].map((tab) => {
            const TabIcon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-[#8B2635] text-[#8B2635] bg-[#F8F6F3]"
                    : "border-transparent text-gray-700 hover:bg-[#F8F6F3]"
                }`}
              >
                <TabIcon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#8B2635] flex items-center gap-2">
                <Shield size={24} />
                General Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Library Name</label>
                  <input
                    type="text"
                    name="libraryName"
                    value={formData.libraryName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-[#E5E3E0] rounded-lg focus:border-[#8B2635] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-[#E5E3E0] rounded-lg focus:border-[#8B2635] focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#E5E3E0] rounded-lg focus:border-[#8B2635] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#E5E3E0] rounded-lg focus:border-[#8B2635] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-[#E5E3E0] rounded-lg focus:border-[#8B2635] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Opening Hours</label>
                  <input
                    type="text"
                    name="openingHours"
                    value={formData.openingHours}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-[#E5E3E0] rounded-lg focus:border-[#8B2635] focus:outline-none"
                  />
                </div>
              </div>

              <button className="px-8 py-3 bg-gradient-to-r from-[#8B2635] to-[#6B1F2E] text-white rounded-lg hover:shadow-lg transition-shadow font-medium flex items-center gap-2">
                <Save size={20} />
                Save Changes
              </button>
            </div>
          )}

          {/* Admin Users Management */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#8B2635] flex items-center gap-2">
                  <Users size={24} />
                  Admin User Management
                </h3>
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-[#8B2635] text-white rounded-lg hover:bg-[#6B1F2E] transition-colors font-medium"
                >
                  Add Admin User
                </button>
              </div>
              <AdminUsersTable
                users={adminUsers}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
                onToggleStatus={handleToggleStatus}
              />
            </div>
          )}

          {/* Library Preferences */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <LibraryPreferences onSave={handlePreferencesSave} />
            </div>
          )}

          {/* System Logs */}
          {activeTab === "logs" && (
            <div className="space-y-6">
              <SystemLogs />
            </div>
          )}
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-[#E5E3E0]">
        <h3 className="text-lg font-bold text-[#8B2635] mb-4 flex items-center gap-2">
          <Lock size={20} />
          Security Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="px-6 py-3 bg-[#E5E3E0] text-gray-700 rounded-lg hover:bg-[#D4AF37] transition-colors font-medium">
            Change Password
          </button>
          <button className="px-6 py-3 bg-[#E5E3E0] text-gray-700 rounded-lg hover:bg-[#D4AF37] transition-colors font-medium">
            Two-Factor Authentication
          </button>
          <button className="px-6 py-3 bg-[#E5E3E0] text-gray-700 rounded-lg hover:bg-[#D4AF37] transition-colors font-medium">
            Reset All Passwords
          </button>
          <button className="px-6 py-3 bg-[#E5E3E0] text-gray-700 rounded-lg hover:bg-[#D4AF37] transition-colors font-medium">
            Clear Cache & Logs
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
