import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

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
    age: "34",
    occupation: "Child psychologist working with art therapy",
    location: "Lives in Seattle, but loves traveling to small towns on weekends",
    personality: "Empathetic and attentive, with a calm presence. Known for asking thoughtful questions and remembering the small details",
    interests: "Reading psychology books, cooking Mediterranean food, practicing mindfulness, and collecting vinyl records of ambient music",
    fun_fact: "Started a small community garden that donates fresh produce to local shelters"
  });

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
              {field === 'funFact' ? 'Fun Fact' : field}
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

        <Button
          onClick={handleSubmit}
          className="w-full max-w-xs mx-auto mt-8 bg-primary hover:bg-primary/90 text-white py-6 text-lg flex items-center justify-center gap-2"
        >
          Start Your Story
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default BackstoryForm;