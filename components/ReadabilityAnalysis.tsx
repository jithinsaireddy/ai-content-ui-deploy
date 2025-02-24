import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

interface ReadabilityProps {
  data: {
    total_words: number
    avg_word_length: number
    readability_level: string
    paragraph_coherence: number
    avg_sentence_length: number
    total_sentences: number
    flesch_reading_ease: number
  }
}

function ReadabilityIndicator({ score }: { score: number }) {
  // Flesch reading ease score ranges
  const getColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    if (score >= 30) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Reading Ease</span>
        <span className="text-sm font-semibold">{score.toFixed(1)}</span>
      </div>
      <div className="relative w-full h-2 bg-secondary/20 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${getColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {score >= 80 ? "Very Easy" :
         score >= 60 ? "Easy" :
         score >= 30 ? "Difficult" : "Very Difficult"} to read
      </p>
    </div>
  )
}

export default function ReadabilityAnalysis({ data }: ReadabilityProps) {
  const coherencePercentage = data.paragraph_coherence * 100

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Readability Analysis</CardTitle>
        <Badge 
          variant={data.readability_level === "Very Difficult" ? "destructive" : "default"}
          className="font-normal"
        >
          {data.readability_level}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <h4 className="text-sm text-muted-foreground mb-1">Words</h4>
              <p className="text-2xl font-semibold">{data.total_words}</p>
              <p className="text-xs text-muted-foreground">
                Avg. {data.avg_word_length.toFixed(1)} letters each
              </p>
            </div>
            <div className="p-3 bg-secondary/20 rounded-lg">
              <h4 className="text-sm text-muted-foreground mb-1">Sentences</h4>
              <p className="text-2xl font-semibold">{data.total_sentences}</p>
              <p className="text-xs text-muted-foreground">
                Avg. {data.avg_sentence_length.toFixed(1)} words each
              </p>
            </div>
          </div>

          {/* Reading Ease Score */}
          <ReadabilityIndicator score={data.flesch_reading_ease} />

          {/* Coherence Score */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Paragraph Coherence</span>
              <span className="text-sm font-semibold">{coherencePercentage.toFixed(1)}%</span>
            </div>
            <div className="relative w-full h-2 bg-secondary/20 rounded-full overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                  coherencePercentage >= 50 ? "bg-green-500" : "bg-orange-500"
                }`}
                style={{ width: `${coherencePercentage}%` }}
              />
            </div>
            {coherencePercentage < 50 && (
              <div className="flex items-center gap-2 text-xs text-orange-500">
                <AlertCircle className="h-4 w-4" />
                <span>Consider improving paragraph transitions</span>
              </div>
            )}
          </div>

          {/* Reading Time Estimate */}
          <div className="p-3 bg-secondary/20 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Estimated Reading Time</h4>
            <p className="text-2xl font-semibold">
              {Math.ceil(data.total_words / 200)} min
            </p>
            <p className="text-xs text-muted-foreground">
              Based on average reading speed of 200 words/minute
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
