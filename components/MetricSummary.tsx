import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { MetricSummaryProps } from "@/lib/types"

export default function MetricSummary({ data }: MetricSummaryProps) {
  // Parse the metrics JSON if it's a string and handle potential parsing errors
  let metricsData;
  try {
    if (typeof data === 'string') {
      // Clean up the JSON string before parsing
      const cleanedData = data.replace(/\n/g, '')
                             .replace(/\s+/g, ' ')
                             .replace(/([{,])\s*(\w+):/g, '$1"$2":')  // Ensure property names are quoted
                             .replace(/:\s*'([^']*)'/g, ':"$1"')      // Replace single quotes with double quotes
                             .replace(/undefined/g, 'null')            // Replace undefined with null
                             .replace(/\bNaN\b/g, '0')                // Replace NaN with 0
      metricsData = JSON.parse(cleanedData)
    } else {
      metricsData = data
    }
  } catch (error) {
    console.error('Error parsing metrics data:', error)
    metricsData = { sentiment: { distribution: {}, topic_analysis: {} } }
  }

  const sentimentData = metricsData?.sentiment

  // Transform sentiment distribution data for pie chart
  const distributionData = [
    {
      name: "Negative",
      value: sentimentData?.distribution?.percentages?.negative ?? 0,
      count: sentimentData?.distribution?.counts?.negative ?? 0,
      score: sentimentData?.distribution?.weighted_scores?.negative ?? 0,
    },
    {
      name: "Very Positive",
      value: sentimentData?.distribution?.percentages?.very_positive ?? 0,
      count: sentimentData?.distribution?.counts?.very_positive ?? 0,
      score: sentimentData?.distribution?.weighted_scores?.very_positive ?? 0,
    },
    {
      name: "Positive",
      value: sentimentData?.distribution?.percentages?.positive ?? 0,
      count: sentimentData?.distribution?.counts?.positive ?? 0,
      score: sentimentData?.distribution?.weighted_scores?.positive ?? 0,
    },
  ].filter(item => item.value > 0)

  // Get top topics by score and filter out invalid entries
  const topTopics = Object.entries(sentimentData?.topic_analysis ?? {})
    .filter(([key, value]) => {
      return !key.includes('{') && 
             typeof value === 'number' && 
             !isNaN(value) && 
             isFinite(value)
    })
    .sort(([, a], [, b]) => (Number(b) || 0) - (Number(a) || 0))
    .slice(0, 5)
    .map(([topic, score]) => ({
      topic,
      score: Number(score) || 0
    }))

  const COLORS = ['#FF8042', '#00C49F', '#FFBB28']

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metric Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Sentiment Distribution Pie Chart */}
          <div>
            <h3 className="text-sm font-medium mb-2">Sentiment Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string, props: any) => {
                    const entry = props.payload
                    return [
                      <div key="tooltip" className="space-y-1">
                        <div>Percentage: {value.toFixed(1)}%</div>
                        <div>Count: {entry.count}</div>
                        <div>Score: {entry.score.toFixed(3)}</div>
                      </div>,
                      name
                    ]
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Topics */}
          <div>
            <h3 className="text-sm font-medium mb-2">Top Topics</h3>
            <div className="grid grid-cols-1 gap-2">
              {topTopics.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 bg-secondary/20 rounded-lg"
                >
                  <span className="text-sm">{item.topic}</span>
                  <span className="text-sm font-medium">{item.score.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Confidence Score */}
          <div>
            <h3 className="text-sm font-medium mb-2">Confidence Score</h3>
            <div className="p-3 bg-secondary/20 rounded-lg">
              <p className="text-2xl font-semibold">
                {((sentimentData?.confidence ?? 0) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 