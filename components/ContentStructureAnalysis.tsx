import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ContentStructureProps {
  data: {
    link_consistency_score: number
    formatting_consistency_score: number
    heading_count: number
    heading_levels_used: number
    list_consistency_score: number
    avg_paragraph_length: number
    emphasis_consistency_score: number
    paragraph_count: number
    paragraph_distribution_score: number
    heading_hierarchy_score: number
    overall_structure_score: number
  }
}

function ScoreCard({ 
  title, 
  score, 
  description 
}: { 
  title: string
  score: number
  description?: string 
}) {
  const percentage = score * 100
  const color = percentage >= 80 ? "bg-green-500" : 
                percentage >= 60 ? "bg-yellow-500" : "bg-red-500"

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-sm font-semibold">{percentage.toFixed(1)}%</span>
      </div>
      <div className="relative w-full h-2 bg-secondary/20 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

export default function ContentStructureAnalysis({ data }: ContentStructureProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Structure Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scores" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scores">Quality Scores</TabsTrigger>
            <TabsTrigger value="metrics">Structure Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="scores" className="space-y-4">
            <div className="p-4 bg-secondary/20 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Overall Score</h3>
                <span className="text-2xl font-bold">
                  {(data.overall_structure_score * 100).toFixed(1)}%
                </span>
              </div>
              <div className="relative w-full h-3 bg-secondary/20 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-500 bg-blue-500"
                  style={{ width: `${data.overall_structure_score * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-6">
              <ScoreCard 
                title="Link Consistency" 
                score={data.link_consistency_score}
                description="Consistency in link formatting and presentation"
              />
              <ScoreCard 
                title="Formatting Consistency" 
                score={data.formatting_consistency_score}
                description="Consistency in text formatting and styling"
              />
              <ScoreCard 
                title="List Consistency" 
                score={data.list_consistency_score}
                description="Consistency in list formatting and structure"
              />
              <ScoreCard 
                title="Paragraph Distribution" 
                score={data.paragraph_distribution_score}
                description="Even distribution of content across paragraphs"
              />
              <ScoreCard 
                title="Heading Hierarchy" 
                score={data.heading_hierarchy_score}
                description="Logical organization of heading levels"
              />
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/20 rounded-lg">
              <h4 className="text-sm text-muted-foreground mb-1">Headings</h4>
              <p className="text-2xl font-semibold">{data.heading_count}</p>
              <p className="text-xs text-muted-foreground">
                Using {data.heading_levels_used} levels
              </p>
            </div>

            <div className="p-4 bg-secondary/20 rounded-lg">
              <h4 className="text-sm text-muted-foreground mb-1">Paragraphs</h4>
              <p className="text-2xl font-semibold">{data.paragraph_count}</p>
              <p className="text-xs text-muted-foreground">
                ~{Math.round(data.avg_paragraph_length)} words each
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
