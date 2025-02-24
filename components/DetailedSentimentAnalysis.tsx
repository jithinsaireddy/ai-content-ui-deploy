import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThumbsUp, ThumbsDown, Zap, TrendingUp, Award, AlertTriangle } from 'lucide-react'

interface SentenceAnalysis {
  sentiment: number
  importance: number
  text: string
  content_weight: number
  position_weight: number
}

interface TopicSentiments {
  [key: string]: number
}

interface EntitySentiments {
  [key: string]: [number, number][]
}

interface SentimentDistribution {
  counts: {
    negative: number
    very_positive: number
    positive: number
  }
  weighted_scores: {
    negative: number
    very_positive: number
    positive: number
  }
  percentages: {
    negative: number
    very_positive: number
    positive: number
  }
}

interface DetailedSentimentAnalysisData {
  sentence_analysis: SentenceAnalysis[]
  topic_sentiments: TopicSentiments
  entity_sentiments: EntitySentiments
  sentiment_distribution: SentimentDistribution
  overall_score: number
  confidence_score: number
}

interface DetailedSentimentAnalysisProps {
  data: string
}

const SENTIMENT_COLORS = {
  negative: '#ef4444',
  positive: '#22c55e',
  very_positive: '#10b981',
  neutral: '#94a3b8'
}

const getSentimentColor = (sentiment: number) => {
  if (sentiment <= 1) return SENTIMENT_COLORS.negative
  if (sentiment <= 2) return SENTIMENT_COLORS.neutral
  if (sentiment <= 3) return SENTIMENT_COLORS.positive
  return SENTIMENT_COLORS.very_positive
}

const getSentimentIcon = (sentiment: number) => {
  if (sentiment <= 1) return <ThumbsDown className="h-4 w-4 text-red-500" />
  if (sentiment <= 2) return <AlertTriangle className="h-4 w-4 text-yellow-500" />
  if (sentiment <= 3) return <ThumbsUp className="h-4 w-4 text-green-500" />
  return <Award className="h-4 w-4 text-emerald-500" />
}

export default function DetailedSentimentAnalysis({ data }: DetailedSentimentAnalysisProps) {
  const parsedData: DetailedSentimentAnalysisData = JSON.parse(data)

  // Prepare data for sentiment flow chart
  const sentimentFlow = parsedData.sentence_analysis.map((s, i) => ({
    index: i,
    sentiment: s.sentiment,
    importance: s.importance
  }))

  // Prepare data for distribution pie chart
  const distributionData = Object.entries(parsedData.sentiment_distribution.percentages).map(([key, value]) => ({
    name: key,
    value: value,
    score: parsedData.sentiment_distribution.weighted_scores[key as keyof typeof parsedData.sentiment_distribution.weighted_scores]
  }))

  // Get top topics by sentiment
  const topTopics = Object.entries(parsedData.topic_sentiments)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([topic, sentiment]) => ({
      topic,
      sentiment
    }))

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Content Sentiment Analysis</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              Score: {parsedData.overall_score.toFixed(2)}
            </Badge>
            <Badge variant="outline" className="font-mono">
              Confidence: {(parsedData.confidence_score * 100).toFixed(0)}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="flow">Sentiment Flow</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="sentences">Sentences</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Sentiment Distribution</CardTitle>
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
                        >
                          {distributionData.map((entry, index) => (
                            <Cell key={index} fill={SENTIMENT_COLORS[entry.name as keyof typeof SENTIMENT_COLORS]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    {distributionData.map((item) => (
                      <div key={item.name} className="space-y-1">
                        <div className="font-medium capitalize">{item.name.replace('_', ' ')}</div>
                        <div className="text-muted-foreground">{item.value.toFixed(1)}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Top Positive Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[240px]">
                    <div className="space-y-2">
                      {topTopics.map((topic) => (
                        <div key={topic.topic} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getSentimentIcon(topic.sentiment)}
                            <span className="font-medium">{topic.topic}</span>
                          </div>
                          <Badge variant="secondary">{topic.sentiment.toFixed(2)}</Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="flow">
            <Card>
              <CardContent className="pt-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sentimentFlow}>
                      <defs>
                        <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="index" />
                      <YAxis domain={[0, 4]} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="sentiment"
                        stroke="#22c55e"
                        fillOpacity={1}
                        fill="url(#sentimentGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topics">
            <Card>
              <CardContent className="pt-6">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {Object.entries(parsedData.topic_sentiments).map(([topic, sentiment]) => (
                      <div key={topic} className="flex items-center gap-4">
                        <div className="w-24 truncate font-medium">{topic}</div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <div>{sentiment.toFixed(2)}</div>
                          </div>
                          <div className="h-2 w-full rounded-full bg-secondary">
                            <div
                              className="h-2 rounded-full bg-primary"
                              style={{
                                width: `${(sentiment / 4) * 100}%`,
                                backgroundColor: getSentimentColor(sentiment)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sentences">
            <Card>
              <CardContent className="pt-6">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {parsedData.sentence_analysis.map((sentence, index) => (
                      <div key={index} className="space-y-2 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getSentimentIcon(sentence.sentiment)}
                            <Badge variant="secondary">
                              Score: {sentence.sentiment.toFixed(2)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              Importance: {(sentence.importance * 100).toFixed(0)}%
                            </Badge>
                            <Badge variant="outline">
                              Position: {(sentence.position_weight * 100).toFixed(0)}%
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{sentence.text}</p>
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
