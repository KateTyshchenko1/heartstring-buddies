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
  const [temporaryData, setTemporaryData] = useState<{
    questionnaire: any;
    companion: any;
  } | null>(null);
  
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

    // Listen for auth state changes to save data after signup
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session && temporaryData) {
        try {
          // Save questionnaire responses
          const { error: questionnaireError } = await supabase
            .from('questionnaire_responses')
            .insert({
              profile_id: session.user.id,
              ...temporaryData.questionnaire
            });

          if (questionnaireError) throw questionnaireError;

          // Save companion profile
          const { error: companionError } = await supabase
            .from('companion_profiles')
            .insert({
              profile_id: session.user.id,
              ...temporaryData.companion
            });

          if (companionError) throw companionError;

          // Update user context in localStorage
          const userContext = {
            name: temporaryData.questionnaire.name,
            questionnaire_responses: temporaryData.questionnaire,
            soulmate_name: temporaryData.companion.name,
            soulmate_backstory: temporaryData.companion
          };
          localStorage.setItem('userContext', JSON.stringify(userContext));

          // Update profile completion status
          await supabase
            .from('profiles')
            .update({ questionnaire_completed: true })
            .eq('id', session.user.id);

          toast.success("Profile created successfully!");
          navigate('/chat');
        } catch (error: any) {
          toast.error(error.message || "Failed to save profile data");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, temporaryData]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      // Prepare questionnaire data
      const questionnaireData = {
        name: answer, // Last question is the name
        perfect_day: newAnswers[0],
        meaningful_compliment: newAnswers[1],
        unwind_method: newAnswers[2],
        learning_desires: newAnswers[3],
        dinner_guest: newAnswers[4],
        resonant_media: newAnswers[5],
        childhood_memory: newAnswers[6],
        impactful_gesture: newAnswers[7]
      };

      // Store questionnaire data temporarily
      setTemporaryData(prev => ({
        ...prev,
        questionnaire: questionnaireData
      }));
      
      setShowBotProfile(true);
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

  const handleBotProfileComplete = (companionData: any) => {
    setTemporaryData(prev => ({
      ...prev,
      companion: companionData
    }));
    setShowAuth(true);
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
          soulmateName={answers[answers.length - 1]} 
          onComplete={handleBotProfileComplete}
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