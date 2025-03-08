import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SeoData {
  Keywords: string[]
  Title_suggestions: string[]
  Meta_description: string[]
  Content_suggestions: string[]
}

interface SeoSuggestionsProps {
  data: string
}

export default function SeoSuggestions({ data }: SeoSuggestionsProps) {
  let seoData: SeoData = {
    Keywords: [],
    Title_suggestions: [],
    Meta_description: [],
    Content_suggestions: []
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

    // Assign data with fallbacks, using the correct field names from backend
    seoData = {
      Keywords: Array.isArray(parsedData.Keywords) ? parsedData.Keywords : [],
      Title_suggestions: Array.isArray(parsedData.Title_suggestions) ? parsedData.Title_suggestions : [],
      Meta_description: Array.isArray(parsedData.Meta_description) ? parsedData.Meta_description : [],
      Content_suggestions: Array.isArray(parsedData.Content_suggestions) ? parsedData.Content_suggestions : []
    };
  } catch (error) {
    console.error('Error parsing SEO data:', error);
    // Use empty arrays as fallback
    seoData = {
      Keywords: [],
      Title_suggestions: [],
      Meta_description: [],
      Content_suggestions: []
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
            {seoData?.Keywords?.map((keyword, index) => (
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
            {seoData?.Title_suggestions?.map((title, index) => (
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
            {seoData?.Meta_description?.map((desc, index) => (
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
            {seoData?.Content_suggestions?.map((suggestion, index) => (
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
