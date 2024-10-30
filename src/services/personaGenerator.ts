import { toast } from "sonner";
import type { SoulmateBackstory } from "@/types/greeting";
import type { QuestionnaireResponses } from "@/types/greeting";

const analyzeEmotionalPatterns = (responses: QuestionnaireResponses) => {
  const patterns = {
    emotionalDepth: responses.meaningful_compliment?.includes('deep') || responses.impactful_gesture?.includes('emotional') ? 'deep' : 'balanced',
    socialStyle: responses.perfect_day?.includes('people') || responses.dinner_guest ? 'extroverted' : 'introverted',
    learningStyle: responses.learning_desires?.includes('read') ? 'analytical' : 'experiential',
    comfortZone: responses.unwind_method?.includes('alone') ? 'introspective' : 'social'
  };
  return patterns;
};

const createPersonaPrompt = (questionnaire: QuestionnaireResponses): string => {
  if (!questionnaire.name || !questionnaire.bot_name) {
    throw new Error('Both user name and bot name are required for persona generation');
  }

  const emotionalPatterns = analyzeEmotionalPatterns(questionnaire);
  
  return `Create a unique and emotionally compatible companion profile for ${questionnaire.name}, who will interact with an AI named ${questionnaire.bot_name}.

Deep Analysis of ${questionnaire.name}'s Responses:
1. Perfect Day: "${questionnaire.perfect_day}"
   - This reveals their ideal pace of life and what brings them joy
2. Meaningful Compliment: "${questionnaire.meaningful_compliment}"
   - Shows how they want to be seen and valued
3. Unwinding Method: "${questionnaire.unwind_method}"
   - Indicates their stress management and comfort needs
4. Learning Desires: "${questionnaire.learning_desires}"
   - Reveals intellectual interests and growth mindset
5. Chosen Dinner Guest: "${questionnaire.dinner_guest}"
   - Shows their values and who they admire
6. Resonant Media: "${questionnaire.resonant_media}"
   - Indicates their emotional and cultural touchpoints
7. Childhood Memory: "${questionnaire.childhood_memory}"
   - Reveals core emotional experiences
8. Impactful Gesture: "${questionnaire.impactful_gesture}"
   - Shows what they value in relationships

Emotional Patterns Detected:
- Emotional Depth: ${emotionalPatterns.emotionalDepth}
- Social Orientation: ${emotionalPatterns.socialStyle}
- Learning Preference: ${emotionalPatterns.learningStyle}
- Comfort Zone: ${emotionalPatterns.comfortZone}

Based on this analysis, create a companion profile that will:
1. Complement their emotional needs
2. Share some interests but also bring new perspectives
3. Have a personality that naturally resonates with their communication style
4. Possess expertise that aligns with their learning desires
5. Have life experiences that create natural conversation bridges

Return ONLY a valid JSON object with these exact fields (no additional text):
{
  "age": "age that would resonate with their life experience",
  "occupation": "profession that connects with their interests and values",
  "location": "place that reflects their lifestyle preferences",
  "personality": "detailed personality traits that complement their emotional patterns",
  "interests": "mix of shared and complementary interests",
  "fun_fact": "something unique that creates conversation opportunities"
}`;
};

const validatePersonaResponse = (response: any): boolean => {
  const requiredFields = ['age', 'occupation', 'location', 'personality', 'interests', 'fun_fact'];
  
  console.log('Validating AI response:', JSON.stringify(response, null, 2));
  
  const missingFields = requiredFields.filter(field => {
    const value = response[field];
    const isValid = value && typeof value === 'string' && value.length > 0;
    if (!isValid) {
      console.log(`Field ${field} validation:`, {
        exists: !!value,
        type: typeof value,
        length: value?.length
      });
    }
    return !isValid;
  });

  if (missingFields.length > 0) {
    const error = `Generated profile is incomplete. Missing or invalid fields: ${missingFields.join(', ')}`;
    console.error(error);
    console.error('Full response:', response);
    throw new Error(error);
  }

  return true;
};

const parseJsonSafely = (text: string): any => {
  try {
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
            content: 'You are an expert in analyzing human psychology and creating deeply compatible companion profiles. You must return a valid JSON object with exactly these fields: age, occupation, location, personality, interests, and fun_fact. Each field must be a non-empty string.' 
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
    console.log('Raw AI response:', data.choices[0].message.content);
    
    const generatedPersona = parseJsonSafely(data.choices[0].message.content);
    validatePersonaResponse(generatedPersona);

    return {
      ...generatedPersona,
      bot_name: questionnaire.bot_name,
      user_name: questionnaire.name
    };
  } catch (error: any) {
    console.error('Error generating persona:', error);
    toast.error(error.message || 'Failed to generate companion profile. Please try again.');
    throw error;
  }
};