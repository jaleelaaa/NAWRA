"use client"

import type React from "react"
import { useState } from "react"
import { Save } from "lucide-react"

interface LibraryPreferencesProps {
  onSave: (data: PreferencesData) => void
}

interface PreferencesData {
  borrowDays: number
  maxBooks: number
  lateFeePerDay: number
  renewalLimit: number
  autoApprove: boolean
}

const LibraryPreferences: React.FC<LibraryPreferencesProps> = ({ onSave }) => {
  const [preferences, setPreferences] = useState<PreferencesData>({
    borrowDays: 14,
    maxBooks: 5,
    lateFeePerDay: 0.5,
    renewalLimit: 2,
    autoApprove: false,
  })

  const handleChange = (field: keyof PreferencesData, value: string | number | boolean) => {
    setPreferences((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave(preferences)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-[#E5E3E0]">
      <h3 className="text-xl font-bold text-[#8B2635] mb-6">Library Preferences</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Borrowing Period (Days)</label>
          <input
            type="number"
            value={preferences.borrowDays}
            onChange={(e) => handleChange("borrowDays", Number.parseInt(e.target.value))}
            className="w-full px-4 py-3 border-2 border-[#E5E3E0] rounded-lg focus:border-[#8B2635] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Books Per Member</label>
          <input
            type="number"
            value={preferences.maxBooks}
            onChange={(e) => handleChange("maxBooks", Number.parseInt(e.target.value))}
            className="w-full px-4 py-3 border-2 border-[#E5E3E0] rounded-lg focus:border-[#8B2635] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Late Fee Per Day ($)</label>
          <input
            type="number"
            step="0.1"
            value={preferences.lateFeePerDay}
            onChange={(e) => handleChange("lateFeePerDay", Number.parseFloat(e.target.value))}
            className="w-full px-4 py-3 border-2 border-[#E5E3E0] rounded-lg focus:border-[#8B2635] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Renewal Limit</label>
          <input
            type="number"
            value={preferences.renewalLimit}
            onChange={(e) => handleChange("renewalLimit", Number.parseInt(e.target.value))}
            className="w-full px-4 py-3 border-2 border-[#E5E3E0] rounded-lg focus:border-[#8B2635] focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-6 p-4 bg-[#F8F6F3] rounded-lg border border-[#E5E3E0]">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={preferences.autoApprove}
            onChange={(e) => handleChange("autoApprove", e.target.checked)}
            className="w-5 h-5 accent-[#8B2635]"
          />
          <span className="font-medium text-gray-700">Auto-approve book reservations</span>
        </label>
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

export default LibraryPreferences
