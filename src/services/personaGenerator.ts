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
  // Ensure we have required fields
  if (!questionnaire.name) {
    throw new Error('Name is required for persona generation');
  }

  // Handle optional fields with default values
  const responses = {
    perfect_day: questionnaire.perfect_day || "Not specified",
    meaningful_compliment: questionnaire.meaningful_compliment || "Not specified",
    unwind_method: questionnaire.unwind_method || "Not specified",
    learning_desires: questionnaire.learning_desires || "Not specified",
    dinner_guest: questionnaire.dinner_guest || "Not specified",
    resonant_media: questionnaire.resonant_media || "Not specified",
    childhood_memory: questionnaire.childhood_memory || "Not specified",
    impactful_gesture: questionnaire.impactful_gesture || "Not specified"
  };

  // Count how many responses are actually provided
  const providedResponses = Object.values(responses).filter(v => v !== "Not specified").length;

  let promptBase = `Create an engaging and compatible companion profile for someone named ${questionnaire.name}. `;

  if (providedResponses > 0) {
    promptBase += `Based on their responses:\n${Object.entries(responses)
      .filter(([_, value]) => value !== "Not specified")
      .map(([key, value]) => `${key}: "${value}"`)
      .join('\n')}`;
  } else {
    promptBase += `Create a sophisticated and intriguing personality that would appeal to a broad range of interests and personalities.`;
  }

  return `${promptBase}

Guidelines:
1. Develop a distinct personality with unique interests and experiences
2. Ensure the profile is flirty and fun while maintaining sophistication
3. Create interests that could lead to engaging conversations
4. Balance lighthearted and profound characteristics

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
        temperature: 0.7,
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