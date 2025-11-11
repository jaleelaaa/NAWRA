"use client"

import { LanguageProvider as Provider } from "@/contexts/language-context"
import type React from "react"

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>
}
