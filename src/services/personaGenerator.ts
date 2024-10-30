import { toast } from "sonner";
import type { BackstoryFields } from "@/components/questionnaire/BackstoryForm";
import type { QuestionnaireResponsesTable } from "@/integrations/supabase/types/questionnaire";

// Declare environment variables
declare global {
  interface ImportMetaEnv {
    VITE_XAI_API_KEY: string;
  }
}

const XAI_API_KEY = import.meta.env.VITE_XAI_API_KEY;
const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

type QuestionnaireResponses = Partial<QuestionnaireResponsesTable['Row']>;

const createPersonaPrompt = (questionnaire: QuestionnaireResponses): string => {
  const responses = {
    perfect_day: questionnaire.perfect_day || "Not provided",
    meaningful_compliment: questionnaire.meaningful_compliment || "Not provided",
    unwind_method: questionnaire.unwind_method || "Not provided",
    learning_desires: questionnaire.learning_desires || "Not provided",
    dinner_guest: questionnaire.dinner_guest || "Not provided",
    resonant_media: questionnaire.resonant_media || "Not provided",
    childhood_memory: questionnaire.childhood_memory || "Not provided",
    impactful_gesture: questionnaire.impactful_gesture || "Not provided"
  };

  return `You are tasked with creating an engaging and compatible companion profile for a user based on their questionnaire responses. The goal is to craft a personality that will spark curiosity and interest while maintaining depth and sophistication.

Here are the user's questionnaire responses:
${Object.entries(responses)
  .map(([key, value]) => `${key}: "${value}"`)
  .join('\n')}

Your task is to create a fictional companion profile that would be appealing and intriguing to this user. The profile should not directly mimic the user's interests, but rather present a unique and captivating personality that complements the user's preferences.

Guidelines:
1. Develop a distinct personality with unique interests, experiences, and qualities
2. Ensure the profile is flirty and fun while also demonstrating depth and sophistication
3. Create interests and experiences that would intrigue the user based on their responses
4. Incorporate elements that could lead to engaging conversations
5. Balance the profile with both lighthearted and profound characteristics

Respond ONLY with a JSON object in this exact format:
{
  "age": "A number between 28-38",
  "occupation": "A sophisticated and intriguing profession",
  "location": "A specific location with an interesting detail",
  "personality": "3-4 key personality traits and characteristics",
  "interests": "4-5 specific interests or hobbies",
  "funFact": "An intriguing detail that could spark conversation"
}

Keep all content appropriate and professional. No references to drugs, illegal activities, or inappropriate content.`;
};

const createDefaultPersona = (questionnaire: QuestionnaireResponses): BackstoryFields => {
  // Extract any available interests or traits from questionnaire
  const interests = questionnaire.learning_desires || 
                   questionnaire.resonant_media || 
                   'art, literature, and cultural experiences';
                   
  const personality = questionnaire.meaningful_compliment 
    ? `Thoughtful and engaging, values ${questionnaire.meaningful_compliment}`
    : 'Warm and intellectually curious, with a natural talent for meaningful conversation';

  return {
    name: questionnaire.name || '',
    age: "32",
    occupation: "Cultural Heritage Consultant",
    location: "Lives in a historic district, surrounded by art galleries and cafes",
    personality,
    interests: `Museum curation, ${interests}, artisanal coffee roasting`,
    fun_fact: "Helped restore a 200-year-old manuscript that revealed a forgotten local legend"
  };
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
          { role: 'system', content: prompt }
        ],
        model: 'grok-beta',
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    // Extract JSON from response
    const contentStr = data.choices[0].message.content;
    const jsonMatch = contentStr.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const generatedPersona = JSON.parse(jsonMatch[0]);

    // Validate all required fields exist and are strings
    const requiredFields = ['age', 'occupation', 'location', 'personality', 'interests', 'funFact'];
    for (const field of requiredFields) {
      if (typeof generatedPersona[field] !== 'string' || !generatedPersona[field].trim()) {
        throw new Error(`Invalid or missing field: ${field}`);
      }
    }

    return {
      name: questionnaire.name || '',
      ...generatedPersona
    };
  } catch (error) {
    console.error('Error generating persona:', error);
    toast.error("Using default profile while we fix some technical issues");
    
    // Fall back to default persona
    return createDefaultPersona(questionnaire);
  }
};