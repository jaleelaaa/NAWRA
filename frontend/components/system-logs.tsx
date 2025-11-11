"use client"

import type React from "react"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

interface LogEntry {
  id: number
  timestamp: string
  action: string
  user: string
  status: string
  details: string
}

const SystemLogs: React.FC = () => {
  const logs: LogEntry[] = [
    {
      id: 1,
      timestamp: "2024-01-18 14:30",
      action: "Book Reservation",
      user: "Fatima Al-Lawati",
      status: "success",
      details: "Digital Transformation Guide reserved",
    },
    {
      id: 2,
      timestamp: "2024-01-18 13:15",
      action: "Member Registration",
      user: "System",
      status: "success",
      details: "New member: Mohammed Al-Zadjali",
    },
    {
      id: 3,
      timestamp: "2024-01-18 12:45",
      action: "Late Fee Applied",
      user: "Admin",
      status: "warning",
      details: "Late fee of $2.50 charged to Ahmed Al-Abri",
    },
    {
      id: 4,
      timestamp: "2024-01-18 11:20",
      action: "System Backup",
      user: "System",
      status: "success",
      details: "Daily backup completed successfully",
    },
    {
      id: 5,
      timestamp: "2024-01-18 10:05",
      action: "Failed Login",
      user: "Unknown",
      status: "error",
      details: "Invalid credentials from 192.168.1.100",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="text-[#2D7A5B]" size={18} />
      case "warning":
        return <AlertCircle className="text-[#D4AF37]" size={18} />
      case "error":
        return <AlertCircle className="text-red-600" size={18} />
      default:
        return <Info className="text-[#1B8B9E]" size={18} />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-[#E5E3E0]">
      <h3 className="text-xl font-bold text-[#8B2635] mb-6">System Activity Logs</h3>

      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="p-4 bg-[#F8F6F3] rounded-lg border border-[#E5E3E0]">
            <div className="flex items-start gap-4">
              {getStatusIcon(log.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-800">{log.action}</h4>
                  <span className="text-xs text-gray-500">{log.timestamp}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{log.details}</p>
                <p className="text-xs text-gray-500">By: {log.user}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SystemLogs
