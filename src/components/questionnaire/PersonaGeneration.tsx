import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { generateMatchingPersona } from "@/services/personaGenerator";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import type { BackstoryFields } from "./BackstoryForm";

interface PersonaGenerationProps {
  questionnaireData: any;
  initialPersona: BackstoryFields;
  onComplete: (data: BackstoryFields) => void;
}

const PersonaGeneration = ({ questionnaireData, initialPersona, onComplete }: PersonaGenerationProps) => {
  const [soulmateData, setSoulmateData] = useState<BackstoryFields>(initialPersona);
  const [isLoading, setIsLoading] = useState(false);

  const generatePersona = async () => {
    try {
      setIsLoading(true);
      const persona = await generateMatchingPersona(questionnaireData);
      setSoulmateData(prev => ({
        ...prev,
        ...persona,
        name: questionnaireData.bot_name
      }));
    } catch (error) {
      console.error('Error generating persona:', error);
      toast.error("Error generating profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: keyof BackstoryFields, value: string) => {
    setSoulmateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onComplete(soulmateData);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl text-center">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-display mb-4 text-gray-800">
            Creating {questionnaireData.bot_name}'s Profile
          </h1>
          <p className="text-lg text-gray-600">
            Using AI to craft a personality that matches yours ✨
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
          Meet {questionnaireData.bot_name}
        </h1>
        <p className="text-lg text-gray-600">
          I've created a unique personality just for you. Feel free to adjust any details ✨
        </p>
      </div>

      <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg">
        {Object.entries(soulmateData)
          .filter(([key]) => !['name', 'bot_name', 'user_name'].includes(key))
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
            onClick={generatePersona}
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
            Chat with {questionnaireData.bot_name}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonaGeneration;