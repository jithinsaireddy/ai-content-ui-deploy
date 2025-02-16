"use client"

import { useState } from "react"
import ContentRequestForm from "./ContentRequestForm"
import ContentPreview from "./ContentPreview"
import TrendAnalysis from "./TrendAnalysis"
import PerformancePrediction from "./PerformancePrediction"
import EngagementPrediction from "./EngagementPrediction"
import SentimentAnalysis from "./SentimentAnalysis"
import SensitivityAnalysis from "./SensitivityAnalysis"
import { mockData } from "@/lib/mockData"
import MetricSummary from "./MetricSummary"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ContentRequest {
  title: string
  contentType: string
  topic: string
  emotionalTone: string
  keywords: string
  contentLength: string
  targetAudience: string
  category: string
  writingStyle: string
  optimizeForSeo: boolean
  region: string
  metadata: {
    includeTrends: boolean
    includeStatistics: boolean
    includeExpertQuotes: boolean
    formatType: string
    researchDepth: string
  }
}

export default function Dashboard() {
  const [data, setData] = useState<typeof mockData | null>(null)

  const handleSubmit = async (request: ContentRequest, generatedContent: any, useMockData: boolean) => {
    if (useMockData) {
      // Use mock data
      setData({
        ...mockData,
        content: {
          ...mockData.content,
          contentBody: `# ${request.title}\n\n${mockData.content.contentBody}`,
        },
      })
    } else {
      // Use the generated content from the form
      setData(generatedContent)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Content Request Form in a distinct section */}
      <div className="bg-secondary/20 p-6 rounded-lg shadow-lg">
        <ContentRequestForm onSubmit={handleSubmit} />
      </div>

      {data && (
        <>
          {/* Main Content Area with 60-40 split */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Preview Section - 60% */}
            <div className="lg:w-[60%]">
              <div className="max-h-[calc(100vh*2)] overflow-y-auto">
                <ContentPreview title={data.content.title} content={data.content.contentBody} />
              </div>
            </div>

            {/* Analysis Section - 40% */}
            <div className="lg:w-[40%] space-y-6">
              {/* <SentimentAnalysis data={data.content.analyzedSentiment} /> */}
              <SensitivityAnalysis data={data.sensitivityAnalysis} />
              <PerformancePrediction data={data.performancePrediction} />
            </div>
          </div>

          {/* Bottom Analysis Components in 2x2 Grid */}
          <div className="grid grid-cols-2 gap-4">
            <TrendAnalysis data={data.trendAnalysis} />
            <EngagementPrediction data={data.engagementPrediction} />
            <div className="col-span-2">
              <MetricSummary data={data.content.metrics} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

