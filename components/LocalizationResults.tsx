"use client"

import { LocalizationResponse } from "@/lib/types/localizationResponse"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface LocalizationResultsProps {
  results: LocalizationResponse
}

export default function LocalizationResults({ results }: LocalizationResultsProps) {
  const regions = Object.keys(results)

  return (
    <div className="space-y-6">
      <Tabs defaultValue={regions[0]} className="w-full">
        <TabsList className="w-full justify-start">
          {regions.map(region => (
            <TabsTrigger key={region} value={region}>
              {region}
            </TabsTrigger>
          ))}
        </TabsList>

        {regions.map(region => {
          const data = results[region]
          return (
            <TabsContent key={region} value={region} className="space-y-4">
              {/* Content Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Localized Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert">
                    {data.content}
                  </div>
                </CardContent>
              </Card>

              {/* Sensitivity Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Sensitivity Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sensitivity Score</span>
                      <span>{(data.sensitivityAnalysis.sensitivityScore * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={data.sensitivityAnalysis.sensitivityScore * 100} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Confidence</span>
                      <span>{(data.sensitivityAnalysis.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={data.sensitivityAnalysis.confidence * 100} />
                  </div>
                </CardContent>
              </Card>

              {/* Predictions */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Predictions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Engagement Score</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">
                          {(data.predictions.engagementScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Growth Potential</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">
                          {(data.predictions.growthPotential * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Predicted Trends */}
                  <div className="space-y-2">
                    <h3 className="font-medium">Predicted Trends</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.predictions.predictedTrends.map((trend, index) => (
                        <Badge key={index} variant="secondary">
                          {trend}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Actions */}
                  <div className="space-y-2">
                    <h3 className="font-medium">Recommended Actions</h3>
                    <ul className="list-disc pl-4 space-y-1">
                      {data.predictions.recommendedActions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Model Confidence */}
                  <div className="flex items-center justify-between border-t pt-4">
                    <span className="text-sm text-muted-foreground">Model Confidence</span>
                    <Badge variant="outline">
                      {(data.predictions.confidence * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
