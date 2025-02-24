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

export interface ContentStructure {
  link_consistency_score: number
  formatting_consistency_score: number
  heading_count: number
  heading_levels_used: number
  list_consistency_score: number
  avg_paragraph_length: number
  emphasis_consistency_score: number
  paragraph_count: number
  paragraph_distribution_score: number
  heading_hierarchy_score: number
  overall_structure_score: number
}

export interface ReadabilityScore {
  total_words: number
  avg_word_length: number
  readability_level: string
  paragraph_coherence: number
  avg_sentence_length: number
  total_sentences: number
  flesch_reading_ease: number
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

export interface QualityAnalysis {
  qualityScore: number
  clarity: number
  engagement: number
  value: number
  recommendations: string[]
}

export interface Content {
  id: number
  contentStructure: string
  readabilityScore: string
  contentBody: string
  metrics: string
  stanfordSentiment?: string
  seoSuggestions?: string
  abTestResults?: string
  qualityAnalysis?: QualityAnalysis
  [key: string]: any
}

export interface MetricSummaryData {
  sentiment: MetricSentiment
  content: Content
}

export interface MetricSummaryProps {
  data: string | MetricSummaryData
}