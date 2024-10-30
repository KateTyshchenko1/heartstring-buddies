export interface BotPersonality {
  style: string;
  profession: string;
  interests: string[];
  traits: string[];
}

export interface QuestionnaireResponses {
  name: string;                    // User's name from first question
  perfect_day: string;             // Perfect day description
  meaningful_compliment: string;    // Most meaningful compliment
  unwind_method: string;           // How they unwind
  learning_desires: string;        // What they want to learn
  dinner_guest: string;            // Dream dinner guest
  resonant_media: string;          // Resonant media
  childhood_memory: string;        // Childhood memory
  impactful_gesture: string;       // Most impactful gesture
  bot_name: string;                // Companion's name (last question)
}

export interface SoulmateBackstory {
  name: string;                    // Bot's name
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