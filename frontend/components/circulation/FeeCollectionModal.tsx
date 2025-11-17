"use client"

import { useState, useEffect } from "react"
import { X, Search, DollarSign, CheckCircle, AlertCircle, Loader2, User } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { searchUsers } from "@/lib/api/users"
import { getUserFines, collectUserFines } from "@/lib/api/circulation"
import { UserDetail } from "@/lib/api/types"
import { toast } from "sonner"

interface FeeCollectionModalProps {
  isOpen: boolean
  onClose: () => void
  onCollectionComplete?: () => void
}

interface UserFine {
  id: string
  book_title: string
  due_date: string
  days_overdue: number
  fine_amount: number
  fine_paid: boolean
}

export default function FeeCollectionModal({
  isOpen,
  onClose,
  onCollectionComplete
}: FeeCollectionModalProps) {
  const t = useTranslations("circulation.modals.feeCollection")
  const locale = useLocale()

  // Helper function to get display name based on locale
  const getDisplayName = (user: UserDetail) => {
    return (locale === 'ar' && user.arabic_name) ? user.arabic_name : user.full_name
  }

  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<UserDetail[]>([])
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null)
  const [userFines, setUserFines] = useState<UserFine[]>([])
  const [isLoadingFines, setIsLoadingFines] = useState(false)
  const [isCollecting, setIsCollecting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [collectionResult, setCollectionResult] = useState<any>(null)

  // Search users
  const handleSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await searchUsers(query)
      setSearchResults(results)
    } catch (error) {
      console.error("Error searching users:", error)
      toast.error(t("searchError"))
    } finally {
      setIsSearching(false)
    }
  }

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Load user fines when user is selected
  const handleSelectUser = async (user: UserDetail) => {
    setSelectedUser(user)
    setSearchResults([])
    setSearchQuery("")
    setIsLoadingFines(true)

    try {
      const fines = await getUserFines(user.id)
      setUserFines(fines.filter((fine: any) => !fine.fine_paid && fine.fine_amount > 0))
    } catch (error) {
      console.error("Error loading fines:", error)
      toast.error(t("loadFinesError"))
      setUserFines([])
    } finally {
      setIsLoadingFines(false)
    }
  }

  // Collect all fines
  const handleCollectFees = async () => {
    if (!selectedUser) return

    setIsCollecting(true)
    try {
      const result = await collectUserFines(selectedUser.id)
      setCollectionResult(result)
      setShowSuccessMessage(true)

      toast.success(t("collectionSuccess", {
        amount: result.total_collected.toFixed(3)
      }))

      // Call callback if provided
      if (onCollectionComplete) {
        onCollectionComplete()
      }

      // Reset after showing success
      setTimeout(() => {
        handleClose()
      }, 3000)
    } catch (error: any) {
      console.error("Error collecting fees:", error)
      toast.error(error.response?.data?.detail || t("collectionError"))
    } finally {
      setIsCollecting(false)
    }
  }

  // Calculate total
  const totalAmount = userFines.reduce((sum, fine) => sum + fine.fine_amount, 0)

  // Reset state when modal closes
  const handleClose = () => {
    setSearchQuery("")
    setSearchResults([])
    setSelectedUser(null)
    setUserFines([])
    setShowSuccessMessage(false)
    setCollectionResult(null)
    onClose()
  }

  if (!isOpen) return null

  // Success message screen
  if (showSuccessMessage && collectionResult) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={handleClose}>
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] mb-2">{t("success")}</h2>
            <p className="text-[#6B7280] mb-6">{collectionResult.message}</p>

            <div className="bg-gradient-to-br from-[#8B1538]/5 to-[#8B1538]/10 rounded-xl p-6 mb-6">
              <div className="text-4xl font-bold text-[#8B1538] mb-1">
                {collectionResult.total_collected.toFixed(3)} OMR
              </div>
              <div className="text-sm text-[#6B7280]">
                {t("recordsUpdated", { count: collectionResult.records_updated })}
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-[#8B1538] text-white py-3 rounded-lg font-semibold hover:bg-[#6D1029] transition-colors"
            >
              {t("close")}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={handleClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#8B1538]/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#8B1538]" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">{t("title")}</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-[#F3F4F6] rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-[#6B7280]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* User Search */}
          {!selectedUser && (
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">
                {t("searchUserLabel")}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder={t("searchUserPlaceholder")}
                  className="pl-10 pr-4 py-3 border-2 border-[#E5E7EB] rounded-lg w-full focus:border-[#8B1538] focus:outline-none focus:ring-2 focus:ring-[#8B1538]/10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-3 w-5 h-5 text-[#9CA3AF] animate-spin" />
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-2 border-2 border-[#E5E7EB] rounded-lg max-h-64 overflow-y-auto">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="w-full px-4 py-3 hover:bg-[#F9FAFB] transition-colors text-left border-b border-[#E5E7EB] last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-[#6B7280]" />
                        <div>
                          <div className="font-semibold text-[#111827]">{getDisplayName(user)}</div>
                          <div className="text-sm text-[#6B7280]">{user.email}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                <div className="mt-2 text-center py-4 text-[#6B7280]">
                  {t("noUsersFound")}
                </div>
              )}
            </div>
          )}

          {/* Selected User & Fines */}
          {selectedUser && (
            <>
              {/* Selected User Card */}
              <div className="bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] border-2 border-[#E5E7EB] rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#8B1538]/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-[#8B1538]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#111827]">{getDisplayName(selectedUser)}</h3>
                      <p className="text-sm text-[#6B7280]">{selectedUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-sm text-[#8B1538] hover:underline"
                  >
                    {t("changeUser")}
                  </button>
                </div>
              </div>

              {/* Fines List */}
              {isLoadingFines ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 text-[#8B1538] animate-spin mx-auto mb-3" />
                  <p className="text-[#6B7280]">{t("loadingFines")}</p>
                </div>
              ) : userFines.length === 0 ? (
                <div className="text-center py-12 bg-green-50 rounded-xl border-2 border-green-200">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <p className="font-semibold text-green-800">{t("noUnpaidFines")}</p>
                  <p className="text-sm text-green-600 mt-1">{t("allClear")}</p>
                </div>
              ) : (
                <>
                  {/* Fines Table */}
                  <div className="border-2 border-[#E5E7EB] rounded-xl overflow-hidden">
                    <div className="bg-[#F9FAFB] px-4 py-3 border-b border-[#E5E7EB]">
                      <h3 className="font-bold text-[#111827]">{t("unpaidFines")}</h3>
                    </div>
                    <div className="divide-y divide-[#E5E7EB]">
                      {userFines.map((fine) => (
                        <div key={fine.id} className="px-4 py-3 hover:bg-[#F9FAFB] transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-[#111827] text-sm">{fine.book_title}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-xs text-[#6B7280]">
                                  {t("dueDate")}: {new Date(fine.due_date).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-red-600 font-medium">
                                  {t("overdue", { days: fine.days_overdue })}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-[#8B1538]">{fine.fine_amount.toFixed(3)} OMR</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="bg-gradient-to-br from-[#8B1538] to-[#6D1029] rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm mb-1">{t("totalAmount")}</p>
                        <p className="text-3xl font-bold">{totalAmount.toFixed(3)} OMR</p>
                        <p className="text-white/60 text-xs mt-1">
                          {t("itemCount", { count: userFines.length })}
                        </p>
                      </div>
                      <DollarSign className="w-16 h-16 text-white/20" />
                    </div>
                  </div>

                  {/* Collect Button */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      className="flex-1 bg-white border-2 border-[#E5E7EB] text-[#111827] py-3 rounded-lg font-semibold hover:bg-[#F9FAFB] transition-colors"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      onClick={handleCollectFees}
                      disabled={isCollecting}
                      className="flex-1 bg-[#8B1538] text-white py-3 rounded-lg font-semibold hover:bg-[#6D1029] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isCollecting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {t("processing")}
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-5 h-5" />
                          {t("collectFees")}
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
