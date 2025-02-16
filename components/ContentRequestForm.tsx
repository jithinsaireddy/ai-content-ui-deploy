import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useContentData } from "@/hooks/useContentData"

interface ContentRequest {
  title: string
  contentType: string
  topic: string
  emotionalTone: string
  keywords: string
  contentLength: string
  targetAudience: string
  category: string
  writingStyle: string
  optimizeForSeo: boolean
  region: string
  metadata: {
    includeTrends: boolean
    includeStatistics: boolean
    includeExpertQuotes: boolean
    formatType: string
    researchDepth: string
  }
}

interface ContentRequestFormProps {
  onSubmit: (data: ContentRequest, generatedContent: any, useMockData: boolean) => void
}

const SelectorGroup = ({
  name,
  options,
  value,
  onChange,
}: { name: string; options: string[]; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div className="flex space-x-2 bg-secondary rounded-md p-1">
    {options.map((option) => (
      <Label
        key={option}
        className={`flex-1 text-center py-1 px-2 rounded cursor-pointer ${
          value === option.toLowerCase() ? "bg-primary text-primary-foreground" : "hover:bg-secondary-foreground/10"
        }`}
      >
        <input
          type="radio"
          name={name}
          value={option.toLowerCase()}
          checked={value === option.toLowerCase()}
          onChange={onChange}
          className="sr-only"
        />
        {option}
      </Label>
    ))}
  </div>
)

export default function ContentRequestForm({ onSubmit }: ContentRequestFormProps) {
  const { toast } = useToast()
  const { generateContent, loading: isLoading } = useContentData()
  const [request, setRequest] = useState<ContentRequest>({
    title: "",
    contentType: "article",
    topic: "",
    emotionalTone: "optimistic",
    keywords: "",
    contentLength: "medium",
    targetAudience: "",
    writingStyle: "professional",
    optimizeForSeo: true,
    category: "general",
    region: "global",
    metadata: {
      includeTrends: false,
      includeStatistics: false,
      includeExpertQuotes: false,
      formatType: "standard",
      researchDepth: "medium"
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setRequest((prev) => ({
      ...prev,
      [name]: type === "radio" ? value : (e.target as HTMLInputElement | HTMLTextAreaElement).value,
    }))
  }

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setRequest((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const generatedContent = await generateContent(request)
      onSubmit(request, generatedContent, false)
      toast({
        title: "Success",
        description: "Content generated successfully",
      })
    } catch (error) {
      console.error('Error generating content:', error)
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleMockSubmit = async () => {
    try {
      onSubmit(request, null, true)
      toast({
        title: "Success",
        description: "Mock content generated successfully",
      })
    } catch (error) {
      console.error('Error generating mock content:', error)
      toast({
        title: "Error",
        description: "Failed to generate mock content. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={request.title} onChange={handleChange} placeholder="Enter title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              name="topic"
              value={request.topic}
              onChange={handleChange}
              placeholder="Enter main topic"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              name="keywords"
              value={request.keywords}
              onChange={handleChange}
              placeholder="Enter keywords (comma-separated)"
            />
          </div>

          <div className="space-y-2">
            <Label>Content Type</Label>
            <SelectorGroup
              name="contentType"
              options={["Article", "Blog Post", "Whitepaper"]}
              value={request.contentType}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Content Length</Label>
            <SelectorGroup
              name="contentLength"
              options={["Short", "Medium", "Long"]}
              value={request.contentLength}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Emotional Tone</Label>
            <SelectorGroup
              name="emotionalTone"
              options={["Optimistic", "Neutral", "Cautious"]}
              value={request.emotionalTone}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Writing Style</Label>
            <SelectorGroup
              name="writingStyle"
              options={["Professional", "Casual", "Academic"]}
              value={request.writingStyle}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              name="targetAudience"
              value={request.targetAudience}
              onChange={handleChange}
              placeholder="Enter target audience"
            />
          </div>

          <div className="md:col-span-2 flex justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="optimizeForSeo"
                checked={request.optimizeForSeo}
                onCheckedChange={handleSwitchChange("optimizeForSeo")}
              />
              <Label htmlFor="optimizeForSeo">Optimize for SEO</Label>
            </div>

            <div className="flex items-center gap-4">
              <Button type="button" variant="secondary" onClick={handleMockSubmit}>
                Generate Mock Content
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Generating..." : "Generate Content"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

