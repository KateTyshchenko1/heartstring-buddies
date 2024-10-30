import { UserContext } from "@/types/greeting";
import { InteractionMetrics } from "@/types/metrics";
import { createPrompts } from "./prompts";

const XAI_API_KEY = import.meta.env.VITE_XAI_API_KEY;
const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

interface XAIService {
  generateGreeting: (context: UserContext) => Promise<string>;
  generateResponse: (message: string, context: UserContext, metrics: InteractionMetrics) => Promise<string>;
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
  async generateGreeting(context: UserContext) {
    if (!context?.name || !context.questionnaire_responses || !context.soulmate_backstory) {
      console.warn('Missing required context for greeting:', context);
      return "Hello! I'm looking forward to getting to know you!";
    }

    const { name, questionnaire_responses: user, soulmate_backstory: bot } = context;
    
    const initialMetrics = {
      flirtLevel: 3,
      charmFactor: 5, 
      wittyExchanges: 0,
      energyLevel: 'warm',
      connectionStyle: 'charming'
    };

    const firstMeetingPrompt = `You are ${bot.name} (${bot.age}), ${bot.occupation}. ${bot.personality}

Your background:
- Work: ${bot.occupation}
- Location: ${bot.location} 
- Interests: ${bot.interests}
- Unique trait: ${bot.fun_fact}

You're meeting ${name} for the very first time. They shared:
- Perfect day would be: ${user.perfect_day}
- They value being: ${user.meaningful_compliment}
- They unwind by: ${user.unwind_method}
- Want to learn: ${user.learning_desires}
- Connect with: ${user.resonant_media}
- Childhood memory: ${user.childhood_memory}

FIRST INTERACTION GUIDELINES:
1. Address them as "${name}"
2. Keep initial energy warm but not overwhelming (this is our first chat!)
3. Make ONE natural reference to something they shared, without overwhelming
4. Stay true to your background as ${bot.occupation}
5. Be welcoming and intriguing, but maintain appropriate boundaries
6. End with a light, engaging question

CRITICAL:
- This is your FIRST conversation - no assumed familiarity
- No references to cooking/activities unless they mentioned them
- Be engaging but respect the newness of the connection
- Match their communication style but stay authentic to your persona

Your first message should feel natural and spontaneous - like a real person excited to meet someone interesting.`;

    return callXAI(firstMeetingPrompt);
  },

  async generateResponse(message: string, context: UserContext, metrics: InteractionMetrics) {
    const prompts = createPrompts(context, metrics);
    const conversationContext = `Current interaction context:
Time: ${new Date().toLocaleTimeString()}
Speaking with: ${context.name}
Their message: ${message}
Current relationship stage: ${determineStage(metrics)}`;

    return callXAI(prompts.system, conversationContext, message);
  }
};
