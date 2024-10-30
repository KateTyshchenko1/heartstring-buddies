import { toast } from "sonner";
import type { SoulmateBackstory } from "@/types/greeting";
import type { QuestionnaireResponses } from "@/types/greeting";

const createPersonaPrompt = (questionnaire: QuestionnaireResponses): string => {
  if (!questionnaire.name || !questionnaire.bot_name) {
    throw new Error('Both user name and bot name are required for persona generation');
  }

  return `Create a compatible companion profile for ${questionnaire.name}, with the AI companion named ${questionnaire.bot_name}.
Based on their responses:
- Perfect day: ${questionnaire.perfect_day || 'Not specified'}
- How they unwind: ${questionnaire.unwind_method || 'Not specified'}
- Learning interests: ${questionnaire.learning_desires || 'Not specified'}
- Meaningful compliment: ${questionnaire.meaningful_compliment || 'Not specified'}
- Dinner guest choice: ${questionnaire.dinner_guest || 'Not specified'}
- Media that resonates: ${questionnaire.resonant_media || 'Not specified'}
- Childhood memory: ${questionnaire.childhood_memory || 'Not specified'}
- Impactful gesture: ${questionnaire.impactful_gesture || 'Not specified'}

Return ONLY a valid JSON object with these exact fields (no additional text or explanation):
{
  "age": "32",
  "occupation": "Marine Biologist specializing in bioluminescent creatures",
  "location": "San Francisco, with a houseboat in Sausalito",
  "personality": "Witty, adventurous, empathetic, and intellectually curious",
  "interests": "Deep-sea photography, writing science poetry, urban foraging, and teaching marine biology to kids",
  "fun_fact": "Once spent a month living in an underwater research station"
}`;
};

const validatePersonaResponse = (response: any): boolean => {
  const requiredFields = ['age', 'occupation', 'location', 'personality', 'interests', 'fun_fact'];
  return requiredFields.every(field => 
    response[field] && 
    typeof response[field] === 'string' &&
    response[field].length > 0
  );
};

const parseJsonSafely = (text: string): any => {
  try {
    // Find the first '{' and last '}' to extract just the JSON object
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}') + 1;
    if (start === -1 || end === 0) {
      throw new Error('No JSON object found in response');
    }
    const jsonStr = text.slice(start, end);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('JSON parsing error:', error);
    throw new Error('Failed to parse AI response');
  }
};

export const generateMatchingPersona = async (
  questionnaire: QuestionnaireResponses
): Promise<SoulmateBackstory> => {
  try {
    const prompt = createPersonaPrompt(questionnaire);
    
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { 
            role: 'system', 
            content: 'You are an AI that generates compatible companion profiles based on user questionnaire responses. Only return valid JSON objects.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        model: 'grok-beta',
        stream: false,
        temperature: 0.8
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('X.AI API Error:', errorData);
      throw new Error('Failed to generate companion profile');
    }

    const data = await response.json();
    const generatedPersona = parseJsonSafely(data.choices[0].message.content);

    if (!validatePersonaResponse(generatedPersona)) {
      throw new Error('Generated profile is incomplete');
    }

    return {
      bot_name: questionnaire.bot_name || '',
      user_name: questionnaire.name,
      ...generatedPersona
    };
  } catch (error: any) {
    console.error('Error generating persona:', error);
    toast.error('Failed to generate companion profile. Please try again.');
    throw error;
  }
};