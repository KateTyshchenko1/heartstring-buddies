import { Json } from './base';

export interface ProfilesTable {
  Row: {
    id: string
    email: string
    created_at: string
    updated_at: string
    questionnaire_completed: boolean | null
  }
  Insert: {
    id: string
    email: string
    created_at?: string
    updated_at?: string
    questionnaire_completed?: boolean | null
  }
  Update: {
    id?: string
    email?: string
    created_at?: string
    updated_at?: string
    questionnaire_completed?: boolean | null
  }
}

export interface CompanionProfilesTable {
  Row: {
    id: string
    profile_id: string | null
    name: string
    age: string | null
    occupation: string | null
    location: string | null
    personality: string | null
    interests: string | null
    fun_fact: string | null
    created_at: string | null
    updated_at: string | null
    personality_insights: Json | null
    interaction_metrics: Json | null
  }
  Insert: {
    id?: string
    profile_id?: string | null
    name: string
    age?: string | null
    occupation?: string | null
    location?: string | null
    personality?: string | null
    interests?: string | null
    fun_fact?: string | null
    created_at?: string | null
    updated_at?: string | null
    personality_insights?: Json | null
    interaction_metrics?: Json | null
  }
  Update: {
    id?: string
    profile_id?: string | null
    name?: string
    age?: string | null
    occupation?: string | null
    location?: string | null
    personality?: string | null
    interests?: string | null
    fun_fact?: string | null
    created_at?: string | null
    updated_at?: string | null
    personality_insights?: Json | null
    interaction_metrics?: Json | null
  }
}