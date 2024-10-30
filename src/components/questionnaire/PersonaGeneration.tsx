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
  onComplete: (data: BackstoryFields) => void;
}

const PersonaGeneration = ({ questionnaireData, onComplete }: PersonaGenerationProps) => {
  const [soulmateData, setSoulmateData] = useState<BackstoryFields | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const generatePersona = async () => {
    try {
      setIsLoading(true);
      const persona = await generateMatchingPersona(questionnaireData);
      setSoulmateData(prev => ({
        ...prev,
        ...persona,
        name: questionnaireData.name // Preserve the name when regenerating
      }));
    } catch (error) {
      console.error('Error generating persona:', error);
      toast.error("Error generating profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generatePersona();
  }, [questionnaireData]);

  const handleFieldChange = (field: keyof BackstoryFields, value: string) => {
    if (soulmateData) {
      setSoulmateData(prev => ({
        ...prev!,
        [field]: value
      }));
    }
  };

  const handleSubmit = () => {
    if (soulmateData) {
      onComplete(soulmateData);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl text-center">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-display mb-4 text-gray-800">
            Creating {questionnaireData.name}'s Profile
          </h1>
          <p className="text-lg text-gray-600">
            Using AI to craft a personality that matches yours ✨
          </p>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  if (!soulmateData) {
    return (
      <div className="text-center">
        <p className="text-red-500">Something went wrong. Please try again.</p>
        <Button onClick={generatePersona}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-display mb-4 text-gray-800">
          Meet {questionnaireData.name}
        </h1>
        <p className="text-lg text-gray-600">
          I've created a unique personality just for you. Feel free to adjust any details ✨
        </p>
      </div>

      <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg">
        {Object.entries(soulmateData).filter(([key]) => key !== 'name').map(([field, value]) => (
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
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonaGeneration;