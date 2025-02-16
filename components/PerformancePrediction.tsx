import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ComposedChart, Line, Legend } from "recharts"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PerformancePredictionProps } from "@/lib/types"

export default function PerformancePrediction({ data }: PerformancePredictionProps) {
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

  // Separate metrics for bar and line visualization
  const lineData = ["roi", "conversion"];
  
  // Transform data for line chart
  const transformedMetricsData = lineData.map(metric => ({
    name: metric.toUpperCase(),
    value: metric === 'roi' 
      ? (data?.predictedMetrics?.roi ?? 0) * 100 
      : (data?.predictedMetrics?.conversion ?? 0) * 100
  }));

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
                <div className="space-y-4">
                  {/* Bar Chart for Reach and Impressions */}
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value: number) => [value.toFixed(0), 'Count']} />
                      <Legend />
                      <Bar dataKey="reach" fill="#8884d8" name="Reach" />
                      <Bar dataKey="impressions" fill="#82ca9d" name="Impressions" />
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Line Chart for ROI and Conversion */}
                  <ResponsiveContainer width="100%" height={200}>
                    <ComposedChart data={transformedMetricsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Percentage', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#ff7300" 
                        name="Percentage"
                        strokeWidth={2}
                        dot={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
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

