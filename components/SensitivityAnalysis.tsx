import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { SensitivityAnalysisProps } from "@/lib/types"

export default function SensitivityAnalysis({ data }: SensitivityAnalysisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cultural Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Sensitivity Score</p>
              <p className="text-2xl font-semibold">{(data.sensitivityScore * 100).toFixed(0)}%</p>
            </div>
            <div className="p-3 bg-secondary/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Confidence</p>
              <p className="text-2xl font-semibold">{(data.confidence * 100).toFixed(0)}%</p>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="warnings">
              <AccordionTrigger className="text-destructive">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Content Warnings</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {data.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-destructive" />
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="suggestions">
              <AccordionTrigger className="text-primary">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Improvement Suggestions</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {data.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  )
}

