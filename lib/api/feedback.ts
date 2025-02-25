import { ContentFeedback, FeedbackResponse } from '../types/feedback';

export async function submitFeedback(feedback: ContentFeedback): Promise<FeedbackResponse> {
  const response = await fetch('/api/content/feedback', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedback),
  });

  if (!response.ok) {
    throw new Error('Failed to submit feedback');
  }

  return response.json();
}
