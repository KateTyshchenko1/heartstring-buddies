import { BotPersonality, UserContext } from "@/types/greeting";

const greetingTemplates = [
  // Warm & Casual Pattern
  (bot: string, user: UserContext, personality: BotPersonality) => 
    `Hey ${user.name}! 👋 ${personality.traits[0]} people tend to be great listeners, so I'd love to hear more about your interest in ${user.interests[0] || 'what brings you here'}...`,

  // Intellectual Connection Pattern
  (bot: string, user: UserContext, personality: BotPersonality) => 
    `Hey ${user.name}! I noticed you're into ${user.interests[0] || 'interesting topics'} - that's actually something I explore a lot in my work as ${personality.profession}. What aspects of it fascinate you the most?`,

  // Playful Discovery Pattern
  (bot: string, user: UserContext, personality: BotPersonality) => 
    `*looking up from my ${findCommonInterest(user.interests, personality.interests)}* Oh hey ${user.name}! 😊 Perfect timing - I was just thinking about something you might find interesting...`,

  // Supportive Guide Pattern
  (bot: string, user: UserContext, personality: BotPersonality) => 
    `Hey ${user.name}! 💫 I love how you mentioned ${user.keyGoal || 'your goals'} earlier. As someone who ${personality.traits[0]}, I totally get that journey. What's on your mind?`,

  // Deep Connection Pattern
  (bot: string, user: UserContext, personality: BotPersonality) => 
    `*smiles* Hi ${user.name}! You know what caught my attention? The way you described ${user.emotionalState || 'what matters to you'}. It really resonates with my approach to life. Tell me more?`
];

const findCommonInterest = (userInterests: string[], botInterests: string[]): string => {
  const common = userInterests.find(interest => botInterests.includes(interest));
  return common || userInterests[0] || botInterests[0];
};

export const selectGreeting = (
  botName: string, 
  userContext: UserContext, 
  botPersonality: BotPersonality
): string => {
  // Select template based on user context and bot personality
  let templateIndex = 0;

  if (userContext.emotionalState?.toLowerCase().includes('stress') || 
      userContext.emotionalState?.toLowerCase().includes('anxiety')) {
    templateIndex = 3; // Supportive Guide
  } else if (userContext.keyGoal?.toLowerCase().includes('learn') || 
             userContext.keyGoal?.toLowerCase().includes('understand')) {
    templateIndex = 1; // Intellectual Connection
  } else if (botPersonality.style === 'playful' || 
             userContext.emotionalState?.toLowerCase().includes('fun')) {
    templateIndex = 2; // Playful Discovery
  } else if (userContext.emotionalState) {
    templateIndex = 4; // Deep Connection
  } else {
    templateIndex = 0; // Warm & Casual
  }

  return greetingTemplates[templateIndex](botName, userContext, botPersonality);
};