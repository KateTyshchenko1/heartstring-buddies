import { toast } from "sonner";
import type { SoulmateBackstory } from "@/types/greeting";
import type { QuestionnaireResponses } from "@/types/greeting";
import { supabase } from "@/integrations/supabase/client";

const createPersonaPrompt = (questionnaire: QuestionnaireResponses): string => {
  if (!questionnaire.name) {
    throw new Error('Name is required for persona generation');
  }

  return `Create a compatible companion profile for ${questionnaire.name}.
Based on their responses:
- Perfect day: ${questionnaire.perfect_day || 'Not specified'}
- How they unwind: ${questionnaire.unwind_method || 'Not specified'}
- Learning interests: ${questionnaire.learning_desires || 'Not specified'}
- Meaningful compliment: ${questionnaire.meaningful_compliment || 'Not specified'}
- Dinner guest choice: ${questionnaire.dinner_guest || 'Not specified'}
- Media that resonates: ${questionnaire.resonant_media || 'Not specified'}
- Childhood memory: ${questionnaire.childhood_memory || 'Not specified'}
- Impactful gesture: ${questionnaire.impactful_gesture || 'Not specified'}

Create a profile that would be compatible with them, following these guidelines:
1. Age should be between 28-38
2. Occupation should be sophisticated and intriguing
3. Location should include an interesting detail
4. Personality should list 3-4 key traits
5. Interests should be 4-5 specific hobbies
6. Include one intriguing fun fact

Format your response as a JSON object with these exact keys:
{
  "age": "32",
  "occupation": "Marine Biologist specializing in bioluminescent creatures",
  "location": "San Francisco, with a houseboat in Sausalito",
  "personality": "Witty, adventurous, empathetic, and intellectually curious",
  "interests": "Deep-sea photography, writing science poetry, urban foraging, and teaching marine biology to kids",
  "funFact": "Once spent a month living in an underwater research station"
}`;
};

const validatePersonaResponse = (response: any): boolean => {
  const requiredFields = ['age', 'occupation', 'location', 'personality', 'interests', 'funFact'];
  return requiredFields.every(field => 
    response[field] && 
    typeof response[field] === 'string' &&
    response[field].length > 0
  );
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
            content: 'You are an AI that generates compatible companion profiles based on user questionnaire responses.' 
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
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedPersona = JSON.parse(data.choices[0].message.content);

    if (!validatePersonaResponse(generatedPersona)) {
      throw new Error('Generated persona is missing required fields');
    }

    return {
      bot_name: questionnaire.bot_name || '',
      user_name: questionnaire.name,
      ...generatedPersona
    };
  } catch (error: any) {
    console.error('Error generating persona:', error);
    toast.error(error.message || 'Failed to generate persona');
    throw error;
  }
};
