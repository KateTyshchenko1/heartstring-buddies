import { useState } from "react";
import { Button } from "@/components/ui/button";

interface QuestionProps {
  question: string;
  onAnswer: (answer: string) => void;
  onBack: () => void;
  onSkip: () => void;
  isFirstQuestion: boolean;
}

const Question = ({ question, onAnswer, onBack, onSkip, isFirstQuestion }: QuestionProps) => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onAnswer(answer);
      setAnswer("");
    }
  };

  return (
    <div className="questionnaire-card max-w-2xl w-full mx-auto">
      <h2 className="text-2xl font-display mb-6">{question}</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-4 rounded-lg border border-gray-200 h-32 resize-none
                     focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <div className="flex gap-3 mt-4">
          {!isFirstQuestion && (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            type="button"
            variant="secondary"
            onClick={onSkip}
            className="flex-1"
          >
            Skip
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={!answer.trim()}
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Question;