"use client"

import { useEffect, useState } from 'react'
import { useTrends } from '@/hooks/useTrends'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function TrendsPage() {
  const { data, loading, error, fetchTrends } = useTrends()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchCategory, setSearchCategory] = useState<string>("");
  
  useEffect(() => {
    if (searchCategory) {
      fetchTrends(searchCategory);
    } else {
      fetchTrends();
    }
  }, [searchCategory])

  const categories = data?.trends 
    ? Array.from(new Set(data.trends.map(trend => trend.category)))
    : []

  const filteredTrends = data?.trends?.filter(trend => 
    selectedCategory === "all" || trend.category === selectedCategory
  ) || []

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Trending Topics</h1>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Input
            placeholder="Search by category (e.g., technology)"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="max-w-xs"
          />
          <Button 
            variant="outline" 
            onClick={() => setSearchCategory("")}
            disabled={!searchCategory}
          >
            Clear
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>
            All
          </TabsTrigger>
          {categories.map(category => (
            <TabsTrigger 
              key={category} 
              value={category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-4">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[250px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-[200px] mb-2" />
                <Skeleton className="h-4 w-[150px]" />
              </CardContent>
            </Card>
          ))
        ) : (
          <ScrollArea className="h-[800px]">
            {filteredTrends.map(trend => (
              <Card key={trend.id} className="mb-4">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">
                      <a 
                        href={trend.metadata.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-blue-500"
                      >
                        {trend.topic}
                      </a>
                    </CardTitle>
                    <Badge variant={trend.trendPattern === "STEADY_RISE" ? "default" : "secondary"}>
                      {trend.trendPattern}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Score: {trend.score.toFixed(3)}</span>
                      <span>•</span>
                      <span>Confidence: {(trend.confidenceScore * 100).toFixed(0)}%</span>
                      <span>•</span>
                      <span>{trend.metadata.timeAgo}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span>💬 {trend.metadata.comments} comments</span>
                      <span>•</span>
                      <span>👍 {trend.metadata.points} points</span>
                      <span>•</span>
                      <span>Source: {trend.metadata.source}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        )}
      </div>
    </div>
  )
}
