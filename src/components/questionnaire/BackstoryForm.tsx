import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { generateMatchingPersona } from "@/services/personaGenerator";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";

interface BackstoryFormProps {
  userName: string;
  botName: string;
  onComplete: (data: BackstoryFields) => void;
}

export interface BackstoryFields {
  bot_name: string;
  user_name: string;
  age: string;
  occupation: string;
  location: string;
  personality: string;
  interests: string;
  fun_fact: string;
}

const BackstoryForm = ({ userName, botName, onComplete }: BackstoryFormProps) => {
  const [fields, setFields] = useState<BackstoryFields>({
    bot_name: botName,
    user_name: userName,
    age: "",
    occupation: "",
    location: "",
    personality: "",
    interests: "",
    fun_fact: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [userResponses, setUserResponses] = useState<any>(null);

  useEffect(() => {
    const fetchUserResponses = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not found');

        // Fetch questionnaire responses
        const { data: responses, error: responsesError } = await supabase
          .from('questionnaire_responses')
          .select('*')
          .eq('profile_id', user.id)
          .single();

        if (responsesError) throw responsesError;
        if (!responses) throw new Error('No questionnaire responses found');

        setUserResponses(responses);
        
        // Generate persona based on responses
        const persona = await generateMatchingPersona(responses);
        setFields(prev => ({
          ...persona,
          bot_name: botName,
          user_name: userName
        }));

        // Update bot_name in questionnaire_responses
        await supabase
          .from('questionnaire_responses')
          .update({ bot_name: botName })
          .eq('profile_id', user.id);

      } catch (error: any) {
        toast.error("Error loading profile data");
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserResponses();
  }, [botName, userName]);

  const handleFieldChange = (field: keyof BackstoryFields, value: string) => {
    setFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      // Create companion profile
      const { error: companionError } = await supabase
        .from('companion_profiles')
        .insert({
          profile_id: user.id,
          ...fields,
          personality_insights: {
            emotionalDepth: 'dynamic',
            vulnerabilityStyle: 'playful',
            attachmentStyle: 'confident',
            conversationStyle: 'witty',
            humorStyle: 'flirty-playful',
            intimacyPace: 'natural',
            romanticStyle: 'charming',
            primaryNeed: 'connection',
            loveLanguage: 'banter',
            personalGrowthFocus: 'adventure'
          }
        });

      if (companionError) throw companionError;

      // Create initial relationship evolution entry
      const { error: relationshipError } = await supabase
        .from('relationship_evolution')
        .insert({
          profile_id: user.id,
          stage: 'flirty_intro',
          connection_style: 'playful',
          chemistry_level: 1
        });

      if (relationshipError) throw relationshipError;

      onComplete(fields);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save companion profile');
    }
  };

  const handleRegenerate = async () => {
    if (!userResponses) {
      toast.error("Cannot regenerate without questionnaire responses");
      return;
    }

    try {
      setIsLoading(true);
      const persona = await generateMatchingPersona(userResponses);
      setFields(prev => ({
        ...persona,
        bot_name: botName,
        user_name: userName
      }));
    } catch (error) {
      toast.error("Error regenerating profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl text-center">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-display mb-4 text-gray-800">
            Creating {botName}'s Profile
          </h1>
          <p className="text-lg text-gray-600">
            Crafting the perfect personality based on your responses ✨
          </p>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-display mb-4 text-gray-800">
          Let's bring {fields.bot_name} to life together!
        </h1>
        <p className="text-lg text-gray-600">
          Help shape {fields.bot_name}'s world – after all, you two might have chemistry ✨
        </p>
      </div>

      <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg">
        {Object.entries(fields)
          .filter(([key]) => !['bot_name', 'user_name'].includes(key))
          .map(([field, value]) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field} className="text-lg capitalize text-gray-700">
                {field === 'fun_fact' ? 'Fun Fact' : field}
              </Label>
              <Textarea
                id={field}
                value={value}
                onChange={(e) => handleFieldChange(field as keyof BackstoryFields, e.target.value)}
                className="min-h-[100px] text-base resize-none bg-white/90"
                placeholder={`Enter ${field}`}
              />
            </div>
          ))}

        <div className="flex gap-4 justify-center pt-4">
          <Button
            onClick={handleRegenerate}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Generate Another
          </Button>
          
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
          >
            Start Your Story
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BackstoryForm;
