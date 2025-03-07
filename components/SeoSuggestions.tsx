import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SeoData {
  Keywords: string[]
  "Title Suggestions": string[]
  "Meta Description": string[]
  "Content Suggestions": string[]
}

interface SeoSuggestionsProps {
  data: string
}

export default function SeoSuggestions({ data }: SeoSuggestionsProps) {
  let seoData: SeoData = {
    Keywords: [],
    "Title Suggestions": [],
    "Meta Description": [],
    "Content Suggestions": []
  }

  try {
    const rawData = JSON.parse(data).rawSuggestions
    // Clean up the JSON data
    let cleanJson = rawData
      // Remove json markers and backticks
      .replace(/```json\n|```/g, '')
      // Remove any content after the last closing brace
      .replace(/}[^}]*$/g, '}')
    seoData = JSON.parse(cleanJson)
  } catch (error) {
    console.error('Error parsing SEO data:', error)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Suggestions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Keywords */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {seoData.Keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* Title Suggestions */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Title Suggestions</h3>
          <ul className="space-y-2">
            {seoData["Title Suggestions"].map((title, index) => (
              <li key={index} className="text-sm bg-secondary/10 p-2 rounded">
                {title}
              </li>
            ))}
          </ul>
        </div>

        {/* Meta Descriptions */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Meta Descriptions</h3>
          <ul className="space-y-2">
            {seoData["Meta Description"].map((desc, index) => (
              <li key={index} className="text-sm bg-secondary/10 p-2 rounded">
                {desc}
              </li>
            ))}
          </ul>
        </div>

        {/* Content Suggestions */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Content Suggestions</h3>
          <ul className="space-y-2">
            {seoData["Content Suggestions"].map((suggestion, index) => (
              <li key={index} className="text-sm bg-secondary/10 p-2 rounded flex items-start">
                <span className="mr-2">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
