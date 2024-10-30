import type { Database } from "@/integrations/supabase/types";
import type { Json } from "@/integrations/supabase/types/base";

export type ConversationStyle = Database['public']['Enums']['conversation_style'];

export interface EmotionalContext {
  userMood?: string | null;
  conversationVibe: string;
  energyLevel: string;
  flirtFactor: number;
  wittyExchanges: boolean;
  followUpNeeded: boolean;
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  emotionalContext: EmotionalContext;
  conversationStyle?: ConversationStyle;
}

export interface ConversationData {
  id: string;
  message: string;
  is_user: boolean;
  timestamp: string | null;
  emotional_context: EmotionalContext;
  conversation_style: ConversationStyle | null;
  context_type?: string | null;
  metadata?: Json | null;
}