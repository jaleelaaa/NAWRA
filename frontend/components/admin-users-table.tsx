"use client"

import type React from "react"
import { Edit2, Trash2, ToggleLeft as Toggle2 } from "lucide-react"

interface AdminUser {
  id: number
  name: string
  email: string
  role: string
  status: string
  lastActive: string
}

interface AdminUsersTableProps {
  users: AdminUser[]
  onEditUser: (user: AdminUser) => void
  onDeleteUser: (id: number) => void
  onToggleStatus: (id: number) => void
}

const AdminUsersTable: React.FC<AdminUsersTableProps> = ({ users, onEditUser, onDeleteUser, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-[#E5E3E0] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#8B2635] to-[#6B1F2E] text-white">
              <th className="px-6 py-4 text-left font-semibold">Name</th>
              <th className="px-6 py-4 text-left font-semibold">Email</th>
              <th className="px-6 py-4 text-left font-semibold">Role</th>
              <th className="px-6 py-4 text-left font-semibold">Last Active</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-[#F8F6F3]"
                } hover:bg-[#E8D4A0] transition-colors border-t border-[#E5E3E0]`}
              >
                <td className="px-6 py-4 font-medium text-[#8B2635]">{user.name}</td>
                <td className="px-6 py-4 text-gray-600 text-sm">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[#E8D4A0] text-[#8B2635]">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">{user.lastActive}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.status === "Active" ? "bg-[#2D7A5B] text-white" : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditUser(user)}
                      className="p-2 text-[#8B2635] hover:bg-[#E8D4A0] rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onToggleStatus(user.id)}
                      className="p-2 text-[#1B8B9E] hover:bg-[#E8D4A0] rounded-lg transition-colors"
                    >
                      <Toggle2 size={18} />
                    </button>
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminUsersTable
