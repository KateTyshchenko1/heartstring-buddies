import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Question from "@/components/questionnaire/Question";
import AuthModal from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
  const [showBotProfile, setShowBotProfile] = useState(false);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState({
    age: "28",
    occupation: "Software engineer who loves teaching others",
    location: "Lives in San Francisco, enjoys hiking in Marin County",
    personality: "Witty and caring, with a passion for helping others grow",
    interests: "Coding, teaching, hiking, photography, and making the perfect cup of coffee",
    funFact: "Once wrote a program that helped a local animal shelter match pets with perfect owners"
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

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Save data after successful sign in
        await saveUserData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const saveUserData = async (userId: string) => {
    try {
      // Save companion profile
      const { error: companionError } = await supabase
        .from('companion_profiles')
        .insert({
          profile_id: userId,
          name: answers[9],
          age: fields.age,
          occupation: fields.occupation,
          location: fields.location,
          personality: fields.personality,
          interests: fields.interests,
          fun_fact: fields.funFact
        });

      if (companionError) {
        console.error('Error saving companion profile:', companionError);
        toast.error("Failed to save companion profile. Please try again.");
        return;
      }

      // Save questionnaire responses
      const { error: questionnaireError } = await supabase
        .from('questionnaire_responses')
        .insert({
          profile_id: userId,
          name: answers[0],
          perfect_day: answers[1],
          meaningful_compliment: answers[2],
          unwind_method: answers[3],
          learning_desires: answers[4],
          dinner_guest: answers[5],
          resonant_media: answers[6],
          childhood_memory: answers[7],
          impactful_gesture: answers[8]
        });

      if (questionnaireError) {
        console.error('Error saving questionnaire responses:', questionnaireError);
        toast.error("Failed to save questionnaire responses. Please try again.");
        return;
      }

      const userContext = {
        name: answers[0],
        questionnaire_responses: {
          perfect_day: answers[1],
          meaningful_compliment: answers[2],
          unwind_method: answers[3],
          learning_desires: answers[4],
          dinner_guest: answers[5],
          resonant_media: answers[6],
          childhood_memory: answers[7],
          impactful_gesture: answers[8]
        },
        soulmate_name: answers[9],
        soulmate_backstory: fields
      };
      
      localStorage.setItem('userContext', JSON.stringify(userContext));
      toast.success("Profile saved successfully!");
      navigate('/chat');
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleBotProfileComplete = () => {
    setShowAuth(true);
  };

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
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

  const handleFieldChange = (field: keyof typeof fields, value: string) => {
    setFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFEFEF] to-[#FFF0EA] flex items-center justify-center p-4">
      {!showAuth && !showBotProfile ? (
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
      ) : showBotProfile ? (
        <div className="w-full max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-display mb-4 text-gray-800">
              Let's bring {answers[9]} to life together!
            </h1>
            <p className="text-lg text-gray-600">
              Help shape {answers[9]}'s world – after all, you two might have chemistry ✨
            </p>
          </div>

          <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg">
            {Object.entries(fields).map(([field, value]) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field} className="text-lg capitalize text-gray-700">
                  {field === 'funFact' ? 'Fun Fact' : field}
                </Label>
                <Textarea
                  id={field}
                  value={value}
                  onChange={(e) => handleFieldChange(field as keyof typeof fields, e.target.value)}
                  className="min-h-[100px] text-base resize-none bg-white/90"
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}

            <Button
              onClick={handleBotProfileComplete}
              className="w-full max-w-xs mx-auto mt-8 bg-primary hover:bg-primary/90 text-white py-6 text-lg flex items-center justify-center gap-2"
            >
              Start Your Story
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
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
