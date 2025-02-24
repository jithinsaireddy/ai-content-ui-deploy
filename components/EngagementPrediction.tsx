import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Gauge } from "@/components/ui/gauge"
import { Sparkles, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react'
import { EngagementPredictionProps } from "@/lib/types"

export default function EngagementPrediction({ data }: EngagementPredictionProps) {
  const score = (data?.score ?? 0) * 100
  const confidence = (data?.confidence ?? 0) * 100

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-blue-500"
    if (score >= 50) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 70) return "Good"
    if (score >= 50) return "Fair"
    return "Poor"
  }

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return <CheckCircle2 className="h-5 w-5 text-green-500" />
    if (confidence >= 60) return <CheckCircle2 className="h-5 w-5 text-blue-500" />
    return <AlertCircle className="h-5 w-5 text-yellow-500" />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Engagement Prediction
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1 ${getScoreColor(score)}`}
          >
            <TrendingUp className="h-4 w-4" />
            {getScoreLabel(score)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Score Gauge */}
          <div className="flex items-center justify-center py-4">
            <Gauge value={score} size="lg" showValue label="Engagement Score" />
          </div>

          {/* Confidence Level */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getConfidenceIcon(confidence)}
                <span className="text-sm font-medium">Prediction Confidence</span>
              </div>
              <span className="text-sm font-bold">{confidence.toFixed(1)}%</span>
            </div>
            <Progress value={confidence} className="h-2" />
          </div>

          {/* Key Factors */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Success Factors</h4>
            <div className="grid gap-2">
              {data?.factors?.map((factor, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-2 bg-secondary/20 p-2 rounded-md"
                >
                  <div className="mt-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="text-sm">{factor}</span>
                </div>
              )) ?? (
                <div className="text-sm text-muted-foreground">No factors available</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
