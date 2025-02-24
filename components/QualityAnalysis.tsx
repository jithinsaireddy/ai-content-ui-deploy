import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { AlertCircle } from "lucide-react"

interface QualityData {
  qualityScore: number
  clarity: number
  engagement: number
  value: number
  recommendations: string[]
}

interface QualityAnalysisProps {
  data: QualityData
}

export default function QualityAnalysis({ data }: QualityAnalysisProps) {
  const radarData = [
    { metric: "Quality", value: data.qualityScore },
    { metric: "Clarity", value: data.clarity },
    { metric: "Engagement", value: data.engagement },
    { metric: "Value", value: data.value },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return "text-green-500"
    if (score >= 0.7) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 0.9) return "bg-green-500"
    if (score >= 0.7) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Content Quality Analysis
          <Badge className={getScoreBadge(data.qualityScore)}>
            {(data.qualityScore * 100).toFixed(0)}% Quality Score
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-4">
          {radarData.map((item) => (
            <div key={item.metric} className="text-center p-2 bg-secondary/5 rounded-lg">
              <div className="text-sm font-medium mb-1">{item.metric}</div>
              <div className={`text-lg font-bold ${getScoreColor(item.value)}`}>
                {(item.value * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>

        {/* Radar Chart */}
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={30} domain={[0, 1]} />
              <Radar
                name="Quality Metrics"
                dataKey="value"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Improvement Recommendations
          </h3>
          <ul className="space-y-2">
            {data.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm bg-secondary/10 p-2 rounded">
                <span className="text-blue-500 font-medium">{index + 1}.</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
