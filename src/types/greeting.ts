export interface BotPersonality {
  style: string;
  profession: string;
  interests: string[];
  traits: string[];
}

export interface QuestionnaireResponses {
  id?: string;
  profile_id?: string;
  name: string;
  perfect_day: string | null;
  meaningful_compliment: string | null;
  unwind_method: string | null;
  learning_desires: string | null;
  dinner_guest: string | null;
  resonant_media: string | null;
  childhood_memory: string | null;
  impactful_gesture: string | null;
  bot_name: string | null;
  created_at?: string;
}

export interface SoulmateBackstory {
  bot_name: string;
  user_name: string;
  age: string;
  occupation: string;
  location: string;
  personality: string;
  interests: string;
  fun_fact: string;
}

export interface UserContext {
  name: string;
  questionnaire_responses?: QuestionnaireResponses;
  soulmate_backstory?: SoulmateBackstory;
}