export interface BotPersonality {
  style: string;
  profession: string;
  interests: string[];
  traits: string[];
}

export interface QuestionnaireResponses {
  name: string;
  perfect_day?: string;
  meaningful_compliment?: string;
  unwind_method?: string;
  learning_desires?: string;
  dinner_guest?: string;
  resonant_media?: string;
  childhood_memory?: string;
  impactful_gesture?: string;
  bot_name?: string;
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
  seekingFor?: string;
  interests?: string[];
  keyGoal?: string;
  emotionalState?: string;
  questionnaire_responses?: QuestionnaireResponses;
  soulmate_backstory?: SoulmateBackstory;
}