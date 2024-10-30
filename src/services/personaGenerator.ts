import { toast } from "sonner";
import type { BackstoryFields } from "@/components/questionnaire/BackstoryForm";
import type { QuestionnaireResponsesTable } from "@/integrations/supabase/types/questionnaire";

const XAI_API_KEY = import.meta.env.VITE_XAI_API_KEY;
const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

type QuestionnaireResponses = Partial<QuestionnaireResponsesTable['Row']>;

const createPersonaPrompt = (questionnaire: QuestionnaireResponses): string => {
  // Clean and validate responses
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

  return `You are a sophisticated AI assistant helping to create a perfect AI companion profile for ${questionnaire.name || 'the user'}.
    
Based on their questionnaire responses below, create an engaging, interesting, and compatible personality profile.
The profile should be flirty and fun while maintaining depth and sophistication.

USER'S QUESTIONNAIRE RESPONSES:
${Object.entries(responses)
  .map(([key, value]) => `- ${key.replace(/_/g, ' ')}: "${value}"`)
  .join('\n')}

Even with limited information, create a compelling and unique personality that would intrigue this user.

Generate a companion profile with these exact fields:
1. Age (between 28-38)
2. Occupation (something interesting and sophisticated that would intrigue this user)
3. Location (somewhere that matches user's vibe with an interesting twist)
4. Personality (traits that would create chemistry with this user)
5. Interests (complementary to user's interests, not identical)
6. Fun Fact (something intriguing that could spark conversation)

Make each field engaging and specific. The profile should feel like a real person who would have amazing chemistry with the user based on their responses.

Format response as JSON with fields: age, occupation, location, personality, interests, funFact`;
};

export const generateMatchingPersona = async (
  questionnaire: QuestionnaireResponses
): Promise<BackstoryFields> => {
  if (!XAI_API_KEY) {
    console.error('Missing XAI_API_KEY environment variable');
    toast.error("Configuration error. Please contact support.");
    throw new Error('API configuration error');
  }

  try {
    console.log('Generating persona with questionnaire data:', questionnaire);
    
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
      const errorData = await response.json();
      console.error('X.AI API error:', errorData);
      throw new Error(`X.AI API error: ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('X.AI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response format');
    }

    let generatedPersona;
    try {
      generatedPersona = JSON.parse(data.choices[0].message.content);
      console.log('Successfully parsed persona:', generatedPersona);
    } catch (parseError) {
      console.error('Error parsing X.AI response:', parseError);
      throw new Error('Failed to parse AI response');
    }

    // Validate the generated persona has all required fields
    const requiredFields = ['age', 'occupation', 'location', 'personality', 'interests', 'funFact'];
    const missingFields = requiredFields.filter(field => !generatedPersona[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Generated persona missing required fields: ${missingFields.join(', ')}`);
    }

    return {
      ...generatedPersona,
      name: questionnaire.name || ''
    };
  } catch (error) {
    console.error('Error generating persona:', error);
    toast.error("Failed to generate persona. Using default values.");
    
    // Create a more personalized fallback based on available questionnaire data
    const interests = questionnaire.learning_desires || questionnaire.resonant_media || 'art and culture';
    const personality = questionnaire.meaningful_compliment 
      ? `Someone who appreciates ${questionnaire.meaningful_compliment}`
      : 'Witty and warm, with a perfect balance of depth and playfulness';

    return {
      name: questionnaire.name || '',
      age: "32",
      occupation: "Creative director at a digital innovation studio",
      location: "Lives in a vibrant city neighborhood, always discovering hidden gems",
      personality,
      interests: `Photography, ${interests}, and collecting vinyl records`,
      fun_fact: "Once started a secret rooftop cinema club that became an underground sensation"
    };
  }
};