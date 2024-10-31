import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import Question from "@/components/questionnaire/Question";
import BackstoryForm, { BackstoryFields } from "@/components/questionnaire/BackstoryForm";
import PersonaGeneration from "@/components/questionnaire/PersonaGeneration";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Questionnaire = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data: questionsData, error } = await supabase
        .from("questions")
        .select("*")
        .order("order_index");

      if (error) throw error;
      setQuestions(questionsData || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to load questions. Please try again.");
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[step].id]: answer,
    }));
    setStep((prev) => prev + 1);
  };

  const handleBackstorySubmit = (backstory: BackstoryFields) => {
    setAnswers((prev) => ({
      ...prev,
      ...backstory,
    }));
    setStep((prev) => prev + 1);
  };

  const handlePersonaSubmit = (persona: BackstoryFields) => {
    console.log("Final Persona: ", persona);
    navigate("/chat");
  };

  const renderStep = () => {
    if (step < questions.length) {
      return (
        <Question
          question={questions[step].question_text}
          onAnswer={handleAnswer}
          onBack={() => setStep((prev) => prev - 1)}
          onSkip={() => setStep((prev) => prev + 1)}
          isFirstQuestion={step === 0}
          isLastQuestion={step === questions.length - 1}
        />
      );
    }

    if (step === questions.length) {
      return (
        <BackstoryForm
          userName={answers.name || ''}
          botName={answers.bot_name || ''}
          onComplete={handleBackstorySubmit}
        />
      );
    }

    return (
      <PersonaGeneration
        questionnaireData={answers}
        initialPersona={{
          age: "",
          occupation: "",
          location: "",
          personality: "",
          interests: "",
          fun_fact: "",
        }}
        onComplete={handlePersonaSubmit}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFEFEF] to-[#FFF0EA] py-8">
      <div className="container mx-auto px-4">
        {step > 0 && step <= questions.length && (
          <Button
            variant="ghost"
            onClick={() => setStep(step - 1)}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        <div className="flex justify-center">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;