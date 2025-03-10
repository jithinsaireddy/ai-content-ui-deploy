import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from "react-markdown"
import { useState, useMemo } from "react"
import { ContentFeedback } from "./ContentFeedback"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
  editedContent?: string
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

interface ContentPreviewProps {
  content: string
  title?: string
  onContentChange?: (content: string, request?: ContentRequest) => void
  contentId?: number
  request?: ContentRequest
}

export default function ContentPreview({ content, title, onContentChange, contentId = 1, request }: ContentPreviewProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const parsedContent = useMemo(() => {
    if (!title) return content

    const pattern = new RegExp(`${title}:`)
    const parts = content.split(pattern)
    if (parts.length !== 2) return content

    // Return only the actual response part
    return parts[1].trim()
  }, [content, title])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value)
  }

  const handleApply = async () => {
    try {
      setIsRegenerating(true)
      if (request) {
        // If we have the original request, create a new request with edited content
        const updatedRequest = {
          ...request,
          editedContent: editedContent
        }
        await onContentChange?.(editedContent, updatedRequest)
        toast({
          title: "Content Updated",
          description: "Your changes have been applied and content has been regenerated."
        })
      } else {
        // If no request object, just update the content without regeneration
        await onContentChange?.(editedContent)
        toast({
          title: "Changes Applied",
          description: "Your changes have been saved successfully."
        })
      }
      setIsEditing(false)
    } catch (error) {
      console.error('Error applying changes:', error)
      toast({
        title: "Error",
        description: "Failed to apply changes. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleStartEditing = () => {
    setEditedContent(content)
    setIsEditing(true)
  }

  return (
    <Card className="md:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <div className="flex gap-2">
          {isEditing && (
            <Button 
              variant="default" 
              size="sm"
              onClick={handleApply}
              disabled={isRegenerating}
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Regenerating...</span>
                </>
              ) : (
                'Apply Changes'
              )}
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleStartEditing}
            disabled={isRegenerating}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Give Feedback
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Content Feedback</DialogTitle>
                <DialogDescription>
                  Help us improve our content generation by providing your feedback.
                </DialogDescription>
              </DialogHeader>
              <ContentFeedback 
                contentId={contentId} 
                onFeedbackSubmitted={() => setShowFeedback(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={handleContentChange}
            className="min-h-[200px] font-mono"
          />
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{parsedContent}</ReactMarkdown>
          </div>
        )}
        {!isEditing && !showFeedback && (
          <div className="mt-6">
            <ContentFeedback 
              contentId={contentId}
              onFeedbackSubmitted={() => setShowFeedback(false)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
