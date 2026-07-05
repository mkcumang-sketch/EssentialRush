export interface SeoMetrics {
  healthScore: number;
  totalIndexed: number;
  crawlErrors: number;
  organicTraffic: number;
  authorityScore: number;
  coreVitalsLcp: number;
  coreVitalsFid: number;
  coreVitalsCls: number;
}

export interface AiGenerateRequest {
  type: 'meta' | 'schema' | 'content';
  target: string;
  context: string;
  keyword?: string;
}

export interface AiGenerateResponse {
  success: boolean;
  data: any;
  error?: string;
}