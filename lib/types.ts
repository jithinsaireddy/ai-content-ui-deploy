export interface TrendAnalysis {
  timeDecay: number
  engagement: number
  marketPotential: number
  competitor: number
  seasonality: number
  relevance: number
  virality: number
  momentum: number
}

export interface EngagementPrediction {
  score: number
  confidence: number
  factors: string[]
}

export interface PerformancePrediction {
  userFeedback: any[]
  feedbackAnalysis: {
    sentimentAnalysis: Record<string, any>
    ratingDistribution: Record<string, any>
    feedbackThemes: Record<string, any>
    successFactors: Record<string, any>
  }
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
  recommendations: string[]
}

export interface SensitivityAnalysis {
  sensitivityScore: number
  warnings: string[]
  suggestions: string[]
  confidence: number
}

export interface SentimentAnalysis {
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

export interface ContentAnalysis {
  trendAnalysis: TrendAnalysis
  engagementPrediction: EngagementPrediction
  performancePrediction: PerformancePrediction
  sensitivityAnalysis: SensitivityAnalysis
  content: {
    contentBody: string
    analyzedSentiment: SentimentAnalysis
  }
}

// Props interfaces for components
export interface TrendAnalysisProps {
  data: TrendAnalysis
}

export interface EngagementPredictionProps {
  data: EngagementPrediction
}

export interface PerformancePredictionProps {
  data: PerformancePrediction
}

export interface SensitivityAnalysisProps {
  data: SensitivityAnalysis
}

export interface SentimentAnalysisProps {
  data: SentimentAnalysis
}


export interface MetricSentiment {
  confidence: number
  distribution: {
    counts: {
      negative: number
      very_positive: number
      positive: number
    }
    weighted_scores: {
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
  topic_analysis: Record<string, number>
}

export interface MetricSummaryData {
  sentiment: MetricSentiment
}

export interface MetricSummaryProps {
  data: string | MetricSummaryData
} 