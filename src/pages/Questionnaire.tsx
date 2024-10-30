import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Question from "@/components/questionnaire/Question";
import AuthModal from "@/components/auth/AuthModal";
import PersonaGeneration from "@/components/questionnaire/PersonaGeneration";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorMessage from "@/components/questionnaire/ErrorMessage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { BackstoryFields } from "@/components/questionnaire/BackstoryForm";

const Questionnaire = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const [showPersonaGen, setShowPersonaGen] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [temporaryData, setTemporaryData] = useState<{
    questionnaire: any;
    companion: any;
  } | null>(null);
  
  const navigate = useNavigate();

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      // Last question is the user's name
      const questionnaireData = {
        name: newAnswers[0], // First question is user's name
        perfect_day: newAnswers[1],
        meaningful_compliment: newAnswers[2],
        unwind_method: newAnswers[3],
        learning_desires: newAnswers[4],
        dinner_guest: newAnswers[5],
        resonant_media: newAnswers[6],
        childhood_memory: newAnswers[7],
        impactful_gesture: newAnswers[8],
        bot_name: answer // Last question is bot's name
      };

      setTemporaryData(prev => ({
        ...prev,
        questionnaire: questionnaireData
      }));
      
      setShowPersonaGen(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePersonaComplete = async (companionData: BackstoryFields) => {
    setTemporaryData(prev => ({
      ...prev,
      companion: companionData
    }));
    setShowAuth(true);
  };

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

  // Handle successful authentication
  const handleAuthSuccess = async (userId: string) => {
    if (!temporaryData) return;

    try {
      // Save questionnaire responses with correct name fields
      const { error: questionnaireError } = await supabase
        .from('questionnaire_responses')
        .insert({
          profile_id: userId,
          name: temporaryData.questionnaire.name, // User's name
          bot_name: temporaryData.questionnaire.bot_name, // Bot's name
          perfect_day: temporaryData.questionnaire.perfect_day,
          meaningful_compliment: temporaryData.questionnaire.meaningful_compliment,
          unwind_method: temporaryData.questionnaire.unwind_method,
          learning_desires: temporaryData.questionnaire.learning_desires,
          dinner_guest: temporaryData.questionnaire.dinner_guest,
          resonant_media: temporaryData.questionnaire.resonant_media,
          childhood_memory: temporaryData.questionnaire.childhood_memory,
          impactful_gesture: temporaryData.questionnaire.impactful_gesture
        });

      if (questionnaireError) throw questionnaireError;

      // Save companion profile with bot's name
      const { error: companionError } = await supabase
        .from('companion_profiles')
        .insert({
          profile_id: userId,
          name: temporaryData.questionnaire.bot_name, // Bot's name
          ...temporaryData.companion
        });

      if (companionError) throw companionError;

      // Update user context with correct names
      const userContext = {
        name: temporaryData.questionnaire.name,
        questionnaire_responses: temporaryData.questionnaire,
        soulmate_name: temporaryData.questionnaire.bot_name,
        soulmate_backstory: temporaryData.companion
      };
      localStorage.setItem('userContext', JSON.stringify(userContext));

      // Update profile completion status
      await supabase
        .from('profiles')
        .update({ questionnaire_completed: true })
        .eq('id', userId);

      toast.success("Profile created successfully!");
      navigate('/chat');
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast.error(error.message || "Failed to save profile data");
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

  if (showPersonaGen && temporaryData?.questionnaire) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFEFEF] to-[#FFF0EA] flex items-center justify-center p-4">
        <PersonaGeneration 
          questionnaireData={temporaryData.questionnaire}
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
