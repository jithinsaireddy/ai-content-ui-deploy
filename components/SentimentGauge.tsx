import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SentimentGaugeProps {
  value: number
}

export default function SentimentGauge({ value }: SentimentGaugeProps) {
  const getSentimentLabel = (val: number) => {
    if (val >= 0.875) return "Very Positive"
    if (val >= 0.625) return "Positive"
    if (val >= 0.375) return "Neutral"
    if (val >= 0.125) return "Negative"
    return "Very Negative"
  }

  const getSentimentColor = (val: number) => {
    if (val >= 0.875) return "bg-green-500"
    if (val >= 0.625) return "bg-green-400"
    if (val >= 0.375) return "bg-yellow-400"
    if (val >= 0.125) return "bg-red-400"
    return "bg-red-500"
  }

  const getGaugeBackground = (val: number) => {
    // Create gradient stops for the gauge
    const stops = [
      { color: "bg-red-500", pos: "0%" },
      { color: "bg-red-400", pos: "25%" },
      { color: "bg-yellow-400", pos: "50%" },
      { color: "bg-green-400", pos: "75%" },
      { color: "bg-green-500", pos: "100%" },
    ]

    return (
      <div className="absolute inset-0 flex">
        {stops.map((stop, i) => (
          <div
            key={i}
            className={`flex-1 ${stop.color} ${i === 0 ? "rounded-l-full" : ""} ${
              i === stops.length - 1 ? "rounded-r-full" : ""
            }`}
          />
        ))}
      </div>
    )
  }

  // Calculate needle position (0-100%)
  const needlePosition = `${value * 100}%`

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Stanford Sentiment Analysis
          <Badge className={getSentimentColor(value)}>
            {getSentimentLabel(value)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Gauge */}
          <div className="relative h-6 rounded-full overflow-hidden">
            {/* Background gradient */}
            {getGaugeBackground(value)}
            
            {/* Needle */}
            <div 
              className="absolute top-0 h-full w-1 bg-white shadow-lg transform -translate-x-1/2 transition-all duration-700"
              style={{ left: needlePosition }}
            />
          </div>

          {/* Scale markers */}
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>Very Negative</span>
            <span>Negative</span>
            <span>Neutral</span>
            <span>Positive</span>
            <span>Very Positive</span>
          </div>

          {/* Score */}
          <div className="text-center">
            <span className="text-2xl font-bold">
              {(value * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
