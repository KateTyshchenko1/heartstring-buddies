export interface InteractionMetrics {
  flirtLevel: number;      // 1-10 scale
  charmFactor: number;     // 1-10 scale
  wittyExchanges: number;
  energyLevel: 'playful' | 'chill' | 'excited' | 'romantic' | 'intellectual';
  connectionStyle: string;
}

export interface ChatResponse {
  response: string;
  metrics: InteractionMetrics;
}