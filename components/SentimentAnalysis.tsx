import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import { SentimentAnalysisProps } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type SentimentType = 'negative' | 'very_positive' | 'positive'

interface SentimentDetailProps {
  name: string
  percentage: number
  count: number
  weightedScore: number
  color: string
}

function SentimentDetailDialog({ data }: { data: SentimentDetailProps }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="p-0 h-auto hover:bg-transparent"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{data.count} mentions</span>
            <span className="text-sm font-medium">{data.percentage.toFixed(1)}%</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">{data.name} Sentiment Analysis</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Mentions */}
          <div className="p-4 bg-secondary/20 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Mentions</h4>
            <p className="text-2xl font-semibold">{data.count}</p>
            <p className="text-sm text-muted-foreground">Total occurrences in content</p>
          </div>

          {/* Distribution */}
          <div className="p-4 bg-secondary/20 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Distribution</h4>
            <p className="text-2xl font-semibold">{data.percentage.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">Percentage of total sentiment</p>
          </div>

          {/* Impact Score */}
          <div className="p-4 bg-secondary/20 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Impact Score</h4>
            <p className="text-2xl font-semibold">{(data.weightedScore * 100).toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">Weighted importance in content</p>
          </div>

          {/* Progress Indicator */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Relative Strength</h4>
            <div className="w-full bg-secondary/20 rounded-full h-3">
              <div
                className="rounded-full h-3 transition-all duration-500"
                style={{ 
                  width: `${data.percentage}%`,
                  backgroundColor: data.color
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function SentimentAnalysis({ data }: SentimentAnalysisProps) {
  // Parse the metrics JSON if it's a string
  const metricsData = typeof data === 'string' ? JSON.parse(data) : data
  const sentimentData = metricsData?.sentiment

  const sentimentTypes: SentimentType[] = ['negative', 'very_positive', 'positive']
  const COLORS: Record<SentimentType, string> = {
    "negative": "#FF8042",
    "very_positive": "#00C49F",
    "positive": "#FFBB28"
  }

  // Transform data for visualization
  const analysisData = sentimentTypes.map(type => ({
    name: type.replace('_', ' '),
    percentage: sentimentData?.distribution?.percentages[type] ?? 0,
    count: sentimentData?.distribution?.counts[type] ?? 0,
    weightedScore: sentimentData?.distribution?.weighted_scores[type] ?? 0,
    color: COLORS[type]
  })).filter(item => item.percentage > 0)

  if (!analysisData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No sentiment data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Confidence Score */}
          <div className="flex items-center justify-between bg-secondary/20 p-3 rounded-lg">
            <span className="text-sm font-medium">Analysis Confidence</span>
            <span className="text-lg font-semibold">
              {((sentimentData?.confidence ?? 0) * 100).toFixed(1)}%
            </span>
          </div>

          {/* Distribution Chart */}
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analysisData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="percentage"
                >
                  {analysisData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    `${Number(value).toFixed(1)}%`,
                    name.charAt(0).toUpperCase() + name.slice(1)
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Metrics */}
          <div className="space-y-3">
            {analysisData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm capitalize">{item.name}</span>
                  <SentimentDetailDialog data={item} />
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-secondary/20 rounded-full h-2">
                    <div
                      className="rounded-full h-2"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Impact Score</span>
                    <span>{(item.weightedScore * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
