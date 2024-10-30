import { UserContext } from "@/types/greeting";
import { InteractionMetrics } from "@/types/metrics";
import { createPrompts } from "./prompts";

const XAI_API_KEY = import.meta.env.VITE_XAI_API_KEY;
const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

interface XAIService {
  generateGreeting: (context: UserContext) => Promise<string>;
  generateResponse: (message: string, context: UserContext, metrics: InteractionMetrics) => Promise<string>;
}

export const xaiService: XAIService = {
  async generateGreeting(context) {
    const metrics = {
      flirtLevel: 5,
      charmFactor: 5,
      wittyExchanges: 0,
      energyLevel: 'playful',
      connectionStyle: 'charming'
    };
    
    const prompts = createPrompts(context, metrics);
    return this.callXAI(prompts.greeting);
  },

  async generateResponse(message, context, metrics) {
    const prompts = createPrompts(context, metrics);
    const conversationContext = `Current Context:
Time: ${new Date().toLocaleTimeString()}
User Name: ${context.name}
Recent Message: ${message}`;

    return this.callXAI(prompts.system, conversationContext, message);
  },

  private async callXAI(systemPrompt: string, conversationContext?: string, userMessage?: string) {
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
  }
};