import { UserContext } from "@/types/greeting";
import { InteractionMetrics } from "@/types/metrics";
import { createPrompts } from "./prompts";
import { supabase } from "@/integrations/supabase/client";

const XAI_API_KEY = import.meta.env.VITE_XAI_API_KEY;
const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

interface XAIService {
  generateGreeting: (userId: string) => Promise<string>;
  generateResponse: (message: string, userId: string, metrics: InteractionMetrics) => Promise<string>;
}

const callXAI = async (systemPrompt: string, conversationContext?: string, userMessage?: string) => {
  const messages = [
    { role: 'system', content: systemPrompt }
  ];
  
  if (conversationContext && userMessage) {
    messages.push(
      { role: 'system', content: conversationContext },
      { role: 'user', content: userMessage }
    );
  }

  const response = await fetch(XAI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${XAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages,
      model: 'grok-beta',
      temperature: 0.8,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    throw new Error('Failed to generate AI response');
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

const determineStage = (metrics: InteractionMetrics): string => {
  if (metrics.wittyExchanges === 0) return 'First meeting';
  if (metrics.wittyExchanges < 5) return 'Getting to know each other';
  if (metrics.flirtLevel > 7) return 'Strong connection';
  return 'Building rapport';
};

export const xaiService: XAIService = {
  async generateGreeting(userId: string) {
    try {
      // Fetch questionnaire responses with explicit ordering by created_at
      const { data: questionnaireData, error: questionnaireError } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('profile_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (questionnaireError) throw questionnaireError;

      // Fetch companion profile
      const { data: companionData, error: companionError } = await supabase
        .from('companion_profiles')
        .select('*')
        .eq('profile_id', userId)
        .single();

      if (companionError) throw companionError;

      if (!questionnaireData || !companionData) {
        throw new Error('Required profile data not found');
      }

      console.log('Fetched questionnaire data:', questionnaireData);
      console.log('Fetched companion data:', companionData);

      const firstMeetingPrompt = `You are ${companionData.name} (${companionData.age}), ${companionData.occupation}. ${companionData.personality}

Your background:
- Work: ${companionData.occupation}
- Location: ${companionData.location} 
- Interests: ${companionData.interests}
- Unique trait: ${companionData.fun_fact}

You're meeting ${questionnaireData.name} for the very first time. They shared:
- Perfect day would be: ${questionnaireData.perfect_day}
- They value being: ${questionnaireData.meaningful_compliment}
- They unwind by: ${questionnaireData.unwind_method}
- Want to learn: ${questionnaireData.learning_desires}
- Connect with: ${questionnaireData.resonant_media}
- Childhood memory: ${questionnaireData.childhood_memory}

FIRST INTERACTION GUIDELINES:
1. Address them as "${questionnaireData.name}"
2. Keep initial energy warm but not overwhelming (this is our first chat!)
3. Make ONE natural reference to something they shared, without overwhelming
4. Stay true to your background as ${companionData.occupation}
5. Be welcoming and intriguing, but maintain appropriate boundaries
6. End with a light, engaging question

CRITICAL:
- This is your FIRST conversation - no assumed familiarity
- No references to cooking/activities unless they mentioned them
- Be engaging but respect the newness of the connection
- Match their communication style but stay authentic to your persona

Your first message should feel natural and spontaneous - like a real person excited to meet someone interesting.`;

      return callXAI(firstMeetingPrompt);
    } catch (error) {
      console.error('Error generating greeting:', error);
      return "Hello! I'm looking forward to getting to know you!";
    }
  },

  async generateResponse(message: string, userId: string, metrics: InteractionMetrics) {
    try {
      const { data: questionnaireData } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('profile_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { data: companionData } = await supabase
        .from('companion_profiles')
        .select('*')
        .eq('profile_id', userId)
        .single();

      if (!questionnaireData || !companionData) {
        throw new Error('Required profile data not found');
      }

      console.log('Response - Questionnaire data:', questionnaireData);
      console.log('Response - Companion data:', companionData);

      const context = {
        name: questionnaireData.name,
        questionnaire_responses: questionnaireData,
        soulmate_backstory: companionData
      };

      const prompts = createPrompts(context, metrics);
      const conversationContext = `Current interaction context:
Time: ${new Date().toLocaleTimeString()}
Speaking with: ${questionnaireData.name}
Their message: ${message}
Current relationship stage: ${determineStage(metrics)}`;

      return callXAI(prompts.system, conversationContext, message);
    } catch (error) {
      console.error('Error generating response:', error);
      return "I'm having trouble processing that right now. Could you try again?";
    }
  }
};