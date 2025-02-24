export interface SensitivityAnalysis {
  sensitivityScore: number;
  confidence: number;
  warnings: string[];
  suggestions: string[];
}

export interface Predictions {
  engagementScore: number;
  predictedTrends: string[];
  growthPotential: number;
  recommendedActions: string[];
  confidence: number;
  modelWeight: number;
}

export interface RegionalResponse {
  content: string;
  sensitivityAnalysis: SensitivityAnalysis;
  predictions: Predictions;
}

export interface LocalizationResponse {
  [region: string]: RegionalResponse;
}
