import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface QuestionProps {
  question: string;
  onAnswer: (answer: string) => void;
  onBack: () => void;
  onSkip: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

const Question = ({ question, onAnswer, onBack, onSkip, isFirstQuestion, isLastQuestion }: QuestionProps) => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onAnswer(answer);
      setAnswer("");
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && answer.trim()) {
        e.preventDefault();
        onAnswer(answer);
        setAnswer("");
      }
    };

    document.addEventListener("keypress", handleKeyPress);
    return () => document.removeEventListener("keypress", handleKeyPress);
  }, [answer, onAnswer]);

  return (
    <div className="max-w-2xl w-full mx-auto relative">
      {!isFirstQuestion && (
        <button 
          onClick={onBack}
          className="absolute -top-12 left-0 text-gray-400 hover:text-primary transition-colors flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}
      
      <div className="mb-12">
        <h2 className="text-3xl font-display mb-2 text-gray-800">{question}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="relative">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-0 text-xl border-0 border-b border-gray-200 
                     focus:border-primary focus:outline-none bg-transparent resize-none 
                     min-h-[100px] transition-colors placeholder:text-gray-300
                     font-sans"
            autoFocus
          />
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <Button
            type="submit"
            className="w-full max-w-xs bg-primary/10 hover:bg-primary/20 text-primary py-6 text-lg"
            disabled={!answer.trim()}
          >
            Continue
          </Button>
          
          {!isFirstQuestion && !isLastQuestion && (
            <button
              type="button"
              onClick={onSkip}
              className="text-sm text-gray-400 hover:text-primary transition-colors"
            >
              Skip this question
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Question;