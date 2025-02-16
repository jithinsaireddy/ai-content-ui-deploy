import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from "react-markdown"
import { useState, useMemo } from "react"

interface ContentPreviewProps {
  content: string
  title?: string
  onContentChange?: (content: string) => void
}

export default function ContentPreview({ content, title, onContentChange }: ContentPreviewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)

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
              Apply
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={isEditing ? () => setIsEditing(false) : handleStartEditing}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="prose max-w-none">
        {isEditing ? (
          <Textarea
            value={editedContent}
            rows={50}
            onChange={handleContentChange}
            className="min-h-[200px] font-mono"
            placeholder="Enter markdown content..."
          />
        ) : (
          <ReactMarkdown>{parsedContent}</ReactMarkdown>
        )}
      </CardContent>
    </Card>
  )
}

