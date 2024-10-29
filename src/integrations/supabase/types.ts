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
      companion_profiles: {
        Row: {
          age: string | null
          created_at: string | null
          fun_fact: string | null
          id: string
          interests: string | null
          location: string | null
          name: string
          occupation: string | null
          personality: string | null
          profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          age?: string | null
          created_at?: string | null
          fun_fact?: string | null
          id?: string
          interests?: string | null
          location?: string | null
          name: string
          occupation?: string | null
          personality?: string | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: string | null
          created_at?: string | null
          fun_fact?: string | null
          id?: string
          interests?: string | null
          location?: string | null
          name?: string
          occupation?: string | null
          personality?: string | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companion_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          context_type: string | null
          id: string
          is_user: boolean
          message: string
          metadata: Json | null
          profile_id: string | null
          timestamp: string | null
        }
        Insert: {
          context_type?: string | null
          id?: string
          is_user: boolean
          message: string
          metadata?: Json | null
          profile_id?: string | null
          timestamp?: string | null
        }
        Update: {
          context_type?: string | null
          id?: string
          is_user?: boolean
          message?: string
          metadata?: Json | null
          profile_id?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          questionnaire_completed: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          questionnaire_completed?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          questionnaire_completed?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      questionnaire_responses: {
        Row: {
          childhood_memory: string | null
          created_at: string | null
          dinner_guest: string | null
          id: string
          impactful_gesture: string | null
          learning_desires: string | null
          meaningful_compliment: string | null
          name: string
          perfect_day: string | null
          profile_id: string | null
          resonant_media: string | null
          unwind_method: string | null
        }
        Insert: {
          childhood_memory?: string | null
          created_at?: string | null
          dinner_guest?: string | null
          id?: string
          impactful_gesture?: string | null
          learning_desires?: string | null
          meaningful_compliment?: string | null
          name: string
          perfect_day?: string | null
          profile_id?: string | null
          resonant_media?: string | null
          unwind_method?: string | null
        }
        Update: {
          childhood_memory?: string | null
          created_at?: string | null
          dinner_guest?: string | null
          id?: string
          impactful_gesture?: string | null
          learning_desires?: string | null
          meaningful_compliment?: string | null
          name?: string
          perfect_day?: string | null
          profile_id?: string | null
          resonant_media?: string | null
          unwind_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_responses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          order_index: number
          question_text: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          order_index: number
          question_text: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number
          question_text?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
