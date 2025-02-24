import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, Zap, ArrowUpRight } from 'lucide-react'

interface TrendData {
  engagement: number
  interest_over_time: number
  change: number
  volatility: number
  dynamicWeight: number
  direction: "UP" | "DOWN"
}

interface TrendAnalysisProps {
  data: string
}

export default function ContentTrendAnalysis({ data }: TrendAnalysisProps) {
  const parsedData: Record<string, TrendData> = JSON.parse(data)
  const [title, trendData] = Object.entries(parsedData)[0]

  const formatChange = (change: number) => {
    if (change >= 1000000) return `${(change / 1000000).toFixed(1)}M%`
    if (change >= 1000) return `${(change / 1000).toFixed(1)}K%`
    return `${change.toFixed(1)}%`
  }

  const getDirectionColor = (direction: string) => {
    return direction === "UP" ? "text-green-500" : "text-red-500"
  }

  const getDirectionIcon = (direction: string) => {
    return direction === "UP" ? (
      <TrendingUp className="h-5 w-5 text-green-500" />
    ) : (
      <TrendingDown className="h-5 w-5 text-red-500" />
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Content Trend Analysis
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1 ${getDirectionColor(trendData.direction)}`}
          >
            {getDirectionIcon(trendData.direction)}
            Trending {trendData.direction}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Title and Engagement */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Content Title</div>
            <div className="text-sm">{title}</div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-none bg-secondary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Engagement Score</div>
                    <div className="text-2xl font-bold">
                      {(trendData.engagement * 100).toFixed(0)}%
                    </div>
                  </div>
                  <Zap className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-secondary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Change Rate</div>
                    <div className="text-2xl font-bold">
                      {formatChange(trendData.change)}
                    </div>
                  </div>
                  <ArrowUpRight className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Interest Over Time</div>
              <div className="text-sm">
                {(trendData.interest_over_time * 100).toFixed(4)}%
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Volatility</div>
              <div className="text-sm">
                {(trendData.volatility * 100).toFixed(1)}%
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Dynamic Weight</div>
              <div className="text-sm">
                {(trendData.dynamicWeight * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
