export interface ContentFeedback {
  contentId: number;
  rating: number;
  comments: string;
}

export interface FeedbackResponse {
  status: number;
  message: string;
}
