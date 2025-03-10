import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SeoData {
  keywords: string[]
  title_suggestions: string[]
  meta_description: string[]
  content_suggestions: string[]
}

interface SeoSuggestionsProps {
  data: string
}

export default function SeoSuggestions({ data }: SeoSuggestionsProps) {
  let seoData: SeoData = {
    keywords: [],
    title_suggestions: [],
    meta_description: [],
    content_suggestions: []
  }

  try {
    // Parse the outer JSON structure (seoSuggestions)
    let parsedData = JSON.parse(data);
    
    // Parse the rawSuggestions string
    if (typeof parsedData.seoSuggestions === 'string') {
      parsedData = JSON.parse(parsedData.seoSuggestions);
    }

    // If we have rawSuggestions as a string (from markdown), parse it
    if (typeof parsedData.rawSuggestions === 'string') {
      // Remove markdown code blocks and parse the JSON
      const cleanJson = parsedData.rawSuggestions.replace(/```json\n|```/g, '').trim();
      try {
        parsedData = JSON.parse(cleanJson);
      } catch (error) {
        console.error('Error parsing rawSuggestions:', error);
        throw error;
      }
    }

    // Assign data with fallbacks, using lowercase field names from backend
    seoData = {
      keywords: Array.isArray(parsedData.Keywords) ? parsedData.Keywords : [],
      title_suggestions: Array.isArray(parsedData["Title suggestions"]) ? parsedData["Title suggestions"] : [],
      meta_description: Array.isArray(parsedData["Meta description"]) ? parsedData["Meta description"] : [],
      content_suggestions: Array.isArray(parsedData["Content suggestions"]) ? parsedData["Content suggestions"] : []
    };
  } catch (error) {
    console.error('Error parsing SEO data:', error);
    // Use empty arrays as fallback
    seoData = {
      keywords: [],
      title_suggestions: [],
      meta_description: [],
      content_suggestions: []
    };
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
            {seoData?.keywords?.map((keyword, index) => (
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
            {seoData?.title_suggestions?.map((title, index) => (
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
            {seoData?.meta_description?.map((desc, index) => (
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
            {seoData?.content_suggestions?.map((suggestion, index) => (
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
