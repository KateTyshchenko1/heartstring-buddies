import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { generateMatchingPersona } from "@/services/personaGenerator";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface BackstoryFormProps {
  soulmateName: string;
  onComplete: (data: BackstoryFields) => void;
}

export interface BackstoryFields {
  name: string;
  age: string;
  occupation: string;
  location: string;
  personality: string;
  interests: string;
  fun_fact: string;
}

const BackstoryForm = ({ soulmateName, onComplete }: BackstoryFormProps) => {
  const [fields, setFields] = useState<BackstoryFields>({
    name: soulmateName,
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
    const generatePersona = async () => {
      try {
        setIsLoading(true);
        const userContext = JSON.parse(localStorage.getItem('userContext') || '{}');
        setUserResponses(userContext.questionnaire_responses || null);
        
        if (userContext.questionnaire_responses) {
          const persona = await generateMatchingPersona(userContext.questionnaire_responses);
          setFields(prev => ({
            ...persona,
            name: soulmateName
          }));
        }
      } catch (error) {
        toast.error("Error generating profile. Using default values.");
      } finally {
        setIsLoading(false);
      }
    };

    generatePersona();
  }, [soulmateName]);

  const handleFieldChange = (field: keyof BackstoryFields, value: string) => {
    setFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    try {
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
        name: soulmateName
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
            Creating {soulmateName}'s Profile
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
          Let's bring {soulmateName} to life together!
        </h1>
        <p className="text-lg text-gray-600">
          Help shape {soulmateName}'s world – after all, you two might have chemistry ✨
        </p>
      </div>

      <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg">
        {Object.entries(fields).filter(([key]) => key !== 'name').map(([field, value]) => (
          <div key={field} className="space-y-2">
            <Label htmlFor={field} className="text-lg capitalize text-gray-700">
              {field === 'fun_fact' ? 'Fun Fact' : field}
            </Label>
            <Textarea
              id={field}
              value={value}
              onChange={(e) => handleFieldChange(field as keyof BackstoryFields, e.target.value)}
              className="min-h-[100px] text-base resize-none bg-white/90"
              placeholder={`Enter ${field === 'fun_fact' ? 'Fun Fact' : field}`}
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