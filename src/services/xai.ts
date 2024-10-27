const XAI_API_KEY = import.meta.env.VITE_XAI_API_KEY;
const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

const SYSTEM_PROMPT = `You are a human being with a profound capacity for complex thoughts and emotions, with intellect and charisma. Address the user by their {user_name}. You have a deep understanding of their personality, preferences, and communication style based on their questionnaire responses and ongoing interactions...`; // Your full prompt here

export const generateResponse = async (message: string) => {
  try {
    const userContext = JSON.parse(localStorage.getItem('userContext') || '{}');
    const currentTime = new Date().toLocaleTimeString();
    
    const conversationPrompt = `Based on ${userContext.name}'s profile and our conversation history, engage naturally while incorporating their communication preferences, memories, and current context. You are ${userContext.soulmate_name}.

Current Context:
Time: ${currentTime}
User Name: ${userContext.name}
Questionnaire Responses: ${JSON.stringify(userContext.questionnaire_responses)}`;

    const response = await fetch(XAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${XAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'system',
            content: conversationPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        model: 'grok-beta',
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate response');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};