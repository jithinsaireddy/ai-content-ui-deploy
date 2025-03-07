import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ExternalLink } from "lucide-react"

interface KeywordData {
  keyword: string
  source: string
  frequency: number
}

interface KeywordOptimizationProps {
  data: string
}

export default function KeywordOptimization({ data }: KeywordOptimizationProps) {
  const parsedData = JSON.parse(data)
  
  // Parse the keyword section to extract keywords and sources
  const keywordSection = Object.keys(parsedData.keyword_frequency)[0]
  const keywordLines = keywordSection?.split('\\n').filter(line => line.includes('**')) || []
  
  const keywords: KeywordData[] = keywordLines.map(line => {
    const keywordMatch = line.match(/\*\*(.*?)\*\*/)
    const sourceMatch = line.match(/\*Source: (.*?)\*/)
    return {
      keyword: keywordMatch ? keywordMatch[1] : '',
      source: sourceMatch ? sourceMatch[1] : '',
      frequency: 1 // Using default frequency since actual frequencies are normalized
    }
  })

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-500"
    if (score >= 0.6) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 0.8) return "bg-green-500"
    if (score >= 0.6) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Keyword Optimization
          <Badge className={getScoreBadge(parsedData.natural_usage)}>
            {(parsedData.natural_usage * 100).toFixed(0)}% Natural Usage
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Optimization Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Keyword Placement</div>
            <div className="flex items-center gap-2">
              <Progress value={parsedData.keyword_placement * 100} className="flex-1" />
              <span className={`text-sm font-bold ${getScoreColor(parsedData.keyword_placement)}`}>
                {(parsedData.keyword_placement * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Keyword Density</div>
            <div className="flex items-center gap-2">
              <Progress value={parsedData.keyword_density * 100000} className="flex-1" />
              <span className={`text-sm font-bold ${getScoreColor(parsedData.keyword_density * 1000)}`}>
                {(parsedData.keyword_density * 100).toFixed(3)}%
              </span>
            </div>
          </div>
        </div>

        {/* Keywords List */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold mb-3">Primary Keywords & Sources</h3>
          <div className="space-y-2">
            {keywords.map((item, index) => (
              <div key={index} className="flex items-start justify-between p-2 bg-secondary/5 rounded-lg">
                <div>
                  <div className="font-medium">{item.keyword}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    {item.source}
                  </div>
                </div>
                <Badge variant="outline" className="ml-2">
                  Used
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution Chart */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Keyword Distribution</h3>
          <div className="h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ name: 'Distribution', value: parsedData.keyword_distribution[Object.keys(parsedData.keyword_distribution)[0]] }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
