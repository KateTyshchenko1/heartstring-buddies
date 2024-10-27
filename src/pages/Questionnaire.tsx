import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Question from "@/components/questionnaire/Question";
import { toast } from "sonner";

const questions = [
  "When you daydream about your ideal future, what does that look like?",
  "If you could spend a perfect day doing anything you want, what would that look like?",
  "What's the most meaningful compliment you've ever received?",
  "How do you like to unwind after a stressful day?",
  "What's something you've always wanted to learn or try but haven't had the chance to yet?",
  "If you could have dinner with anyone, living or dead, who would you choose and why?",
  "What's a movie or book that really resonated with you recently?",
  "When you think about your childhood, what's a memory that always makes you smile?",
  "What's a small gesture someone has done for you that left a big impression?",
];

const Questionnaire = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();

  const handleAnswer = (answer: string) => {
    // In a real app, we'd save the answer here
    if (currentQuestion === questions.length - 1) {
      toast.success("Thank you for sharing! Your AI companion is ready.");
      navigate("/chat");
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-primary/10 to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <p className="text-sm text-gray-600 mb-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-primary rounded-full h-1 transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>
        
        <Question
          question={questions[currentQuestion]}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
};

export default Questionnaire;