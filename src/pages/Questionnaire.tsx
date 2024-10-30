import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Question from "@/components/questionnaire/Question";
import AuthModal from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorMessage from "@/components/questionnaire/ErrorMessage";

interface QuestionType {
  id: string;
  question_text: string;
  order_index: number;
  category: string;
}

const Questionnaire = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
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

        if (fetchError) {
          console.error('Error fetching questions:', fetchError);
          setError('Failed to load questions. Please try again.');
          setIsLoading(false);
          return;
        }

        if (!questionsData || questionsData.length === 0) {
          setError('No questions found. Please try again later.');
          setIsLoading(false);
          return;
        }

        setQuestions(questionsData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError('An unexpected error occurred. Please try again.');
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 2) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentQuestion === questions.length - 1) {
      const userContext = {
        name: newAnswers[0],
        questionnaire_responses: {
          perfect_day: newAnswers[1],
          meaningful_compliment: newAnswers[2],
          unwind_method: newAnswers[3],
          learning_desires: newAnswers[4],
          dinner_guest: newAnswers[5],
          resonant_media: newAnswers[6],
          childhood_memory: newAnswers[7],
          impactful_gesture: newAnswers[8]
        },
        soulmate_name: newAnswers[9]
      };
      
      localStorage.setItem('userContext', JSON.stringify(userContext));
      setShowAuth(true);
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
      setShowAuth(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFEFEF] to-[#FFF0EA] flex items-center justify-center p-4">
      {!showAuth ? (
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
      ) : (
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-display mb-6 text-center">Create Your Account</h2>
          <AuthModal isSignUp={true} />
        </div>
      )}
    </div>
  );
};

export default Questionnaire;