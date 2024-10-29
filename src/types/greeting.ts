export type BotPersonality = {
  style: string;
  profession: string;
  interests: string[];
  traits: string[];
};

export type UserContext = {
  name: string;
  seekingFor: string;
  interests: string[];
  recentChallenge?: string;
  emotionalState?: string;
  keyGoal?: string;
};

const findCommonInterest = (userInterests: string[], botInterests: string[]): string => {
  const common = userInterests.find(interest => botInterests.includes(interest));
  return common || userInterests[0] || botInterests[0];
};