export interface QuestionnaireResponsesTable {
  Row: {
    id: string
    profile_id: string | null
    name: string
    perfect_day: string | null
    meaningful_compliment: string | null
    unwind_method: string | null
    learning_desires: string | null
    dinner_guest: string | null
    resonant_media: string | null
    childhood_memory: string | null
    impactful_gesture: string | null
    created_at: string | null
  }
  Insert: {
    id?: string
    profile_id?: string | null
    name: string
    perfect_day?: string | null
    meaningful_compliment?: string | null
    unwind_method?: string | null
    learning_desires?: string | null
    dinner_guest?: string | null
    resonant_media?: string | null
    childhood_memory?: string | null
    impactful_gesture?: string | null
    created_at?: string | null
  }
  Update: {
    id?: string
    profile_id?: string | null
    name?: string
    perfect_day?: string | null
    meaningful_compliment?: string | null
    unwind_method?: string | null
    learning_desires?: string | null
    dinner_guest?: string | null
    resonant_media?: string | null
    childhood_memory?: string | null
    impactful_gesture?: string | null
    created_at?: string | null
  }
}

export interface QuestionsTable {
  Row: {
    id: string
    question_text: string
    order_index: number
    category: string | null
    is_active: boolean | null
    created_at: string | null
  }
  Insert: {
    id?: string
    question_text: string
    order_index: number
    category?: string | null
    is_active?: boolean | null
    created_at?: string | null
  }
  Update: {
    id?: string
    question_text?: string
    order_index?: number
    category?: string | null
    is_active?: boolean | null
    created_at?: string | null
  }
}