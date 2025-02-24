export interface TrendMetadata {
  timeAgo: string;
  comments: number;
  historicalPoints: number[];
  source: string;
  url: string;
  points: number;
}

export interface Trend {
  id: number;
  analysisTimestamp: string;
  trendScore: number;
  topic: string;
  category: string;
  confidenceScore: number;
  trendPattern: string;
  metadata: TrendMetadata;
  score: number;
}

export interface TrendsResponse {
  count: number;
  trends: Trend[];
}
