"use client"

import type React from "react"
import { useState } from "react"
import { Save } from "lucide-react"

interface NotificationPreferencesProps {
  onSave: (preferences: PreferencesData) => void
}

interface PreferencesData {
  emailNotifications: boolean
  inAppNotifications: boolean
  bookDueReminders: boolean
  reservationUpdates: boolean
  memberRegistration: boolean
  overdueNotifications: boolean
  notificationFrequency: string
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ onSave }) => {
  const [preferences, setPreferences] = useState<PreferencesData>({
    emailNotifications: true,
    inAppNotifications: true,
    bookDueReminders: true,
    reservationUpdates: true,
    memberRegistration: true,
    overdueNotifications: true,
    notificationFrequency: "immediate",
  })

  const handleToggle = (key: keyof PreferencesData) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: typeof prev[key] === "boolean" ? !prev[key] : prev[key],
    }))
  }

  const handleChange = (key: keyof PreferencesData, value: string | boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onSave(preferences)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-[#E5E3E0]">
      <h3 className="text-xl font-bold text-[#8B2635] mb-6">Notification Preferences</h3>

      <div className="space-y-4 mb-6">
        {[
          { key: "emailNotifications", label: "Email Notifications" },
          { key: "inAppNotifications", label: "In-App Notifications" },
          { key: "bookDueReminders", label: "Book Due Reminders" },
          { key: "reservationUpdates", label: "Reservation Updates" },
          { key: "memberRegistration", label: "New Member Registration" },
          { key: "overdueNotifications", label: "Overdue Book Notifications" },
        ].map((pref) => (
          <label
            key={pref.key}
            className="flex items-center gap-3 p-4 bg-[#F8F6F3] rounded-lg cursor-pointer hover:bg-[#E8D4A0] transition-colors"
          >
            <input
              type="checkbox"
              checked={preferences[pref.key as keyof PreferencesData] as boolean}
              onChange={() => handleToggle(pref.key as keyof PreferencesData)}
              className="w-5 h-5 accent-[#8B2635]"
            />
            <span className="font-medium text-gray-700">{pref.label}</span>
          </label>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Notification Frequency</label>
        <select
          value={preferences.notificationFrequency}
          onChange={(e) => handleChange("notificationFrequency", e.target.value)}
          className="w-full px-4 py-3 border-2 border-[#E5E3E0] rounded-lg focus:border-[#8B2635] focus:outline-none"
        >
          <option value="immediate">Immediate</option>
          <option value="daily">Daily Digest</option>
          <option value="weekly">Weekly Digest</option>
        </select>
      </div>

      <button
        onClick={handleSave}
        className="px-8 py-3 bg-gradient-to-r from-[#8B2635] to-[#6B1F2E] text-white rounded-lg hover:shadow-lg transition-shadow font-medium flex items-center gap-2"
      >
        <Save size={20} />
        Save Preferences
      </button>
    </div>
  )
}

export default NotificationPreferences
