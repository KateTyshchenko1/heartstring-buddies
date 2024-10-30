import { toast } from "sonner";
import type { BackstoryFields } from "@/components/questionnaire/BackstoryForm";
import type { QuestionnaireResponsesTable } from "@/integrations/supabase/types/questionnaire";

const XAI_API_KEY = import.meta.env.VITE_XAI_API_KEY;
const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

type QuestionnaireResponses = Partial<QuestionnaireResponsesTable['Row']>;

export const generateMatchingPersona = async (
  questionnaire: QuestionnaireResponses
): Promise<BackstoryFields> => {
  if (!XAI_API_KEY) {
    console.error('Missing XAI_API_KEY environment variable');
    throw new Error('API configuration error');
  }

  try {
    console.log('Generating persona with questionnaire:', questionnaire);

    const prompt = `You are a sophisticated AI assistant helping to create a perfect AI companion profile for ${questionnaire.name}.
    
    Based on their questionnaire responses below, create an engaging, interesting, and compatible personality profile.
    The profile should be flirty and fun while maintaining depth and sophistication.

    USER'S QUESTIONNAIRE RESPONSES:
    - Perfect day: "${questionnaire.perfect_day}"
    - Meaningful compliment: "${questionnaire.meaningful_compliment}"
    - Unwinding method: "${questionnaire.unwind_method}"
    - Learning desires: "${questionnaire.learning_desires}"
    - Dream dinner guest: "${questionnaire.dinner_guest}"
    - Resonant media: "${questionnaire.resonant_media}"
    - Childhood memory: "${questionnaire.childhood_memory}"
    - Impactful gesture: "${questionnaire.impactful_gesture}"

    Generate a companion profile with these exact fields:
    1. Age (between 28-38)
    2. Occupation (something interesting and sophisticated that would intrigue this user)
    3. Location (somewhere that matches user's vibe with an interesting twist)
    4. Personality (traits that would create chemistry with this user)
    5. Interests (complementary to user's interests, not identical)
    6. Fun Fact (something intriguing that could spark conversation)

    Make each field engaging and specific. Avoid generic descriptions.
    The profile should feel like a real person who would have amazing chemistry with ${questionnaire.name} based on their responses.
    
    Format response as JSON with fields: age, occupation, location, personality, interests, funFact`;

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
      const errorData = await response.json();
      console.error('AI API error:', errorData);
      throw new Error('Failed to generate persona');
    }

    const data = await response.json();
    console.log('AI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response format');
    }

    const generatedPersona = JSON.parse(data.choices[0].message.content);
    console.log('Generated persona:', generatedPersona);

    return {
      ...generatedPersona,
      name: questionnaire.name || ''
    };
  } catch (error) {
    console.error('Error generating persona:', error);
    toast.error("Failed to generate persona. Using default values.");
    
    // Fallback to default values if AI generation fails
    return {
      name: questionnaire.name || '',
      age: "32",
      occupation: "Creative director at a digital innovation studio",
      location: "Lives in a vibrant city neighborhood, always discovering hidden gems",
      personality: "Witty and warm, with a perfect balance of depth and playfulness",
      interests: "Photography, obscure films, and collecting vinyl records",
      fun_fact: "Once started a secret rooftop cinema club that became an underground sensation"
    };
  }
};