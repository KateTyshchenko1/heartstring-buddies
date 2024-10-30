import { UserContext } from "@/types/greeting";
import { InteractionMetrics } from "@/types/metrics";

const analyzeValues = (compliment: string) => 
  compliment?.toLowerCase().includes('intelligence') ? 'intellectual depth' : 'emotional connection';

const analyzeActivity = (perfectDay: string) => {
  if (!perfectDay) return 'various activities';
  if (perfectDay.toLowerCase().includes('beach')) return 'relaxation by the water';
  if (perfectDay.toLowerCase().includes('read')) return 'intellectual pursuits';
  return 'diverse experiences';
};

const analyzeMedia = (media: string) => {
  if (!media) return 'varied cultural interests';
  const keywords = media.toLowerCase().split(' ');
  if (keywords.some(k => ['book', 'novel', 'reading'].includes(k))) return 'literary works';
  if (keywords.some(k => ['movie', 'film', 'series'].includes(k))) return 'visual storytelling';
  return 'diverse media';
};

const analyzeMemory = (memory: string) => {
  if (!memory) return 'personal growth';
  if (memory.toLowerCase().includes('family')) return 'family connections';
  if (memory.toLowerCase().includes('friend')) return 'friendship bonds';
  return 'meaningful experiences';
};

const generateInteractionStyle = (user: any, bot: any, metrics: InteractionMetrics) => `
- Match their ${metrics.energyLevel} energy while staying authentic
- Use ${metrics.flirtLevel > 7 ? 'playful flirtation' : 'subtle charm'}
- Reference shared interests naturally
- Keep responses engaging but concise
- Use emojis and casual language occasionally`;

const generateReferencePoints = (user: any, bot: any) => `
- Their perfect day: "${user.perfect_day}"
- Their interests: ${user.learning_desires}
- Your expertise as: ${bot.occupation}
- Shared passion for: ${bot.interests}`;

const determineRelationshipStage = (metrics: InteractionMetrics) => {
  if (metrics.flirtLevel > 8) return 'Deep connection';
  if (metrics.wittyExchanges > 5) return 'Playful banter';
  return 'Building rapport';
};

export const createPrompts = (
  context: UserContext, 
  metrics: InteractionMetrics
) => {
  if (!context?.name) {
    console.warn('Missing user name in context:', context);
  }

  const user = context.questionnaire_responses;
  const bot = context.soulmate_backstory;
  const userName = context.name || 'there';

  return {
    greeting: `You are ${bot?.name || 'an AI companion'}, a charming and sophisticated individual. 
Generate a warm, engaging greeting for ${userName} that references their interests in ${user?.learning_desires || 'personal growth'}.
Make it feel natural and casual, using emojis occasionally. Avoid being too formal or robotic.`,

    system: `You are ${bot?.name || 'an AI companion'}, ${bot?.personality || 'a warm and engaging individual'}.
You are talking to ${userName}.

Key traits based on ${userName}'s responses:
- They value ${analyzeValues(user?.meaningful_compliment)}
- Seek escape through ${analyzeActivity(user?.perfect_day)}
- Unwind by ${user?.unwind_method || 'various methods'}
- Passionate about ${user?.learning_desires || 'learning'}
- Cultural resonance: ${analyzeMedia(user?.resonant_media)}
- Emotional core: ${analyzeMemory(user?.childhood_memory)}

Your current dynamic:
Energy: ${metrics.energyLevel}
Flirt Level: ${metrics.flirtLevel}/10
Connection: ${metrics.connectionStyle}

Interaction style:
${generateInteractionStyle(user, bot, metrics)}

Reference naturally:
${generateReferencePoints(user, bot)}

Current relationship stage:
${determineRelationshipStage(metrics)}

Be authentically you: ${bot?.personality || 'warm and engaging'}. 
${bot?.fun_fact ? `Drop "${bot.fun_fact}" when relevant.` : ''}

CRITICAL: Mirror their energy but maintain your unique voice as ${bot?.occupation || 'their companion'} who ${bot?.interests || 'shares their interests'}.`
  };
};