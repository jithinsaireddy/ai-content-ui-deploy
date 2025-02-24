"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useLocalization } from "@/hooks/useLocalization"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { LocalizationRequest } from "@/lib/types/localization"

interface LocalizationRequestFormProps {
  onSubmit: (request: LocalizationRequest, result: any) => void
}

export default function LocalizationRequestForm({ onSubmit }: LocalizationRequestFormProps) {
  const { toast } = useToast()
  const { localizeContent, loading: isLoading } = useLocalization()
  const [request, setRequest] = useState<LocalizationRequest>({
    title: "",
    contentBody: "",
    language: "en",
    category: "TECHNOLOGY",
    description: "",
    user: { id: 1 },
    metrics: JSON.stringify({
      audience: "tech-savvy professionals",
      tone: "professional"
    }),
    seoMetadata: JSON.stringify({
      keywords: ["AI", "artificial intelligence", "future technology"],
      focus: "AI impact"
    }),
    targetRegions: ["ES", "FR"],
    enableRealTimeMonitoring: true
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setRequest(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRegionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regions = e.target.value.split(",").map(r => r.trim().toUpperCase())
    setRequest(prev => ({
      ...prev,
      targetRegions: regions
    }))
  }

  const handleMonitoringChange = (checked: boolean) => {
    setRequest(prev => ({
      ...prev,
      enableRealTimeMonitoring: checked
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await localizeContent(request)
      onSubmit(request, result)
      toast({
        title: "Success",
        description: "Content localization request submitted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit localization request",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Content Localization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={request.title}
              onChange={handleChange}
              placeholder="Enter content title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentBody">Content</Label>
            <Textarea
              id="contentBody"
              name="contentBody"
              value={request.contentBody}
              onChange={handleChange}
              placeholder="Enter your content here"
              className="min-h-[200px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={request.description}
              onChange={handleChange}
              placeholder="Brief description of the content"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={request.category}
              onChange={handleChange}
              placeholder="e.g., TECHNOLOGY"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetRegions">Target Regions (comma-separated)</Label>
            <Input
              id="targetRegions"
              name="targetRegions"
              value={request.targetRegions.join(", ")}
              onChange={handleRegionsChange}
              placeholder="e.g., ES, FR, DE"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="monitoring"
              checked={request.enableRealTimeMonitoring}
              onCheckedChange={handleMonitoringChange}
            />
            <Label htmlFor="monitoring">Enable Real-time Monitoring</Label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Localizing..." : "Localize Content"}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
