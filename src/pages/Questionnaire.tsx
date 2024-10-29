import { useState } from "react";
import Question from "@/components/questionnaire/Question";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

const questions = [
  "What's your name?",
  "If you could spend a perfect day doing anything you want, what would that look like?",
  "What's the most meaningful compliment you've ever received?",
  "How do you like to unwind after a stressful day?",
  "What's something you've always wanted to learn or try but haven't had the chance to yet?",
  "If you could have dinner with anyone, living or dead, who would you choose and why?",
  "What's a movie or book that really resonated with you recently?",
  "When you think about your childhood, what's a memory that always makes you smile?",
  "What's a small gesture someone has done for you that left a big impression?",
  "Give your Soulmate a name:",
  "Let's bring your Soulmate to life!"
];

interface BackstoryFields {
  age: string;
  occupation: string;
  location: string;
  personality: string;
  interests: string;
  funFact: string;
}

const Questionnaire = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const [soulmateData, setSoulmateData] = useState<BackstoryFields>({
    age: "34",
    occupation: "Child psychologist working with art therapy",
    location: "Lives in Seattle, but loves traveling to small towns on weekends",
    personality: "Empathetic and attentive, with a calm presence. Known for asking thoughtful questions and remembering the small details",
    interests: "Reading psychology books, cooking Mediterranean food, practicing mindfulness, and collecting vinyl records of ambient music",
    funFact: "Started a small community garden that donates fresh produce to local shelters"
  });
  const navigate = useNavigate();
  const { session } = useAuth();

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
        soulmate_name: newAnswers[9],
        soulmate_backstory: soulmateData
      };
      localStorage.setItem('userContext', JSON.stringify(userContext));
      setShowAuth(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleFieldChange = (field: keyof BackstoryFields, value: string) => {
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
    
    // Don't allow skipping the soulmate name question (index 9)
    if (currentQuestion === 9) {
      return;
    }
    
    if (currentQuestion === questions.length - 1) {
      setShowAuth(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmitBackstory = () => {
    handleAnswer("backstory_completed");
  };

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
              question={questions[currentQuestion]}
              onAnswer={handleAnswer}
              onBack={handleBack}
              onSkip={handleSkip}
              isFirstQuestion={currentQuestion === 0}
              isLastQuestion={currentQuestion === questions.length - 1}
              hideSkip={currentQuestion === 9} // Hide skip button for soulmate name question
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
                      onChange={(e) => handleFieldChange(field as keyof BackstoryFields, e.target.value)}
                      className="min-h-[100px] text-base resize-none bg-white/90"
                      placeholder={`Enter ${field}`}
                    />
                  </div>
                ))}

                <Button
                  onClick={handleSubmitBackstory}
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
