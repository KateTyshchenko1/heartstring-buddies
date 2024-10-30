import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Question from "@/components/questionnaire/Question";
import AuthModal from "@/components/auth/AuthModal";
import BackstoryForm from "@/components/questionnaire/BackstoryForm";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorMessage from "@/components/questionnaire/ErrorMessage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Questionnaire = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const [showBotProfile, setShowBotProfile] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data: questionsData, error: fetchError } = await supabase
          .from('questions')
          .select('*')
          .eq('is_active', true)
          .order('order_index');

        if (fetchError) throw fetchError;
        if (!questionsData?.length) throw new Error('No questions found');

        setQuestions(questionsData);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error:', err);
        setError(err.message || 'An unexpected error occurred');
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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        // Save questionnaire responses
        const { error: responseError } = await supabase
          .from('questionnaire_responses')
          .insert({
            profile_id: user.id,
            name: newAnswers[9], // Assuming this is the name question
            perfect_day: newAnswers[0],
            meaningful_compliment: newAnswers[1],
            unwind_method: newAnswers[2],
            learning_desires: newAnswers[3],
            dinner_guest: newAnswers[4],
            resonant_media: newAnswers[5],
            childhood_memory: newAnswers[6],
            impactful_gesture: newAnswers[7]
          });

        if (responseError) throw responseError;
        setShowBotProfile(true);
      } catch (error: any) {
        toast.error(error.message || 'Failed to save questionnaire responses');
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
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
      setShowBotProfile(true);
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

  if (showBotProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFEFEF] to-[#FFF0EA] flex items-center justify-center p-4">
        <BackstoryForm 
          soulmateName={answers[9]} 
          onComplete={() => setShowAuth(true)} 
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
          hideSkip={currentQuestion === 9}
        />
      </div>
    </div>
  );
};

export default Questionnaire;
