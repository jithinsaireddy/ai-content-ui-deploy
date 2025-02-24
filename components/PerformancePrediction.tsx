import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ComposedChart, Line, Legend } from "recharts"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PerformancePredictionProps } from "@/lib/types"

export default function PerformancePrediction({ data }: PerformancePredictionProps) {
  // Helper function to format numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toFixed(0)
  }

  // Helper function to format percentages
  const formatPercentage = (num: number): string => {
    return `${(num * 100).toFixed(2)}%`
  }

  // Convert engagement metrics to percentages based on total
  const totalEngagement = (
    (data?.estimatedEngagement?.shares ?? 0) +
    (data?.estimatedEngagement?.comments ?? 0) +
    (data?.estimatedEngagement?.clicks ?? 0) +
    (data?.estimatedEngagement?.likes ?? 0)
  )

  const engagementData = [
    { metric: "Shares", value: ((data?.estimatedEngagement?.shares ?? 0) / totalEngagement) * 100 },
    { metric: "Comments", value: ((data?.estimatedEngagement?.comments ?? 0) / totalEngagement) * 100 },
    { metric: "Clicks", value: ((data?.estimatedEngagement?.clicks ?? 0) / totalEngagement) * 100 },
    { metric: "Likes", value: ((data?.estimatedEngagement?.likes ?? 0) / totalEngagement) * 100 },
  ]

  // Transform metrics data for visualization
  const reachData = [
    {
      name: "Reach",
      value: data?.predictedMetrics?.reach ?? 0,
      description: "Unique users who will see the content",
      trend: "↗",
      color: "#8884d8"
    },
    {
      name: "Impressions",
      value: data?.predictedMetrics?.impressions ?? 0,
      description: "Total number of times content will be displayed",
      trend: "↗",
      color: "#82ca9d"
    }
  ]

  const conversionData = [
    {
      name: "ROI",
      value: data?.predictedMetrics?.roi ?? 0,
      description: "Return on Investment",
      format: "multiplier",
      trend: data?.predictedMetrics?.roi > 1 ? "↗" : "↘",
      color: "#ff7300"
    },
    {
      name: "Conversion Rate",
      value: data?.predictedMetrics?.conversion ?? 0,
      description: "Percentage of users who take desired action",
      format: "percentage",
      trend: data?.predictedMetrics?.conversion > 0.01 ? "↗" : "↘",
      color: "#8884d8"
    }
  ]

  // Bar chart data
  const barData = [
    {
      metric: "Metrics",
      reach: data?.predictedMetrics?.reach ?? 0,
      impressions: data?.predictedMetrics?.impressions ?? 0,
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">
              Overall Score: {((data?.overallScore ?? 0) * 100).toFixed(1)}%
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="engagement">
              <AccordionTrigger>Estimated Engagement</AccordionTrigger>
              <AccordionContent>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={engagementData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis />
                    <Radar 
                      name="Engagement Distribution" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6} 
                    />
                    <Tooltip 
                      formatter={(value: number) => [
                        `${value.toFixed(1)}%`,
                        "Distribution"
                      ]} 
                    />
                    <Legend 
                      align="center"
                      verticalAlign="bottom"
                      height={36}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="metrics">
              <AccordionTrigger>Predicted Metrics</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-8">
                  {/* Reach Metrics */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Reach & Impressions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reachData.map((item) => (
                        <div key={item.name} className="p-4 rounded-lg bg-card border">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">{item.name}</p>
                              <p className="text-2xl font-bold" style={{ color: item.color }}>
                                {formatNumber(item.value)} <span className="text-lg">{item.trend}</span>
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      ))}
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="metric" />
                        <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                        <Tooltip 
                          formatter={(value: number) => [formatNumber(value), 'Count']} 
                          labelStyle={{ color: '#000' }}
                        />
                        <Legend />
                        <Bar dataKey="reach" fill="#8884d8" name="Reach" />
                        <Bar dataKey="impressions" fill="#82ca9d" name="Impressions" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Conversion Metrics */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Conversion Metrics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {conversionData.map((item) => (
                        <div key={item.name} className="p-4 rounded-lg bg-card border">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">{item.name}</p>
                              <p className="text-2xl font-bold" style={{ color: item.color }}>
                                {item.format === 'percentage' 
                                  ? formatPercentage(item.value)
                                  : item.format === 'multiplier'
                                    ? `${item.value.toFixed(2)}x`
                                    : item.value.toFixed(2)
                                }
                                <span className="text-lg ml-1">{item.trend}</span>
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="recommendations">
              <AccordionTrigger>Recommendations</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-1">
                  {data?.recommendations?.map((recommendation, index) => (
                    <li key={index} className="text-sm text-muted-foreground">{recommendation}</li>
                  )) ?? (
                    <li className="text-sm text-muted-foreground">No recommendations available</li>
                  )}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  )
}

