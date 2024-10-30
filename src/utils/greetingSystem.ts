import { BotPersonality, UserContext } from "@/types/greeting";

export const selectGreeting = (
  botName: string,
  userContext: UserContext,
  botPersonality: BotPersonality
): string => {
  // Default greeting if x.ai call fails
  return `Hey ${userContext.name}! I'm ${botName}, and I'm really excited to get to know you better. ${
    botPersonality.interests[0] ? `I noticed you're interested in ${botPersonality.interests[0]} - that's fascinating!` : ''
  } What's on your mind?`;
};