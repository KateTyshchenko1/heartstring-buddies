import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Question from "@/components/questionnaire/Question";
import AuthModal from "@/components/auth/AuthModal";
import { toast } from "sonner";

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
  "Give your Soulmate a name:"
];

const Questionnaire = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    try {
      if (currentQuestion === questions.length - 1) {
        const userContext = {
          name: newAnswers[0],
          questionnaire_responses: {
            perfect_day: newAnswers[1],
            meaningful_compliment: newAnswers[2],
            stress_relief: newAnswers[3],
            learning_desires: newAnswers[4],
            dinner_guest: newAnswers[5],
            resonant_media: newAnswers[6],
            childhood_memory: newAnswers[7],
            impactful_gesture: newAnswers[8]
          },
          soulmate_name: newAnswers[9],
          communication_style: {
            formality_level: "casual",
            emoji_usage: "moderate",
            message_length: "medium",
            response_speed: "quick",
            vulnerability: "mixed",
            love_language: "words"
          },
          relationship_stage: "initial",
          key_memories: [],
          inside_jokes: [],
          current_goals: []
        };

        localStorage.setItem('userContext', JSON.stringify(userContext));
        setShowAuth(true);
      } else {
        setCurrentQuestion(currentQuestion + 1);
      }
    } catch (error) {
      toast.error("There was an error saving your response. Please try again.");
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
      const userContext = {
        name: newAnswers[0] || "User",
        questionnaire_responses: {
          perfect_day: newAnswers[1],
          meaningful_compliment: newAnswers[2],
          stress_relief: newAnswers[3],
          learning_desires: newAnswers[4],
          dinner_guest: newAnswers[5],
          resonant_media: newAnswers[6],
          childhood_memory: newAnswers[7],
          impactful_gesture: newAnswers[8]
        },
        soulmate_name: newAnswers[9],
        communication_style: {
          formality_level: "casual",
          emoji_usage: "moderate",
          message_length: "medium",
          response_speed: "quick",
          vulnerability: "mixed",
          love_language: "words"
        },
        relationship_stage: "initial",
        key_memories: [],
        inside_jokes: [],
        current_goals: []
      };
      localStorage.setItem('userContext', JSON.stringify(userContext));
      setShowAuth(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
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
          
          <Question
            question={questions[currentQuestion]}
            onAnswer={handleAnswer}
            onBack={handleBack}
            onSkip={handleSkip}
            isFirstQuestion={currentQuestion === 0}
            isLastQuestion={currentQuestion === questions.length - 1}
          />
        </div>
      ) : (
        <AuthModal isSignUp={true} />
      )}
    </div>
  );
};

export default Questionnaire;