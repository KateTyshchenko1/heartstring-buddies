import { toast } from "sonner";
import type { BackstoryFields } from "@/components/questionnaire/BackstoryForm";
import type { QuestionnaireResponsesTable } from "@/integrations/supabase/types/questionnaire";

declare global {
  interface ImportMetaEnv {
    VITE_XAI_API_KEY: string;
  }
}

const XAI_API_KEY = import.meta.env.VITE_XAI_API_KEY;
const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

type QuestionnaireResponses = Partial<QuestionnaireResponsesTable['Row']>;

const createPersonaPrompt = (questionnaire: QuestionnaireResponses): string => {
  // Only name is required
  if (!questionnaire.name) {
    throw new Error('Name is required for persona generation');
  }

  // Filter out undefined or null values
  const providedAnswers = Object.entries(questionnaire)
    .filter(([key, value]) => 
      value && 
      typeof value === 'string' && 
      key !== 'id' && 
      key !== 'profile_id' && 
      key !== 'created_at' &&
      key !== 'bot_name'
    );

  let promptBase = `Create an engaging and compatible companion profile for someone named ${questionnaire.name}.`;

  if (providedAnswers.length > 1) { // More than just the name
    promptBase += `\n\nBased on what we know about them:\n${providedAnswers
      .map(([key, value]) => `${key}: "${value}"`)
      .join('\n')}`;
  }

  return `${promptBase}

Guidelines:
1. Create a unique and intriguing personality that would be compatible with what we know about ${questionnaire.name}
2. Develop interests and characteristics that could lead to engaging conversations
3. Balance playful charm with intellectual depth
4. Make the profile feel authentic and relatable

Respond ONLY with a JSON object in this exact format:
{
  "age": "A number between 28-38",
  "occupation": "A sophisticated and intriguing profession",
  "location": "A specific location with an interesting detail",
  "personality": "3-4 key personality traits and characteristics",
  "interests": "4-5 specific interests or hobbies",
  "funFact": "An intriguing detail that could spark conversation"
}

Keep all content appropriate and professional.`;
};

export const generateMatchingPersona = async (
  questionnaire: QuestionnaireResponses
): Promise<BackstoryFields> => {
  if (!XAI_API_KEY) {
    throw new Error('API configuration error: Missing XAI_API_KEY');
  }

  if (!questionnaire.name) {
    throw new Error('Name is required for persona generation');
  }

  try {
    const prompt = createPersonaPrompt(questionnaire);
    console.log('Sending prompt to X.AI:', prompt);

    const response = await fetch(XAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: prompt }
        ],
        model: 'grok-beta',
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      console.error('X.AI API error:', response.statusText);
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('X.AI response:', data);
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    const contentStr = data.choices[0].message.content;
    const jsonMatch = contentStr.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.error('No JSON found in response:', contentStr);
      throw new Error('No valid JSON found in response');
    }

    const generatedPersona = JSON.parse(jsonMatch[0]);

    // Validate all required fields
    const requiredFields = ['age', 'occupation', 'location', 'personality', 'interests', 'funFact'];
    for (const field of requiredFields) {
      if (!generatedPersona[field] || typeof generatedPersona[field] !== 'string') {
        console.error(`Missing or invalid field in response: ${field}`);
        throw new Error(`Invalid or missing field: ${field}`);
      }
    }

    return {
      name: questionnaire.name,
      age: generatedPersona.age,
      occupation: generatedPersona.occupation,
      location: generatedPersona.location,
      personality: generatedPersona.personality,
      interests: generatedPersona.interests,
      fun_fact: generatedPersona.funFact
    };
  } catch (error) {
    console.error('Error generating persona:', error);
    throw error;
  }
};