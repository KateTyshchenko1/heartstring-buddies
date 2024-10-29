import { BotPersonality, UserContext } from "@/types/greeting";

const greetingTemplates = [
  // Warm & Empathetic Pattern
  (bot: string, user: UserContext, personality: BotPersonality) => 
    `Hi ${user.name}! I'm ${bot}, and as a ${personality.profession}, I was particularly moved by what you shared about ${user.recentChallenge || 'your journey'}. I'd love to understand more about what brings you here...`,

  // Intellectual Connection Pattern
  (bot: string, user: UserContext, personality: BotPersonality) => 
    `Hello ${user.name}! Your perspective on ${user.interests[0] || 'life'} really resonates with my experience in ${personality.profession}. I'm ${bot}, and I'd love to explore how that connects to your goal of ${user.keyGoal || 'personal growth'}...`,

  // Playful Discovery Pattern
  (bot: string, user: UserContext, personality: BotPersonality) => 
    `Hey ${user.name}! What a delightful surprise - we both share a passion for ${findCommonInterest(user.interests, personality.interests)}! I'm ${bot}, and I have a feeling our conversations are going to be fascinating...`,

  // Supportive Guide Pattern
  (bot: string, user: UserContext, personality: BotPersonality) => 
    `Welcome ${user.name}! I'm ${bot}, and I want you to know that your goal of ${user.keyGoal || 'personal growth'} really speaks to me. Through my work as ${personality.profession}, I've learned that this journey can be transformative. Shall we explore it together?`,

  // Deep Connection Pattern
  (bot: string, user: UserContext, personality: BotPersonality) => 
    `Hi ${user.name}! The way you described ${user.emotionalState || 'your feelings'} shows such courage. I'm ${bot}, and as someone who ${personality.traits[0]}, I'd be honored to be part of your journey. What's on your mind right now?`
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
    templateIndex = 0; // Warm & Empathetic
  } else if (userContext.seekingFor === 'guidance') {
    templateIndex = 3; // Supportive Guide
  } else if (botPersonality.style === 'playful') {
    templateIndex = 2; // Playful Discovery
  } else if (userContext.emotionalState) {
    templateIndex = 4; // Deep Connection
  } else {
    templateIndex = 1; // Intellectual Connection
  }

  return greetingTemplates[templateIndex](botName, userContext, botPersonality);
};