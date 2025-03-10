"use client"

import { useState } from "react"
import type { ContentData } from "@/types"
import { authApi, API_ENDPOINTS, fetchWithCors } from "@/hooks/apiUtil"
import { useToast } from "@/components/ui/use-toast"

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
  editedContent?: string
  regenerate?: boolean // Flag to indicate if content should be regenerated
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
  const { toast } = useToast()

  const generateContent = async (request: ContentRequest) => {
    setLoading(true)
    setError(null)
    try {
      console.log('Starting content generation...')
      const token = authApi.getToken()
      console.log('Token before request:', token ? 'Present' : 'Missing')
      
      if (!token) {
        console.log('No token found')
        throw new Error("Authentication token not found")
      }
      
      // Validate token format
      const jwt = token.startsWith('Bearer ') ? token.split(' ')[1] : token
      if (!jwt.includes('.') || jwt.split('.').length !== 3) {
        console.log('Invalid token format')
        authApi.removeToken() // Clear invalid token
        throw new Error("Invalid token format. Please log in again.")
      }

      console.log('Making API request...')
      console.log('Using JWT:', jwt.substring(0, 20) + '...')
      
      const response = await fetchWithCors(API_ENDPOINTS.content.generate, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(request),
      })
      if (!response.ok) {
        console.log('Response not OK:', response.status)
        console.log('Response headers:', Object.fromEntries(response.headers.entries()))
        const errorData = await response.json().catch(() => null)
        console.log('Error data:', errorData)
        console.log('Token at error time:', authApi.getToken() ? 'Present' : 'Missing')
        
        if (response.status === 401) {
          // Only remove token if it's actually expired
          const token = authApi.getToken()
          console.log('Got 401, checking if token expired...')
          // Extract JWT part for expiration check
          const jwt = token?.startsWith('Bearer ') ? token.split(' ')[1] : token
          if (jwt && authApi.isTokenExpired(jwt)) {
            console.log('Token expired, removing...')
            authApi.removeToken()
            throw new Error("Your session has expired. Please log in again.")
          } else {
            throw new Error(errorData?.message || "Authentication failed. Please check your credentials.")
          }
        }
        throw new Error(errorData?.message || "Failed to generate content")
      }
      const result = await response.json()
      setData(result)
      toast({
        title: "Success",
        description: "Content generated successfully",
      })
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, generateContent }
}
