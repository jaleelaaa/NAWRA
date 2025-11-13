"use client"

import { Card } from "@/components/ui/card"
import { BookOpen, Check, BookMarked, AlertCircle, TrendingUp, TrendingDown } from "lucide-react"
import { useTranslations } from "next-intl"

interface StatsCardsProps {
  stats: {
    totalBooks: number
    available: number
    borrowed: number
    overdue: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const t = useTranslations("books.stats")
  const tCommon = useTranslations("common")

  const cards = [
    {
      title: t("totalBooks"),
      value: stats.totalBooks.toLocaleString(),
      icon: BookOpen,
      color: "text-blue-600",
      bgGradient: "from-blue-50 to-blue-100/50",
      accentColor: "bg-blue-500",
      borderColor: "border-l-4 border-l-blue-500",
      trend: "+8%",
      trendPositive: true,
    },
    {
      title: t("available"),
      value: stats.available.toLocaleString(),
      icon: Check,
      color: "text-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100/50",
      accentColor: "bg-emerald-500",
      borderColor: "border-l-4 border-l-emerald-500",
      trend: "+5%",
      trendPositive: true,
    },
    {
      title: t("borrowed"),
      value: stats.borrowed.toLocaleString(),
      icon: BookMarked,
      color: "text-purple-600",
      bgGradient: "from-purple-50 to-purple-100/50",
      accentColor: "bg-purple-500",
      borderColor: "border-l-4 border-l-purple-500",
      trend: "+18%",
      trendPositive: true,
    },
    {
      title: t("overdue"),
      value: stats.overdue.toLocaleString(),
      icon: AlertCircle,
      color: "text-red-600",
      bgGradient: "from-red-50 to-red-100/50",
      accentColor: "bg-red-500",
      borderColor: "border-l-4 border-l-red-500",
      trend: "-5%",
      trendPositive: false,
    },
  ]

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        const TrendIcon = card.trendPositive ? TrendingUp : TrendingDown
        return (
          <Card
            key={card.title}
            className={`${card.borderColor} group overflow-hidden bg-gradient-to-br ${card.bgGradient} transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:border-l-4 cursor-pointer border-border/50`}
          >
            <div className="relative p-6">
              {/* Background decoration */}
              <div
                className={`absolute -right-8 -top-8 h-32 w-32 rounded-full ${card.accentColor} opacity-5 transition-transform duration-500 group-hover:scale-150`}
              ></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                      {card.title}
                    </p>
                    <p className="mt-2 text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent transition-all group-hover:from-foreground group-hover:to-foreground">
                      {card.value}
                    </p>
                  </div>
                  <div
                    className={`rounded-lg ${card.accentColor} p-3 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Trend indicator */}
                <div className="mt-6 flex items-center gap-2 pt-4 border-t border-border/20">
                  <div className="flex items-center gap-1">
                    <TrendIcon
                      className={`h-4 w-4 transition-colors ${card.trendPositive ? "text-emerald-600" : "text-red-600"}`}
                    />
                    <span
                      className={`text-sm font-bold transition-colors ${card.trendPositive ? "text-emerald-600" : "text-red-600"}`}
                    >
                      {card.trend}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground/70 font-medium">{t("vsLastMonth")}</span>
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
