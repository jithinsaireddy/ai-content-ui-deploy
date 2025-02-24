import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, AreaChart, Area } from "recharts"
import { MetricSummaryProps } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Gauge } from "@/components/ui/gauge"
import { ThumbsUp, ThumbsDown, TrendingUp, Award, AlertTriangle, Zap, Brain, Target } from 'lucide-react'

const SENTIMENT_COLORS = {
  negative: '#ef4444',
  positive: '#22c55e',
  very_positive: '#10b981',
  neutral: '#94a3b8'
}

const getSentimentIcon = (score: number) => {
  if (score <= 0.3) return <ThumbsDown className="h-4 w-4 text-red-500" />
  if (score <= 0.5) return <AlertTriangle className="h-4 w-4 text-yellow-500" />
  if (score <= 0.7) return <ThumbsUp className="h-4 w-4 text-green-500" />
  return <Award className="h-4 w-4 text-emerald-500" />
}

export default function MetricSummary({ data }: MetricSummaryProps) {
  const metricsData = typeof data === 'string' ? JSON.parse(data) : data
  const sentimentData = metricsData?.sentiment

  // Transform sentiment distribution data
  const distributionData = Object.entries(sentimentData?.distribution?.percentages || {}).map(([key, value]) => ({
    name: key.replace('_', ' '),
    value: value as number,
    count: sentimentData?.distribution?.counts[key as keyof typeof sentimentData.distribution.counts] || 0,
    score: sentimentData?.distribution?.weighted_scores[key as keyof typeof sentimentData.distribution.weighted_scores] || 0
  })).sort((a, b) => b.score - a.score)

  // Get top topics by score and filter out invalid entries
  const topTopics = Object.entries(sentimentData?.topic_analysis ?? {})
    .filter(([key, value]) => {
      return !key.includes('{') && 
             typeof value === 'number' && 
             !isNaN(value) && 
             isFinite(value)
    })
    .map(([topic, score]) => ({
      topic: topic.charAt(0).toUpperCase() + topic.slice(1), // Capitalize first letter
      score: Number(score) || 0
    }))
    .sort((a, b) => b.score - a.score)
    .filter(item => item.score >= 2.5) // Only show high-impact topics (score >= 2.5)
    .slice(0, 10) // Show top 10 high-impact topics

  const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#8884d8'];

  // Transform entity analysis data
  const entityAnalysis = Object.entries(sentimentData?.entity_analysis ?? {})
    .map(([entity, scores]) => ({
      entity,
      avgScore: Array.isArray(scores) ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
      mentions: Array.isArray(scores) ? scores.length : 0
    }))
    .sort((a, b) => b.avgScore - a.avgScore)
    .filter(item => item.avgScore >= 2.5);

  // Transform weighted scores for sentiment
  const weightedScores = Object.entries(sentimentData?.distribution?.weighted_scores ?? {})
    .map(([sentiment, score]) => ({
      name: sentiment.charAt(0).toUpperCase() + sentiment.slice(1).replace('_', ' '),
      score: Number(score),
      percentage: sentimentData?.distribution?.percentages[sentiment] || 0,
      count: sentimentData?.distribution?.counts[sentiment] || 0
    }));

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Content Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              {getSentimentIcon(sentimentData?.confidence || 0)}
              {((sentimentData?.confidence || 0) * 100).toFixed(0)}% Confidence
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sentiment" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="entities">Entities</TabsTrigger>
          </TabsList>

          <TabsContent value="sentiment" className="space-y-4">
            <div className="grid gap-4 grid-cols-2">
              {/* Sentiment Distribution */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Sentiment Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={distributionData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                        >
                          {distributionData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={SENTIMENT_COLORS[entry.name.replace(' ', '_') as keyof typeof SENTIMENT_COLORS]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => `${value.toFixed(1)}%`}
                          labelFormatter={(label: string) => label.charAt(0).toUpperCase() + label.slice(1)}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {distributionData.map((item, index) => (
                      <div 
                        key={index}
                        className="p-2 rounded-lg bg-secondary/10 flex flex-col items-center justify-center text-center"
                      >
                        <div className="text-sm font-medium mb-1">{item.name}</div>
                        <div className="text-2xl font-bold">{item.value.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">{item.count} mentions</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="topics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Top Topics by Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {topTopics.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.topic}</span>
                          <Badge 
                            variant={item.score >= 2.5 ? "default" : "outline"}
                            className={item.score >= 2.5 ? "bg-green-500" : ""}
                          >
                            {item.score.toFixed(1)}
                          </Badge>
                        </div>
                        <Progress value={item.score / 3 * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Key Entities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {entityAnalysis.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm font-medium">{item.entity}</div>
                            <div className="text-xs text-muted-foreground">{item.mentions} mentions</div>
                          </div>
                          <Badge 
                            variant={item.avgScore >= 2.5 ? "default" : "outline"}
                            className={item.avgScore >= 2.5 ? "bg-green-500" : ""}
                          >
                            {item.avgScore.toFixed(1)}
                          </Badge>
                        </div>
                        <Progress value={item.avgScore / 3 * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 