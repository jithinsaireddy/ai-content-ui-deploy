"use client"

import { useState } from "react"
import type { ContentData } from "@/types"
import { authApi, API_ENDPOINTS } from "@/hooks/apiUtil"

interface ContentRequest {
  title: string
  contentType: string
  topic: string
  emotionalTone: string
  keywords: string
  desiredContentLength: string
  targetAudience: string
  category: string
  language: string
  writingStyleSample: string
  optimizeForSEO: boolean
  region: string
  metadata: {
    includeTrends: boolean
    includeStatistics: boolean
    includeExpertQuotes: boolean
    formatType: string
    researchDepth: string
    priority: string
    department: string
  }
}

export function useContentData() {
  const [data, setData] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateContent = async (request: ContentRequest) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(API_ENDPOINTS.content.generate, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${authApi.getToken()}` 
        },
        body: JSON.stringify(request),
      })
      if (!response.ok) throw new Error("Failed to generate content")
      const result = await response.json()
      setData(result)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, generateContent }
}
