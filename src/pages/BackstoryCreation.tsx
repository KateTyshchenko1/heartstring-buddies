import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BackstoryFields {
  age: string;
  occupation: string;
  location: string;
  personality: string;
  interests: string;
  funFact: string;
}

const BackstoryCreation = () => {
  const navigate = useNavigate();
  const [soulmateData, setSoulmateData] = useState<BackstoryFields>({
    age: "34",
    occupation: "Child psychologist working with art therapy",
    location: "Lives in Seattle, but loves traveling to small towns on weekends",
    personality: "Empathetic and attentive, with a calm presence. Known for asking thoughtful questions and remembering the small details",
    interests: "Reading psychology books, cooking Mediterranean food, practicing mindfulness, and collecting vinyl records of ambient music",
    funFact: "Started a small community garden that donates fresh produce to local shelters"
  });
  const [soulmateName, setSoulmateName] = useState("");

  useEffect(() => {
    const userContext = JSON.parse(localStorage.getItem('userContext') || '{}');
    setSoulmateName(userContext.soulmate_name || '');
  }, []);

  const handleFieldChange = (field: keyof BackstoryFields, value: string) => {
    setSoulmateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const userContext = JSON.parse(localStorage.getItem('userContext') || '{}');
      const updatedContext = {
        ...userContext,
        soulmate_backstory: soulmateData
      };
      localStorage.setItem('userContext', JSON.stringify(updatedContext));

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ questionnaire_completed: true })
          .eq('id', user.id);
      }

      navigate('/chat');
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFEFEF] to-[#FFF0EA] flex items-center justify-center p-4">
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
          {Object.entries(soulmateData).map(([field, value]) => (
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
    </div>
  );
};

export default BackstoryCreation;