export interface Competitor {
  name: string;
  estimatedSubscribers: string;
  avgViewsPerVideo: number;
  strength: string;
  topVideoTitle: string;
  whyItWorks: string;
}

export interface Recommendation {
  title: string;
  description: string;
  impactLevel: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Moderate' | 'Hard';
}

export interface AnalysisResult {
  niche: string;
  targetAudience: string;
  channelOverview: string;
  competitors: Competitor[];
  winningPatterns: string[];
  recommendations: Recommendation[];
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
}
