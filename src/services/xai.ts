const XAI_API_KEY = 'xai-qo2N72M5BhR5cPMvJ6jIzdAY9ShJRFkXMnDu8Vkvbnc5UshTJ3OnwpkuRg39YM864mgrf9SweP2xqO0i';
const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

export const generateResponse = async (message: string, context: string = '') => {
  try {
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
            content: 'You are a caring and empathetic AI companion. Your responses should be warm, supportive, and focused on emotional connection. ' + context
          },
          {
            role: 'user',
            content: message
          }
        ],
        model: 'x-1-latest',
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate response');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};