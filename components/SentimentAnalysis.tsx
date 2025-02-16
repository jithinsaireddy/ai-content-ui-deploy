import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import { SentimentAnalysisProps } from "@/lib/types"

export default function SentimentAnalysis({ data }: SentimentAnalysisProps) {
  // Parse the metrics JSON if it's a string
  const metricsData = typeof data === 'string' ? JSON.parse(data) : data
  const sentimentData = metricsData?.sentiment

  const chartData = [
    { 
      name: "Negative", 
      value: sentimentData?.distribution?.percentages?.negative ?? 0 
    },
    { 
      name: "Very Positive", 
      value: sentimentData?.distribution?.percentages?.very_positive ?? 0 
    },
    { 
      name: "Positive", 
      value: sentimentData?.distribution?.percentages?.positive ?? 0 
    },
  ].filter(item => item.value > 0) // Only show segments with values

  const COLORS = ["#FF8042", "#00C49F", "#FFBB28"]

  if (!chartData.length) {
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
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <p>Confidence: {((sentimentData?.confidence ?? 0) * 100).toFixed(2)}%</p>
        </div>
      </CardContent>
    </Card>
  )
}

