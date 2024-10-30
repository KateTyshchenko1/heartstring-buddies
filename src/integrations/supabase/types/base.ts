export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: ProfilesTable
      companion_profiles: CompanionProfilesTable
      conversations: ConversationsTable
      questionnaire_responses: QuestionnaireResponsesTable
      questions: QuestionsTable
      relationship_evolution: RelationshipEvolutionTable
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      conversation_style: 'flirty' | 'witty' | 'playful' | 'charming' | 'mysterious' | 'intellectual' | 'supportive'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}