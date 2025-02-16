import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from "recharts"
import { EngagementPredictionProps } from "@/lib/types"

export default function EngagementPrediction({ data }: EngagementPredictionProps) {
  // Normalize the score and confidence to percentage for better visualization
  const chartData = [
    { name: "Score", value: (data?.score ?? 0) * 100 },
    { name: "Confidence", value: (data?.confidence ?? 0) * 100 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <Radar name="Value (%)" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">Key Factors:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {data?.factors?.map((factor, index) => (
                <li key={index} className="text-sm text-muted-foreground">{factor}</li>
              )) ?? (
                <li className="text-sm text-muted-foreground">No factors available</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

