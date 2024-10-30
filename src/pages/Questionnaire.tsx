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
  
  const [soulmateData, setSoulmateData] = useState({
    age: "34",
    occupation: "Child psychologist working with art therapy",
    location: "Lives in Seattle, but loves traveling to small towns on weekends",
    personality: "Empathetic and attentive, with a calm presence. Known for asking thoughtful questions and remembering the small details",
    interests: "Reading psychology books, cooking Mediterranean food, practicing mindfulness, and collecting vinyl records of ambient music",
    funFact: "Started a small community garden that donates fresh produce to local shelters"
  });
  
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
          console.error('Supabase error:', fetchError);
          setError('Failed to load questions. Please try again.');
          setIsLoading(false);
          return;
        }

        if (!questionsData || questionsData.length === 0) {
          setError('No questions found in the database.');
          setIsLoading(false);
          return;
        }

        console.log('Fetched questions:', questionsData);
        setQuestions(questionsData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again.');
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 2) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentQuestion === questions.length - 1) {
      // Store answers in localStorage before showing auth
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
        soulmate_name: newAnswers[9],
        soulmate_backstory: soulmateData
      };
      localStorage.setItem('userContext', JSON.stringify(userContext));
      setShowAuth(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleFieldChange = (field: keyof typeof soulmateData, value: string) => {
    setSoulmateData(prev => ({
      ...prev,
      [field]: value
    }));
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

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFEFEF] to-[#FFF0EA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No questions available. Please try again later.</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
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
          
          {currentQuestion < questions.length - 1 ? (
            <Question
              question={questions[currentQuestion]?.question_text || ""}
              onAnswer={handleAnswer}
              onBack={handleBack}
              onSkip={handleSkip}
              isFirstQuestion={currentQuestion === 0}
              isLastQuestion={currentQuestion === questions.length - 1}
              hideSkip={currentQuestion === 9}
            />
          ) : (
            <div className="w-full max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-display mb-4 text-gray-800">
                  Let's bring {answers[9]} to life together!
                </h1>
                <p className="text-lg text-gray-600">
                  Help shape {answers[9]}'s world – after all, you two might have chemistry ✨
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
                      onChange={(e) => handleFieldChange(field as keyof typeof soulmateData, e.target.value)}
                      className="min-h-[100px] text-base resize-none bg-white/90"
                      placeholder={`Enter ${field}`}
                    />
                  </div>
                ))}

                <Button
                  onClick={() => handleAnswer("backstory_completed")}
                  className="w-full max-w-xs mx-auto mt-8 bg-primary hover:bg-primary/90 text-white py-6 text-lg flex items-center justify-center gap-2"
                >
                  Start Your Story
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
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