import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

interface ABTestVariant {
  userFeedback: any[]
  feedbackAnalysis: {
    sentimentAnalysis: any
    ratingDistribution: any
    feedbackThemes: any
    successFactors: any
  }
  overallScore: number
  estimatedEngagement: {
    shares: number
    comments: number
    clicks: number
    likes: number
  }
  predictedMetrics: {
    reach: number
    impressions: number
    roi: number
    conversion: number
  }
  recommendations: string[]
}

interface ABTestResults {
  original: ABTestVariant
  [key: string]: ABTestVariant
}

interface ABTestResultsProps {
  data: string
}

export default function ABTestResults({ data }: ABTestResultsProps) {
  const results: ABTestResults = JSON.parse(data)
  const variants = Object.entries(results)

  // Prepare data for the engagement chart
  const engagementData = variants.map(([name, variant]) => ({
    name: name === 'original' ? 'Original' : `Variant ${name.split('_')[1]}`,
    ...variant.estimatedEngagement
  }))

  // Prepare data for the metrics chart
  const metricsData = variants.map(([name, variant]) => ({
    name: name === 'original' ? 'Original' : `Variant ${name.split('_')[1]}`,
    ...variant.predictedMetrics
  }))

  const getPerformanceIndicator = (value: number, baseline: number) => {
    const diff = ((value - baseline) / baseline) * 100
    if (diff > 0) {
      return <ArrowUpRight className="text-green-500" />
    } else if (diff < 0) {
      return <ArrowDownRight className="text-red-500" />
    }
    return <Minus className="text-gray-500" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          A/B Test Results
          <Badge variant="outline" className="ml-2">
            {variants.length} Variants
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Scores */}
        <div className="grid grid-cols-3 gap-4">
          {variants.map(([name, variant]) => (
            <Card key={name} className="bg-secondary/5">
              <CardContent className="pt-6">
                <h3 className="text-sm font-medium mb-2">
                  {name === 'original' ? 'Original' : `Variant ${name.split('_')[1]}`}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {(variant.overallScore * 100).toFixed(1)}%
                  </span>
                  {name !== 'original' && getPerformanceIndicator(
                    variant.overallScore,
                    results.original.overallScore
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Engagement Metrics */}
        <div>
          <h3 className="text-sm font-semibold mb-4">Engagement Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="shares" name="Shares" fill="#4CAF50" />
                <Bar dataKey="comments" name="Comments" fill="#2196F3" />
                <Bar dataKey="clicks" name="Clicks" fill="#FF9800" />
                <Bar dataKey="likes" name="Likes" fill="#E91E63" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Predicted Metrics */}
        <div>
          <h3 className="text-sm font-semibold mb-4">Performance Metrics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="reach" name="Reach" fill="#9C27B0" />
                <Bar dataKey="impressions" name="Impressions" fill="#3F51B5" />
                <Bar dataKey="roi" name="ROI" fill="#009688" />
                <Bar dataKey="conversion" name="Conversion" fill="#795548" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Recommendations</h3>
          <ul className="space-y-2">
            {variants[0][1].recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm bg-secondary/10 p-2 rounded">
                <span>•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
