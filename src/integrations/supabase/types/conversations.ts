import { Json } from './base';

export interface ConversationsTable {
  Row: {
    id: string
    profile_id: string | null
    message: string
    is_user: boolean
    timestamp: string | null
    context_type: string | null
    metadata: Json | null
    emotional_context: Json | null
    conversation_style: Database['public']['Enums']['conversation_style'] | null
  }
  Insert: {
    id?: string
    profile_id?: string | null
    message: string
    is_user: boolean
    timestamp?: string | null
    context_type?: string | null
    metadata?: Json | null
    emotional_context?: Json | null
    conversation_style?: Database['public']['Enums']['conversation_style'] | null
  }
  Update: {
    id?: string
    profile_id?: string | null
    message?: string
    is_user?: boolean
    timestamp?: string | null
    context_type?: string | null
    metadata?: Json | null
    emotional_context?: Json | null
    conversation_style?: Database['public']['Enums']['conversation_style'] | null
  }
}

export interface RelationshipEvolutionTable {
  Row: {
    id: string
    profile_id: string | null
    stage: string | null
    connection_style: string | null
    chemistry_level: number | null
    shared_moments: Json | null
    interaction_preferences: Json | null
    last_interaction: string | null
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    id?: string
    profile_id?: string | null
    stage?: string | null
    connection_style?: string | null
    chemistry_level?: number | null
    shared_moments?: Json | null
    interaction_preferences?: Json | null
    last_interaction?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
  Update: {
    id?: string
    profile_id?: string | null
    stage?: string | null
    connection_style?: string | null
    chemistry_level?: number | null
    shared_moments?: Json | null
    interaction_preferences?: Json | null
    last_interaction?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
}