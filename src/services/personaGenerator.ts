import { toast } from "sonner";
import type { SoulmateBackstory } from "@/types/greeting";
import type { QuestionnaireResponsesTable } from "@/integrations/supabase/types/questionnaire";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface ImportMetaEnv {
    VITE_XAI_API_KEY: string;
  }
}

const XAI_API_KEY = import.meta.env.VITE_XAI_API_KEY;
const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

type QuestionnaireResponses = Partial<QuestionnaireResponsesTable['Row']>;

const createPersonaPrompt = (questionnaire: QuestionnaireResponses): string => {
  if (!questionnaire.name) {
    throw new Error('Name is required for persona generation');
  }

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

  if (providedAnswers.length > 1) {
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
5. Generate an appropriate age between 28-38 years old

Respond ONLY with a JSON object in this exact format:
{
  "age": "A specific age (just the number) between 28-38",
  "occupation": "A sophisticated and intriguing profession",
  "location": "A specific location with an interesting detail",
  "personality": "3-4 key personality traits and characteristics",
  "interests": "4-5 specific interests or hobbies",
  "funFact": "An intriguing detail that could spark conversation"
}

Keep all content appropriate and professional.`;

};

export const generateMatchingPersona = async (
  questionnaire: Partial<QuestionnaireResponsesTable['Row']>
): Promise<SoulmateBackstory> => {
  if (!questionnaire.name) {
    throw new Error('Name is required for persona generation');
  }

  try {
    const prompt = createPersonaPrompt(questionnaire);
    const response = await fetch(XAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'system', content: prompt }],
        model: 'grok-beta',
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedPersona = JSON.parse(data.choices[0].message.content);

    // Validate and process the generated persona
    const age = generatedPersona.age.toString().match(/\d+/)?.[0];
    if (!age || parseInt(age) < 28 || parseInt(age) > 38) {
      throw new Error('Invalid age generated');
    }

    const persona = {
      name: questionnaire.name,
      age: age.toString(),
      occupation: generatedPersona.occupation,
      location: generatedPersona.location,
      personality: generatedPersona.personality,
      interests: generatedPersona.interests,
      fun_fact: generatedPersona.funFact
    };

    // Save the generated persona to companion_profiles
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('companion_profiles')
        .upsert({
          profile_id: user.id,
          ...persona
        })
        .select();
    }

    return persona;
  } catch (error) {
    console.error('Error generating persona:', error);
    throw error;
  }
};
