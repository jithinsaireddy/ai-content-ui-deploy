export interface LocalizationUser {
  id: number;
}

export interface LocalizationRequest {
  title: string;
  contentBody: string;
  language: string;
  category: string;
  description: string;
  user: LocalizationUser;
  metrics: string;
  seoMetadata: string;
  targetRegions: string[];
  enableRealTimeMonitoring: boolean;
}

export interface LocalizationMetrics {
  audience: string;
  tone: string;
}

export interface SeoMetadata {
  keywords: string[];
  focus: string;
}
