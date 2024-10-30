import { supabase } from "@/integrations/supabase/client";
import type { InteractionMetrics } from "@/types/metrics";
import type { UserContext } from "@/types/greeting";

declare global {
  interface ImportMetaEnv {
    VITE_XAI_API_KEY: string;
  }
}

export const xaiService = {
  generateGreeting: async (userId: string, userName: string) => {
    try {
      const { data: profile } = await supabase
        .from('companion_profiles')
        .select('*')
        .eq('profile_id', userId)
        .single();

      if (!profile) throw new Error('Profile not found');

      const prompt = `Create a warm, engaging first greeting for ${userName}. Use their name naturally in the greeting. The greeting should reflect your personality as: ${profile.personality}. Keep it under 100 words and make it feel personal and welcoming.`;

      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_XAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'system', content: prompt }],
          model: 'grok-beta',
          stream: false,
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('X.AI API Error:', errorData);
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating greeting:', error);
      return `Hi ${userName}! It's great to meet you.`;
    }
  },

  generateResponse: async (
    message: string,
    context: UserContext,
    metrics: InteractionMetrics
  ) => {
    try {
      const prompt = `You are engaging in a conversation with ${context.name}. 
      Their message: "${message}"
      
      Current interaction metrics:
      - Energy Level: ${metrics.energyLevel}
      - Flirt Level: ${metrics.flirtLevel}
      - Connection Style: ${metrics.connectionStyle}
      - Witty Exchanges: ${metrics.wittyExchanges}
      
      User Background:
      ${Object.entries(context.questionnaire_responses || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')}
      
      Your Personality:
      ${Object.entries(context.soulmate_backstory || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')}
      
      Respond naturally and engagingly while maintaining character consistency.`;

      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_XAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'system', content: prompt }],
          model: 'grok-beta',
          stream: false,
          temperature: 0.8
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('X.AI API Error:', errorData);
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating response:', error);
      return "I'm having trouble processing that right now. Could you rephrase?";
    }
  },

  analyzeMessage: async (message: string): Promise<{
    sentiment: string;
    topics: string[];
    engagement: number;
  }> => {
    try {
      const prompt = `Analyze this message for sentiment, key topics, and engagement level:
      "${message}"
      
      Respond in JSON format:
      {
        "sentiment": "positive/negative/neutral",
        "topics": ["topic1", "topic2"],
        "engagement": 1-10 scale number
      }`;

      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_XAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'system', content: prompt }],
          model: 'grok-beta',
          stream: false,
          temperature: 0.3
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('X.AI API Error:', errorData);
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing message:', error);
      return {
        sentiment: 'neutral',
        topics: [],
        engagement: 5,
      };
    }
  },
};