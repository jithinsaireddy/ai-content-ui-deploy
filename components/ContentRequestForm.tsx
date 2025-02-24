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
  desiredContentLength: string
  targetAudience: string
  category: string
  language: string
  writingStyleSample: string
  optimizeForSEO: boolean
  region: string
  metadata: {
    includeTrends: boolean
    includeStatistics: boolean
    includeExpertQuotes: boolean
    formatType: string
    researchDepth: string
    priority: string
    department: string
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
    desiredContentLength: "long",
    targetAudience: "",
    category: "technology",
    language: "en",
    writingStyleSample: "professional",
    optimizeForSEO: true,
    region: "global",
    metadata: {
      includeTrends: true,
      includeStatistics: true,
      includeExpertQuotes: true,
      formatType: "detailed",
      researchDepth: "comprehensive",
      priority: "high",
      department: "engineering"
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
            <Label htmlFor="contentType">Content Type</Label>
            <Input
              id="contentType"
              name="contentType"
              value={request.contentType}
              onChange={handleChange}
              placeholder="e.g., Article, Blog Post, Whitepaper, Newsletter, Case Study"
            />
            <div className="text-xs text-muted-foreground">
              Recommended: Article, Blog Post, Whitepaper, Newsletter, Case Study, Technical Report
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desiredContentLength">Desired Content Length</Label>
            <Input
              id="desiredContentLength"
              name="desiredContentLength"
              value={request.desiredContentLength}
              onChange={handleChange}
              placeholder="e.g., Short (500 words), Medium (1000-1500 words), Long (2000+ words)"
            />
            <div className="text-xs text-muted-foreground">
              Recommended: Short (500 words), Medium (1000-1500 words), Long (2000+ words), Custom length
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emotionalTone">Emotional Tone</Label>
            <Input
              id="emotionalTone"
              name="emotionalTone"
              value={request.emotionalTone}
              onChange={handleChange}
              placeholder="e.g., Optimistic, Professional, Enthusiastic, Balanced"
            />
            <div className="text-xs text-muted-foreground">
              Recommended: Optimistic, Professional, Enthusiastic, Balanced, Authoritative, Empathetic
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="writingStyleSample">Writing Style</Label>
            <Input
              id="writingStyleSample"
              name="writingStyleSample"
              value={request.writingStyleSample}
              onChange={handleChange}
              placeholder="e.g., Professional, Technical, Conversational, Academic"
            />
            <div className="text-xs text-muted-foreground">
              Recommended: Professional, Technical, Conversational, Academic, Journalistic, Tutorial-style
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input
              id="language"
              name="language"
              value={request.language}
              onChange={handleChange}
              placeholder="e.g., English, Spanish, French, German, Japanese"
            />
            <div className="text-xs text-muted-foreground">
              Recommended: English (en), Spanish (es), French (fr), German (de), Japanese (ja), Chinese (zh)
            </div>
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

          <div className="space-y-2">
            <Label>Category</Label>
            <SelectorGroup
              name="category"
              options={["Technology", "Healthcare", "Business", "Science"]}
              value={request.category}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Region</Label>
            <SelectorGroup
              name="region"
              options={["Global", "North America", "Europe", "Asia"]}
              value={request.region}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Metadata Options</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="optimizeForSEO"
                    checked={request.optimizeForSEO}
                    onCheckedChange={handleSwitchChange("optimizeForSEO")}
                  />
                  <Label htmlFor="optimizeForSEO">Optimize for SEO</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="includeTrends"
                    checked={request.metadata.includeTrends}
                    onCheckedChange={(checked) =>
                      setRequest((prev) => ({
                        ...prev,
                        metadata: { ...prev.metadata, includeTrends: checked },
                      }))
                    }
                  />
                  <Label htmlFor="includeTrends">Include Trends</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="includeStatistics"
                    checked={request.metadata.includeStatistics}
                    onCheckedChange={(checked) =>
                      setRequest((prev) => ({
                        ...prev,
                        metadata: { ...prev.metadata, includeStatistics: checked },
                      }))
                    }
                  />
                  <Label htmlFor="includeStatistics">Include Statistics</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="includeExpertQuotes"
                    checked={request.metadata.includeExpertQuotes}
                    onCheckedChange={(checked) =>
                      setRequest((prev) => ({
                        ...prev,
                        metadata: { ...prev.metadata, includeExpertQuotes: checked },
                      }))
                    }
                  />
                  <Label htmlFor="includeExpertQuotes">Include Expert Quotes</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="space-y-2">
                  <Label>Format Type</Label>
                  <SelectorGroup
                    name="formatType"
                    options={["Detailed", "Standard", "Brief"]}
                    value={request.metadata.formatType}
                    onChange={(e) =>
                      setRequest((prev) => ({
                        ...prev,
                        metadata: { ...prev.metadata, formatType: e.target.value },
                      }))
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Research Depth</Label>
                  <SelectorGroup
                    name="researchDepth"
                    options={["Comprehensive", "Standard", "Basic"]}
                    value={request.metadata.researchDepth}
                    onChange={(e) =>
                      setRequest((prev) => ({
                        ...prev,
                        metadata: { ...prev.metadata, researchDepth: e.target.value },
                      }))
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <SelectorGroup
                    name="priority"
                    options={["High", "Medium", "Low"]}
                    value={request.metadata.priority}
                    onChange={(e) =>
                      setRequest((prev) => ({
                        ...prev,
                        metadata: { ...prev.metadata, priority: e.target.value },
                      }))
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input
                    id="department"
                    name="department"
                    value={request.metadata.department}
                    onChange={(e) =>
                      setRequest((prev) => ({
                        ...prev,
                        metadata: { ...prev.metadata, department: e.target.value },
                      }))
                    }
                    placeholder="Enter department"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end gap-4">
            <Button type="button" variant="secondary" onClick={handleMockSubmit}>
              Generate Mock Content
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Content"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
