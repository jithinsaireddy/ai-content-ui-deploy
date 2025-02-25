"use client"

import { useState } from 'react'
import { Star, StarHalf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { submitFeedback } from '@/lib/api/feedback'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface ContentFeedbackProps {
  contentId: number
  onFeedbackSubmitted?: () => void
}

export function ContentFeedback({ contentId, onFeedbackSubmitted }: ContentFeedbackProps) {
  const [rating, setRating] = useState(0)
  const [comments, setComments] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const { toast } = useToast()

  const handleRatingClick = (newRating: number) => {
    setRating(newRating)
    setIsExpanded(true)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      await submitFeedback({
        contentId,
        rating,
        comments
      })
      
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
        duration: 3000,
      })
      
      setRating(0)
      setComments('')
      setIsExpanded(false)
      onFeedbackSubmitted?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-lg">How helpful was this content?</CardTitle>
        <CardDescription>Your feedback helps us improve our content generation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleRatingClick(value)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "w-8 h-8 transition-colors",
                  value <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>
        {isExpanded && (
          <div className="space-y-4">
            <Textarea
              placeholder="Share your thoughts about this content..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        )}
      </CardContent>
      {isExpanded && (
        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
