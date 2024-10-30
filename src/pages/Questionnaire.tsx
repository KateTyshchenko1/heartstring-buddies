import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Question from "@/components/questionnaire/Question";
import AuthModal from "@/components/auth/AuthModal";
import PersonaGeneration from "@/components/questionnaire/PersonaGeneration";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorMessage from "@/components/questionnaire/ErrorMessage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { generateMatchingPersona } from "@/services/personaGenerator";
import type { BackstoryFields } from "@/components/questionnaire/BackstoryForm";
import type { QuestionnaireResponses } from "@/types/greeting";

const Questionnaire = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const [showPersonaGen, setShowPersonaGen] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatedPersona, setGeneratedPersona] = useState<BackstoryFields | null>(null);
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireResponses | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: questionsData, error: fetchError } = await supabase
          .from('questions')
          .select('*')
          .eq('is_active', true)
          .order('order_index');

        if (fetchError) throw fetchError;
        if (!questionsData?.length) {
          throw new Error('No questions found');
        }

        setQuestions(questionsData);
      } catch (err: any) {
        console.error('Error:', err);
        setError(err.message || 'An unexpected error occurred');
        toast.error("Failed to load questions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      try {
        const mappedData: QuestionnaireResponses = {
          name: newAnswers[0],
          perfect_day: newAnswers[1],
          meaningful_compliment: newAnswers[2],
          unwind_method: newAnswers[3],
          learning_desires: newAnswers[4],
          dinner_guest: newAnswers[5],
          resonant_media: newAnswers[6],
          childhood_memory: newAnswers[7],
          impactful_gesture: newAnswers[8],
          bot_name: answer
        };

        setQuestionnaireData(mappedData);
        setIsLoading(true);

        const persona = await generateMatchingPersona(mappedData);
        const backstoryFields: BackstoryFields = {
          age: persona.age,
          occupation: persona.occupation,
          location: persona.location,
          personality: persona.personality,
          interests: persona.interests,
          fun_fact: persona.fun_fact
        };

        setGeneratedPersona(backstoryFields);
        setShowPersonaGen(true);
      } catch (error: any) {
        console.error('Error generating persona:', error);
        toast.error("Failed to generate companion profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePersonaComplete = (updatedPersona: BackstoryFields) => {
    setGeneratedPersona(updatedPersona);
    
    // Store data in localStorage before auth
    const userContext = {
      questionnaire_responses: questionnaireData,
      soulmate_backstory: updatedPersona
    };
    localStorage.setItem('userContext', JSON.stringify(userContext));
    
    setShowAuth(true);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSkip = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = "";
    setAnswers(newAnswers);
    
    if (currentQuestion === questions.length - 1) {
      setShowPersonaGen(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFEFEF] to-[#FFF0EA] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-display mb-6 text-center">Create Your Account</h2>
          <AuthModal isSignUp={true} />
        </div>
      </div>
    );
  }

  if (showPersonaGen && questionnaireData && generatedPersona) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFEFEF] to-[#FFF0EA] flex items-center justify-center p-4">
        <PersonaGeneration 
          questionnaireData={questionnaireData}
          initialPersona={generatedPersona}
          onComplete={handlePersonaComplete}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFEFEF] to-[#FFF0EA] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-16">
          <div className="w-full bg-gray-100 rounded-full h-1 mb-4">
            <div
              className="bg-[#D91F3A] rounded-full h-1 transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`
              }}
            />
          </div>
          <p className="text-sm text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
        
        <Question
          question={questions[currentQuestion]?.question_text || ""}
          onAnswer={handleAnswer}
          onBack={handleBack}
          onSkip={handleSkip}
          isFirstQuestion={currentQuestion === 0}
          isLastQuestion={currentQuestion === questions.length - 1}
          hideSkip={currentQuestion === questions.length - 1}
        />
      </div>
    </div>
  );
};

export default Questionnaire;