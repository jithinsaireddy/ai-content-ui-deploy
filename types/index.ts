export interface TrendAnalysisData {
  timeDecay: number
  engagement: number
  marketPotential: number
  competitor: number
  seasonality: number
  relevance: number
  virality: number
  momentum: number
}

export interface PerformancePredictionData {
  overallScore: number
  estimatedEngagement: {
    shares: number
    comments: number
    clicks: number
    likes: number
  }
  predictedMetrics: {
    reach: number
    impressions: number
    roi: number
    conversion: number
  }
}

export interface EngagementPredictionData {
  score: number
  confidence: number
  factors: string[]
}

export interface SentimentData {
  confidence: number
  distribution: {
    counts: {
      negative: number
      very_positive: number
      positive: number
    }
    percentages: {
      negative: number
      very_positive: number
      positive: number
    }
  }
}

export interface SensitivityAnalysisData {
  sensitivityScore: number
  warnings: string[]
  suggestions: string[]
  confidence: number
}

export interface ContentData {
  trendAnalysis: TrendAnalysisData
  performancePrediction: PerformancePredictionData
  engagementPrediction: EngagementPredictionData
  sentiment: SentimentData
  sensitivityAnalysis: SensitivityAnalysisData
  content: {
    contentBody: string
  }
}

