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
  age: string;
  occupation: string;
  location: string;
  personality: string;
  interests: string;
  fun_fact: string;
}

const BackstoryForm = ({ userName, botName, onComplete }: BackstoryFormProps) => {
  const [fields, setFields] = useState<BackstoryFields>({
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
        setFields({
          age: persona.age,
          occupation: persona.occupation,
          location: persona.location,
          personality: persona.personality,
          interests: persona.interests,
          fun_fact: persona.fun_fact
        });

      } catch (error: any) {
        console.error('Error loading profile data:', error);
        toast.error("Error loading profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserResponses();
  }, []);

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

      // First check if a companion profile already exists
      const { data: existingProfile } = await supabase
        .from('companion_profiles')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('companion_profiles')
          .update({
            age: fields.age,
            occupation: fields.occupation,
            location: fields.location,
            personality: fields.personality,
            interests: fields.interests,
            fun_fact: fields.fun_fact,
            updated_at: new Date().toISOString()
          })
          .eq('profile_id', user.id);

        if (updateError) throw updateError;
      } else {
        // Create new companion profile
        const { error: insertError } = await supabase
          .from('companion_profiles')
          .insert({
            profile_id: user.id,
            age: fields.age,
            occupation: fields.occupation,
            location: fields.location,
            personality: fields.personality,
            interests: fields.interests,
            fun_fact: fields.fun_fact
          });

        if (insertError) throw insertError;

        // Create initial relationship evolution entry
        await supabase
          .from('relationship_evolution')
          .insert({
            profile_id: user.id,
            stage: 'flirty_intro',
            connection_style: 'playful',
            chemistry_level: 1,
            last_interaction: new Date().toISOString()
          });
      }

      onComplete(fields);
    } catch (error: any) {
      console.error('Error saving profile:', error);
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
      setFields({
        age: persona.age,
        occupation: persona.occupation,
        location: persona.location,
        personality: persona.personality,
        interests: persona.interests,
        fun_fact: persona.fun_fact
      });
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
          Let's bring {botName} to life together!
        </h1>
        <p className="text-lg text-gray-600">
          Help shape {botName}'s world – after all, you two might have chemistry ✨
        </p>
      </div>

      <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg">
        {Object.entries(fields).map(([field, value]) => (
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