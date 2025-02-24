"use client"

import { useState } from "react"
import { LocalizationRequest } from "@/lib/types/localization"
import { authApi } from "@/hooks/apiUtil"

export function useLocalization() {
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const localizeContent = async (request: LocalizationRequest) => {
    setLoading(true)
    setError(null)
    try {
      const queryParams = new URLSearchParams({
        targetRegions: request.targetRegions.join(','),
        enableRealTimeMonitoring: request.enableRealTimeMonitoring.toString()
      })

      const response = await fetch(`http://localhost:8080/api/v1/localization/localize?${queryParams}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authApi.getToken()}`
        },
        body: JSON.stringify({
          title: request.title,
          contentBody: request.contentBody,
          language: request.language,
          category: request.category,
          description: request.description,
          user: request.user,
          metrics: typeof request.metrics === 'string' 
            ? request.metrics 
            : JSON.stringify(request.metrics),
          seoMetadata: typeof request.seoMetadata === 'string' 
            ? request.seoMetadata 
            : JSON.stringify(request.seoMetadata)
        })
      })

      if (!response.ok) {
        throw new Error("Failed to localize content")
      }

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

  return { data, loading, error, localizeContent }
}
