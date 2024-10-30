import { toast } from "sonner";
import type { BackstoryFields } from "@/components/questionnaire/BackstoryForm";
import type { QuestionnaireResponsesTable } from "@/integrations/supabase/types/questionnaire";

const XAI_API_KEY = import.meta.env.VITE_XAI_API_KEY;
const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

type QuestionnaireResponses = Partial<QuestionnaireResponsesTable['Row']>;

const createPersonaPrompt = (questionnaire: QuestionnaireResponses): string => {
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

  return `Create a unique AI companion profile based on these user responses:
${Object.entries(responses)
  .map(([key, value]) => `${key}: "${value}"`)
  .join('\n')}

Generate a JSON object with these fields:
{
  "age": "between 28-38",
  "occupation": "something intriguing that matches their interests",
  "location": "somewhere that fits their vibe",
  "personality": "traits that would create chemistry",
  "interests": "complementary to their interests",
  "funFact": "something conversation-worthy"
}`;
};

export const generateMatchingPersona = async (
  questionnaire: QuestionnaireResponses
): Promise<BackstoryFields> => {
  if (!XAI_API_KEY) {
    console.error('Missing XAI_API_KEY environment variable');
    throw new Error('API configuration error');
  }

  try {
    const prompt = createPersonaPrompt(questionnaire);
    console.log('Generated prompt:', prompt);

    const response = await fetch(XAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: prompt
          }
        ],
        model: 'grok-beta',
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`X.AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('X.AI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response format');
    }

    // Extract JSON from the response content
    const contentStr = data.choices[0].message.content;
    const jsonMatch = contentStr.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON object found in response');
    }

    const generatedPersona = JSON.parse(jsonMatch[0]);
    console.log('Successfully parsed persona:', generatedPersona);

    // Validate required fields
    const requiredFields = ['age', 'occupation', 'location', 'personality', 'interests', 'funFact'];
    const missingFields = requiredFields.filter(field => !generatedPersona[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return {
      ...generatedPersona,
      name: questionnaire.name || ''
    };
  } catch (error) {
    console.error('Error generating persona:', error);
    
    // Create fallback persona based on available data
    const interests = questionnaire.learning_desires || 
                     questionnaire.resonant_media || 
                     'art, culture, and meaningful conversations';
                     
    const personality = questionnaire.meaningful_compliment 
      ? `Someone who values ${questionnaire.meaningful_compliment}`
      : 'Witty and warm, with a perfect balance of depth and playfulness';

    return {
      name: questionnaire.name || '',
      age: "32",
      occupation: "Creative Director at a Digital Innovation Studio",
      location: "Lives in a vibrant city neighborhood, always discovering hidden gems",
      personality,
      interests: `Photography, ${interests}, and collecting vinyl records`,
      fun_fact: "Once started a secret rooftop cinema club that became an underground sensation"
    };
  }
};