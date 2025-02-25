import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from "react-markdown"
import { useState, useMemo } from "react"
import { ContentFeedback } from "./ContentFeedback"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ContentPreviewProps {
  content: string
  title?: string
  onContentChange?: (content: string) => void
  contentId?: number
}

export default function ContentPreview({ content, title, onContentChange, contentId = 1 }: ContentPreviewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const [showFeedback, setShowFeedback] = useState(false)

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

  const handleApply = () => {
    onContentChange?.(editedContent)
    setIsEditing(false)
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
            >
              Apply Changes
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleStartEditing}
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
