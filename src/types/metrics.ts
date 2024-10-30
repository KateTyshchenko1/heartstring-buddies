import type { Json } from "@/integrations/supabase/types/base";

export type ConversationStyle = 'flirty' | 'witty' | 'playful' | 'charming' | 'mysterious' | 'intellectual' | 'supportive';

export interface InteractionMetrics {
  flirtLevel: number;      // 1-10 scale
  charmFactor: number;     // 1-10 scale
  wittyExchanges: number;
  energyLevel: 'playful' | 'chill' | 'excited' | 'romantic' | 'intellectual';
  connectionStyle: ConversationStyle;
}

export interface ChatResponse {
  response: string;
  metrics: InteractionMetrics;
}

export type MetricsJson = {
  [K in keyof InteractionMetrics]: Json;
};